# Proje Görev Listesi (TASK)

Bu liste, projenin MVP (Minimum Uygulanabilir Ürün) hedefine ulaşmak için tamamlanması gereken görevleri içerir. Görevler, `RULES.md` dosyasında belirtildiği gibi sırayla ve onay mekanizmasıyla işlenecektir.

## Faz 1: Proje Kurulumu ve Altyapı

- [x] **Görev 1.1: Docker Desktop Kurulumu ve Doğrulaması**
  - **Açıklama:** Geliştirme ortamı için Docker Desktop'ın yerel makineye kurulması ve `docker --version` komutuyla çalışır durumda olduğunun teyit edilmesi.
  - **İlgili Dosyalar:** `docs/README.md`, `docs/learnin.md`

- [x] **Görev 1.2: Proje İskeletinin Oluşturulması**
  - **Açıklama:** `frontend` ve `backend` adında iki ana klasörün oluşturulması.
  - **İlgili Dosyalar:** `docs/README.md`

- [x] **Görev 1.3: `docker-compose.yml` Dosyasının Oluşturulması**
  - **Açıklama:** Projenin ana dizininde `frontend`, `backend` ve `postgres` servislerini tanımlayan `docker-compose.yml` dosyasının oluşturulması. Veritabanı için kalıcı bir `volume` tanımlanması.
  - **İlgili Dosyalar:** `docs/learnin.md`

- [x] **Görev 1.4: Backend (Express) Dockerizasyonu**
  - **Açıklama:** `backend` klasörü içine temel bir `Dockerfile`, `package.json` ve başlangıç `index.ts` dosyası oluşturarak Express uygulamasını Docker içinde çalışır hale getirmek.
  - **İlgili Dosyalar:** `docs/README.md`

- [x] **Görev 1.5: Frontend (Next.js) Dockerizasyonu**
  - **Açıklama:** `frontend` klasörü içine temel bir Next.js projesi oluşturmak ve bunu Docker içinde çalıştıracak bir `Dockerfile` hazırlamak.
  - **İlgili Dosyalar:** `docs/README.md`

- [x] **Görev 1.6: Servislerin Birlikte Çalışmasının Test Edilmesi**
  - **Açıklama:** `docker-compose up` komutuyla tüm servislerin (frontend, backend, db) hatasız bir şekilde ayağa kalktığının ve birbirleriyle iletişim kurabildiğinin test edilmesi.

- [x] **Görev 1.7: Geliştirme Ortamı İçin Docker Yapılandırması**
  - **Açıklama:** `docker-compose.yml` dosyasını, kod dosyalarını canlı olarak senkronize edecek `volumes` ayarlarını ekleyerek ve konteynerlerin geliştirme sunucusunu (`pnpm dev`) başlatmasını sağlayarak güncellemek.

## Faz 2: Backend - Kimlik Doğrulama

- [x] **Görev 2.1: Kimlik Doğrulama İçin Bağımlılıkların Eklenmesi**
  - **Açıklama:** `backend` projesine Prisma, Passport, JWT, bcrypt ve Zod gibi temel kimlik doğrulama kütüphanelerini eklemek.

- [x] **Görev 2.2: Prisma Şemasının ve `User` Modelinin Oluşturulması**
  - **Açıklama:** `prisma/schema.prisma` dosyasını oluşturmak, veritabanı bağlantısını yapılandırmak ve `User` modelini (id, email, password, role vb.) tanımlamak.

- [x] **Görev 2.3: Prisma'nın Projeye Entegre Edilmesi**
  - **Açıklama:** `prisma generate` komutunu çalıştırarak veritabanı istemcisini oluşturmak ve Prisma'yı başlatacak bir servis (`prisma.service.ts`) yazmak.

- [x] **Görev 2.4: Veritabanı Migration'ının Çalıştırılması**
  - **Açıklama:** `prisma migrate dev` komutu ile `User` tablosunu veritabanında oluşturmak.

- [x] **Görev 2.5: Kayıt Olma (Register) Endpoint'inin Oluşturulması**
  - **Açıklama:** `/auth/register` yolunda, Zod ile doğrulanmış kullanıcı verisini alan, şifreyi bcrypt ile hash'leyen ve yeni kullanıcıyı veritabanına kaydeden bir endpoint oluşturmak.

- [x] **Görev 2.6: Giriş Yapma (Login) Endpoint'inin Oluşturulması**
  - **Açıklama:** `/auth/login` yolunda, kullanıcı kimlik bilgilerini doğrulayan, başarılı olursa bir JWT (Access Token) üreten ve bunu kullanıcıya geri dönen bir endpoint oluşturmak.

## Faz 3: Backend - Ürün Yönetimi

- [x] **Görev 3.1: Ürün ve Kategori Modellerinin Şemaya Eklenmesi**
  - **Açıklama:** `schema.prisma` dosyasına `Product` ve `Category` modellerini ve aralarındaki ilişkiyi eklemek.

- [x] **Görev 3.2: Ürünler İçin Veritabanı Migration'ı**
  - **Açıklama:** Yeni modeller için `prisma migrate dev` komutunu çalıştırarak veritabanında `Product` ve `Category` tablolarını oluşturmak.

- [x] **Görev 3.3: Ürünler İçin API Yapısının Oluşturulması**
  - **Açıklama:** Ürünlerle ilgili endpoint'leri yönetmek için `api/products` altında `products.controller.ts` ve `products.service.ts` dosyalarını oluşturmak.

- [x] **Görev 3.4: "Tüm Ürünleri Listele" Endpoint'inin Oluşturulması**
  - **Açıklama:** `/api/products` adresine gelen `GET` isteklerine tüm ürünleri (filtreleme ve sayfalama ile) listeleyen bir endpoint oluşturmak.

- [x] **Görev 3.5: "Yeni Ürün Oluştur" Endpoint'inin Oluşturulması**
  - **Açıklama:** `/api/products` adresine gelen `POST` istekleriyle (doğrulanmış veri ile) yeni bir ürün oluşturan bir endpoint yazmak. Bu endpoint'in sadece admin gibi yetkili kullanıcılar tarafından erişilebilir olması gerekecek (şimdilik bu kuralı atlayabiliriz).

## Faz 4: Frontend - Ürün Keşfi (Anasayfa ve Kategori Sayfası)

- [x] **Görev 4.1: Frontend Anasayfa UI'ının Oluşturulması**
  - **Açıklama:** Referans tasarıma uygun olarak, anasayfayı oluşturan tüm bileşenlerin (Header, Footer, Banner, CategoryShowcase, Bestsellers, Reviews, Assurance) oluşturulması ve yerleştirilmesi.
  - **Detaylar:** Header ve Footer, tüm cihazlar için responsive (masaüstü menü, mobil sheet/accordion) olarak tamamlandı.
- [x] **Görev 4.2: Dinamik Kategori Sayfa Altyapısının Kurulması**
  - **Açıklama:** `/kategori/[slug]` dinamik route'u oluşturuldu. Bu sayfa, URL'deki `slug`'a göre kategori başlığını dinamik olarak gösterir.
- [x] **Görev 4.3: Kategori Sayfası UI'ının Oluşturulması**
  - **Açıklama:** Referans tasarıma uygun olarak kategori sayfasında `CategoryNavbar`, `InfoBanner` ve ürün listesi alanları oluşturuldu.

## Faz 5: Veritabanı - Başlangıç Verilerinin Yüklenmesi (Seeding)

- [ ] **Görev 5.1: `seed.ts` Dosyasının Postman Verileriyle Doldurulması**
  - **Açıklama:** Sağlanan Postman koleksiyonundaki ürün ve kategori verilerini `prisma/seed.ts` dosyasına aktarmak. Bu, `pnpm prisma db seed` komutu çalıştırıldığında geliştirme veritabanının tutarlı ve gerçekçi verilerle dolmasını sağlayacak.
- [ ] **Görev 5.2: Backend Kategori Filtrelemesinin Tamamlanması**
  - **Açıklama:** Postman koleksiyonunda belirtildiği gibi, `/api/products` endpoint'inin `?category=[slug]` parametresini kabul edecek şekilde backend'de `products.service.ts` dosyasını güncellemek.

## Faz 6: Frontend & Backend - Kullanıcı Kimlik Doğrulama

- [ ] **Görev 6.1: Frontend'de Üye Ol Sayfası UI'ını Oluşturmak**
- [ ] **Görev 6.2: Frontend'de Giriş Yap Sayfası UI'ını Oluşturmak**
- [ ] **Görev 6.3: Frontend'den Register ve Login API İsteklerini Göndermek**
- [ ] **Görev 6.4: Alınan JWT'yi Frontend'de Saklamak ve Yönetmek (Context API)**

## Faz 7: Admin Paneli ve Ürün Yönetimi

- [ ] **Görev 7.1: Prisma Şemasına Kullanıcı Rolü (Admin/User) Eklemek**
- [ ] **Görev 7.2: Backend'de Admin Yetki Kontrolü (Middleware) Yazmak**
- [ ] **Görev 7.3: Frontend'de Temel Bir Admin Paneli Arayüzü Oluşturmak**
- [ ] **Görev 7.4: Admin Panelinde Ürün Ekleme/Düzenleme/Silme (CRUD) Fonksiyonlarını Eklemek**

## Faz 8: Alışveriş Sepeti

- [ ] **Görev 8.1: Prisma Şemasına `Cart` ve `CartItem` Modellerini Eklemek**
- [ ] **Görev 8.2: Backend'de Sepete Ekleme/Güncelleme/Silme API Endpoint'lerini Yazmak**
- [ ] **Görev 8.3: Frontend'de "Sepete Ekle" Butonlarını İşlevsel Hale Getirmek**
- [ ] **Görev 8.4: Frontend'de Sepet İçeriğini Gösteren Bir Sayfa veya Drawer Oluşturmak**
