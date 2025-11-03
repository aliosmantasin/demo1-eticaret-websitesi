# Deployment ve Görsel Yönetimi Rehberi

Bu rehber, projeyi canlıya alırken Supabase entegrasyonu ve görsel yükleme stratejisini açıklar.

---

## 🎯 Supabase Uyumluluğu

### ✅ **Supabase Neden Uygun?**

**1. PostgreSQL Tam Desteği:**
- Supabase, PostgreSQL'in managed hosting versiyonudur
- Prisma ile %100 uyumlu (herhangi bir kod değişikliği gerekmez)
- Mevcut `schema.prisma` dosyanızı olduğu gibi kullanabilirsiniz

**2. Görsel Depolama:**
- **Supabase Storage:** S3 benzeri object storage servisi
- Ücretsiz plan: **1 GB** görsel depolama
- Pro plan ($25/ay): **100 GB** görsel depolama
- Admin panelden görsel yükleme/düzenleme mümkün

**3. Deployment Kolaylığı:**
```bash
# Sadece DATABASE_URL'i değiştirin
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"

# Prisma migration'ı aynen çalışır
pnpm prisma db push
```

---

## 📦 Görsel Yükleme Stratejisi

### Mevcut Yapı (Local/Development):

```typescript
// Product model
images  String[]  // URL array: ["/images/product1.jpg", ...]
```

**Sorun:** Görseller şu anda statik klasörde. Supabase'e geçerken storage kullanmalıyız.

---

### 🚀 Yeni Yapı (Supabase Storage):

#### **1. Supabase Storage Kurulumu**

```bash
# 1. Supabase Dashboard'a git
# 2. Storage → Create New Bucket
# 3. Bucket isimleri:
   - "products"     # Ürün görselleri
   - "categories"   # Kategori görselleri
   - "banners"      # Banner görselleri
```

#### **2. Prisma Schema Güncelleme (Opsiyonel)**

Şu anki yapı yeterli:

```prisma
model Product {
  // ... diğer alanlar
  images  String[]  // Supabase Storage URL'leri: ["https://...supabase.co/storage/v1/object/public/products/image.jpg"]
}

model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  image     String?  // Banner URL
  products  Product[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Not:** `Category` modeline `image` alanı ekleyebiliriz (opsiyonel).

---

### 🔧 Backend Implementasyonu

#### **Supabase Storage Client**

```bash
# backend klasörüne Supabase SDK ekleyin
cd backend
pnpm add @supabase/supabase-js
```

```typescript
// backend/src/core/services/supabase.service.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### **Environment Variables**

```env
# Backend .env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]  # Admin işlemleri için
```

---

### 📤 Görsel Yükleme API Endpoint'leri

#### **1. Ürün Görseli Yükleme**

```typescript
// backend/src/api/admin/admin.controller.ts
import { supabase } from '../../core/services/supabase.service';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/admin/products/:id/upload-image
adminRouter.post('/products/:id/upload-image', 
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Supabase Storage'a yükle
      const fileName = `${id}-${Date.now()}.${file.originalname.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      // Public URL al
      const { data: publicData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      // Veritabanında güncelle
      const product = await ProductService.updateProduct(id, {
        images: {
          push: publicData.publicUrl,
        },
      });

      res.json({ product, imageUrl: publicData.publicUrl });
    } catch (error) {
      next(error);
    }
  }
);
```

#### **2. Kategori Banner Yükleme**

```typescript
// POST /api/admin/categories/:id/upload-banner
adminRouter.post('/categories/:id/upload-banner',
  authenticateToken,
  requireAdmin,
  upload.single('banner'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Supabase Storage'a yükle
      const fileName = `${id}-${Date.now()}.${file.originalname.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('categories')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true, // Overwrite existing
        });

      if (error) {
        throw new Error(error.message);
      }

      // Public URL al
      const { data: publicData } = supabase.storage
        .from('categories')
        .getPublicUrl(fileName);

      // Veritabanında güncelle
      const category = await CategoryService.updateCategory(id, {
        image: publicData.publicUrl,
      });

      res.json({ category, bannerUrl: publicData.publicUrl });
    } catch (error) {
      next(error);
    }
  }
);
```

---

### 🎨 Frontend: Admin Panel Görsel Yükleme

#### **File Upload Component**

```typescript
// frontend/components/admin/ImageUpload.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  type: 'product' | 'category' | 'banner';
  id: string;
  onUploadSuccess: (url: string) => void;
}

export function ImageUpload({ type, id, onUploadSuccess }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = type === 'category' ? 'banner' : 'image';
      const response = await fetch(`${apiUrl}/api/admin/${type}s/${id}/upload-${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      onUploadSuccess(data.imageUrl || data.bannerUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Görsel yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-2">Görsel Yükle</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id={`upload-${id}`}
      />
      <label
        htmlFor={`upload-${id}`}
        className="cursor-pointer"
      >
        <Button variant="outline" disabled={uploading}>
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Yükleniyor...' : 'Görsel Seç'}
        </Button>
      </label>
    </div>
  );
}
```

#### **Admin Panel Entegrasyonu**

```typescript
// frontend/app/admin/page.tsx
import { ImageUpload } from '@/components/admin/ImageUpload';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const handleImageUpload = (productId: string) => (url: string) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, images: [...p.images, url] }
        : p
    ));
  };

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          {/* ... ürün bilgileri */}
          <ImageUpload
            type="product"
            id={product.id}
            onUploadSuccess={handleImageUpload(product.id)}
          />
          {/* Mevcut görselleri göster */}
          <div className="flex gap-2 mt-2">
            {product.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt="" className="w-20 h-20 object-cover rounded" />
                <button onClick={() => handleDeleteImage(product.id, idx)}>
                  <X className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white rounded" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔄 Veri Aktarımı: Prisma ile Supabase

### ✅ **Evet, Prisma ile Aktaracağız!**

**Süreç:**

```bash
# 1. Supabase projesi oluştur
# 2. DATABASE_URL'i al

# 3. Backend .env'i güncelle
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"

# 4. Prisma migration (mevcut şema aynen çalışır!)
cd backend
pnpm prisma db push

# 5. Seed data (opsiyonel)
pnpm prisma db seed
```

**Avantajlar:**
- ✅ Hiçbir kod değişikliği gerekmiyor
- ✅ Mevcut `schema.prisma` dosyanız Supabase'de çalışır
- ✅ Migration geçmişi korunur
- ✅ Type safety devam eder

---

## 📊 Deployment Özeti

### **Stack:**

```
Frontend:      Vercel           (https://your-app.vercel.app)
Backend:       Railway/Render   (https://your-api.railway.app)
Database:      Supabase         (Managed PostgreSQL)
Storage:       Supabase Storage (Görsel depolama)
ORM:           Prisma           (Değişiklik yok!)
```

### **Maliyet (Aylık):**

| Servis | Plan | Fiyat |
|--------|------|-------|
| Vercel Frontend | Hobby | $0 |
| Railway Backend | Starter | $5 (ücretsiz kredi) |
| Supabase DB | Pro | $25 (100GB storage) |
| **TOPLAM** | | **$25/ay** |

**Veya Başlangıç İçin Ücretsiz:**

| Servis | Plan | Fiyat |
|--------|------|-------|
| Vercel Frontend | Hobby | $0 |
| Railway Backend | Starter | $0 |
| Supabase DB | Free | $0 (500MB DB, 1GB storage) |
| **TOPLAM** | | **$0/ay** |

---

## 🚀 Deployment Adımları

### **1. Supabase Setup**

1. https://supabase.com → GitHub ile giriş
2. "New Project" → Proje adı + şifre
3. Database → Connection string kopyala
4. Storage → Buckets oluştur: `products`, `categories`, `banners`

### **2. Backend .env**

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_KEY]
JWT_SECRET=your-secret-key
PORT=5000
```

### **3. Railway Backend Deploy**

```bash
# GitHub'a push
git push origin main

# Railway'de:
# 1. New Project → Deploy from GitHub
# 2. Backend klasörünü seç
# 3. Environment variables ekle
# 4. Deploy!
```

### **4. Vercel Frontend Deploy**

```bash
# Vercel Dashboard:
# 1. Import Project → GitHub repo
# 2. Framework: Next.js
# 3. Root Directory: frontend
# 4. Environment:
   NEXT_PUBLIC_API_URL=https://your-api.railway.app
# 5. Deploy!
```

---

## ✅ Supabase Uyumluluk Kontrolü

- ✅ **PostgreSQL:** Tam destek
- ✅ **Prisma ORM:** Tam destek
- ✅ **Görsel Depolama:** Storage API ile
- ✅ **Admin Panel:** API üzerinden yönetim
- ✅ **Ölçeklenebilirlik:** 500MB → 8GB → sınırsız
- ✅ **Güvenlik:** RLS (Row Level Security) mevcut
- ✅ **Backup:** Otomatik günlük backup

**Sonuç:** Supabase, projeniz için ideal seçim! 🎯

---

## 🔗 Yararlı Linkler

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-supabase)
- [Railway Deploy Guide](https://docs.railway.app/getting-started)
- [Vercel Deploy Guide](https://vercel.com/docs)

