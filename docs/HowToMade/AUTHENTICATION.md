# AUTHENTICATION

Bu doküman, projedeki kullanıcı kimlik doğrulama (authentication) altyapısını, kullanılan teknolojileri, dosya yapısını ve geliştirme sürecini kronolojik olarak belgeler.

## Mimari Genel Bakış

Kullanıcı kimlik doğrulama süreci, **Frontend** (kullanıcı arayüzü) ve **Backend** (API sunucusu) arasında senkronize bir iletişimle çalışır.

```
Frontend (Next.js)  ←→  Backend (Express.js + Prisma)  ←→  Database (PostgreSQL)
```

---

## Kullanılan Teknolojiler

### Backend

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **Express.js** | - | Web framework, API endpoint'lerini oluşturmak |
| **Prisma** | 5.x | ORM, veritabanı ile iletişim ve tip güvenliği |
| **bcrypt.js** | - | Şifreleri hash'leme, güvenli şifre saklama |
| **jsonwebtoken (JWT)** | - | Oturum yönetimi, kullanıcı kimliği doğrulama |
| **Zod** | - | Gelen verilerin doğrulanması (validation) |
| **PostgreSQL** | 16 | Veritabanı |

### Frontend

| Teknoloji/Kavram | Kullanım Amacı |
|------------------|----------------|
| **Next.js 14** | React framework, App Router, SSR/CSR |
| **React Context API** | Global state yönetimi (AuthContext) |
| **`useState` Hook** | Form verilerinin anlık takibi |
| **`useRouter` Hook** | Sayfa yönlendirmeleri (`next/navigation`) |
| **`localStorage`** | Token'ın tarayıcıda kalıcı saklanması |
| **CORS Middleware** | Farklı origin'ler arası güvenli iletişim |
| **shadcn/ui** | UI bileşenleri (dropdown, avatar, vs.) |

---

## Dosya Yapısı ve İşlevleri

### Backend

```
backend/
├── prisma/
│   └── schema.prisma              # User modelinin tanımlandığı veritabanı şeması
├── src/
│   ├── index.ts                   # Ana uygulama dosyası, CORS ayarları
│   ├── api/
│   │   └── auth/
│   │       ├── auth.controller.ts # /register ve /login endpoint'leri, Zod validation
│   │       └── auth.service.ts    # İş mantığı: hash, token üretimi, DB işlemleri
│   └── core/
│       └── services/
│           └── prisma.service.ts  # Prisma Client'ın tek instance'ını export eder
```

### Frontend

```
frontend/
├── app/
│   ├── layout.tsx                 # AuthProvider ile tüm uygulamayı sarmalama
│   └── (auth)/
│       ├── kayit-ol/
│       │   └── page.tsx           # Kayıt ol formu, /api/auth/register'a istek
│       └── giris-yap/
│           └── page.tsx           # Giriş formu, /api/auth/login'a istek
├── components/
│   └── navbar/
│       ├── HeaderDesktop.tsx      # Ana desktop header, auth durumuna göre menü gösterimi
│       ├── HeaderMobil.tsx        # Hamburger menü, mobil görünüm
│       ├── AccountDropdown.tsx    # Giriş yapmış kullanıcılar için dropdown
│       └── GuestDropdown.tsx      # Giriş yapmamış kullanıcılar için dropdown
└── context/
    └── AuthContext.tsx            # Global auth state, token yönetimi, logout
```

---

## İş Akışı (Flow) Detayları

### 1. Kullanıcı Kaydı (Register)

#### Frontend (`app/(auth)/kayit-ol/page.tsx`)

1.  Kullanıcı, formdaki **"Ad Soyad"**, **"E-posta"** ve **"Şifre"** alanlarını doldurur.
2.  "Kayıt Ol" butonuna tıklandığında `handleSubmit` fonksiyonu tetiklenir.
3.  `fetch` API'si kullanılarak `http://localhost:5001/api/auth/register` adresine **POST** isteği gönderilir.
4.  Yanıt başarısızsa, hata mesajı `error` state'ine yazılır ve kullanıcıya gösterilir.
5.  Yanıt başarılıysa, kullanıcı `/giris-yap` sayfasına yönlendirilir.

#### Backend (`api/auth/auth.controller.ts` → `auth.service.ts`)

1.  **Validation:** `Zod` şeması (`RegisterSchema`) kullanılarak gelen veriler doğrulanır:
    *   E-posta geçerli bir format'ta mı?
    *   Şifre en az 8 karakter mi?
    *   Ad Soyad en az 3 karakter mi?

2.  **İş Mantığı (`auth.service.ts`):**
    *   E-postanın daha önce kullanılıp kullanılmadığı Prisma ile kontrol edilir.
    *   Aynı e-posta varsa bir hata fırlatılır.
    *   `bcrypt.hash()` ile şifre hash'lenir.
    *   "Ad Soyad" bilgisi `firstName` ve `lastName` olarak ayrılır.
    *   Prisma'nın `create` metoduyla `User` tablosuna kayıt eklenir.
    *   Kullanıcı bilgileri (şifre hariç) response olarak Frontend'e döner.

### 2. Kullanıcı Girişi (Login)

#### Frontend (`app/(auth)/giris-yap/page.tsx`)

1.  Kullanıcı, formdaki **"E-posta"** ve **"Şifre"** alanlarını doldurur.
2.  "Giriş Yap" butonuna tıklandığında `handleSubmit` fonksiyonu tetiklenir.
3.  `fetch` API'si kullanılarak `http://localhost:5001/api/auth/login` adresine **POST** isteği gönderilir.
4.  Yanıt başarısızsa, hata mesajı gösterilir.
5.  Yanıt başarılıysa:
    *   `useAuth` hook'undaki `setToken` fonksiyonu çağrılır.
    *   Token hem global state'e hem de `localStorage`'a kaydedilir.
    *   `useRouter` ile kullanıcı `/` (anasayfa) adresine yönlendirilir.

#### Backend (`api/auth/auth.controller.ts` → `auth.service.ts`)

1.  **Validation:** `LoginSchema` kullanılarak e-posta ve şifre alanlarının dolu olduğu kontrol edilir.

2.  **İş Mantığı (`auth.service.ts`):**
    *   Prisma ile e-posta adresine sahip bir kullanıcı aranır.
    *   Kullanıcı bulunamazsa bir hata fırlatılır.
    *   `bcrypt.compare()` ile formdan gelen şifre, veritabanındaki hash ile karşılaştırılır.
    *   Şifreler eşleşmezse bir hata fırlatılır.
    *   Eşleşirse, `jsonwebtoken.sign()` kullanılarak kullanıcıya özel bir JWT token üretilir.
    *   Token `{ token: "..." }` şeklinde response olarak Frontend'e döner.

### 3. Oturum Yönetimi ve Header Dinamizmi

#### AuthContext (`context/AuthContext.tsx`)

1.  `AuthContext`, uygulama genelinde kullanıcının giriş durumunu (`token`) tutar.
2.  `useEffect` ile sayfa yüklendiğinde `localStorage`'dan token okunur, varsa state'e yazılır.
3.  `setToken` fonksiyonu çağrıldığında:
    *   Token hem state'e kaydedilir hem de `localStorage`'a yazılır.
4.  `logout` fonksiyonu çağrıldığında:
    *   Token state'ten ve `localStorage`'dan silinir.

#### Header Bileşenleri

*   **`HeaderDesktop.tsx`:**
    *   `useAuth` ile `token` bilgisine erişir.
    *   `token` yoksa `GuestDropdown` bileşenini gösterir (ikon + "Hesap" dropdown).
    *   `token` varsa `AccountDropdown` bileşenini gösterir (avatar + "Hesabım" dropdown).

*   **`AccountDropdown.tsx`:**
    *   İçinde **"Profil"** ve **"Çıkış Yap"** seçenekleri vardır.
    *   "Profil"e tıklandığında `/hesabim` sayfasına yönlendirir.
    *   "Çıkış Yap"a tıklandığında `logout()` çalışır ve anasayfaya yönlendirir.

*   **`GuestDropdown.tsx`:**
    *   İçinde **"Giriş Yap"** ve **"Kayıt Ol"** seçenekleri vardır.
    *   Her ikisi de ilgili auth sayfalarına yönlendirir.

---

## Güvenlik Önlemleri

1.  **Şifre Hash'leme:** Şifreler `bcrypt` ile salt'lı hash'e dönüştürülerek saklanır, açık metin olarak veritabanında tutulmaz.
2.  **JWT Token:** Token'lar, kullanıcı kimliği ve süre (expiry) bilgisi içerir, değiştirilmesi zordur.
3.  **Input Validation:** `Zod` ile hem frontend hem de backend'de gelen veriler doğrulanır.
4.  **CORS:** Sadece `http://localhost:3000` origin'inden gelen isteklere izin verilir.
5.  **Hata Mesajları:** Uygulama içinde hassas bilgilerin (örn. "Bu e-posta kullanılıyor mu?") üzeri kapatılmıştır.

---

## Geliştirme Notları ve Kararlar

### Neden bu teknolojileri seçtik?

*   **Prisma:** TypeScript'e tam entegrasyonu, veritabanı şemasının kod olarak tanımlanması ve otomatik migration desteği.
*   **bcrypt:** Endüstri standardı, şifre güvenliği için güvenilir kütüphane.
*   **JWT:** Stateless authentication için ideal, sunucuda oturum state'i tutmaya gerek yok.
*   **React Context + localStorage:** Basit oturum yönetimi için yeterli, Redux gibi karmaşık state management gerektirmedi.
*   **shadcn/ui:** Tailwind tabanlı, özelleştirilebilir ve erişilebilir bileşenler.

### CORS ve Environment Variables

*   `.env.local` dosyasında `NEXT_PUBLIC_API_URL=http://localhost:5001` tanımlandı.
*   Backend'de `index.ts` içinde `cors` middleware'i yapılandırıldı: `origin: 'http://localhost:3000'`.

### Veritabanı Şeması

`User` modeli şu alanları içerir:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  firstName String?
  lastName  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## Test Senaryoları

1.  ✅ Yeni bir kullanıcı kaydı oluşturma
2.  ✅ Mevcut bir e-posta ile tekrar kayıt olmayı deneme (hata mesajı görmeli)
3.  ✅ Doğru e-posta/şifre ile giriş yapma (token almalı ve anasayfaya yönlenmeli)
4.  ✅ Yanlış e-posta/şifre ile giriş yapmayı deneme (hata mesajı görmeli)
5.  ✅ Giriş yaptıktan sonra header'ın "Hesabım" dropdown'ına dönüşmesi
6.  ✅ "Çıkış Yap" ile oturumu sonlandırma ve header'ın tekrar "Hesap" dropdown'ına dönmesi
7.  ✅ Sayfayı yeniledikten sonra token'ın korunması (localStorage sayesinde)

---

## Sonraki Adımlar (Backlog)

*   [ ] Şifre sıfırlama (password reset) özelliği
*   [ ] E-posta doğrulama (email verification)
*   [ ] Sosyal medya ile giriş (OAuth 2.0)
*   [ ] Refresh token mekanizması (token yenileme)
*   [ ] "Beni Hatırla" (Remember Me) seçeneği
