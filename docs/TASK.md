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

- [x] **Görev 5.1: `seed.ts` Dosyasının Postman Verileriyle Doldurulması**
  - **Açıklama:** Sağlanan Postman koleksiyonundaki ürün ve kategori verilerini `prisma/seed.ts` dosyasına aktarmak. Bu, `pnpm prisma db seed` komutu çalıştırıldığında geliştirme veritabanının tutarlı ve gerçekçi verilerle dolmasını sağlayacak.
- [x] **Görev 5.2: Backend Kategori Filtrelemesinin Tamamlanması**
  - **Açıklama:** Postman koleksiyonunda belirtildiği gibi, `/api/products` endpoint'inin `?category=[slug]` parametresini kabul edecek şekilde backend'de `products.service.ts` dosyasını güncellemek.

## Faz 6: Frontend & Backend - Kullanıcı Kimlik Doğrulama

- [x] **Görev 6.1: Frontend'de Üye Ol Sayfası UI'ını Oluşturmak**
- [x] **Görev 6.2: Frontend'de Giriş Yap Sayfası UI'ını Oluşturmak**
- [x] **Görev 6.3: Frontend'den Register ve Login API İsteklerini Göndermek**
- [x] **Görev 6.4: Alınan JWT'yi Frontend'de Saklamak ve Yönetmek (Context API)**

## Faz 7: Admin Paneli ve Ürün Yönetimi

- [x] **Görev 7.1: Prisma Şemasına Kullanıcı Rolü (Admin/User) Eklemek**
  - **Açıklama:** `User` modeline `role` alanı eklendi. Varsayılan değer "USER".
- [x] **Görev 7.2: Backend'de Admin Yetki Kontrolü (Middleware) Yazmak**
  - **Açıklama:** `requireAdmin` middleware'i oluşturuldu. Admin route'ları korunuyor.
- [x] **Görev 7.3: Frontend'de Temel Bir Admin Paneli Arayüzü Oluşturmak**
  - **Açıklama:** `/admin` sayfası oluşturuldu. Ürün listesi ve silme işlevi eklendi.
- [x] **Görev 7.4: Admin Panelinde Ürün Ekleme/Düzenleme/Silme (CRUD) Fonksiyonlarını Eklemek**
  - **Açıklama:** Backend ve frontend'de tam CRUD işlemleri tamamlandı. Form yapısı oluşturuldu.

## Faz 8: Alışveriş Sepeti

- [x] **Görev 8.1: Prisma Şemasına `Cart` ve `CartItem` Modellerini Eklemek**
- [x] **Görev 8.2: Backend'de Sepete Ekleme/Güncelleme/Silme API Endpoint'lerini Yazmak**
- [x] **Görev 8.3: Frontend'de "Sepete Ekle" Butonlarını İşlevsel Hale Getirmek**
- [x] **Görev 8.4: Frontend'de Sepet İçeriğini Gösteren Bir Sayfa veya Drawer Oluşturmak**

## Faz 9: Ürün Detay Sayfası Geliştirmeleri

- [x] **Görev 9.1: Ürün Yorumları Sistemi - Backend**
  - **Açıklama:** `Review` modelini Prisma şemasına eklemek, yorum CRUD API'lerini oluşturmak. **Not:** MVP'de sipariş sistemi olmadığı için satın alma kontrolü yok.
- [x] **Görev 9.2: Ürün Yorumları Sistemi - Frontend**
  - **Açıklama:** Ürün detay sayfasına yorum gösterme ve yorum yapma özelliği eklemek.
- [x] **Görev 9.3: Benzer Ürünler Bölümü**
  - **Açıklama:** Ürün detay sayfasında "Son Görüntülenen Ürünler" yerine aynı kategorideki benzer ürünleri göstermek.
- [x] **Görev 9.4: Çok Satanlar Bölümü**
  - **Açıklama:** Ürün detay sayfasına `isBestseller` olarak işaretlenmiş ürünleri gösteren bir bölüm eklemek.

## Faz 10: Kullanıcı Profili ve Sepet Sayfası

- [x] **Görev 10.1: Kullanıcı Profil Sayfası**
  - **Açıklama:** Kullanıcının bilgilerini görüntüleyip düzenleyebileceği bir sayfa oluşturmak.
- [x] **Görev 10.2: Kullanıcı Bilgileri Güncelleme Backend**
  - **Açıklama:** Profil güncelleme API'si oluşturmak.
- [x] **Görev 10.3: Sepete Eklenen Ürünler Sayfası**
  - **Açıklama:** Sepet sayfasını oluşturmak, CartDrawer'dan sepet sayfasına yönlendirme eklendi. Ürün ekleme ve silme işlemleri için modern modal dialogs eklendi.
- [x] **Görev 10.4: Siparişlerim Sayfası**
  - **Açıklama:** Mock data ile sipariş listesi sayfası oluşturuldu. MVP için backend entegrasyonu sonraya ertelendi.
- [x] **Görev 10.5: Adreslerim Sayfası**
  - **Açıklama:** Mock data ile adres yönetimi sayfası oluşturuldu. MVP için backend entegrasyonu sonraya ertelendi.

## Faz 11: Ek Sayfalar ve İyileştirmeler

- [x] **Görev 11.1: İletişim Sayfası**
  - **Açıklama:** İletişim formu, telefon ve e-posta bilgileri, kargo bilgileri içeren sayfa oluşturuldu.
- [x] **Görev 11.2: Hakkımızda Sayfası**
  - **Açıklama:** Şirket misyonu, değerler, sertifikalar ve müşteri istatistikleri içeren sayfa oluşturuldu.
- [x] **Görev 11.3: SSS (FAQ) Sayfası**
  - **Açıklama:** Genel, Ürünler, Kargo kategorilerinde soru-cevap sayfası oluşturuldu.
- [x] **Görev 11.4: Dokümantasyon Güncellemeleri**
  - **Açıklama:** ACCOUNT_MANAGEMENT.md, DEPLOYMENT.md oluşturuldu, README.md güncellendi.

## Faz 12: MVP Sonrası Geliştirmeler

Bu faz, projenin temel MVP (Minimum Viable Product) sürümünden sonra eklenen daha gelişmiş ve dinamik özellikleri içerir. Amaç, statik verileri dinamik, yönetilebilir ve kullanıcı dostu arayüzlerle değiştirmektir.

### **Görev 12.1: Admin Paneli - Dinamik Görsel Yönetimi** `Tamamlandı`
-   [x] **Backend:**
    -   [x] `schema.prisma`: `Product` ve `Image` modelleri arasında one-to-many ilişki kuruldu.
    -   [x] `images.controller.ts`: Görsel yükleme (`/upload`) ve listeleme (`/`) için API endpoint'leri oluşturuldu.
    -   [x] `products.service.ts`: Ürün oluşturma/güncelleme servisleri, `imageIds` kabul edecek şekilde güncellendi.
-   [x] **Frontend:**
    -   [x] `admin/page.tsx`:
        -   [x] "Medya Galerisi" sekmesi eklendi.
        -   [x] Görsel yükleme formu oluşturuldu ve API'ye bağlandı.
        -   [x] Yüklenen tüm görseller grid yapısında listelendi.
        -   [x] Ürün formunda, galeriden görsel seçmek için bir modal (dialog) arayüzü oluşturuldu.
        -   [x] Seçilen görseller `handleProductSubmit` ile backend'e gönderildi.

### **Görev 12.2: Frontend - Gelişmiş Ürün Galerisi (Dinamik Carousel)** `Tamamlandı`
-   [x] **Veri Akışı:**
    -   [x] `products.service.ts`: Ürünler getirilirken ilişkili `images` verilerinin de dahil edilmesi sağlandı (`include`).
    -   [x] `types/index.ts`: Frontend `Product` tipi, `string[]` yerine `Image[]` objelerini kabul edecek şekilde güncellendi.
-   [x] **Arayüz:**
    -   [x] `ProductGallery.tsx`: Statik görseller yerine, ürüne ait `images` dizisini alacak şekilde dinamik hale getirildi.
    -   [x] Ana görsel ve altında tıklanabilir thumbnail'ler içeren bir carousel yapısı kuruldu.
    -   [x] `ProductCard.tsx` ve diğer ilgili bileşenler yeni veri yapısına uyarlandı.

### **Görev 12.3: Admin Paneli - Dinamik Ürün Varyant Yönetimi (Aroma/Boyut)** `Tamamlandı`
-   [x] **Backend:**
    -   [x] `schema.prisma`: `Option`, `OptionValue` ve `ProductVariant` modelleri oluşturularak varyant altyapısı kuruldu.
    -   [x] `options.service.ts`: `Option` ve `OptionValue` için veritabanı CRUD işlemleri (create, read, update, delete) oluşturuldu.
    -   [x] `options.controller.ts`: Varyantları yönetmek için `/api/admin/options` ve `/api/admin/options/values` altında güvenli API endpoint'leri oluşturuldu.
    -   [x] `admin.controller.ts` ve `index.ts`: Yeni `optionsRouter`, ana admin rotalarına entegre edildi.
-   [x] **Frontend:**
    -   [x] `admin/page.tsx`:
        -   [x] "Varyantlar" adında yeni bir sekme eklendi.
        -   [x] `Option` (örn: Aroma) ve `OptionValue` (örn: Çilek) oluşturmak, listelemek ve silmek için arayüz geliştirildi.
        -   [x] Arayüz, backend API'lerine bağlanarak tamamen işlevsel hale getirildi.

### **Görev 12.4: Ürünlere Varyant Ekleme ve Frontend'de Gösterim** `Tamamlandı`
-   [x] **Admin Paneli:**
    -   [x] Ürün ekleme/düzenleme formuna, oluşturulan `Option` ve `OptionValue`'ları kullanarak o ürüne özel varyantlar (`ProductVariant`) tanımlanmasını sağlayan bir arayüz eklendi.
    -   [x] Her bir varyant için ayrı fiyat ve stok bilgisi girilebilmesi sağlandı.
-   [x] **Backend:**
    -   [x] `products.service.ts`: Ürün oluşturma/güncelleme fonksiyonları, `ProductVariant` verilerini kabul edecek ve işleyecek şekilde genişletildi. `getProductBySlug` fonksiyonu da varyantları içerecek şekilde güncellendi.
-   [x] **Frontend (Ürün Detay Sayfası):**
    -   [x] `types/index.ts`: Varyantları destekleyecek şekilde tüm tipler güncellendi.
    -   [x] `ProductInfo.tsx`: Ürüne ait varyantları (örn: Aroma, Boyut seçenekleri) kullanıcıya sunacak şekilde yeniden yapılandırıldı.
    -   [x] Kullanıcı bir varyant seçtiğinde ürün fiyatının ve stok durumunun dinamik olarak güncellenmesi sağlandı.
    -   [x] `VariantChip.tsx`: Yeni esnek yapıya uygun hale getirildi.

## Faz 13: Supabase Storage Entegrasyonu ve Veri Restorasyonu `Tamamlandı`

Bu fazın amacı, projedeki tüm görsel varlık yönetimini yerel dosya sisteminden bulut tabanlı Supabase Storage'a taşımak ve bu süreçte projenin başlangıcındaki zengin referans veri setini (ürünler ve görselleri) restore etmektir.

### **Görev 13.1: Backend - Supabase Entegrasyonu** `Tamamlandı`
-   [x] **Kurulum:** `@supabase/supabase-js` paketini backend'e ekle.
-   [x] **Servis Oluşturma:** Supabase client'ını başlatan ve ortam değişkenlerini kullanan merkezi bir `supabase.service.ts` oluştur.
-   [x] **API Güncellemesi:** `images.controller.ts`'i, görselleri yerel diske kaydetmek yerine Supabase Storage'a yükleyecek ve dönen URL'yi veritabanına kaydedecek şekilde yeniden yaz.

### **Görev 13.2: Veri Taşıma ve Seed Güncellemesi** `Tamamlandı`
-   [x] **Veri Taşıma:** Yerel `uploads` klasöründeki görselleri Supabase Storage'a yükleyen tek seferlik bir script (`upload-local-assets.ts`) oluşturuldu ve çalıştırıldı.
-   [x] **Seed Güncellemesi:** `prisma/seed.ts` dosyası, restore edilen ürünleri ve onlara ait Supabase'deki görsellerin URL'lerini ve placeholder'ları kullanarak veritabanını dolduracak şekilde tamamen yeniden yazıldı.
-   [x] **Veritabanı Tohumlama:** Güncellenen `seed.ts` script'i başarıyla çalıştırılarak veritabanı "fabrika ayarlarına" döndürüldü.


---

## Faz 14: Altyapı Stabilizasyonu ve Hata Ayıklama

**Durum:** Tamamlandı ✅

Bu faz, Faz 12 ve 13'teki geliştirmeler sonrası ortaya çıkan ve sistemin genel kararlılığını bozan kritik altyapı sorunlarını çözmek için gerçekleştirilmiştir.

### Karşılaşılan Sorunlar ve Çözümleri:

-   **Prisma Client Senkronizasyon Sorunu:**
    -   **Problem:** `schema.prisma` dosyasında yapılan değişiklikler (`ProductVariant` -> `Image` ilişkisi gibi) `Prisma Client` tarafından algılanmadı. Bu, backend'in `Unknown field 'images'` hatasıyla sürekli çökmesine neden oldu.
    -   **Çözüm:** Sorunlu kod satırı geçici olarak devre dışı bırakılarak sistem stabil hale getirildi. `docker-compose down`, `pnpm install` ve `prisma generate` gibi adımlarla client'ın güncellenmesi sağlandı.

-   **Veritabanı Şema Uyumsuzluğu:**
    -   **Problem:** Kodun beklediği veritabanı şeması ile mevcut veritabanı arasında farklar oluştu. Bu da backend'in başlamasını engelledi.
    -   **Çözüm:** `docker-compose.yml` dosyasında başlangıç komutu geçici olarak değiştirilerek konteynere erişim sağlandı. `prisma db push --accept-data-loss` komutuyla şema zorla eşitlendi.

-   **Veri Kaybı ve Seed Sorunları:**
    -   **Problem:** Şema eşitleme sırasında veritabanındaki tüm veriler (admin kullanıcısı, ürünler, kategoriler) silindi. Bu, "Failed to fetch" hatalarına ve giriş yapamamaya neden oldu. Ayrıca, `seed.ts` dosyasının kategorilere görsel atamadığı ve veri setinin yetersiz olduğu tespit edildi.
    -   **Çözüm:** `seed.ts` dosyası, doğru Supabase URL'lerini kullanarak zengin bir veri seti (daha fazla ürün, görselli kategoriler vb.) oluşturacak şekilde tamamen yeniden yazıldı ve `prisma db seed` ile veritabanı yeniden dolduruldu.

-   **Docker Ağ Yapılandırma Hatası:**
    -   **Problem:** Frontend'in hem sunucu tarafı (konteyner içi) hem de istemci tarafı (tarayıcı) için doğru API URL'ini kullanamaması "Failed to fetch" hatalarına yol açtı.
    -   **Çözüm:** `docker-compose.yml` dosyasında `NEXT_PUBLIC_API_URL` (`http://localhost:5001`) ve `INTERNAL_API_URL` (`http://backend:5001`) değişkenleri doğru şekilde ayarlandı.

**Sonuç:** Sistem şu an stabil ve zengin bir veri setiyle çalışır durumda. Ancak, orijinal hatanın kaynağı olan varyant görsellerini getiren kod (`products.service.ts` içinde) geçici olarak devre dışıdır.


---

## Faz 15: Admin Paneli İyileştirmeleri ve Dinamik İçerik Yönetimi `Tamamlandı`

### **Görev 15.1: Medya Galerisi UX İyileştirmesi** `Tamamlandı`
- [x] **Görsel Seç Modalı:** Kategori ve ürün görsellerini ayıran filtre butonları eklendi
- [x] **Görsel Etiketleme:** Her görsel kartında "Ürün Görseli", "Kategori Görseli" veya "Bağımsız görsel" etiketleri gösteriliyor
- [x] **Varsayılan Filtre:** Modal açıldığında varsayılan olarak ürün görselleri gösteriliyor

### **Görev 15.2: Çok Satanlar Kısa Açıklama Kaldırma** `Tamamlandı`
- [x] **ProductCard Bileşeni:** `showShortExplanation` prop'u eklendi
- [x] **Anasayfa Bestsellers:** Kısa açıklama gösterimi kaldırıldı, sadece ürün detay sayfasında görünüyor

### **Görev 15.3: Ürün Rozet Yönetimi (Vejetaryen/Glutensiz)** `Tamamlandı`
- [x] **Veritabanı Şeması:** `Product` modeline `badge_primary_text`, `badge_primary_hidden`, `badge_secondary_text`, `badge_secondary_hidden` alanları eklendi
- [x] **Admin Paneli:** Ürün formunda kısa açıklama altına rozet yönetimi eklendi (text + hidden checkbox)
- [x] **Frontend Gösterimi:** Ürün detay sayfasında dinamik rozet gösterimi
- [x] **Seed Verileri:** Tüm ürünlere referans rozet verileri eklendi

### **Görev 15.4: Varyant Sıralama İyileştirmesi** `Tamamlandı`
- [x] **Aroma Sıralama:** Aromalar alfabetik olarak sıralanıyor (Türkçe karakter desteği ile)
- [x] **Boyut Sıralama:** Boyutlar sayısal değerlerine göre küçükten büyüğe sıralanıyor (400g < 1000g < 2300g)
- [x] **Admin Panel:** Varyant seçim dropdown'larında da aynı sıralama mantığı uygulandı

### **Görev 15.5: Çok Satanlar İndirim Rengi Düzeltmesi** `Tamamlandı`
- [x] **ProductCard:** İndirimli fiyatlar kırmızı yerine yeşil (`text-green-600`) olarak gösteriliyor

---

## Faz 16: Tüm Web Sitesini Dinamik Hale Getirme

**Durum:** Planlama Aşaması 📋

Bu faz, web sitesindeki tüm statik içerikleri admin panelinden yönetilebilir hale getirmeyi hedefler.

### **Görev 16.1: Navbar Dinamik Kategori Yönetimi** `Tamamlandı`
- [x] **Veritabanı Şeması:** `Category` modeline `showInNavbar` (Boolean) alanı eklendi
- [x] **Admin Paneli - Navbar Sekmesi:** 
  - [x] Yeni "Navbar" sekmesi oluşturuldu
  - [x] Kategori listesi gösteriliyor (checkbox ile seçilebilir)
  - [x] Navbar'da gösterilecek kategorileri seçme/gizleme arayüzü eklendi
- [x] **Frontend - Header:** Navbar'da sadece `showInNavbar: true` olan kategoriler gösteriliyor
- [x] **İlgili Dosyalar:** `frontend/components/Header.tsx`, `frontend/components/navbar/HeaderDesktop.tsx`, `frontend/components/navbar/HeaderMobil.tsx`, `frontend/components/navbar/CategoryNavbar.tsx`

### **Görev 16.2: Infobar Dinamik İçerik Yönetimi** `Tamamlandı`
- [x] **Veritabanı Şeması:** `SiteSettings` modeline `infobar_first_text`, `infobar_first_subtext`, `infobar_second_text`, `infobar_second_subtext`, `infobar_third_text`, `infobar_third_subtext` alanları eklendi
- [x] **Admin Paneli - Navbar Sekmesi:**
  - [x] Infobar text ve subtext düzenleme alanları eklendi (3 bilgi kutusu için)
- [x] **Frontend - Header:** Infobar içeriği dinamik olarak gösteriliyor
- [x] **İlgili Dosyalar:** `frontend/components/navbar/InfoBar.tsx`, `frontend/components/admin/NavbarManagement.tsx`

### **Görev 16.3: Akan Yazı (Marquee) Yönetimi** `Tamamlandı`
- [x] **Veritabanı Şeması:** `SiteSettings` modeline `marquee_text` ve `marquee_speed` (1x, 2x, 3x) alanları eklendi
- [x] **Admin Paneli - Navbar Sekmesi:**
  - [x] Akan yazı metni düzenleme alanı eklendi
  - [x] Hız seçimi (1x, 2x, 3x) dropdown'u eklendi
- [x] **Frontend - Header:** Akan yazı bileşeni oluşturuldu ve dinamik içerik/hız ile gösteriliyor
- [x] **İlgili Dosyalar:** `frontend/components/navbar/Marquee.tsx`, `frontend/components/Header.tsx`, `frontend/app/globals.css`

### **Görev 16.4: AnaSayfa Sekmesi - HomepageBanner Yönetimi** `Tamamlandı`
- [x] **Veritabanı Şeması:** `SiteSettings` modelinde `homepage_banner_desktop_url`, `homepage_banner_mobile_url`, `homepage_banner_hidden` alanları kullanılıyor
- [x] **Supabase:** `homepage-banner-desktop`, `homepage-banner-mobil`, `homepage-promotion-banner` bucket'ları oluşturuldu ve Next.js yapılandırmasına eklendi
- [x] **Admin Paneli - AnaSayfa Sekmesi:**
  - [x] Yeni "AnaSayfa" sekmesi oluşturuldu
  - [x] Desktop ve Mobile banner seçimi için medya galerisi entegre edildi
  - [x] Banner gizleme checkbox'ı eklendi
- [x] **Frontend - Banner Bileşeni:** SiteSettings verisiyle dinamik görsel gösterimi ve hidden kontrolü sağlandı
- [x] **İlgili Dosyalar:** `frontend/components/homepage/Banner.tsx`, `frontend/components/admin/HomepageManagement.tsx`, `frontend/app/page.tsx`

### **Görev 16.5: AnaSayfa Sekmesi - CategoryShowcase Yönetimi** `Tamamlandı`
- [x] **Veritabanı Şeması:** `SiteSettings` modelindeki `category_showcase_hidden` alanı kullanılıyor
- [x] **Admin Paneli - AnaSayfa Sekmesi:** CategoryShowcase için gizleme checkbox'ı eklendi
- [x] **Frontend - Anasayfa:** CategoryShowcase bileşeni SiteSettings verisine göre gösteriliyor/gizleniyor
- [x] **İlgili Dosyalar:** `frontend/components/homepage/CategoryShowcase.tsx`, `frontend/components/admin/HomepageManagement.tsx`

### **Görev 16.6: AnaSayfa Sekmesi - Bestsellers Yönetimi** `Tamamlandı`
- [x] **Veritabanı Şeması:** `SiteSettings` modelindeki `bestsellers_hidden` ve `bestsellers_limit` alanları kullanılıyor (maksimum 6 ürün)
- [x] **Admin Paneli - AnaSayfa Sekmesi:**
  - [x] Bestsellers gizleme checkbox'ı eklendi
  - [x] 1-6 arası ürün sayısı belirleyebilen input eklendi
- [x] **Frontend - Anasayfa:** Bestsellers bileşeni SiteSettings verisine göre gizleniyor ve seçilen limit kadar ürün gösteriyor
- [x] **İlgili Dosyalar:** `frontend/app/page.tsx`, `frontend/components/homepage/Bestsellers.tsx`, `frontend/components/admin/HomepageManagement.tsx`

### **Görev 16.7: AnaSayfa Sekmesi - HomepagePromotionBanner Yönetimi** `Tamamlandı`
- [x] **Veritabanı Şeması:** `SiteSettings` modelindeki `homepage_promotion_banner_desktop_url`, `homepage_promotion_banner_mobile_url`, `homepage_promotion_banner_hidden` alanları kullanılıyor
- [x] **Supabase:** `homepage-promotion-banner-desktop` ve `homepage-promotion-banner-mobil` bucket'ları oluşturuldu, medya galerisi filtrelerine eklendi
- [x] **Admin Paneli - AnaSayfa Sekmesi:**
  - [x] Promosyon banner için desktop ve mobil görsel seçimi yapılabiliyor
  - [x] Promosyon banner gizleme checkbox'ı eklendi
- [x] **Frontend - PromotionBanner:** SiteSettings verisine göre dinamik görseller ve hidden kontrolü sağlandı
- [x] **İlgili Dosyalar:** `frontend/components/homepage/PromotionBanner.tsx`, `frontend/components/admin/HomepageManagement.tsx`, `frontend/app/page.tsx`

### **Görev 16.8: AnaSayfa Sekmesi - Assurance Yönetimi** `Tamamlandı`
- [x] **Veritabanı Şeması:** `SiteSettings.assurance_title`, `assurance_text`, `assurance_hidden`
- [x] **Admin Paneli - AnaSayfa Sekmesi:** Başlık/metin alanı + gizleme checkbox'ı
- [x] **Frontend - Anasayfa:** Assurance bileşeni ayarları dinamik okuyor ve gizlemeyi destekliyor
- [x] **İlgili Dosyalar:** `frontend/components/homepage/Assurance.tsx`, `frontend/components/admin/HomepageManagement.tsx`

### **Görev 16.9: Navbar Sekmesi - Logo Yönetimi** `Tamamlandı`
- [x] **Veritabanı Şeması / Seed:** `SiteSettings.logo_image_url` ve `logo_white_image_url` Supabase `logo` bucket URL’leri ile güncellendi
- [x] **Medya Yönetimi:** `logo` bucket’ı API ve MediaGallery filtrelerine/yükleme seçeneklerine eklendi
- [x] **Admin Paneli - AnaSayfa Sekmesi:** Logo kartı ile navbar/footera özel seçim yapılabiliyor, Supabase’den medya galerisi açılıyor
- [x] **Frontend - Logo:** `Logo` bileşeni site ayarlarını okuyup navbar için renkli, footer için beyaz logoyu dinamik gösteriyor
- [x] **İlgili Dosyalar:** `frontend/components/navbar/Logo.tsx`, `frontend/components/admin/HomepageManagement.tsx`, `frontend/components/admin/MediaGallery.tsx`, `backend/src/api/images/images.controller.ts`, `frontend/next.config.ts`

### **Görev 16.10: Footer Sekmesi - Footer İçerik Yönetimi** `Tamamlandı`
- [x] **Veritabanı / API:** `FooterLink` modeli ve `/api/footer-links` servisi kullanılarak link CRUD akışı aktif edildi, `SiteSettings.footer_copyright_text` & `popular_product_slugs` alanları admin tarafından güncellenebiliyor
- [x] **Admin Paneli - Footer Sekmesi:** Yeni sekme ve `FooterManagement` bileşeni ile Company/Info linkleri ekle-düzenle-sil-sırala, max 9 popüler ürün seç ve telif metni düzenle
- [x] **Frontend - Footer:** Footer bileşeni API’den dinamik linkleri, kategorileri ve popüler ürünleri çekiyor; copyright metni SiteSettings’ten okunuyor
- [x] **İlgili Dosyalar:** `frontend/components/admin/FooterManagement.tsx`, `frontend/app/admin/page.tsx`, `frontend/components/footer/Footer.tsx`, `frontend/types/index.ts`

### **Görev 16.11: Popüler Ürünler – Dinamik Yönetim** `Tamamlandı`
- [x] **Veritabanı Şeması:** `SiteSettings` modeline `popular_product_slugs`, `popular_products_hidden`, `popular_products_limit`, `popular_products_title`, `popular_products_subtitle` alanları eklendi
- [x] **Seed Verileri:** `seed.ts` dosyasına varsayılan popüler ürün slug'ları ve başlık/metin değerleri referans olarak eklendi
- [x] **Admin Paneli - AnaSayfa Sekmesi:**
  - [x] Popüler ürünler için gizleme checkbox'ı, limit input'u (1-12), başlık ve alt başlık düzenleme alanları eklendi
  - [x] Arama yapılabilen ürün seçim modalı oluşturuldu; yüzlerce ürün arasından arama ile seçim yapılabiliyor
  - [x] Seçili ürünler listesi gösteriliyor; ürünler listeden kaldırılabiliyor (sıralama arrow butonları kaldırıldı)
- [x] **Frontend - PopularProducts Bileşeni:** Ana sayfada müşteri yorumlarının üstünde dinamik başlık/metin ve seçili ürünler gösteriliyor; hidden kontrolü mevcut
- [x] **Footer Entegrasyonu:** Footer'daki popüler ürünler aynı `popular_product_slugs` kaynağını kullanıyor; tek bir hidden bayrağı ile yönetiliyor
- [x] **İlgili Dosyalar:** `frontend/components/admin/HomepageManagement.tsx`, `frontend/components/homepage/PopularProducts.tsx`, `frontend/app/page.tsx`, `frontend/components/footer/Footer.tsx`, `backend/prisma/schema.prisma`, `backend/prisma/seed.ts`

### **Görev 16.12: Medya Galerisi – Kategorize Görünüm ve UX İyileştirmesi** `Planlanıyor`
- **Amaç:** Logo, banner, ürün, paket vb. görsellerin karışmasını önlemek ve “Tüm Görseller” görünümünü kullanıcı dostu hale getirmek.
- **Teknik Gereksinimler:**
  - Bucket filtrelerini sekmeli/segmentli yapıya taşımak; kartlarda kategori badge’leri ve renk kodları göstermek.
  - “Tüm Görseller” görünümünde kategori başlıklarıyla gruplanmış veya masonry düzenli grid, isteğe bağlı arama/tag filtreleri ve boş durum tasarımı.
  - Upload formu ve listeleme `packages` bucket’ini de içerecek şekilde güncellenecek; Supabase tarafındaki tüm bucket’ler için yönergeler gösterilecek.
  - Kullanıcı deneyimini iyileştirmek için skeleton/placeholder, hızlı silme, seçili bucket vurgusu gibi etkileşimler eklenecek.

### **Görev 16.13: Paketler Kategorisi ve Sayfaları** `Tamamlandı`
- [x] **Veritabanı Şeması:** `seed.ts` dosyasına "Paketler" kategorisi eklendi (`slug: 'paketler'`, `name: 'Paketler'`)
- [x] **Kategori Görseli:** `category-images` bucket'ine `paketler.webp` görseli referans olarak eklendi
- [x] **Liste Sayfası:** `/paketler` route'u oluşturuldu; mevcut `Product` modeli kullanılarak paketler kategorisindeki ürünler listeleniyor
- [x] **Detay Sayfası:** `/paketler/[slug]` route'u oluşturuldu; paketler kategorisindeki ürünler için özel detay sayfası
- [x] **Navbar Entegrasyonu:** CategoryNavbar ve HeaderMobil'de paketler kategorisi için `/paketler` linki kullanılıyor (özel route)
- [x] **Footer Entegrasyonu:** Footer'daki kategori linklerinde paketler için `/paketler` linki kullanılıyor
- [x] **Breadcrumb:** Paket detay sayfasında breadcrumb'da `/paketler` linki gösteriliyor
- [x] **Admin Paneli - Kategori Filtresi:** ProductManagement component'ine kategori filtresi eklendi; admin paketler kategorisini seçerek sadece paketleri görebilir
- [x] **Otomatik Entegrasyon:** CategoryShowcase'de "Paketler" kategorisi otomatik olarak görünüyor (kategori `showInNavbar: true` ile oluşturuldu)
- [x] **Medya Galerisi:** Paket banner bucket'leri (`packages-banner-desktop`, `packages-banner-mobil`) zaten mevcut
- [x] **İlgili Dosyalar:** 
  - `backend/prisma/seed.ts`
  - `frontend/app/paketler/page.tsx`
  - `frontend/app/paketler/[slug]/page.tsx`
  - `frontend/components/navbar/CategoryNavbar.tsx`
  - `frontend/components/navbar/HeaderMobil.tsx`
  - `frontend/components/footer/Footer.tsx`
  - `frontend/components/product-detail/Breadcrumb.tsx`
  - `frontend/components/admin/ProductManagement.tsx`

**Not:** Paketler için ayrı bir `Package` modeli yerine mevcut `Product` modeli kullanıldı. Paketler, `category.slug === 'paketler'` olan ürünler olarak yönetilecek. Admin panelinden normal ürün ekleme akışıyla paket ürünleri eklenebilir. Admin panelinde kategori filtresi kullanılarak sadece paketler görüntülenebilir.

### **Görev 16.14: Paket Banner Yönetimi (Ana Sayfa)** `Tamamlandı`
- [x] **Veritabanı Şeması:** `SiteSettings` modeline `packages_banner_desktop_url`, `packages_banner_mobile_url`, `packages_banner_hidden` alanları eklendi
- [x] **Seed Verileri:** `seed.ts` dosyasına paket banner görselleri (`paketBanner.webp`) orijinal isimleriyle referans olarak eklendi; `packages-banner-desktop` ve `packages-banner-mobil` bucket'leri için URL'ler SiteSettings'e yazıldı
- [x] **Admin Paneli - AnaSayfa Sekmesi:**
  - [x] Paket Banner yönetimi bölümü eklendi; desktop ve mobile banner seçimi için medya galerisi modalları oluşturuldu
  - [x] Hidden checkbox eklendi
- [x] **Medya Galerisi:** `packages-banner-desktop` ve `packages-banner-mobil` bucket'leri upload ve filter seçeneklerine eklendi; görsel etiketleme yapıldı
- [x] **Backend API:** `images.controller.ts`'de paket banner bucket'leri `ALLOWED_BUCKETS` ve `SPECIAL_BUCKETS` listelerine eklendi (orijinal isimlerle kayıt)
- [x] **Frontend - PackagesBanner Bileşeni:** Yeni `PackagesBanner` bileşeni oluşturuldu; responsive davranış diğer banner bileşenleriyle aynı
- [x] **Next.js Config:** `next.config.ts`'ye paket banner bucket'leri için remote pattern'ler eklendi
- [x] **Ana Sayfa Entegrasyonu:** `page.tsx`'e `PackagesBanner` bileşeni eklendi (şimdilik PopularProducts'tan sonra, ileride paketler bölümünün üstüne taşınacak)
- [x] **İlgili Dosyalar:** `frontend/components/homepage/PackagesBanner.tsx`, `frontend/components/admin/HomepageManagement.tsx`, `frontend/app/page.tsx`, `frontend/components/admin/MediaGallery.tsx`, `backend/src/api/images/images.controller.ts`, `frontend/next.config.ts`, `backend/prisma/schema.prisma`, `backend/prisma/seed.ts`

**Not:** `page.tsx` içindeki "Kullanıcı Profili" bölümü (satır 48), kullanıcı profili oluşturulduktan sonra tamamlanacak.

---

## Faz 17: Kullanıcı Profili, Adres Yönetimi ve Ödeme Sistemi

**Durum:** Planlama Aşaması 📋

Bu faz, kullanıcı profil yönetimi, adres yönetimi, sipariş sistemi ve ödeme entegrasyonunu tamamlamayı hedefler. Mevcut mock data yapıları backend entegrasyonu ile değiştirilecek ve tam işlevsel bir e-ticaret deneyimi sağlanacaktır.

### **Görev 17.1: Kullanıcı Profili Yapılandırması - Backend Entegrasyonu** `Planlanıyor`
- **Amaç:** Kullanıcı profil bilgilerinin (ad, soyad, e-posta) backend'den çekilmesi ve güncellenebilmesi.
- **Teknik Gereksinimler:**
  - [ ] Backend'de `/api/auth/me` GET endpoint'i oluşturulacak (kullanıcı bilgilerini getir)
  - [ ] Backend'de `/api/auth/me` PUT endpoint'i oluşturulacak (kullanıcı bilgilerini güncelle)
  - [ ] Frontend'de `hesabim/page.tsx` sayfası backend API'lerine bağlanacak
  - [ ] Şifre değiştirme özelliği eklenecek (opsiyonel)
  - [ ] Form validasyonu ve hata yönetimi iyileştirilecek
- **İlgili Dosyalar:** 
  - `backend/src/api/auth/auth.controller.ts`
  - `backend/src/api/auth/auth.service.ts`
  - `frontend/app/hesabim/page.tsx`

### **Görev 17.2: Adres Yönetimi - Backend Entegrasyonu** `Planlanıyor`
- **Amaç:** Kullanıcıların adreslerini ekleyebilmesi, düzenleyebilmesi ve silebilmesi.
- **Teknik Gereksinimler:**
  - [ ] Prisma şemasına `Address` modeli eklenecek:
    - `id`, `userId`, `title` (Ev, İş vb.), `firstName`, `lastName`, `phone`, `addressLine1`, `addressLine2`, `city`, `district`, `postalCode`, `isDefault`, `createdAt`, `updatedAt`
  - [ ] Backend'de `/api/addresses` CRUD endpoint'leri oluşturulacak:
    - GET `/api/addresses` - Kullanıcının tüm adreslerini listele
    - POST `/api/addresses` - Yeni adres ekle
    - PUT `/api/addresses/:id` - Adres güncelle
    - DELETE `/api/addresses/:id` - Adres sil
    - PATCH `/api/addresses/:id/set-default` - Varsayılan adres belirle
  - [ ] Frontend'de `hesabim/adreslerim/page.tsx` sayfası backend API'lerine bağlanacak
  - [ ] Adres ekleme/düzenleme formu oluşturulacak
  - [ ] Varsayılan adres seçimi ve görselleştirme eklenecek
- **İlgili Dosyalar:**
  - `backend/prisma/schema.prisma`
  - `backend/src/api/addresses/addresses.controller.ts`
  - `backend/src/api/addresses/addresses.service.ts`
  - `frontend/app/hesabim/adreslerim/page.tsx`

### **Görev 17.3: Sipariş Sistemi - Backend Entegrasyonu** `Planlanıyor`
- **Amaç:** Kullanıcıların siparişlerini görüntüleyebilmesi ve sipariş detaylarını inceleyebilmesi.
- **Teknik Gereksinimler:**
  - [ ] Prisma şemasına `Order` ve `OrderItem` modelleri eklenecek:
    - `Order`: `id`, `userId`, `orderNumber`, `status` (Beklemede, Hazırlanıyor, Kargoda, Teslim Edildi, İptal Edildi), `totalAmount`, `shippingCost`, `taxAmount`, `shippingAddressId`, `billingAddressId`, `paymentMethod`, `paymentStatus`, `notes`, `createdAt`, `updatedAt`
    - `OrderItem`: `id`, `orderId`, `productId`, `variantId`, `quantity`, `unitPrice`, `discountedPrice`, `totalPrice`
  - [ ] Backend'de `/api/orders` endpoint'leri oluşturulacak:
    - GET `/api/orders` - Kullanıcının tüm siparişlerini listele
    - GET `/api/orders/:id` - Sipariş detayını getir
    - POST `/api/orders` - Yeni sipariş oluştur (sepetten)
  - [ ] Frontend'de `hesabim/siparislerim/page.tsx` sayfası backend API'lerine bağlanacak
  - [ ] Sipariş durumu görselleştirmesi (badge'ler, renkler) eklenecek
  - [ ] Sipariş detay sayfası oluşturulacak (`hesabim/siparislerim/[id]/page.tsx`)
- **İlgili Dosyalar:**
  - `backend/prisma/schema.prisma`
  - `backend/src/api/orders/orders.controller.ts`
  - `backend/src/api/orders/orders.service.ts`
  - `frontend/app/hesabim/siparislerim/page.tsx`
  - `frontend/app/hesabim/siparislerim/[id]/page.tsx`

### **Görev 17.4: Sepet İyileştirmeleri ve Ödeme Akışı** `Planlanıyor`
- **Amaç:** Sepet sayfasının iyileştirilmesi ve ödeme sayfasına geçiş akışının oluşturulması.
- **Teknik Gereksinimler:**
  - [ ] Sepet sayfasında KDV hesaplama düzeltmesi (KDV dahil fiyatlar için doğru hesaplama)
  - [ ] Kargo ücreti hesaplama mantığı iyileştirilecek (1500₺ üzeri ücretsiz kargo)
  - [ ] "Ödemeye Geç" butonu `/odeme` sayfasına yönlendirecek
  - [ ] Ödeme sayfası (`/odeme/page.tsx`) oluşturulacak:
    - Adres seçimi (varsayılan adres veya yeni adres ekleme)
    - Sipariş özeti (sepet içeriği, kargo, KDV, toplam)
    - Ödeme yöntemi seçimi (Kredi Kartı, Havale/EFT, Kapıda Ödeme)
    - Sipariş notu ekleme alanı
    - "Siparişi Tamamla" butonu
  - [ ] Ödeme sayfasında form validasyonu eklenecek
  - [ ] Sipariş oluşturma işlemi backend'e bağlanacak
- **İlgili Dosyalar:**
  - `frontend/app/sepet/page.tsx`
  - `frontend/app/odeme/page.tsx`
  - `backend/src/api/orders/orders.service.ts`

### **Görev 17.5: Ödeme Entegrasyonu (İyPay veya Alternatif)** `Planlanıyor`
- **Amaç:** Gerçek ödeme işlemlerinin yapılabilmesi için ödeme gateway entegrasyonu.
- **Teknik Gereksinimler:**
  - [ ] Ödeme gateway seçimi ve araştırması (İyPay, PayTR, Stripe vb.)
  - [ ] Backend'de ödeme gateway API entegrasyonu:
    - Ödeme başlatma endpoint'i
    - Ödeme callback/notification endpoint'i
    - Ödeme durumu sorgulama
  - [ ] Frontend'de ödeme formu entegrasyonu
  - [ ] Ödeme başarılı/başarısız sayfaları (`/odeme/basarili`, `/odeme/basarisiz`)
  - [ ] Sipariş durumu güncelleme (ödeme başarılı olduğunda)
  - [ ] Güvenlik önlemleri (CSRF, rate limiting, input validation)
- **İlgili Dosyalar:**
  - `backend/src/api/payments/payments.controller.ts`
  - `backend/src/api/payments/payments.service.ts`
  - `frontend/app/odeme/page.tsx`
  - `frontend/app/odeme/basarili/page.tsx`
  - `frontend/app/odeme/basarisiz/page.tsx`

### **Görev 17.6: E-posta Bildirimleri** `Planlanıyor`
- **Amaç:** Sipariş onayı, kargo durumu gibi önemli olaylar için e-posta bildirimleri.
- **Teknik Gereksinimler:**
  - [ ] E-posta servisi seçimi ve kurulumu (SendGrid, Resend, Nodemailer vb.)
  - [ ] Backend'de e-posta servisi entegrasyonu
  - [ ] Sipariş oluşturulduğunda onay e-postası gönderme
  - [ ] Sipariş durumu değiştiğinde bildirim e-postası gönderme
  - [ ] E-posta şablonları oluşturma (HTML template'ler)
- **İlgili Dosyalar:**
  - `backend/src/core/services/email.service.ts`
  - `backend/src/api/orders/orders.service.ts`

---

## Future Tasks / Araştırma Notları

1. **Bestsellers – Hibrit Seçim Altyapısı (Planlanıyor)**
   - **Amaç:** Satış verilerine göre otomatik olarak oluşan çok satanlar listesini, admin panelinden manuel olarak override edilebilir hale getirmek (Faz 16’dan sonra uygulanacak).
   - **Teknik Gereksinimler:**
     - Sipariş ve sipariş kalemi verilerini saklayan `Order` / `OrderItem` tabloları ile her ürünün son X gündeki satış adedini periyodik olarak hesaplayan bir job veya materialized view.
     - Bu hesaplanan skorları saklayacak bir `ProductSalesStats` tablosu (ör. `productId`, `period`, `salesCount`, `updatedAt`).
     - Admin panelinde “Bestsellers Yönetimi” bölümüne manuel seçim için ürün listesi + sıralama alanı (örn. `SiteSettings.popular_product_slugs` veya yeni bir `FeaturedProduct` tablosu).
     - Frontend’de Bestsellers bileşeni, önce admin override listesini (varsa) kullandıktan sonra kalan slotları otomatik hesaplanan skorlarla dolduracak.
   - **Ek Notlar:** Bu hibrit yapı, gerçek satış performansına dayalı önerileri muhafaza ederken pazarlama ekibinin kampanya ürünlerini öne çıkarmasına izin verir.

2. **Supabase Bucket Hazırlığı (Gelecek Görevler)**
   - `homepage-promotion-banner-desktop`
   - `homepage-promotion-banner-mobil`
   - Yukarıdaki bucket isimleri, Faz 16.7 kapsamında kullanılmak üzere rezerve edildi; ilgili görevde bu adlar kullanılmalıdır.

