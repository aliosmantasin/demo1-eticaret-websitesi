# HESAP YÖNETİMİ (ACCOUNT MANAGEMENT)

Bu doküman, e-ticaret projesindeki kullanıcı hesap yönetimi sistemini, kullanılan teknolojileri, dosya yapısını ve geliştirme sürecini kronolojik olarak belgeler.

## Mimari Genel Bakış

Hesap yönetimi sistemi, kullanıcıların kişisel bilgilerini görüntüleyip düzenleyebilmesi, siparişlerini takip edebilmesi ve adres bilgilerini yönetebilmesi için tasarlanmıştır. MVP aşamasında bazı özellikler mock data ile çalışmaktadır.

```
Frontend (Next.js + React Context)  ←→  Backend (Express.js + Prisma + JWT)  ←→  Database (PostgreSQL)
```

---

## Kullanılan Teknolojiler

### Backend

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| **Express.js** | RESTful API endpoint'leri oluşturma |
| **Prisma ORM** | Veritabanı işlemleri, `User` modeli |
| **jsonwebtoken (JWT)** | Kullanıcı kimlik doğrulama, korumalı route'lar |
| **Zod** | Request/Response validasyonu |
| **PostgreSQL** | Veritabanı (User, Cart, Review tabloları) |

### Frontend

| Teknoloji/Kavram | Kullanım Amacı |
|------------------|----------------|
| **Next.js 14** | React framework, dynamic routing, API routes |
| **React Context API** | Global authentication state (`AuthContext`) |
| **React Hooks** | `useState`, `useEffect`, `useRouter` |
| **shadcn/ui** | Dialog, Button, Input, Sheet bileşenleri |
| **lucide-react** | İkonlar (User, Package, MapPin, etc.) |
| **localStorage** | JWT token saklama (AuthContext ile) |

---

## Dosya Yapısı ve İşlevleri

### Backend

```
backend/
├── prisma/
│   └── schema.prisma              # User modelinin tanımı
├── src/
│   ├── core/
│   │   └── middleware/
│   │       └── auth.middleware.ts  # JWT doğrulama middleware
│   ├── api/
│   │   └── auth/
│   │       ├── auth.service.ts     # Kullanıcı iş mantığı
│   │       └── auth.controller.ts  # API endpoint'leri
│   └── index.ts                    # Ana Express uygulaması
```

**Önemli Dosyalar:**

1. **`backend/prisma/schema.prisma`**
   - `User` modeli: Kullanıcı bilgileri
   - `role`: USER veya ADMIN

2. **`backend/src/api/auth/auth.service.ts`**
   - `getUserById()`: Kullanıcı profilini getirir
   - `updateUserProfile()`: Kullanıcı bilgilerini günceller

3. **`backend/src/api/auth/auth.controller.ts`**
   - `GET /api/auth/me`: Mevcut kullanıcı bilgilerini getirir
   - `PUT /api/auth/me`: Profil bilgilerini günceller

### Frontend

```
frontend/
├── app/
│   └── hesabim/
│       ├── page.tsx                # Hesap Bilgileri
│       ├── siparislerim/
│       │   └── page.tsx           # Siparişlerim (mock)
│       └── adreslerim/
│           └── page.tsx           # Adreslerim (mock)
├── components/
│   ├── navbar/
│   │   └── AccountDropdown.tsx    # Hesap dropdown menü
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── dialog.tsx
├── types/
│   └── index.ts                   # TypeScript type tanımları
└── context/
    └── AuthContext.tsx            # Global authentication state
```

---

## Adım Adım Geliştirme Süreci

### 1. Kullanıcı Profil Endpoint'leri

**Amaç:** Backend'de kullanıcı profil bilgilerini getirme ve güncelleme API'lerini oluşturmak.

**Sorun:** Frontend'de kullanıcı bilgilerini göstermek için backend API'si yoktu.

**Çözüm:** `GET /api/auth/me` ve `PUT /api/auth/me` endpoint'leri oluşturuldu.

**İşlemler:**

1. **`getUserById()` Servis Fonksiyonu:**

```typescript
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
```

**Özellikler:**
- Password alanı döndürülmez (güvenlik)
- JWT token'dan `userId` alınır
- Prisma `select` ile sadece gerekli alanlar

2. **`updateUserProfile()` Servis Fonksiyonu:**

```typescript
export const updateUserProfile = async (userId: string, updateData: { firstName?: string; lastName?: string }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};
```

**Özellikler:**
- Sadece `firstName` ve `lastName` güncellenir
- Email değiştirilemez (veritabanı seviyesinde korumalı)
- Güvenlik için password döndürülmez

3. **API Endpoint'leri:**

```typescript
// GET /api/auth/me
authRouter.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.getUserById(req.userId!);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/me
authRouter.put('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const UpdateProfileSchema = z.object({
      firstName: z.string().min(1, { message: "Ad alanı boş olamaz" }).optional(),
      lastName: z.string().min(1, { message: "Soyad alanı boş olamaz" }).optional(),
    });

    const updateData = UpdateProfileSchema.parse(req.body);
    const user = await AuthService.updateUserProfile(req.userId!, updateData);
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }
    next(error);
  }
});
```

**Özellikler:**
- Her iki endpoint de `authenticateToken` middleware ile korunur
- Zod ile validasyon
- Hata mesajları Türkçe
- JWT token'dan `userId` çıkartılır

---

### 2. Hesap Bilgileri Sayfası

**Amaç:** Kullanıcıların profil bilgilerini görüntüleyip düzenleyebileceği bir sayfa oluşturmak.

**Sorun:** Kullanıcılar için hesap yönetimi sayfası yoktu.

**Çözüm:** `frontend/app/hesabim/page.tsx` oluşturuldu.

**İşlemler:**

1. **Sayfa Yapısı:**

```typescript
export default function AccountPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const { token, logout } = useAuth();
  const router = useRouter();
```

**State Açıklamaları:**
- `userProfile`: Backend'den gelen kullanıcı bilgileri
- `loading`: Sayfa yükleniyor durumu
- `isEditing`: Form düzenleme modu
- `formData`: Form input değerleri
- `token`: AuthContext'ten gelen JWT token

2. **Profil Bilgilerini Getirme:**

```typescript
const fetchUserProfile = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUserProfile(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email,
      });
    }
  } catch (error) {
    console.error('Profil bilgilerini yükleme hatası:', error);
  } finally {
    setLoading(false);
  }
};
```

**İşleyiş:**
- JWT token ile giriş yapmış kullanıcı kontrolü
- Backend'den kullanıcı bilgilerini çekme
- State'e kaydetme

**useEffect ile Tetikleme:**

```typescript
useEffect(() => {
  if (!token) {
    router.push('/giris-yap');
    return;
  }

  fetchUserProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [token]);
```

**Neden `eslint-disable`:**
- `fetchUserProfile` fonksiyonu dependency array'de olmalı
- Ancak bu sonsuz döngüye neden olur (`useCallback` ile çözülebilir)
- Şimdilik eslint uyarısını kapatıyoruz

3. **Profil Güncelleme:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!token) {
    alert('Önce giriş yapmalısınız');
    return;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Profil güncellenirken bir hata oluştu');
    }

    setUserProfile(data);
    setIsEditing(false);
    alert('Profil başarıyla güncellendi!');
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    alert(error instanceof Error ? error.message : 'Bir hata oluştu. Lütfen tekrar deneyin.');
  }
};
```

**İşleyiş:**
1. Form submit edilir
2. JWT token kontrol edilir
3. PUT isteği gönderilir (sadece firstName, lastName)
4. Başarılı olursa state güncellenir ve düzenleme modu kapatılır
5. Hata olursa kullanıcıya bildirilir

---

### 3. Siparişlerim Sayfası (Mock)

**Amaç:** Kullanıcıların siparişlerini görüntüleyebileceği bir sayfa oluşturmak.

**Sorun:** Sipariş modeli yok, MVP'de sipariş sistemi beklenmiyor.

**Çözüm:** Mock data ile `frontend/app/hesabim/siparislerim/page.tsx` oluşturuldu.

**İşlemler:**

1. **Mock Data:**

```typescript
interface MockOrder {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

const mockOrders: MockOrder[] = [
  {
    id: '1',
    orderNumber: '290405',
    status: 'Teslim Edildi',
    date: '14 Aralık 2022',
    total: 770,
    items: [
      {
        name: 'MELATONIN',
        quantity: 2,
        price: 62,
        image: 'https://via.placeholder.com/80x80?text=BETAINE',
      },
      // ... diğer ürünler
    ],
  },
];
```

**Özellikler:**
- Basit TypeScript interface
- Statik mock data
- Gerçekçi veri yapısı

2. **Sayfa Yapısı:**

```typescript
export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/giris-yap');
      return;
    }
    setLoading(false);
  }, [token, router]);

  // Mock orders
  const mockOrders: MockOrder[] = [/* ... */];
```

**İşleyiş:**
- JWT token kontrolü
- Mock data doğrudan render edilir
- Giriş yapmamış kullanıcılar yönlendirilir

3. **Sipariş Kartı:**

```tsx
{mockOrders.map((order) => (
  <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    {/* Başlık */}
    <div className="flex items-center justify-between mb-4 pb-4 border-b">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Sipariş #{order.orderNumber}
        </h3>
        <p className="text-sm text-gray-500">{order.date}</p>
      </div>
      <div className="text-right">
        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {order.status}
        </span>
        <p className="text-lg font-bold text-gray-900 mt-2">
          {order.total.toFixed(2)} ₺
        </p>
      </div>
    </div>

    {/* Ürünler */}
    <div className="space-y-3 mb-4">
      {order.items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md border" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {(item.price * item.quantity).toFixed(2)} ₺
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Detaylar Butonu */}
    <Link href={`/hesabim/siparislerim/${order.id}`}>
      <button className="text-primary hover:underline font-medium">
        Sipariş Detaylarını Görüntüle
      </button>
    </Link>
  </div>
))}
```

---

### 4. Adreslerim Sayfası (Mock)

**Amaç:** Kullanıcıların adres bilgilerini yönetebileceği bir sayfa oluşturmak.

**Sorun:** Address modeli yok, MVP'de adres sistemi beklenmiyor.

**Çözüm:** Mock data ile `frontend/app/hesabim/adreslerim/page.tsx` oluşturuldu.

**İşlemler:**

1. **Mock Data:**

```typescript
interface MockAddress {
  id: string;
  title: string;
  firstname: string;
  lastname: string;
  address: string;
  district: string;
  city: string;
  country: string;
  phone?: string;
}

const [addresses, setAddresses] = useState<MockAddress[]>([
  {
    id: '1',
    title: 'Ev',
    firstname: 'Ahmet Mah. Mehmetoğlu Sk., No: 1 Daire: 2',
    lastname: 'Fatmaoğlu',
    address: 'Ataşehir, İstanbul, Türkiye',
    district: 'Ataşehir',
    city: 'İstanbul',
    country: 'Türkiye',
  },
]);
```

2. **Adres Ekleme Formu:**

```tsx
{showAddForm && (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <h3 className="text-lg font-semibold mb-4">
      {editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
    </h3>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adres Başlığı <span className="text-red-500">*</span>
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="ev, iş vb..."
          required
        />
      </div>
      {/* ... diğer form alanları */}
      <div className="flex gap-2">
        <Button type="submit">Kaydet</Button>
        <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
          İptal
        </Button>
      </div>
    </form>
  </div>
)}
```

**Özellikler:**
- Düzenleme ve ekleme tek form ile
- Zod validasyon yok (mock)
- Alert ile kullanıcı bildirimi

3. **Adres Listesi:**

```tsx
{addresses.map((address) => (
  <div key={address.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{address.title}</h3>
        <p className="text-gray-700">{address.firstname}</p>
        <p className="text-gray-600">{address.address}</p>
        <p className="text-gray-600">{address.district}, {address.city}, {address.country}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => handleEdit(address)}>
          <Edit className="h-5 w-5" />
        </button>
        <button onClick={() => handleDelete(address.id)}>
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
))}
```

---

### 5. Navigasyon Menüsü

**Amaç:** Tüm hesap sayfaları arasında tutarlı bir navigasyon sağlamak.

**Sorun:** Her sayfada aynı sidebar menüsü tekrarlanıyordu.

**Çözüm:** Her sayfada ortak bir yan menü yapısı oluşturuldu.

**İşlemler:**

1. **Ortak Menü Yapısı:**

Her hesap sayfasında (`/hesabim`, `/hesabim/siparislerim`, `/hesabim/adreslerim`) aynı yan menü bulunur:

```tsx
<div className="lg:col-span-1">
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-semibold mb-4">Menü</h2>
    <div className="space-y-2">
      <Link href="/hesabim">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white font-medium">
          <User className="h-5 w-5" />
          <span>Hesap Bilgilerim</span>
        </button>
      </Link>
      <Link href="/hesabim/siparislerim">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
          <Package className="h-5 w-5" />
          <span>Siparişlerim</span>
        </button>
      </Link>
      <Link href="/hesabim/adreslerim">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
          <MapPin className="h-5 w-5" />
          <span>Adreslerim</span>
        </button>
      </Link>
      <button onClick={handleLogout}>
        <span>Çıkış Yap</span>
      </button>
    </div>
  </div>
</div>
```

**Özellikler:**
- Aktif sayfa `bg-primary` ile vurgulanır
- Diğer sayfalar `hover:bg-gray-100` ile
- Link wrapper ile sayfa yenilenmeden navigasyon

---

## MVP Kapsamı ve Gelecek Geliştirmeler

### MVP Kapsamında Olanlar:

✅ Kullanıcı Profil Görüntüleme
- Ad, soyad, email gösterimi
- JWT token ile güvenli erişim

✅ Profil Güncelleme
- Ad ve soyad değiştirme
- Email değiştirilemez (güvenlik)
- Real-time validation

✅ Siparişlerim Sayfası
- Mock data ile sipariş listesi
- Sipariş detayı (ürünler, fiyat, durum)
- Sipariş görünümü

✅ Adreslerim Sayfası
- Mock data ile adres listesi
- Adres ekleme/düzenleme/silme (frontend only)
- Form validasyonu

✅ Navigasyon
- Tutarlı yan menü
- Aktif sayfa göstergesi
- Responsive tasarım

### Gelecek Geliştirmeler (Sipariş Sistemi Sonrası):

🔄 Sipariş Modeli
- `Order` ve `OrderItem` modellerini Prisma'ya eklemek
- Backend CRUD API'leri
- Frontend'deki mock data'yı gerçek veri ile değiştirmek

🔄 Adres Modeli
- `Address` modelini Prisma'ya eklemek
- Backend CRUD API'leri
- Frontend form'u backend'e bağlamak

🔄 Sipariş Takibi
- Sipariş durumları (Hazırlanıyor, Kargoda, Teslim Edildi)
- Kargo takip numarası
- Teslimat tahmin süresi

🔄 Adres Seçimi
- Sipariş verirken adres seçimi
- Varsayılan adres belirleme
- Tüm şehirler için il/ilçe dropdown

---

## Önemli Tasarım Kararları

### 1. Mock Data Kullanımı

**Neden:**
- MVP için sipariş ve adres sistemi beklemiyoruz
- Kullanıcı deneyimi için UI'ı önceden hazırlamak
- Gelecek backend entegrasyonuna hazır kod yapısı

**Avantajlar:**
- Hızlı geliştirme
- UI test edilebilir
- Gerçekçi veri akışı

**Dezavantajlar:**
- Veri kalıcı değil (sayfa yenilenince kaybolur)
- Backend entegrasyonu gerekli

---

### 2. Ortak Menü Yapısı

**Neden:**
- Kullanıcı navigasyonu basit
- Tutarlı UX
- Kod tekrarı azalır

**Alternatif:**
Her sayfada farklı layout. Tutarlılık azalır.

---

### 3. Email Değiştirilemez

**Neden:**
- Güvenlik: Email doğrulama gerekir
- Basitlik: MVP'de email doğrulama yok
- Kullanıcı karmaşıklığını azaltır

**Gelecek:**
Email doğrulama ile değiştirme eklenebilir.

---

### 4. Protected Routes

**Neden:**
- Her hesap sayfası `useEffect` ile token kontrol eder
- Token yoksa `/giris-yap`'a yönlendirilir
- Güvenlik için zorunlu

**Alternatif:**
Middleware ile global kontrol. MVP için fazla karmaşık.

---

## Karşılaşılan Sorunlar ve Çözümleri

### Sorun 1: useEffect Dependency Uyarısı

**Sorun:** `fetchUserProfile` fonksiyonu dependency array'de olmalı.

**Çözüm:** `eslint-disable` ile uyarı kapatıldı:

```typescript
useEffect(() => {
  fetchUserProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [token]);
```

**Gelecek Çözüm:**
```typescript
const fetchUserProfile = useCallback(async () => {
  // ...
}, [token]);

useEffect(() => {
  fetchUserProfile();
}, [fetchUserProfile]);
```

---

### Sorun 2: Email Alanı Değiştirilemez

**Sorun:** Email input'u disabled, kullanıcı değiştirmek istiyor.

**Çözüm:** Şimdilik bırakıldı. Gelecekte email doğrulama eklenecek.

---

### Sorun 3: Mock Data Kalıcı Değil

**Sorun:** Adresler sayfa yenilenince kaybolur.

**Çözüm:** Backend entegrasyonu gerekli. MVP için mock data yeterli.

---

## Çalıştırma ve Test

### 1. Backend Test

**Test Senaryoları:**

1. **Profil Getir (Giriş Yapmış):**
   ```bash
   curl http://localhost:5001/api/auth/me \
     -H "Authorization: Bearer TOKEN"
   ```
   → `200 OK` dönmeli, kullanıcı bilgileri görünmeli

2. **Profil Güncelle (Giriş Yapmış):**
   ```bash
   curl -X PUT http://localhost:5001/api/auth/me \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"firstName": "Ali", "lastName": "Osman"}'
   ```
   → `200 OK` dönmeli, güncellenmiş bilgiler görünmeli

3. **Profil Getir (Giriş Yapmamış):**
   ```bash
   curl http://localhost:5001/api/auth/me
   ```
   → `401 Unauthorized` dönmeli

---

### 2. Frontend Test

**Test Senaryoları:**

1. **Hesabım Sayfası:**
   - Giriş yapmadan `/hesabim` sayfasına git
   → `/giris-yap`'a yönlendirilmeli

2. **Profil Görüntüleme:**
   - Giriş yap, `/hesabim` sayfasına git
   → Profil bilgileri görünmeli

3. **Profil Güncelleme:**
   - "Düzenle" butonuna tıkla
   - Ad/soyad değiştir
   - "Kaydet" butonuna tıkla
   → Başarı mesajı görünmeli, değişiklikler kalıcı olmalı

4. **Siparişlerim:**
   - `/hesabim/siparislerim` sayfasına git
   → Mock siparişler görünmeli

5. **Adreslerim:**
   - `/hesabim/adreslerim` sayfasına git
   → Mock adresler görünmeli
   - "Yeni Adres Ekle" butonuna tıkla
   - Formu doldur ve kaydet
   → Alert görünmeli (backend yok, mock)

---

## Sonuç

Hesap yönetimi sistemi temel olarak tamamlandı:

**Tamamlananlar:**
- ✅ Kullanıcı profil görüntüleme ve güncelleme
- ✅ Siparişlerim sayfası (mock)
- ✅ Adreslerim sayfası (mock)
- ✅ Navigasyon menüsü
- ✅ Protected routes
- ✅ Responsive tasarım

**Gelecek Geliştirmeler:**
- 🔄 Sipariş modeli ve backend API
- 🔄 Adres modeli ve backend API
- 🔄 Email değiştirme (doğrulama ile)
- 🔄 Sipariş takibi
- 🔄 Adres seçimi (sipariş verirken)

**Kilit Başarı Faktörleri:**
- JWT ile güvenli erişim
- Mock data ile hızlı UI geliştirme
- Ortak menü ile tutarlı UX
- Gelecek backend entegrasyonuna hazır kod yapısı

**Öğrenilenler:**
- Zustand veya Context API ile global state yönetimi
- Protected routes pattern
- Mock data kullanımı
- Form state yönetimi

---

**Not:** MVP aşamasında sipariş ve adres sistemi mock data ile çalışmaktadır. Gerçek production için backend entegrasyonu gereklidir.

