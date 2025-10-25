import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

// Prisma istemcisini başlat
const prisma = new PrismaClient();

// Dış API için temel URL
const BaseUrl = 'https://fe1111.projects.academy.onlyjs.com';

// API'den gelen ürün verisinin tip tanımı
interface ApiProduct {
  name: string;
  short_explanation: string;
  photo_src: string;
  price_info: {
    total_price: number;
    discounted_price: number | null;
    discount_percentage: number | null;
  };
  comment_count: number;
  average_star: number;
}

async function main() {
  console.log('Tohumlama işlemi başlıyor...');

  // 1. "Çok Satanlar" kategorisini oluştur veya bul
  let bestSellersCategory = await prisma.category.findUnique({
    where: { name: 'Çok Satanlar' },
  });

  if (!bestSellersCategory) {
    console.log('"Çok Satanlar" kategorisi oluşturuluyor...');
    bestSellersCategory = await prisma.category.create({
      data: { name: 'Çok Satanlar' },
    });
    console.log('Kategori başarıyla oluşturuldu.');
  } else {
    console.log('"Çok Satanlar" kategorisi zaten mevcut.');
  }

  // 2. Dış API'den ürünleri çek
  console.log('Dış API\'den ürünler çekiliyor...');
  const response = await fetch(`${BaseUrl}/api/v1/products/best-sellers`);
  if (!response.ok) {
    throw new Error('API\'den veriler alınamadı');
  }
  const result = (await response.json()) as { data: ApiProduct[] };
  const productsFromApi = result.data;
  console.log(`${productsFromApi.length} adet ürün bulundu.`);

  // 3. Mevcut ürünleri temizle (isteğe bağlı, her seferinde aynı ürünlerin eklenmesini önler)
  console.log('Mevcut "Çok Satanlar" ürünleri veritabanından siliniyor...');
  await prisma.product.deleteMany({
    where: {
      categoryId: bestSellersCategory.id,
    },
  });
  console.log('Eski ürünler silindi.');

  // 4. Ürünleri veritabanına ekle
  console.log('Yeni ürünler veritabanına ekleniyor...');
  for (const product of productsFromApi) {
    await prisma.product.create({
      data: {
        name: product.name,
        short_explanation: product.short_explanation,
        price: product.price_info.total_price,
        discounted_price: product.price_info.discounted_price,
        discount_percentage: product.price_info.discount_percentage,
        comment_count: product.comment_count,
        average_star: product.average_star,
        images: [`${BaseUrl}${product.photo_src}`], // Resim linkini tam URL olarak kaydet
        categoryId: bestSellersCategory.id, // Oluşturulan kategoriye bağla
        stock: 100, // Varsayılan stok miktarı
      },
    });
    console.log(`- ${product.name} eklendi.`);
  }

  console.log('Tohumlama işlemi başarıyla tamamlandı.');
}

main()
  .catch((e) => {
    console.error('Tohumlama sırasında bir hata oluştu:', e);
    process.exit(1);
  })
  .finally(async () => {
    // İşlem bittiğinde Prisma bağlantısını kapat
    await prisma.$disconnect();
  });


