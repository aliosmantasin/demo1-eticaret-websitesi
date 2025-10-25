# Proje: E-Ticaret Platformu

Bu proje, modern bir e-ticaret platformu oluşturmak için PERN (PostgreSQL, Express, React/Next.js, Node.js) yığınını kullanan bir full-stack web uygulamasıdır. Hem son kullanıcılar için bir vitrin hem de site sahipleri için bir yönetim paneli içerir.

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
