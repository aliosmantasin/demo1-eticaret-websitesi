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

## 3. Monorepo Mimarisi (pnpm)

- **[x] `pnpm workspace` ve `node_modules` Yapısı:**
    - **Öğrenildi mi?** Evet.
    - **Notlar:** `pnpm`, monorepo projelerinde verimlilik için akıllı bir `node_modules` yapısı kullanır. Kök dizindeki `node_modules` klasörü, tüm alt projelerin (`frontend`, `backend`) bağımlılıklarının **fiziksel kopyalarını** barındıran ana depodur. Alt proje klasörleri (`frontend/node_modules`) içinde ise paketlerin gerçek kopyaları bulunmaz; bunun yerine kök dizindeki ana depoya yönlendiren **sembolik linkler (kısayollar)** bulunur. Bu, diskten tasarruf sağlar ve kurulumları hızlandırır.
- **[x] Kök `package.json`'ın Rolü ("Orkestra Şefi"):**
    - **Öğrenildi mi?** Evet.
    - **Notlar:** Projenin kök dizinindeki `package.json` dosyası, tüm projeyi yöneten merkezi komutları içerir. `pnpm --filter <klasör>` sözdizimi, komutun hangi alt projede çalışacağını belirtir. Örneğin, `pnpm dev` komutu hem `backend` hem de `frontend`'in `dev` script'lerini aynı anda çalıştırır.
- **[x] `.npmrc` ve `store-dir` Yapılandırması:**
    - **Öğrenildi mi?** Evet.
    - **Notlar:** `.npmrc` dosyası, `pnpm`'in davranışlarını yapılandırır. `store-dir=.pnpm-store` ayarı, `pnpm`'e bağımlılıkları bilgisayarın genel bir deposuna değil, projenin kök dizininde oluşturulacak olan `.pnpm-store` klasörüne indirmesini söyler. Bu, "Unexpected store location" hatasını çözer ve projenin taşınabilirliğini ve tutarlılığını artırır.

## 4. Frontend Geliştirme

*Bu bölüme frontend ile ilgili öğrenilen konular eklenecektir.*

### Geliştirilecek Alanlar ve Odak Konuları

-   **Component'ler Arası Veri Aktarımı (Props):**
    -   **Durum:** Bir parent component'ten child component'e veri (`props`) aktarma mantığı henüz tam oturmadı. Özellikle birden fazla seviyede (parent -> child -> grandchild) veri aktarımının (prop drilling) ne zaman sorun olabileceği ve bu durumu yönetme stratejileri (Context API, State Management) pratikle pekiştirilmeli.
    -   **Hedef:** Bir component'in ihtiyaç duyduğu veriyi nasıl ve nereden alması gerektiğine sezgisel olarak karar verebilmek. `Bestsellers` component'ine `products` listesinin nasıl aktarıldığını ve `ProductCard`'ın bu listeden tek bir `product`'ı nasıl aldığını tekrar incelemek.

-   **Koşullu Render (Conditional Rendering) Mantığı:**
    -   **Durum:** JavaScript operatörleri (üçlü operatör `? :`, mantıksal AND `&&`) kullanarak JSX içinde dinamik olarak bir şeyi gösterme veya gizleme konusunda pratik eksikliği var. Örneğin, bir üründe indirim varsa indirimli fiyatı, yoksa normal fiyatı gösterme gibi senaryoları koda dökmekte zorlanılıyor.
    -   **Hedef:** Verinin durumuna göre farklı UI elemanları gösterme mantığını kavramak. `ProductCard` bileşenindeki `hasDiscount` kontrolü ve buna bağlı olarak farklı fiyatların nasıl render edildiği gibi örnekleri analiz ederek bu yapıları kendi başına kurabilme yeteneği kazanmak.

## Postman Koleksiyonunu Anlamak ve Kullanmak

Projemizin yol haritasını ve teknik gereksinimlerini anlamak için bize bir Postman koleksiyonu verildi. Bu koleksiyon, backend API'mız için bir kılavuz niteliğindedir.

- **Postman URL'i:** `https://import.cdn.thinkific.com/871167/BkNjMszqTVOpBOi1vMiV_OJS%20Nutrition.postman_collection.json`

### Bu Koleksiyon Ne İşe Yarar?

Bu koleksiyon, projemizin backend'i için bir "teknik şartname" gibidir. Bize aşağıdaki bilgileri verir:

1.  **API Endpoints (Uç Noktalar):** Hangi URL'lerin ne işe yaradığını gösterir. Örnek:
    *   `GET /api/v1/products`: Tüm ürünleri listeler.
    *   `POST /api/v1/auth/register`: Yeni bir kullanıcı kaydeder.
    *   `POST /api/v1/users/cart`: Kullanıcının sepetine ürün ekler.

2.  **Veri Yapıları (Data Structures):** Bir ürünün hangi alanları içerdiğini (`name`, `price_info`, `photo_src` vb.), bir kullanıcı kaydının nasıl olması gerektiğini (`email`, `password`, `first_name` vb.) net bir şekilde tanımlar.

3.  **İstek ve Cevap Formatları:** API'ye hangi formatta veri göndermemiz (Request Body) ve API'den hangi formatta bir cevap beklememiz (Response) gerektiğini belirtir.

### Bu Bilgilerle Neler Yapabiliriz?

1.  **Veritabanı Şemasını Şekillendirme:** Postman'deki ürün, kategori, kullanıcı gibi veri yapılarına bakarak `backend/prisma/schema.prisma` dosyamızı doğru bir şekilde oluşturabilir ve güncelleyebiliriz. Ürün görsellerinin tam URL'lerini bu koleksiyondan alarak `seed.ts` dosyamızı düzelttik.

2.  **Backend API Geliştirme:** `backend/src/api` klasörümüzdeki controller ve service dosyalarını bu kılavuza göre yazabiliriz. Örneğin, `products.service.ts` içinde kategoriye göre filtreleme yapmamız gerektiğini bu koleksiyondan anlıyoruz.

3.  **Frontend-Backend Entegrasyonu:** `frontend`'de bir API isteği yapacağımız zaman (örneğin ürünleri çekerken), hangi URL'ye istek atacağımızı ve gelen verinin hangi alanları içereceğini bu koleksiyona bakarak biliriz.

4.  **Yol Haritası Çıkarma:** Bu koleksiyon, projenin sadece mevcut ürün listeleme özelliğini değil, aynı zamanda **Kullanıcı Girişi**, **Sepet İşlemleri** ve **Sipariş Verme** gibi gelecekteki özelliklerini de tanımlıyor. Bu da bize projenin geri kalanı için net bir yol haritası sunuyor.
