# ADMIN PANEL İŞLEVLİĞİ

Bu doküman, e-ticaret projesindeki admin panel işlevselliğini, kullanıcı rol yönetimini, yetki kontrolünü ve geliştirme sürecini kronolojik olarak belgeler.

## Mimari Genel Bakış

Admin panel, sadece **ADMIN** rolüne sahip kullanıcıların ürün yönetimi yapabileceği bir arayüzdür. Sistem, **role-based access control (RBAC)** prensibiyle çalışır.

```
Frontend (Admin UI)  ←→  Backend (Express + Middleware)  ←→  Database (PostgreSQL)
          ↓
    JWT Token (Admin Role)
```

---

## Kullanılan Teknolojiler ve Kavramlar

### Backend

| Teknoloji/Kavram | Kullanım Amacı |
|------------------|----------------|
| **Prisma** | Veritabanı şemasına `role` alanı ekleme |
| **JWT (jsonwebtoken)** | Token içinde kullanıcı rolü bilgisi |
| **Express Middleware** | `requireAdmin`: Admin yetki kontrolü |
| **RESTful API** | `/api/admin/*` endpoint'leri |

### Frontend

| Teknoloji/Kavram | Kullanım Amacı |
|------------------|----------------|
| **Next.js** | Admin panel sayfası routing |
| **React Hooks** | State yönetimi, useEffect |
| **JWT Token** | localStorage'dan okunan admin token |

---

## Adım Adım Geliştirme Süreci

### 1. Veritabanı Şemasını Güncelleme

**Amaç:** Kullanıcıları "USER" ve "ADMIN" olarak ayırmak.

**Sorun:** Başlangıçta tüm kullanıcılar aynı haklara sahipti.

**Çözüm:** `User` modeline `role` alanı eklendi.

**İşlemler:**

1. `backend/prisma/schema.prisma` dosyasında `User` modeli güncellendi:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  firstName String?
  lastName  String?
  role      String   @default("USER") // USER veya ADMIN
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  cart      Cart?     
}
```

**Neden `default("USER")`:**
- Kayıt olan herkes varsayılan olarak "normal kullanıcı"
- Admin kullanıcılar manuel olarak veritabanında oluşturulur

2. Migration çalıştırıldı: `docker exec ecom_backend_api pnpm prisma db push`

---

### 2. Admin Kullanıcısı Oluşturma

**Sorun:** Admin kullanıcısı oluşturmak için terminal komutu çok karmaşıktı.

**Geçici Çözüm:** Bir `create-admin.js` script'i yazıldı.

**Neden Script Yazıldı:**

```javascript
// Neden böyle yapıldı?
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// İş mantığı: Şifreyi hash'le, admin kullanıcısı oluştur
const hashedPassword = await bcrypt.hash('admin123', 10);
await prisma.user.create({
  data: {
    email: 'admin@yazilimtech.com',
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN'  // Önemli: role alanı ADMIN
  }
});
```

**Neden Daha Sonra Silindi:**
- Script sadece **bir kez** çalışacaktı
- Kod tabanını kirletmemek için (production'da olmamalı)
- Geçici bir çözümdü, kalıcı değildi

**Alternatif Çözümler (Gelecek):**
- Seed dosyasına admin kullanıcısı eklemek
- Database migration ile otomatik eklemek
- Admin panelinden kullanıcı ekleme özelliği

---

### 3. Backend: Middleware Geliştirme

**Amaç:** Admin route'larını korumak.

**Sorun:** Normal kullanıcılar admin işlemleri yapabilirdi.

**Çözüm:** İki middleware:
1. `authenticateToken`: JWT doğrulama (zaten vardı)
2. `requireAdmin`: Yeni eklenen, admin kontrolü

**İşlemler:**

1. `AuthenticatedRequest` interface güncellendi:

```typescript
export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;  // Yeni eklenen
}
```

2. `authenticateToken` middleware güncellendi:

```typescript
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // ... JWT doğrulama
  
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.userId = decoded.userId;
  req.userRole = user.role;  // ⭐ YENİ: Kullanıcı rolünü request'e ekle
  next();
};
```

3. Yeni `requireAdmin` middleware eklendi:

```typescript
/**
 * Admin yetkisi kontrolü yapar.
 * Kullanım: Sadece admin route'larında kullanılır.
 * 
 * @middleware
 */
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};
```

**İşleyiş:**

```
Request → authenticateToken → requireAdmin → Controller
           ↓                      ↓
        JWT doğrula          Role kontrolü
        userRole ekle        403 dön
                             
```

**HTTP Status Kodları:**
- `401 Unauthorized`: Token yok veya geçersiz
- `403 Forbidden`: Token var ama yetki yok

---

### 4. Backend: Products Service Güncelleme

**Amaç:** Ürün silme fonksiyonu eklemek.

**Sorun:** Ürün silme işlemi yoktu.

**Çözüm:** `deleteProduct` fonksiyonu eklendi.

**İşlemler:**

1. `backend/src/api/products/products.service.ts` dosyasına yeni fonksiyon:

```typescript
/**
 * Bir ürünü veritabanından siler.
 * Kullanım: Admin panelinde ürün silme işlemi.
 * 
 * @param productId - Silinecek ürünün ID'si
 */
export const deleteProduct = async (productId: string) => {
  await prisma.product.delete({
    where: { id: productId },
  });
};
```

**Neden Service Katmanında:**
- **Separation of Concerns**: Controller UI mantığı, Service iş mantığı
- **Reusability**: Aynı fonksiyon farklı yerlerde kullanılabilir
- **Testability**: Service fonksiyonları izole test edilebilir

---

### 5. Backend: Admin Controller Oluşturma

**Amaç:** Admin route'larını tanımlamak.

**Sorun:** Ürün CRUD işlemleri korunmuyordu.

**Çözüm:** Yeni `admin.controller.ts` dosyası eklendi.

**İşlemler:**

1. Dosya oluşturuldu: `backend/src/api/admin/admin.controller.ts`

```typescript
import express, { Response, NextFunction } from 'express';
import * as ProductService from '../products/products.service';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../../core/middleware/auth.middleware';

export const adminRouter = express.Router();

// Tüm admin route'larını koru
adminRouter.use(authenticateToken);  // 1. Önce JWT kontrolü
adminRouter.use(requireAdmin);        // 2. Sonra admin kontrolü

// DELETE /api/admin/products/:id
adminRouter.delete('/products/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await ProductService.deleteProduct(id);
    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    next(error);
  }
});
```

**Middleware Zinciri:**

```typescript
adminRouter.use(authenticateToken);  // ← Tüm route'lara uygulanır
adminRouter.use(requireAdmin);
```

Bu, her admin route'unun otomatik olarak korunmasını sağlar.

2. Ana uygulamaya entegrasyon: `backend/src/index.ts`

```typescript
import { adminRouter } from './api/admin/admin.controller';

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/admin', adminRouter);  // ← Yeni eklendi
```

**Neden Ayrı Router:**
- **Modülerlik**: Admin işlemleri ayrı kategoride
- **Güvenlik**: Tek yerden middleware uygulanır
- **Organizasyon**: Kod daha okunabilir

---

### 6. Frontend: Admin Sayfası Oluşturma

**Amaç:** Admin arayüzü oluşturmak.

**Sorun:** Ürün yönetimi için arayüz yoktu.

**Çözüm:** `frontend/app/admin/page.tsx` dosyası oluşturuldu.

**İşlemler:**

1. Dosya oluşturuldu: `frontend/app/admin/page.tsx`

**Özellikler:**

```typescript
export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/giris-yap');  // Kullanıcı giriş yapmamışsa login'e yönlendir
      return;
    }
    fetchProducts();
  }, [token, router]);

  // Ürün listesini API'den çek
  const fetchProducts = async () => {
    const response = await fetch(`${apiUrl}/api/products`);
    const data = await response.json();
    setProducts(data);
  };

  // Ürün silme
  const handleDelete = async (productId: string) => {
    const response = await fetch(`${apiUrl}/api/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,  // JWT token gönder
      },
    });
    
    if (response.ok) {
      setProducts(products.filter(p => p.id !== productId));  // UI'dan kaldır
    }
  };
}
```

**Güvenlik Açıklaması:**

Frontend tarafında rol kontrolü **yapılmaz**. Neden?

1. **Sunucu tarafı kontrol yeterli**: Backend zaten kontrol ediyor
2. **Güvenlik için frontend'e güvenilmez**: Kullanıcı kod değiştirebilir
3. **Defense in Depth**: Frontend sadece UX için, asıl güvenlik backend'de

**Örneğin:**

```typescript
// ❌ YANLIŞ: Frontend'de rol kontrolü
if (user.role !== 'ADMIN') {
  return <div>Yetkisiz erişim</div>;
}

// ✅ DOĞRU: Backend'de kontrol (zaten yapılıyor)
// Frontend sadece kullanıcıyı yönlendirir
```

---

## Önemli Tasarım Kararları

### 1. RBAC (Role-Based Access Control)

**Neden:**
- Farklı kullanıcı tiplerine farklı yetkiler
- Güvenlik: Normal kullanıcılar admin işlemleri yapamaz
- Ölçeklenebilirlik: Gelecekte daha fazla rol eklenebilir

**Değerler:**
- `USER`: Normal kullanıcı (varsayılan)
- `ADMIN`: Yönetici (ürün yönetimi)

---

### 2. Middleware Zincirleme

**Neden İki Middleware:**

```typescript
adminRouter.use(authenticateToken);  // JWT doğrula
adminRouter.use(requireAdmin);        // Rol kontrolü
```

**İşleyiş:**

1. `authenticateToken`:
   - Token var mı?
   - Token geçerli mi?
   - Kullanıcı veritabanında var mı?
   - → `req.userRole` set et

2. `requireAdmin`:
   - `req.userRole === 'ADMIN'` mi?
   - → Yoksa 403 dön

**Alternatif:**

```typescript
// Tek middleware ile de yapılabilirdi
const requireAdminAuth = async (req, res, next) => {
  // JWT kontrolü
  // Rol kontrolü
  next();
};
```

Ama **ayrı tutuldu** çünkü:
- `authenticateToken` başka yerlerde de kullanılıyor (cart, auth)
- **Single Responsibility Principle**: Her middleware tek iş yapmalı

---

### 3. Service Pattern

**Neden Service Katmanı:**

```
Controller → Service → Prisma → Database
```

**Örnek:**

```typescript
// Controller: HTTP isteklerini yönet
router.delete('/products/:id', async (req, res) => {
  await ProductService.deleteProduct(req.params.id);
  res.json({ message: 'Ürün silindi' });
});

// Service: İş mantığını yönet
export const deleteProduct = async (productId: string) => {
  await prisma.product.delete({ where: { id: productId } });
};
```

**Avantajlar:**
- **Reusability**: Service farklı controller'larda kullanılabilir
- **Testability**: Service fonksiyonları test edilebilir
- **Separation of Concerns**: UI mantığı vs. iş mantığı

---

## Karşılaşılan Sorunlar ve Çözümleri

### Sorun 1: create-admin.js Karmaşıklığı

**Sorun:** İlk başta tek komutla admin kullanıcısı oluşturmak istedik ama Node.js inline komutu çok karmaşıktı.

**Çözüm:** Geçici olarak bir script dosyası yazıldı, çalıştırıldı, sonra silindi.

**Gelecek Geliştirmeler:**
- `prisma/seed.ts` dosyasına admin kullanıcısı eklemek
- Migration ile otomatik admin oluşturma

---

### Sorun 2: Frontend'de Rol Kontrolü

**Sorun:** Frontend'de admin sayfasını sadece admin görebilmeli mi?

**Çözüm:** **Hayır.** Frontend sadece UX için yönlendirme yapar, asıl güvenlik backend'de.

```typescript
// Frontend: Sadece kullanıcıyı login'e yönlendir
if (!token) {
  router.push('/giris-yap');
}

// Backend: Gerçek kontrol burada
if (req.userRole !== 'ADMIN') {
  return res.status(403).json({ message: 'Access denied' });
}
```

---

## Çalıştırma ve Test

### 1. Admin Kullanıcısı Oluşturma

**Geçici Script (Zaten Silindi):**

```bash
docker exec ecom_backend_api sh -c "cd /usr/src/app/backend && node create-admin.js"
```

**Sonuç:**

```
Admin user created successfully: {
  id: 'cmhhn97yb00002pt8jwpqui7y',
  email: 'admin@yazilimtech.com',
  role: 'ADMIN',
  ...
}
```

**Gelecek:** Bu script yerine `prisma/seed.ts` kullanılacak.

---

### 2. Backend Test

**Test Senaryoları:**

1. **Normal Kullanıcı ile Ürün Silme:**
   ```bash
   curl -X DELETE http://localhost:5001/api/admin/products/123 \
     -H "Authorization: Bearer NORMAL_USER_TOKEN"
   ```
   → `403 Forbidden` dönmeli

2. **Admin Kullanıcı ile Ürün Silme:**
   ```bash
   curl -X DELETE http://localhost:5001/api/admin/products/123 \
     -H "Authorization: Bearer ADMIN_TOKEN"
   ```
   → `200 OK` dönmeli

3. **Token Olmadan İstek:**
   ```bash
   curl -X DELETE http://localhost:5001/api/admin/products/123
   ```
   → `401 Unauthorized` dönmeli

---

### 3. Frontend Test

**Test Senaryoları:**

1. **Login Yapmadan Admin Sayfası:**
   - `/admin` sayfasına git
   - → `/giris-yap` sayfasına yönlendirilmeli

2. **Normal Kullanıcı ile Admin Sayfası:**
   - Normal kullanıcı ile giriş yap
   - `/admin` sayfasına git
   - → Ürün listesi yüklenir ama silme işlemi **403 döner**

3. **Admin Kullanıcı ile Admin Sayfası:**
   - Admin kullanıcı ile giriş yap (`admin@yazilimtech.com`)
   - `/admin` sayfasına git
   - → Ürün listesi yüklenir
   - → Silme işlemi başarılı

---

## Sonuç

Admin panel işlevselliği temel olarak tamamlandı:

**Tamamlananlar:**
- ✅ Kullanıcı rolleri (USER, ADMIN)
- ✅ Admin middleware (`requireAdmin`)
- ✅ Admin API route'ları
- ✅ Frontend admin sayfası
- ✅ Ürün CRUD işlemleri (Ekleme, Düzenleme, Silme)
- ✅ İndirimli fiyat hesaplama
- ✅ Dinamik form yönetimi

**Gelecek Geliştirmeler:**
- 🔄 Seed dosyasına admin kullanıcısı ekleme
- 🔄 Kategori yönetimi
- 🔄 Kullanıcı yönetimi
- 🔄 Sipariş yönetimi

**Kilit Başarı Faktörleri:**
- RBAC ile güvenli yetki kontrolü
- Middleware zincirleme ile modüler kod
- Service pattern ile clean architecture
- Frontend'de asla kritik kontroller yapılmaması

**Öğrenilenler:**
- Role-based access control prensibi
- Middleware chain pattern
- Defense in depth güvenlik yaklaşımı
- Separation of concerns (Controller vs Service)

