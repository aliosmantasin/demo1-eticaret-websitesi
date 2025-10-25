# Öğrenme Süreci Günlüğü

Bu doküman, proje geliştirme sürecinde öğrenilen konuları, karşılaşılan zorlukları ve çözümleri takip etmek için kullanılır.

## 1. Kurulum Aşaması

- **[x] Docker Desktop Kurulumu ve Temel Kavramlar:**
    - **Öğrenildi mi?** Evet (Kurulum tamamlandı).
    - **Notlar:** Proje servislerini izole ortamlarda (konteyner) çalıştırmak için gerekli olan Docker platformunun kurulumu. Temel kavramlar: Image, Container, Volume, Network, Dockerfile, Docker Compose. Bu kavramlar proje ilerledikçe pratik olarak pekiştirilecektir.
- **[x] PostgreSQL Konteynerinin Oluşturulması:**
    - **Öğrenildi mi?** Evet (Yapılandırma tamamlandı).
    - **Notlar:** `docker-compose.yml` dosyası içinde PostgreSQL servisi tanımlandı. Verilerin kalıcı olması için bir `volume` bağlandı. Ortam değişkenleri (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) ile veritabanı ayarları yapıldı.
- **[x] Backend (Express.js) Dockerizasyonu:**
    - **Öğrenildi mi?** Evet (Temel yapı tamamlandı).
    - **Notlar:** `backend` uygulaması için bir `Dockerfile` oluşturuldu. Bu dosya, Node.js ortamını kuracak, bağımlılıkları (`pnpm install`) yükleyecek ve uygulamayı başlatacak adımları içerir. Temel `package.json`, `tsconfig.json` ve `src/index.ts` dosyaları oluşturuldu.
- **[x] Frontend (Next.js) Dockerizasyonu:**
    - **Öğrenildi mi?** Evet (Temel yapı tamamlandı).
    - **Notlar:** `pnpm create next-app` komutu ile `frontend` klasörü içine TypeScript ve Tailwind CSS destekli bir Next.js projesi oluşturuldu. Backend'e benzer şekilde, uygulamayı Docker imajı haline getiren bir `Dockerfile` eklendi.
- **[x] Artık Konteynerlerin ve Kaynakların Temizlenmesi:**
    - **Öğrenildi mi?** Evet.
    - **Notlar:** Geliştirme sürecinde eski denemelerden kalan ve `Exited` durumunda olan konteynerlerin (`eloquent_napier` gibi) birikmesi normaldir. `docker system prune` komutu, bu tür durdurulmuş konteynerleri, kullanılmayan ağları ve boştaki imajları silerek Docker ortamını temizler ve disk alanı kazandırır. Bu işlemin periyodik olarak yapılması iyi bir alışkanlıktır.
- **[x] Docker'da Geliştirme ve Üretim Modu Ayrımı:**
    - **Öğrenildi mi?** Evet.
    - **Notlar:** Docker ile geliştirme yaparken, kod değişikliklerinin anında yansıması için `volumes` kullanılır. Bu, yerel makinedeki kod klasörünü konteyner içindeki klasörle senkronize eder. Ayrıca, geliştirme sunucusunu (`pnpm dev`) çalıştırmak için `command` anahtar kelimesi ile `Dockerfile`'daki varsayılan komut ezilir. Üretim ortamında ise `volumes` kullanılmaz ve `pnpm start` ile optimize edilmiş kod çalıştırılır.
- **[x] Prisma Migration ve Veritabanı Senkronizasyonu:**
    - **Öğrenildi mi?** Evet.
    - **Notlar:** `prisma migrate dev` komutu, `schema.prisma` dosyasındaki modellere bakarak veritabanında gerekli tabloları oluşturur veya günceller. Bu komut ayrıca `@prisma/client`'ı üreten `prisma generate`'i de tetikler. `Dockerfile`'daki `node:18-alpine` gibi minimal imajlar bazen Prisma'nın motoruyla uyumsuzluk yaşayabilir; `node:18` gibi standart bir imaja geçmek bu tür sorunları çözebilir.
- **[x] Konteynerler Arası İletişim:**
    - **Öğrenildi mi?** Evet.
    - **Notlar:** Docker ağındaki konteynerler, birbirleriyle `localhost` üzerinden değil, servis adları üzerinden iletişim kurar. Örneğin, `frontend` konteyneri, backend API'sine `http://localhost:5001` adresinden değil, `http://backend:5000` adresinden erişir (`backend` servis adı, `5000` konteynerin iç portu).
- **[x] Hatalı `volume` Tanımının Etkisi (`Module not found` Hatası):**
    - **Öğrenildi mi?** Evet.
    - **Notlar:** `docker-compose.yml` dosyasında `volumes: [ "- /usr/src/app/node_modules" ]` gibi isimsiz bir volume tanımı yapmak, `build` sırasında oluşturulan `node_modules` klasörünün, konteyner çalıştırıldığında boş bir klasörle ezilmesine neden olur. Bu durum, kodun `import` ettiği paketleri bulamamasına ve "Module not found" hatası vermesine yol açar. **Çözüm, bu hatalı volume tanımını kaldırmaktır.**
- **[x] `pnpm` Depo Yolu Hatası (`Unexpected store`):**
    - **Öğrenildi mi?** Evet.
    - **Notlar:** `pnpm`'in global ve proje içi depoları arasında bir çakışma yaşandığında "Unexpected store location" hatası alınabilir. Kalıcı çözüm, projenin ana dizinine `.npmrc` adında bir dosya oluşturup içine `store-dir=.pnpm-store` yazmaktır. Bu, `pnpm`'i her zaman proje içindeki depoyu kullanmaya zorlar.
- **[x] Türkçe Karakter ve Docker `gRPC` Hatası:**
    - **Öğrenildi mi?** Evet.
    - **Notlar:** Proje klasör yolunda bulunan Türkçe karakterler (`ı`, `ş` vb.), Docker'ın dahili iletişim protokolünde (gRPC) hatalara neden olabilir ve `docker-compose`'un çalışmasını engelleyebilir. **Çözüm, projenin ana klasör adını ve yolunu sadece ASCII karakterler içerecek şekilde değiştirmektir.**

## 2. Backend Geliştirme

- **[x] Express.js Temelleri (Controller Katmanı):**
    - **Öğrenildi mi?** Evet.
    - **Tekrar Edilecekler:** `express.Router()`, `router.get()`, `router.post()`, `req` (istek) objesinin ne taşıdığı (`req.body`, `req.params`), `res` (cevap) objesiyle nasıl yanıt dönüldüğü (`res.json()`, `res.status()`), `next` (hata yönetimi) fonksiyonu.
- **[x] Servis Katmanı Mimarisi (Service Katmanı):**
    - **Öğrenildi mi?** Evet.
    - **Tekrar Edilecekler:** Controller'ın neden sadece istekleri karşılayıp doğrulaması gerektiği, asıl iş mantığının (business logic) neden Servis katmanında yer aldığı. Bu ayrımın kodun okunabilirliğini ve test edilebilirliğini nasıl artırdığı.
- **[x] Prisma ORM Kullanımı (Veritabanı Etkileşimi):**
    - **Öğrenildi mi?** Evet.
    - **Tekrar Edilecekler:** `PrismaClient`'ın ne olduğu, `prisma.[model].[işlem]` yapısı. Özellikle `create`, `findUnique`, `findMany`, `update`, `delete` gibi temel CRUD operasyonlarının nasıl çalıştığı.
- **[x] Veri Doğrulama (Zod):**
    - **Öğrenildi mi?** Evet.
    - **Tekrar Edilecekler:** Gelen verinin güvenli olduğundan emin olmak için neden doğrulama yapılması gerektiği. `zod` ile temel şemaların (`string`, `email`, `min`) nasıl oluşturulduğu ve `schema.parse()` ile verinin nasıl doğrulandığı.
- **[x] Güvenlik Temelleri (bcryptjs):**
    - **Öğrenildi mi?** Evet.
    - **Tekrar Edilecekler:** Şifrelerin neden asla veritabanına açık metin olarak kaydedilmemesi gerektiği. "Hashing" kavramının ne olduğu ve `bcrypt.hash()` ile şifrelerin nasıl güvenli hale getirildiği.
- **[x] API Testi (Postman / .http dosyası):**
    - **Öğrenildi mi?** Evet.
    - **Notlar:** API endpoint'lerinin doğru çalışıp çalışmadığını test etmek için Postman gibi araçlar veya VS Code için REST Client eklentisi kullanılır. Bu araçlar, belirli bir adrese (`http://localhost:5001/api/auth/register`), belirli bir metotla (`POST`) ve belirli bir `body` (JSON verisi) ile istek göndermemizi sağlar. Dönen yanıtın durum kodunu (`201 Created`, `400 Bad Request` vb.) ve içeriğini kontrol ederek kodumuzun beklendiği gibi çalıştığını doğrularız.
- **[x] Veritabanını Tamamen Sıfırlama:**
    - **Öğrenildi mi?** Evet.
    - **Notlar:** Temel şema değişiklikleri (örn: ID tipini `String`'den `Int`'e çevirmek) gibi durumlarda veritabanını sıfırlamak en temiz yöntemdir. Adımlar: `rm -rf prisma/migrations` (geçmişi sil), `docker-compose down -v` (konteynerleri ve volume'ü sil), `docker-compose up -d` (yeniden başlat), `pnpm prisma migrate dev` (yeni şemayı kur). `docker-compose down -v` komutu verileri kalıcı olarak siler.

## 3. Veritabanı Yönetimi (Prisma)

- **[x] Prisma ORM'nin Rolü:**
  - **Öğrenildi mi?** Evet.
  - **Notlar:** Prisma, TypeScript kodumuz ile PostgreSQL veritabanı arasında bir "tercüman" görevi görür. Bizim yazdığımız `prisma.product.findMany()` gibi komutları, veritabanının anladığı `SELECT * FROM "Product";` gibi SQL sorgularına çevirir. Bu, karmaşık SQL yazma zorunluluğunu ortadan kaldırır.
- **[x] `prisma/schema.prisma` Dosyası:**
  - **Öğrenildi mi?** Evet.
  - **Notlar:** Veritabanımızın ana planıdır. `User`, `Product`, `Category` gibi modeller (tablolar) ve bunların alanları (sütunları) burada tanımlanır. Veritabanı yapısındaki "tek doğru kaynak" bu dosyadır.
- **[x] `prisma/migrations` Klasörü:**
  - **Öğrenildi mi?** Evet.
  - **Notlar:** Veritabanının versiyon geçmişini tutar. `schema.prisma`'da yapılan her değişiklik sonrası çalıştırılan `pnpm prisma migrate dev` komutu, değişiklikleri uygulayacak SQL kodlarını bu klasörde yeni bir dosya olarak oluşturur. Bu, veritabanı şemasının kod ile senkronize kalmasını sağlayan bir versiyon kontrol sistemidir.
- **[x] `prisma/seed.ts` Dosyası (Tohumlama):**
  - **Öğrenildi mi?** Evet.
  - **Notlar:** Boş bir veritabanını başlangıç verileriyle doldurmak için kullanılan bir script'tir. Proje ilk kurulduğunda veya sıfırlandığında, uygulamayı test edebilmek için gerekli olan örnek ürün, kategori gibi verileri otomatik olarak ekler.

## 4. Frontend Geliştirme

*Bu bölüme frontend ile ilgili öğrenilen konular eklenecektir.*
