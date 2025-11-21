# Proje: E-Ticaret Platformu (MVP ✅)

Modern bir e-ticaret platformu oluşturmak için **PERN** (PostgreSQL, Express, React/Next.js, Node.js) yığınını kullanan tam özellikli bir full-stack web uygulamasıdır. Hem son kullanıcılar için bir vitrin hem de site sahipleri için bir yönetim paneli içerir.

## 🎯 MVP Özeti

**Proje Durumu:** ✅ MVP Tamamlandı

### Tamamlanan Özellikler

#### 🔐 Kullanıcı Yönetimi
- ✅ Kullanıcı kayıt ve giriş sistemi (JWT authentication)
- ✅ Kullanıcı profil yönetimi (ad, soyad, email güncelleme)
- ✅ Rol tabanlı erişim kontrolü (ADMIN/USER)
- ✅ Protected routes (korumalı sayfalar)

#### 🛍️ Ürün Yönetimi
- ✅ Ürün listeleme ve detay sayfaları
- ✅ Kategori bazlı filtreleme
- ✅ Admin panelinde ürün CRUD işlemleri
- ✅ Ürün yorumları sistemi (1-5 yıldız, yorum metni)
- ✅ Benzer ürünler ve çok satanlar bölümleri

#### 🛒 Alışveriş Sepeti
- ✅ Sepete ürün ekleme/çıkarma
- ✅ Sepet içeriğini görüntüleme
- ✅ Ürün adet güncelleme
- ✅ Sepet sayfası ve drawer (yan panel)

#### 👤 Hesap Yönetimi
- ✅ Hesap Bilgilerim sayfası
- ✅ Siparişlerim sayfası (mock data)
- ✅ Adreslerim sayfası (mock data)
- ✅ Modal dialogs ile kullanıcı dostu bildirimler

#### 🎨 Kullanıcı Arayüzü
- ✅ Responsive tasarım (desktop, tablet, mobil)
- ✅ Modern UI bileşenleri (shadcn/ui)
- ✅ Loading states ve error handling
- ✅ Toast bildirimleri

### Gelecek Geliştirmeler

- 🔄 Sipariş sistemi (Order modeli ve backend entegrasyonu)
- 🔄 Ödeme sistemi entegrasyonu
- 🔄 Adres yönetimi (backend API)
- 🔄 E-posta bildirimleri
- 🔄 Admin panel genişletmeleri

## 🏗️ Mimari

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui         │
│  - SSR/SSG                                                   │
│  - Dynamic Routing                                           │
│  - Server Components                                         │
│  - React Context API (Auth State)                           │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API (HTTP/JSON)
┌────────────────────┴────────────────────────────────────────┐
│                         Backend                              │
│  Express.js + TypeScript + Prisma ORM                       │
│  - JWT Authentication                                        │
│  - Role-based Access Control                                 │
│  - RESTful API Endpoints                                     │
│  - Zod Validation                                            │
└────────────────────┬────────────────────────────────────────┘
                     │ PostgreSQL
┌────────────────────┴────────────────────────────────────────┐
│                      Database                                │
│  PostgreSQL (Docker Container)                              │
│  - User, Product, Category, Cart, Review tables             │
└─────────────────────────────────────────────────────────────┘
```

### Dosya Yapısı

```
/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── api/               # API route'ları
│   │   │   ├── auth/         # Kimlik doğrulama
│   │   │   ├── products/     # Ürün işlemleri
│   │   │   ├── cart/         # Sepet işlemleri
│   │   │   ├── admin/        # Admin paneli
│   │   │   ├── categories/   # Kategoriler
│   │   │   └── reviews/      # Yorumlar
│   │   ├── core/
│   │   │   ├── middleware/   # JWT auth, admin check
│   │   │   └── services/     # Prisma service
│   │   └── index.ts          # Ana uygulama
│   ├── prisma/
│   │   └── schema.prisma     # Veritabanı şeması
│   └── Dockerfile
│
├── frontend/                   # Next.js UI
│   ├── app/                   # App Router
│   │   ├── (auth)/           # Auth route'ları
│   │   ├── hesabim/          # Hesap yönetimi
│   │   ├── urun/[slug]/      # Ürün detay
│   │   ├── kategori/[slug]/  # Kategori sayfası
│   │   ├── admin/            # Admin paneli
│   │   ├── sepet/            # Sepet sayfası
│   │   └── page.tsx          # Anasayfa
│   ├── components/           # React bileşenleri
│   ├── context/             # Context API (Auth)
│   ├── types/               # TypeScript types
│   └── Dockerfile
│
├── docs/                      # Dokümantasyon
│   ├── HowToMade/           # Nasıl yapıldı?
│   ├── TASK.md              # Görev listesi
│   └── README.md            # Bu dosya
│
└── docker-compose.yml         # Container orchestration
```

## 🚀 Teknolojiler

- **Frontend:** Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js, TypeScript
- **Veritabanı:** PostgreSQL
- **ORM:** Prisma
- **Kimlik Doğrulama:** Passport.js (JWT Stratejisi)
- **Containerization:** Docker

## 📂 Proje Yapısı

Proje, `frontend` ve `backend` olmak üzere iki ana klasörden oluşur. Bu yapı, sorumlulukların net bir şekilde ayrılmasını sağlar.

```
/
├── backend/         # Express.js API sunucusu
├── docs/            # Proje dokümantasyonu
└── frontend/        # Next.js istemci uygulaması
```

## 🏁 Başlarken

Projenin yerel makinenizde çalıştırılması için gerekli adımlar ve önkoşullar burada belirtilecektir.

### Gereksinimler

- Node.js (v18+)
- **Docker Desktop:** Projenin tüm servisleri (veritabanı vb.) Docker konteynerleri içinde çalışacaktır. Bu nedenle Docker Desktop'ın bilgisayarınızda kurulu ve çalışır durumda olması gerekmektedir. [Docker Desktop'ı buradan indirebilirsiniz.](https://www.docker.com/products/docker-desktop/)
- pnpm (veya npm/yarn)

### Kurulum (Docker ile)

Proje, `docker-compose` kullanılarak tek bir komutla ayağa kaldırılacak şekilde tasarlanmıştır. Bu, hem `frontend` hem de `backend` servislerini ve `PostgreSQL` veritabanını başlatacaktır.

1.  **Repo'yu Klonlayın:**
    ```bash
    git clone <proje-repo-adresi>
    cd <proje-klasoru>
    ```

2.  **Ortam Değişkenlerini Ayarlayın:**
    - `backend/` klasörü içinde `.env.example` dosyasını `.env` olarak kopyalayın.
    - `frontend/` klasörü içinde `.env.local.example` dosyasını `.env.local` olarak kopyalayın.
    - Gerekli gördüğünüz değişkenleri (veritabanı şifresi, API portu vb.) bu dosyalarda düzenleyin. `docker-compose.yml` dosyasındaki servis isimleriyle uyumlu olduklarından emin olun.

3.  **Docker Konteynerlerini Başlatın:**
    Projenin ana dizinindeyken aşağıdaki komutu çalıştırın:
    ```bash
    docker-compose up --build
    ```
    - `--build` parametresi, imajları ilk kez oluştururken veya `Dockerfile`'da bir değişiklik yaptığınızda gereklidir.

4.  **Uygulamaya Erişin:**
    - Frontend: `http://localhost:3000`
    - Backend API: `http://localhost:5000` (veya `.env` dosyasında belirttiğiniz port)

### Kurulum (Docker olmadan - Önerilmez)

Detaylı kurulum adımları daha sonra eklenecektir.

1.  **Backend Kurulumu:**
    ```bash
    cd backend
    pnpm install
    # .env dosyasını oluşturun
    # Veritabanını başlatın
    pnpm dev
    ```

2.  **Frontend Kurulumu:**
    ```bash
    cd frontend
    pnpm install
    # .env.local dosyasını oluşturun
    pnpm dev
    ```

## Projeyi Çalıştırma

### 1. Ön Gereksinimler

- Docker Desktop'ın bilgisayarınızda yüklü ve çalışır durumda olması gerekmektedir.
- `pnpm` paket yöneticisinin yüklü olması gerekmektedir (`npm install -g pnpm`).

### 2. Kurulum

1. Projeyi klonladıktan sonra, projenin kök dizininde aşağıdaki komutu çalıştırarak tüm bağımlılıkları yükleyin:
   ```bash
   pnpm install
   ```
2. Docker servislerini (veritabanı, backend, frontend) ayağa kaldırmak için aşağıdaki komutu çalıştırın:
   ```bash
   docker-compose up -d --build
   ```

### 3. Geliştirme Ortamı

Proje, pnpm workspaces kullanılarak bir monorepo olarak yapılandırılmıştır. Kök dizindeki `package.json` dosyası, tüm projeyi yöneten merkezi komutları içerir.

- **Tüm Projeyi Geliştirme Modunda Başlatma:**
  Aşağıdaki komut, hem backend API'sini hem de frontend Next.js sunucusunu aynı anda "hot-reload" (kod değiştikçe otomatik yeniden başlama) modunda çalıştırır.
  ```bash
  pnpm dev
  ```
  Bu komut aslında `backend` ve `frontend` klasörlerindeki `dev` script'lerini paralel olarak tetikler.

- **Tüm Projeyi Üretim (Production) İçin Build Etme:**
  Aşağıdaki komut, önce backend'i, ardından frontend'i üretim için hazırlar.
  ```bash
  pnpm build
  ```

### 4. Servislere Erişim

- **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
- **Backend (Express.js):** [http://localhost:5000](http://localhost:5000)
- **pgAdmin (Veritabanı Yönetimi):** [http://localhost:8080](http://localhost:8080)
  - **Kullanıcı Adı:** `admin@example.com`
  - **Şifre:** `admin`

## Veritabanı Yönetimi (Prisma)

Prisma migration ve veritabanı yönetimi için detaylar:

```bash
# Backend container içinde migration çalıştırma
docker exec ecom_backend_api sh -c "cd /usr/src/app/backend && pnpm prisma db push"

# Backend container içinde Prisma Studio açma
docker exec -it ecom_backend_api sh -c "cd /usr/src/app/backend && pnpm prisma studio"
```

---

## 🌐 Deployment (Canlıya Alma)

### Önerilen Hosting Platformları

#### **Veritabanı:**

| Platform | Özellikler | Fiyat (Başlangıç) | Önerilen Kullanım |
|----------|-----------|-------------------|-------------------|
| **Supabase** | PostgreSQL, PostgREST, Auth, Storage | Ücretsiz (500MB) | ⭐ En Kolay, Hızlı Setup |
| **Neon** | Serverless PostgreSQL | Ücretsiz (3GB) | ⭐ Kolay, Otomatik Scaling |
| **Railway** | PostgreSQL + Heroku alternatifi | Ücretsiz ($5 kredi) | ⭐ Container Friendly |
| **Vercel Postgres** | Serverless PostgreSQL | Ücretli | Vercel ile entegre |
| **AWS RDS** | Managed PostgreSQL | Ücretli | Enterprise |

**💡 Öneri: Supabase veya Neon**

**Neden:**
- Kurulum kolay, hızlı başlangıç
- Yeterli ücretsiz kotası
- Otomatik yedekleme ve ölçekleme
- Prisma ile uyumlu

#### **Backend (Express.js):**

| Platform | Özellikler | Fiyat | Önerilen |
|----------|-----------|-------|----------|
| **Railway** | Container deployment | Ücretsiz ($5 kredi) | ⭐ Prisma ile kolay |
| **Render** | Heroku alternatifi | Ücretsiz (sleeps) | ⭐ Yaygın kullanım |
| **Fly.io** | Global edge deployment | Ücretsiz (256MB RAM) | ⭐ Performans |
| **Heroku** | PaaS | Ücretli | 🔴 Eski teknoloji |
| **AWS EC2 / Lightsail** | VPS / Container | Ücretli | Enterprise |

**💡 Öneri: Railway veya Render**

#### **Frontend (Next.js):**

| Platform | Özellikler | Fiyat | Önerilen |
|----------|-----------|-------|----------|
| **Vercel** | Next.js creator | Ücretsiz | ⭐⭐⭐ En İyi Seçim |
| **Netlify** | JAMstack hosting | Ücretsiz | ⭐ Popüler |
| **Railway** | Full-stack hosting | Ücretsiz | ⭐ Backend ile birlikte |
| **Cloudflare Pages** | Global CDN | Ücretsiz | Performans |

**💡 Öneri: Vercel (Next.js için en uygun)**

---

### Deployment Adımları (Önerilen Stack: Supabase + Railway + Vercel)

#### 1️⃣ Supabase Veritabanı Kurulumu

1. **Supabase'de Proje Oluştur:**
   - https://supabase.com adresine git
   - "Start your project" → GitHub ile giriş yap
   - Yeni proje oluştur

2. **Connection String'i Al:**
   - Proje ayarları → Database → Connection string
   - `DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres` formatında

3. **Prisma'da Supabase'i Kullan:**
   ```bash
   # Backend .env dosyasını güncelle
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres?pgbouncer=true"
   ```

4. **Migration Çalıştır:**
   ```bash
   # Local'den migration gönder
   cd backend
   pnpm prisma db push
   ```

---

#### 2️⃣ Railway Backend Deployment

1. **Railway'de Proje Oluştur:**
   - https://railway.app adresine git
   - GitHub ile giriş yap
   - "New Project" → "Deploy from GitHub repo"

2. **Backend Servis Ekle:**
   - Proje seç → "New" → "GitHub Repo"
   - Backend klasörünü seç veya monorepo ise root path belirt

3. **Environment Variables:**
   ```env
   DATABASE_URL=postgresql://...supabase.co
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

4. **Deploy:**
   - Railway otomatik build eder
   - Public URL al (örn: `https://your-backend.up.railway.app`)

---

#### 3️⃣ Vercel Frontend Deployment

1. **Vercel'de Proje Oluştur:**
   - https://vercel.com adresine git
   - GitHub ile giriş yap
   - "Import Project" → Repo seç

2. **Build Settings:**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: pnpm build
   Output Directory: .next
   ```

3. **Environment Variables (ÖNEMLİ - İKİSİ DE GEREKLİ):**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
   INTERNAL_API_URL=https://your-backend.up.railway.app
   ```
   
   **⚠️ ÖNEMLİ:** Vercel'de **hem** `NEXT_PUBLIC_API_URL` **hem de** `INTERNAL_API_URL` tanımlanmalıdır. İkisi de aynı Railway backend URL'ine işaret etmelidir.
   
   - `NEXT_PUBLIC_API_URL`: Tarayıcı tarafında (client-side) kullanılır
   - `INTERNAL_API_URL`: Sunucu tarafında (SSR) kullanılır - Bu olmadan ürünler, kategoriler ve diğer veriler görünmez!

4. **Deploy:**
   - "Deploy" → İlk build otomatik başlar
   - Public URL al (örn: `https://your-app.vercel.app`)

---

### Deploy Sonrası Kontroller

✅ **Backend API Testi:**
```bash
curl https://your-backend.up.railway.app/api
# {"message":"Welcome to the E-Commerce API!"}
```

✅ **Frontend Test:**
- https://your-app.vercel.app adresine git
- Ana sayfa açılmalı
- Ürünler görünmeli

✅ **Veritabanı Bağlantısı:**
- Login/Kayıt testi yap
- Veriler Supabase'de görünmeli

---

### Alternatif: Railway Full-Stack (Kolay)

Tek platformda tüm servisler:

1. **Railway'de Proje Oluştur**
2. **3 Servis Ekle:**
   - PostgreSQL (Railway managed)
   - Backend (GitHub repo)
   - Frontend (GitHub repo)
3. **Environment Variables:**
   - Backend: `DATABASE_URL` (Railway otomatik verir)
   - Frontend: `NEXT_PUBLIC_API_URL` (Backend URL'i)

**💡 En Kolay Yol: Railway Full-Stack**

---

## 📚 Ek Dokümantasyon

- **[TASK.md](TASK.md):** Tamamlanan görevler listesi
- **[DEPLOYMENT.md](DEPLOYMENT.md):** 🚀 Canlıya alma rehberi (Supabase, görsel yükleme, Prisma entegrasyonu)
- **[HowToMade/](HowToMade/):** Geliştirme süreçleri
  - [AUTHENTICATION.md](HowToMade/AUTHENTICATION.md): Kimlik doğrulama nasıl yapıldı?
  - [CART.md](HowToMade/CART.md): Sepet sistemi nasıl yapıldı?
  - [ADMIN_PANEL.md](HowToMade/ADMIN_PANEL.md): Admin paneli nasıl yapıldı?
  - [PRODUCT_REVIEWS.md](HowToMade/PRODUCT_REVIEWS.md): Yorum sistemi nasıl yapıldı?
  - [ACCOUNT_MANAGEMENT.md](HowToMade/ACCOUNT_MANAGEMENT.md): Hesap yönetimi nasıl yapıldı?
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md):** Yaygın sorunlar ve çözümleri

---

## 🤝 Katkıda Bulunma

Proje şu anda MVP aşamasında. Gerçek bir ürün haline getirmek için:

1. Fork the repository
2. Feature branch oluştur
3. Değişikliklerini commit et
4. Pull request aç

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

## 📞 İletişim

Sorularınız için issue açabilir veya direkt iletişime geçebilirsiniz.
