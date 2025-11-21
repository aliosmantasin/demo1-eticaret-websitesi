import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { supabase } from '../../core/services/supabase.service';
import prisma from '../../core/services/prisma.service';
import { authenticateToken, requireAdmin } from '../../core/middleware/auth.middleware';
import path from 'path';
import crypto from 'crypto';

const router = express.Router();

// Multer'ı disk yerine memory storage kullanacak şekilde yapılandır
const storage = multer.memoryStorage();
const upload = multer({ storage });

const ALLOWED_BUCKETS = [
    'product-images',
    'category-images',
    'homepage-banner-desktop',
    'homepage-banner-mobil',
    'homepage-promotion-banner-desktop',
    'homepage-promotion-banner-mobil',
    'packages-banner-desktop',
    'packages-banner-mobil',
    'packages-images', // Paket ürün görselleri için ayrı bucket
    'logo',
];

// GET /api/images - Tüm görselleri DB'den getir
router.get('/', async (req, res, next) => {
    try {
        const images = await prisma.image.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(images);
    } catch (error) {
        next(error);
    }
});

// GEÇİCİ DEBUG ENDPOINT'İ - KATEGORİLERİ VE GÖRSELLERİNİ KONTROL ET
router.get('/debug-categories', async (req, res, next) => {
    try {
        const categoriesWithImages = await prisma.category.findMany({
            include: {
                image: true,
            },
        });
        res.json(categoriesWithImages);
    } catch (error) {
        next(error);
    }
});


// POST /api/images/upload - Görsel(ler)i Supabase'e yükle ve DB'ye kaydet
router.post('/upload', authenticateToken, requireAdmin, upload.array('images', 10), async (req: Request, res: Response, next: NextFunction) => {
    const { bucketName } = req.body;
    
    if (!bucketName || !ALLOWED_BUCKETS.includes(bucketName)) {
        return res.status(400).json({ message: 'Geçerli bir bucket adı belirtilmedi.' });
    }

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ message: 'Yüklenecek dosya bulunamadı.' });
    }

    try {
        const files = req.files as Express.Multer.File[];
        const createdImages = [];

        // Banner, logo, kategori ve paket görselleri için orijinal isimleri kullan, diğerleri için hash
        const SPECIAL_BUCKETS = [
            'homepage-banner-desktop',
            'homepage-banner-mobil',
            'homepage-promotion-banner-desktop',
            'homepage-promotion-banner-mobil',
            'packages-banner-desktop',
            'packages-banner-mobil',
            'packages-images', // Paket ürün görselleri orijinal isimleriyle kaydedilmeli
            'logo',
            'category-images', // Kategori görselleri orijinal isimleriyle kaydedilmeli (seed.ts'de slug'a göre bulunuyor)
        ];
        
        for (const file of files) {
            const fileExtension = path.extname(file.originalname);
            // Özel bucket'ler için orijinal ismi kullan, diğerleri için hash
            const fileName = SPECIAL_BUCKETS.includes(bucketName)
                ? file.originalname // Orijinal isim (örn: banner.webp, ojslogo.webp)
                : `${crypto.randomBytes(16).toString('hex')}${fileExtension}`; // Hash'lenmiş isim

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(bucketName) // Gelen bucket adını kullan
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true, // Aynı isimde dosya varsa üzerine yaz
                });

            if (uploadError) {
                // Hata durumunda döngüyü durdur ve hatayı gönder
                throw new Error(`Supabase upload error for file ${file.originalname}: ${uploadError.message}`);
            }

            const { data: urlData } = supabase.storage
                .from(bucketName) // Gelen bucket adını kullan
                .getPublicUrl(uploadData.path);
            
            const publicUrl = urlData.publicUrl;

            const newImage = await prisma.image.create({
                data: {
                    url: publicUrl,
                    bucket: bucketName,
                },
            });
            createdImages.push(newImage);
        }

        res.status(201).json(createdImages);

    } catch (error) {
        next(error);
    }
});

// DELETE /api/images/:id - Görseli DB'den ve Supabase'den sil
router.delete('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        // 1. Görseli veritabanında bul
        const image = await prisma.image.findUnique({
            where: { id },
        });

        if (!image) {
            return res.status(404).json({ message: 'Görsel bulunamadı.' });
        }

        // 2. URL'den dosya adını ve bucket'ı çıkar
        const urlParts = image.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const bucketName = image.bucket || urlParts[urlParts.length - 2];

        if (!bucketName || !fileName) {
            throw new Error('Geçersiz görsel URL formatı.');
        }

        // 3. Görseli Supabase Storage'dan sil
        const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([fileName]);

        if (deleteError) {
            // Eğer Supabase'de bir hata olursa, işlemi durdur ama logla.
            // Veritabanından silmeye devam edebiliriz ki bozuk kayıt kalmasın.
            console.error(`Supabase delete error for file ${fileName}:`, deleteError.message);
            // Belki burada hatayı fırlatmak yerine sadece loglamak daha iyi olabilir,
            // böylece veritabanı kaydı yine de silinebilir.
        }

        // 4. Görseli veritabanından sil
        await prisma.image.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Görsel başarıyla silindi.' });

    } catch (error) {
        next(error);
    }
});


export default router;
