# SEPET İŞLEVLİĞİ (SHOPPING CART)

Bu doküman, e-ticaret projesindeki alışveriş sepeti işlevselliğini, kullanılan teknolojileri, dosya yapısını ve geliştirme sürecini kronolojik olarak belgeler.

## Mimari Genel Bakış

Sepet işlevselliği, kullanıcıların ürünleri seçmesi, miktar ayarlaması ve satın alma işlemine hazırlanması için tasarlanmıştır. Sistem, veritabanında **her kullanıcı için ayrı bir sepet** tutar.

```
Frontend (Next.js + React Context)  ←→  Backend (Express.js + Prisma + JWT)  ←→  Database (PostgreSQL)
```

---

## Kullanılan Teknolojiler

### Backend

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| **Express.js** | RESTful API endpoint'leri oluşturma |
| **Prisma ORM** | Veritabanı işlemleri, `Cart` ve `CartItem` modelleri |
| **jsonwebtoken (JWT)** | Kullanıcı kimlik doğrulama, korumalı route'lar |
| **Zod** | Request/Response validasyonu |
| **PostgreSQL** | Veritabanı (Cart ve CartItem tabloları) |

### Frontend

| Teknoloji/Kavram | Kullanım Amacı |
|------------------|----------------|
| **Next.js 14** | React framework, component lifecycle |
| **React Context API** | Global authentication state (`AuthContext`) |
| **React Hooks** | `useState`, `useEffect`, `useCallback` |
| **Custom Events** | Sepet güncellemelerinde cross-component haberleşme |
| **shadcn/ui Sheet** | Sepet drawer (yan panel) bileşeni |
| **localStorage** | JWT token saklama (AuthContext ile) |
| **Image (next/image)** | Optimized resim gösterimi |

---

## Dosya Yapısı ve İşlevleri

### Backend

```
backend/
├── prisma/
│   └── schema.prisma              # Cart ve CartItem modellerinin tanımları
├── src/
│   ├── core/
│   │   └── middleware/
│   │       └── auth.middleware.ts  # JWT doğrulama middleware
│   ├── api/
│   │   └── cart/
│   │       ├── cart.service.ts     # Sepet iş mantığı (CRUD)
│   │       └── cart.controller.ts  # API endpoint'leri
│   └── index.ts                    # Ana Express uygulaması
```

**Önemli Dosyalar:**

1. **`backend/prisma/schema.prisma`**
   - `Cart` modeli: Her kullanıcının bir sepeti
   - `CartItem` modeli: Sepetteki ürünler
   - `User` modeline `cart` ilişkisi eklendi

2. **`backend/src/core/middleware/auth.middleware.ts`**
   - JWT token doğrulama
   - Korumalı route'lar için middleware

3. **`backend/src/api/cart/cart.service.ts`**
   - `getCartByUserId()`: Kullanıcı sepetini getirir
   - `addItemToCart()`: Ürün ekler veya miktarı artırır
   - `updateCartItem()`: Ürün miktarını günceller
   - `removeCartItem()`: Ürünü sepetten çıkarır

4. **`backend/src/api/cart/cart.controller.ts`**
   - `GET /api/cart`: Sepeti listele
   - `POST /api/cart/items`: Ürün ekle
   - `PATCH /api/cart/items/:itemId`: Miktar güncelle
   - `DELETE /api/cart/items/:itemId`: Ürünü sil

### Frontend

```
frontend/
├── components/
│   ├── cart/
│   │   └── CartDrawer.tsx          # Sepet drawer bileşeni
│   ├── navbar/
│   │   ├── HeaderDesktop.tsx       # Desktop header (CartDrawer kullanır)
│   │   └── HeaderMobil.tsx         # Mobile header (CartDrawer kullanır)
│   └── product-detail/
│       └── ProductInfo.tsx         # Ürün detay sayfası, "Sepete Ekle" butonu
├── context/
│   └── AuthContext.tsx             # Global authentication state
└── app/
    └── urun/
        └── [slug]/
            └── page.tsx            # Ürün detay sayfası
```

**Önemli Dosyalar:**

1. **`frontend/components/cart/CartDrawer.tsx`**
   - Drawer açılıp kapanması (`Sheet` component)
   - Sepet verilerini API'den çekme
   - Ürün adet güncelleme/silme
   - Toplam fiyat hesaplama
   - Custom event dinleme (badge güncelleme için)

2. **`frontend/components/product-detail/ProductInfo.tsx`**
   - "Sepete Ekle" butonu işlevselliği
   - Adet seçimi
   - API isteği gönderme
   - Custom event tetikleme

3. **`frontend/context/AuthContext.tsx`**
   - JWT token yönetimi
   - localStorage entegrasyonu
   - `useAuth()` hook'u

---

## Adım Adım Geliştirme Süreci

### 1. Veritabanı Şeması Güncelleme

**Amaç:** Sepet ve sepet öğelerini veritabanında tutmak.

**İşlemler:**
1. `backend/prisma/schema.prisma` dosyasına `Cart` ve `CartItem` modelleri eklendi
2. `User` modeline `cart` ilişkisi eklendi
3. `Product` modeline `cartItems` ilişkisi eklendi
4. Migration çalıştırıldı: `docker exec ecom_backend_api pnpm prisma db push`

**Şema Özeti:**

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  firstName String
  lastName  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  cart      Cart?     // Her kullanıcının tek bir sepeti
}

model Cart {
  id        String      @id @default(cuid())
  userId    String      @unique
  items     CartItem[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CartItem {
  id        String   @id @default(cuid())
  cartId    String
  productId String
  quantity  Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])
  
  @@unique([cartId, productId])  // Aynı ürün sepette iki kez olmaz
}
```

**Neden:**
- `Cart` ve `CartItem` ayrı tablolarda: Normalizasyon, veri bütünlüğü
- `onDelete: Cascade`: Kullanıcı silinince sepeti de silinir
- `@@unique([cartId, productId])`: Aynı ürün tekrar eklenemez; miktar artırılır

---

### 2. Backend Auth Middleware Oluşturma

**Amaç:** Sepet API'lerini korumak için JWT doğrulama middleware'i.

**Dosya:** `backend/src/core/middleware/auth.middleware.ts`

**İşlemler:**
1. JWT token'ı header'dan okuma
2. Token'ı doğrulama
3. Kullanıcı ID'sini `req.user.id` olarak set etme

**Kod Özeti:**

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: 'Token bulunamadı' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Geçersiz token' });
  }
};
```

**Neden Middleware:**
- Korumalı route'larda tekrar eden kod azalır
- Güvenlik: Token yoksa istek reddedilir
- Tip güvenliği: `req.user.id` kullanılabilir

---

### 3. Backend Cart Service Yazma

**Amaç:** Sepet CRUD işlemlerini gerçekleştiren servis katmanı.

**Dosya:** `backend/src/api/cart/cart.service.ts`

**Fonksiyonlar:**

#### a) `getCartByUserId(userId: string)`
Sepeti getirir; yoksa oluşturur.

```typescript
export const getCartByUserId = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });
  }

  return cart;
};
```

#### b) `addItemToCart(userId: string, productId: string, quantity: number)`
Ürün ekler; varsa miktarını artırır.

```typescript
export const addItemToCart = async (userId: string, productId: string, quantity: number) => {
  // Sepeti getir veya oluştur
  let cart = await getCartByUserId(userId);

  // Ürün zaten sepette mi?
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    // Miktarı artır
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: { product: true },
    });
  } else {
    // Yeni ürün ekle
    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: { product: true },
    });
  }
};
```

#### c) `updateCartItem(itemId: string, quantity: number)`
Ürün miktarını günceller.

#### d) `removeCartItem(itemId: string)`
Ürünü sepetten çıkarır.

---

### 4. Backend Cart Controller Yazma

**Amaç:** API endpoint'lerini tanımlama ve servis katmanını kullanma.

**Dosya:** `backend/src/api/cart/cart.controller.ts`

**Endpoint'ler:**

| Method | Endpoint | Açıklama | Koruma |
|--------|----------|----------|--------|
| `GET` | `/api/cart` | Sepeti listele | JWT |
| `POST` | `/api/cart/items` | Ürün ekle | JWT |
| `PATCH` | `/api/cart/items/:itemId` | Miktar güncelle | JWT |
| `DELETE` | `/api/cart/items/:itemId` | Ürünü sil | JWT |

**Kod Özeti:**

```typescript
import express from 'express';
import { verifyToken } from '../../core/middleware/auth.middleware';
import * as cartService from './cart.service';

const router = express.Router();

// Tüm route'ları JWT ile koru
router.use(verifyToken);

// GET /api/cart
router.get('/', async (req, res) => {
  const cart = await cartService.getCartByUserId(req.user!.id);
  res.json(cart);
});

// POST /api/cart/items
router.post('/items', async (req, res) => {
  const { productId, quantity } = req.body;
  const item = await cartService.addItemToCart(req.user!.id, productId, quantity);
  res.json(item);
});

// ... diğer endpoint'ler

export const cartRouter = router;
```

**Ana Uygulamaya Entegrasyon:**

`backend/src/index.ts`:

```typescript
import { cartRouter } from './api/cart/cart.controller';

app.use('/api/cart', cartRouter);
```

---

### 5. Frontend: Sepete Ekleme Butonu

**Amaç:** Ürün detay sayfasından sepete ürün ekleme.

**Dosya:** `frontend/components/product-detail/ProductInfo.tsx`

**İşlemler:**

1. Kullanıcı girişini kontrol et (`useAuth` hook'u)
2. API'ye POST isteği gönder
3. Başarılı olursa custom event tetikle
4. Kullanıcıyı bilgilendir

**Kod Özeti:**

```typescript
const handleAddToCart = async () => {
  // 1. Token kontrolü
  if (!token) {
    router.push('/giris-yap');
    return;
  }

  // 2. Loading state
  setIsAdding(true);
  
  try {
    // 3. API isteği
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product.id,
        quantity: quantity,
      }),
    });

    if (!response.ok) {
      throw new Error('Sepete eklenirken bir hata oluştu');
    }

    // 4. Custom event ile diğer component'lere haber ver
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    alert('Ürün sepete eklendi!');
  } catch (error) {
    console.error('Sepete ekleme hatası:', error);
    alert('Ürün sepete eklenirken bir hata oluştu.');
  } finally {
    setIsAdding(false);
  }
};
```

**Custom Event Neden Gerekiyor:**
- `ProductInfo` ve `CartDrawer` farklı bileşenler
- "Sepete Ekle" sonrası badge anında güncellenmeli
- `CartDrawer` event dinleyerek sepetteki ürünleri yeniden yükler

---

### 6. Frontend: CartDrawer Component'i

**Amaç:** Sepet içeriğini gösteren drawer.

**Dosya:** `frontend/components/cart/CartDrawer.tsx`

**Özellikler:**

1. Drawer açılır/kapanır (`shadcn/ui Sheet`)
2. Sepet verilerini API'den çeker
3. Ürün listesini gösterir
4. Adet güncelleme/silme işlemleri
5. Toplam fiyat hesaplama
6. Custom event dinleyerek badge günceller

**State Yönetimi:**

```typescript
const [cart, setCart] = useState<Cart | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [isOpen, setIsOpen] = useState(false);
const { token } = useAuth();
```

**Sepet Verisini Çekme (fetchCart):**

```typescript
const fetchCart = useCallback(async (showLoading = false) => {
  if (!token) return;
  
  if (showLoading) {
    setIsLoading(true);
  }
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const cartData = await response.json();
      setCart(cartData);
    }
  } catch (error) {
    console.error('Sepet bilgisi alınamadı:', error);
  } finally {
    if (showLoading) {
      setIsLoading(false);
    }
  }
}, [token]);
```

**useEffect Hook'ları:**

1. İlk yüklemede sepeti al (badge için)
2. Drawer açıldığında tekrar yükle
3. Custom event dinle, badge'i güncelle

```typescript
// İlk yüklemede sepeti al
useEffect(() => {
  if (token && !isOpen) {
    fetchCart(false); // Silent update
  }
}, [token, fetchCart, isOpen]);

// Drawer açıldığında sepeti yeniden yükle
useEffect(() => {
  if (isOpen && token) {
    fetchCart(true); // Loading göster
  }
}, [isOpen, token, fetchCart]);

// Custom event dinleyicisi - sepete ürün eklendiğinde badge'i güncelle
useEffect(() => {
  const handleCartUpdate = () => {
    if (token) {
      fetchCart(false); // Silent update
    }
  };

  window.addEventListener('cartUpdated', handleCartUpdate);
  return () => {
    window.removeEventListener('cartUpdated', handleCartUpdate);
  };
}, [token, fetchCart]);
```

**Toplam Fiyat Hesaplama:**

```typescript
const totalPrice = cart?.items.reduce((sum, item) => {
  const itemPrice = item.product.discounted_price || item.product.price;
  return sum + (itemPrice * item.quantity);
}, 0) || 0;

const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
```

**UI Özeti:**

```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetTrigger asChild>
    <button className="relative flex items-center justify-center gap-2 md:h-12 md:w-32">
      <ShoppingCart className="h-7 w-7" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {totalItems}
        </span>
      )}
      <span>Sepet</span>
    </button>
  </SheetTrigger>
  <SheetContent side="right" className="w-full sm:max-w-lg">
    {/* Sepet içeriği */}
  </SheetContent>
</Sheet>
```

---

## Önemli Tasarım Kararları

### 1. Her Kullanıcı İçin Otomatik Sepet Oluşturma
**Neden:** Kullanıcı ilk ürünü eklediğinde sepet otomatik oluşturulmalı.

**Çözüm:** `getCartByUserId()` fonksiyonu sepeti kontrol eder, yoksa oluşturur.

### 2. Aynı Ürünün Tekrar Eklenmesini Önleme
**Neden:** Aynı ürün sepette iki kez olmamalı, miktarı artırılmalı.

**Çözüm:** `@@unique([cartId, productId])` constraint + kontrol

### 3. Sepet Öğelerinin Silinme Durumları
**Neden:** Kullanıcı silinince sepeti de silinmeli.

**Çözüm:** `onDelete: Cascade`

### 4. Badge Güncellemesi
**Sorun:** "Sepete Ekle" sonrası badge hemen güncellenmiyor.

**Çözüm:** Custom Event (`cartUpdated`) kullanımı

### 5. JWT Token Yönetimi
**Neden:** Sepet işlemleri için kullanıcı kimliği gerekli.

**Çözüm:** `localStorage` + `AuthContext` ile global state

---

## Karşılaşılan Sorunlar ve Çözümleri

### Sorun 1: Sepet Badge'i Güncellenmiyor
**Belirti:** Ürün sepete eklendikten sonra navbar'daki badge sayıyı göstermiyor.

**Neden:** `CartDrawer` bileşeni sadece drawer açıldığında API'den veri çekiyordu.

**Çözüm:** Custom Event ekledik (`cartUpdated`) ve `ProductInfo` bileşeninden tetikledik.

### Sorun 2: Badge Konumlandırması
**Belirti:** Badge sepet butonunun üzerinde görünmüyor.

**Neden:** Badge `absolute` konumlu ama buton `relative` değildi.

**Çözüm:** Buton `className`'ine `relative` ekledik.

### Sorun 3: useEffect Infinite Loop
**Belirti:** Sepet sürekli yeniden yükleniyor.

**Neden:** `fetchCart` dependency array'de ama her render'da yeniden oluşturuluyordu.

**Çözüm:** `useCallback` ile `fetchCart` fonksiyonunu memoize ettik.

### Sorun 4: CORS Hatası
**Belirti:** Frontend'den backend'e istek atılamıyor (`Failed to fetch`).

**Neden:** Backend'de CORS middleware eksikti.

**Çözüm:** `backend/src/index.ts` dosyasına CORS middleware ekledik.

---

## Çalıştırma ve Test

### Backend

1. Docker container'ları başlat: `docker-compose up -d postgres`
2. Backend'i başlat: `docker-compose up --build -d backend`
3. Migration'ları çalıştır: `docker exec ecom_backend_api pnpm prisma db push`
4. Backend loglarını takip et: `docker logs -f ecom_backend_api`

### Frontend

1. Frontend'i IDE'den başlat: `pnpm dev`
2. Tarayıcıda aç: `http://localhost:3000`

### Test Senaryoları

1. **Üye Ol / Giriş Yap:** Kullanıcı hesabı oluşturulur
2. **Ürün Detay Sayfası:** Ürüne tıkla
3. **Sepete Ekle:** Miktar seç, "Sepete Ekle" tıkla
4. **Badge Kontrolü:** Navbar'da badge görünür
5. **Drawer Aç:** Sepet ikonuna tıkla, ürünler görünür
6. **Adet Değiştir:** +/- butonlarıyla miktar değiştir
7. **Ürün Sil:** X ikonuna tıkla, ürün kaldırılır
8. **Toplam Fiyat:** Toplam doğru hesaplanır

---

## Sonuç

Sepet işlevselliği başarıyla tamamlandı. Sistem, kullanıcıların ürün seçmesi, sepeti yönetmesi ve satın alma işlemine hazırlanması için tam bir e-ticaret deneyimi sunar.

**Kilit Başarı Faktörleri:**
- Veritabanı normalizasyonu (`Cart` ve `CartItem` ayrı tablolar)
- JWT tabanlı güvenlik
- Reactive UI güncellemeleri (Custom Events)
- Kullanıcı dostu arayüz (shadcn/ui Sheet)
- Hata yönetimi ve loading state'leri

**Gelecek Geliştirmeler:**
- "Siparişi Tamamla" butonunun checkout flow'una bağlanması
- Ürün stok kontrolü
- Promosyon kodları
- Sepet süresi sona erme (session timeout)

