# Sorun Giderme Kılavuzu

Bu doküman, proje geliştirme sürecinde karşılaşılan önemli ve inatçı sorunları, nedenlerini ve çözüm adımlarını içerir.

## Kısır Döngü: Docker Build Hatası ve Veri Gelmeme Sorunu (Ekim 2025)

Projenin Docker üzerinde çalıştırılmaya çalışıldığı sırada, saatler süren ve kendini tekrar eden bir dizi sorunla karşılaşıldı. Ana sorunlar iki başlıkta toplanabilir: `frontend`'in derlenememesi (build hatası) ve `backend`'den veri çekilememesi.

### Problem 1: İnatçı Docker Build Hatası

- **Hata Belirtisi:** `docker-compose up` veya `docker-compose build` komutları çalıştırıldığında, `frontend` servisi `Type error: Type '{ params: { slug: string; }; }' does not satisfy the constraint 'PageProps'.` gibi bir TypeScript tip hatası vererek derlenemiyordu.
- **Neden:**
    1.  **Asıl Neden:** `frontend/app/kategori/[slug]/page.tsx` dosyasındaki sayfa bileşeninin tip tanımı, Next.js'in beklediği standart yapıya uymuyordu.
    2.  **Kısır Döngünün Sebebi:** Kodu defalarca düzeltmemize rağmen, Docker'ın katmanlı önbellek (build cache) mekanizması, dosyanın eski ve hatalı bir versiyonunu inatla kullanmaya devam etti. Bu yüzden yaptığımız düzeltmeler build sürecine yansımadı.
- **Çözüm Adımları:**
    1.  **İzolasyon:** Sorunun Docker önbelleğinden kaynaklandığından şüphelenildiği için, Docker'ı denklemden çıkarmak amacıyla bir "hibrit model" denendi (`frontend` yerelde, `backend` Docker'da).
    2.  **Temizlik:** `frontend` klasöründeki tüm bağımlılıklar ve build artıkları `rm -rf frontend/node_modules frontend/.next frontend/pnpm-lock.yaml` komutuyla tamamen silindi.
    3.  **Taze Kurulum:** `pnpm --filter frontend install` ile bağımlılıklar sıfırdan kuruldu.
    4.  **Doğrulama:** `pnpm --filter frontend dev` komutuyla `frontend` yerelde çalıştırıldığında, anasayfanın başarıyla açıldığı ve build hatasının çözüldüğü teyit edildi.

### Problem 2: Veritabanı ve Kod Arasındaki Senkronizasyon Kaybı

- **Hata Belirtisi:** Build sorunu çözüldükten sonra bile `frontend`'e veriler gelmiyordu. `docker-compose logs backend` komutuyla `backend` logları incelendiğinde `The column 'Product.isBestseller' does not exist in the current database.` hatası görüldü.
- **Neden:**
    1.  `backend/prisma/schema.prisma` dosyasında `Product` ve `Category` modellerine `isBestseller` ve `slug` gibi yeni alanlar eklenmişti.
    2.  Ancak bu şema değişiklikleri, veritabanının kendisine hiç uygulanmamıştı ("migration" işlemi yapılmamıştı).
    3.  Kod, veritabanından `isBestseller` kolonunu okumaya çalıştığında, veritabanında böyle bir kolon olmadığı için `backend` çöküyordu.
- **Çözüm Adımları:**
    1.  **Teşhis:** `docker-compose logs backend` ile sorunun tam kaynağı bulundu.
    2.  **Veritabanı Sıfırlama:** Önceki denemelerden kalma eski ve uyumsuz veriler migration işlemini engellediği için, `docker-compose down && docker volume rm ...` komutlarıyla veritabanı volume'ü tamamen silinerek temiz bir başlangıç yapıldı.
    3.  **Şemayı Uygulama:** Temiz veritabanı oluşturulduktan sonra, `docker-compose exec backend pnpm prisma db push` komutu çalıştırıldı. Bu komut, `schema.prisma` dosyasındaki en güncel şemayı okuyup, veritabanını bu şemayla birebir aynı hale getirdi.
    4.  **Verileri Doldurma:** Son olarak, `docker-compose exec backend pnpm prisma db seed` komutu çalıştırılarak, senkronize edilmiş ve artık doğru kolonları içeren veritabanı, ürün ve kategori verileriyle başarıyla dolduruldu.

### Problem 3: Kırık Görseller

- **Hata Belirtisi:** Veriler gelmeye başladı ancak ürün görselleri görünmüyordu.
- **Neden:** `prisma/seed.ts` dosyasında, imajlar için `/assets/products/...` gibi yerel yollar tanımlanmıştı. Bu dosyalar fiziksel olarak projede olmadığı için tarayıcı resimleri bulamadı.
- **Çözüm:** `seed.ts` dosyası, Postman koleksiyonunda belirtilen `https://fe1111.projects.academy.onlyjs.com/media/...` formatındaki tam ve ulaşılabilir URL'ler ile güncellendi ve `db seed` komutu tekrar çalıştırıldı.

### Problem 4: Next.js 15 Asenkron `params` Hatası

- **Hata Belirtisi:** Hibrit geliştirme modeline geçtikten sonra, `frontend`'in lokal sunucusu çalışmasına rağmen, dinamik sayfalara (`/urun/[slug]`, `/kategori/[slug]`) girildiğinde terminalde `Error: Route ... used params.slug. params should be awaited before using its properties.` hatası alınıyordu.
- **Neden:** Next.js'in 15. versiyonu ile birlikte, sayfa bileşenlerine gelen `params` ve `searchParams` objeleri artık senkron (doğrudan erişilebilir) objeler değil, **asenkron `Promise`'lerdir**. Bu, Next.js'in render optimizasyonları için yaptığı bir değişikliktir. Bizim kodumuz ise, `params` objesini `await` ile beklemeden doğrudan içindeki `slug`'a erişmeye çalışıyordu.
- **Çözüm:**
    1.  **Teşhis:** Hata mesajındaki `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis` linki incelenerek sorunun kaynağının Next.js 15 değişikliği olduğu anlaşıldı.
    2.  **Kod Düzeltmesi:** İlgili tüm sayfa bileşenlerinde (`urun/[slug]/page.tsx` ve `kategori/[slug]/page.tsx`), `params` objesini kullanmadan önce `await` anahtar kelimesi ile "çözülmesi" sağlandı.

        ```typescript
        // ESKİ HATALI KOD
        // export default async function Page({ params: { slug } }) { ... }

        // YENİ VE DOĞRU KOD
        export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
            const { slug } = await params;
            // ...
        }
        ```

## Sorun: ProductReviews Prop Uyumsuzluğu (Kasım 2025)

- **Hata Belirtisi:** Vercel build sırasında `ProductReviews` bileşenine `reviews` prop’u geçtiğimiz için `Property 'reviews' does not exist on type 'ProductReviewsProps'` tip hatasıyla build duruyordu.
- **Neden:** Bileşen yalnızca `productId` bekleyecek şekilde bırakılmış, ancak sayfa seviyesinde SSR ile çekilen `product.reviews` verisi de gönderilmeye devam ediyordu. Bu yarım kalan yapılandırma hem tip uyuşmazlığına hem de komponentin önceden yüklenen veriden yararlanamamasına yol açtı.
- **Çözüm Adımları:**
    1. Bileşene `initialReviews` adında opsiyonel bir prop eklendi ve state başlangıç değeri bu prop’tan beslenecek hale getirildi; ilk render’da veri varsa `loading` göstergesi kapalı kalıyor.
    2. Yorumlar yine de güncel kalsın diye `fetchReviews` fonksiyonu `useCallback` ile tanımlanıp `useEffect` içinde tetiklendi; form gönderimleri aynı fonksiyonu yeniden kullanıyor.
    3. `app/urun/[slug]/page.tsx` ve `app/paketler/[slug]/page.tsx` dosyalarında `ProductReviews` çağrıları `initialReviews={product.reviews}` şeklinde güncellendi.

## Sorun: ProductReviews Kullanıcı Verisi Şekil Uyumsuzluğu (Kasım 2025)

- **Hata Belirtisi:** Vercel build’i `ProductReviews.tsx` içinde `user.firstName` alanına erişilmeye çalışıldığı, fakat tipte yalnızca `name` tanımlı olduğu için `Property 'firstName' does not exist on type '{ name: string; }'` hatası veriyordu.
- **Neden:** Backend’den dönen yorum verisi bazı yerlerde sadece `name` içeriyor, bazı yerlerde `firstName/lastName` kombinasyonu bekleniyor. TypeScript tipi ve UI mantığı bu iki senaryoyu kapsamadığı için derleme düşüyordu.
- **Çözüm Adımları:**
    1. `frontend/types/index.ts` içindeki `Review.user` tanımı `name?`, `firstName?`, `lastName?` alanlarını opsiyonel olacak şekilde genişletildi.
    2. `ProductReviews` bileşenindeki `getUserInitials` fonksiyonu her iki veri şeklini destekleyecek şekilde güncellendi; isim yoksa varsayılan “A” gösteriyor.
    3. Kullanıcı adını yazan kısım, önce `firstName/lastName`, yoksa `name` değeriyle render edilecek şekilde düzenlendi.

## Not: ProductReviews Bileşeninin Geçici Olarak Devre Dışı Bırakılması (Kasım 2025)

- **Durum:** Backend tarafında yorum servisi ve veritabanı henüz hazır olmadığı için `ProductReviews` bileşeni uygulamada kullanılmıyordu. Buna rağmen sayfa seviyesinde import edilip render edildiğinden build süreci gereksiz tip/derleme hatalarıyla kesiliyordu.
- **Aksiyon:** `app/urun/[slug]/page.tsx` ve `app/paketler/[slug]/page.tsx` dosyalarından `ProductReviews` import’u ve render blokları kaldırıldı. Bileşen dosyası projede tutuluyor; backend tamamlandığında yeniden entegre edilecek.



## Sorun: API URL Tutarsızlığı (IDE vs. Docker Modu) (Kasım 2025)

Proje hem Docker konteynerleri üzerinden hem de doğrudan IDE'de (örn. `pnpm run dev`) çalıştırılacak şekilde tasarlanmıştır. Ancak, bu iki ortamda `frontend`'in `backend` API'sine hangi adresten ulaşacağı konusunda bir tutarsızlık yaşanmıştır.

### Problem: `fetch` Hataları ve Veri Gelmeme

- **Hata Belirtisi:**
    - **Docker Modu:** Frontend konteyneri içindeki Sunucu Tarafı Render (SSR) işlemi, `backend`'e `http://localhost:5001` adresinden ulaşmaya çalıştığında başarısız oluyordu, çünkü konteynerler birbirleriyle `localhost` üzerinden konuşamazlar.
    - **IDE Modu:** `.env.local` dosyasındaki yanlış veya eksik yapılandırma nedeniyle, IDE'de çalışan `frontend` de `backend`'e doğru adresten istek atamıyordu.

- **Neden:**
    1.  **Çalışma Ortamı Farklılığı:** Bir kod parçasının çalıştığı yer (tarayıcı, ana makinedeki Node.js sunucusu, konteyner içindeki Node.js sunucusu) API'ye nasıl erişeceğini değiştirir.
    2.  **Tek Yönlü Çözüm:** Daha önceki çözümler (`host.docker.internal` gibi) sadece senaryolardan birini çözüyor, diğerini bozuyordu. Tüm senaryoları (Tarayıcı, IDE-SSR, Docker-SSR) kapsayan birleşik bir mantık eksikti.

- **Çözüm Adımları:**
    1.  **Birleşik Mantık Geliştirme:** `frontend`'deki tüm veri çekme (`fetch`) işlemleri standartlaştırıldı. Kod, `typeof window === 'undefined'` kontrolü ile sunucu tarafında mı yoksa tarayıcıda mı çalıştığını anlar.
        - Sunucu tarafındaysa (SSR), `INTERNAL_API_URL` ortam değişkenini kullanır.
        - Tarayıcı tarafındaysa, `NEXT_PUBLIC_API_URL` ortam değişkenini kullanır.
    2.  **Docker Yapılandırması (`docker-compose.yml`):** `frontend` servisi için ortam değişkenleri doğru şekilde ayarlandı:
        - `NEXT_PUBLIC_API_URL=http://localhost:5001` (Tarayıcı ana makinede olduğu için `localhost` kullanır)
        - `INTERNAL_API_URL=http://backend:5001` (Konteynerler birbirleriyle servis adları üzerinden konuşur)
    3.  **IDE Yapılandırması (`frontend/.env.local`):** IDE'de çalışmayı sağlamak için bu dosya oluşturuldu ve her iki değişken de `localhost`'a yönlendirildi:
        - `NEXT_PUBLIC_API_URL=http://localhost:5001`
        - `INTERNAL_API_URL=http://localhost:5001`
    4.  **Uygulama:** Bu standart mantık projedeki tüm sayfalara (`/`, `/urun/[slug]`, `/kategori/[slug]`, `/giris-yap`) uygulandı ve sorun kalıcı olarak çözüldü.



## Sorun: Prisma Migration Hatası ve Port Çakışması (Kasım 2025)

Veritabanı şemasına ürün varyantları eklendikten sonra, bu değişiklikleri veritabanına uygulamak için `pnpm prisma migrate dev` komutu çalıştırıldığında inatçı bir erişim hatasıyla karşılaşıldı.

### Problem: `P1010: User 'admin' was denied access` Hatası

- **Hata Belirtisi:**
    - `docker exec` üzerinden çalıştırıldığında komut, interaktif bir ortam olmadığı için başarısız oldu.
    - Bunun üzerine komut, interaktif olan yerel makine terminalinden çalıştırıldı.
    - Bu sefer de `backend/.env` dosyasındaki `DATABASE_URL`'in doğru olmasına ve hatta Docker veritabanı volume'ünün (`docker volume rm ...`) tamamen sıfırlanmasına rağmen, komut sürekli olarak `P1010: User 'admin' was denied access on the database 'ecom_db.public'` hatası verdi.

- **Neden (Asıl Kök Neden):**
    1.  **Port Çakışması:** Sorunun asıl kaynağı, geliştirme makinesinde (Docker dışında) çalışan ve `5432` portunu zaten kullanan başka bir PostgreSQL sunucusunun olmasıydı.
    2.  **Yanlış Hedef:** `pnpm prisma migrate dev` komutu `localhost:5432`'ye bağlanmaya çalıştığında, Docker'daki veritabanımıza değil, bu diğer yerel veritabanına bağlanıyordu. O veritabanının kimlik bilgileri farklı olduğu için de "erişim reddedildi" hatası alınıyordu.
    3.  **Yanlış Yönlendiren Çözüm Denemeleri:** Veritabanı şifresini kontrol etmek veya Docker volume'ünü sıfırlamak gibi denemeler, komutumuz en başından beri yanlış veritabanını hedeflediği için işe yaramadı.

- **Çözüm Adımları:**
    1.  **Teşhis:** Diğer tüm çözümlerin başarısız olması, sorunun bir port çakışması olduğu teşhisini kesinleştirdi.
    2.  **Port Değişikliği:** Çakışmayı önlemek için, Docker'daki veritabanının dış dünyaya açılan portu değiştirildi. `docker-compose.yml` dosyasında `postgres` servisinin `ports` ayarı `"5432:5432"`'den `"5433:5432"`'ye güncellendi. Bu, "bilgisayarın 5433 portuna gelen istekleri, konteynerin 5432 portuna yönlendir" anlamına gelir.
    3.  **Bağlantı URL'sini Güncelleme:** `backend/.env` dosyasındaki `DATABASE_URL`, yeni portu yansıtacak şekilde `...localhost:5433...` olarak güncellendi.
    4.  **Yeniden Başlatma ve Uygulama:** `docker-compose up -d` komutuyla servisler yeni port ayarıyla yeniden başlatıldı. Bu adımdan sonra, `pnpm prisma migrate dev` komutu `localhost:5433` üzerinden doğru veritabanına başarıyla bağlandı ve migration işlemi tamamlandı.



## Sorun: Vercel Deploy Sonrası Ürünler ve Veriler Görünmüyor (Kasım 2025)

### Problem: Canlı Sitede Veri Görünmeme

- **Hata Belirtisi:**
    - Local'de çalışan site normal görünüyor (ürünler, kategoriler, bestseller'lar görünüyor)
    - GitHub'a push edip Vercel'de deploy edildikten sonra canlı sitede ürünler, kategoriler ve diğer veriler görünmüyor
    - Sadece statik içerikler (örneğin "Gerçek Müşteri Yorumları" bölümü) görünüyor

- **Neden:**
    1.  **Eksik Environment Variable:** Vercel'de sadece `NEXT_PUBLIC_API_URL` tanımlıydı, ancak `INTERNAL_API_URL` tanımlı değildi.
    2.  **SSR Veri Çekme Sorunu:** Next.js'in Server-Side Rendering (SSR) özelliği kullanılarak sayfalar oluşturulurken, `page.tsx` dosyalarındaki `getProducts()`, `getProduct()` gibi fonksiyonlar `INTERNAL_API_URL` environment variable'ını kullanıyor.
    3.  **Kod Mantığı:** Kod, `typeof window === 'undefined'` kontrolü ile sunucu tarafında mı yoksa tarayıcıda mı çalıştığını anlıyor:
        - Sunucu tarafındaysa (SSR): `INTERNAL_API_URL` kullanılır
        - Tarayıcı tarafındaysa: `NEXT_PUBLIC_API_URL` kullanılır
    4.  **Sonuç:** `INTERNAL_API_URL` tanımlı olmadığı için SSR sırasında API istekleri başarısız oluyor ve boş array dönüyor, bu yüzden ürünler görünmüyor.

- **Çözüm Adımları:**
    1.  **Vercel Dashboard'a Git:**
        - Projenizi seçin → Settings → Environment Variables
    2.  **İki Environment Variable Ekleyin:**
        - `NEXT_PUBLIC_API_URL`: Railway backend URL'iniz (örn: `https://your-backend.up.railway.app`)
        - `INTERNAL_API_URL`: Aynı Railway backend URL'iniz (aynı değer)
    3.  **Deploy'u Yeniden Başlatın:**
        - Deployments sekmesine gidin
        - Son deployment'ı seçin → "Redeploy" butonuna tıklayın
        - Veya yeni bir commit push edin
    4.  **Doğrulama:**
        - Canlı siteyi yenileyin
        - Ürünler, kategoriler ve diğer veriler artık görünmeli

**Not:** `INTERNAL_API_URL` ve `NEXT_PUBLIC_API_URL` aynı değere sahip olmalıdır (Railway backend URL'iniz). İkisi de aynı backend'e işaret eder, sadece kullanım yerleri farklıdır (SSR vs client-side).



## Sorun: Vercel Build Hatası - Dynamic Server Usage (Kasım 2025)

### Problem: Next.js Statik Sayfa Oluşturma Hatası

- **Hata Belirtisi:**
    - Vercel'de build sırasında şu hata alınıyor:
    ```
    Error: Dynamic server usage: Route / couldn't be rendered statically because it used revalidate: 0 fetch
    ```
    - Build tamamlanıyor ancak bu hata loglarda görünüyor
    - Sayfalar `ƒ (Dynamic)` olarak işaretleniyor

- **Neden:**
    1.  **Next.js Statik Sayfa Oluşturma:** Next.js, build sırasında sayfaları statik olarak oluşturmaya (SSG - Static Site Generation) çalışır.
    2.  **Dinamik Veri Çekme:** Sayfalarda `cache: 'no-store'` kullanılarak dinamik veri çekiliyor.
    3.  **Çakışma:** `cache: 'no-store'` kullanımı, sayfanın her istekte yeniden render edilmesini gerektirir, bu da statik sayfa oluşturma ile çakışır.
    4.  **Next.js 15 Değişikliği:** Next.js 15, bu durumu daha sıkı kontrol ediyor ve hata olarak işaretliyor.

- **Çözüm Adımları:**
    1.  **Sayfaları Dinamik Olarak İşaretle:** İlgili sayfa dosyalarına (`page.tsx`) şu satırı ekleyin:
        ```typescript
        export const dynamic = 'force-dynamic';
        ```
    2.  **Etkilenen Sayfalar:**
        - `app/page.tsx` (Ana sayfa)
        - `app/paketler/page.tsx` (Paketler listesi)
        - `app/kategori/[slug]/page.tsx` (Kategori sayfası)
        - `app/urun/[slug]/page.tsx` (Ürün detay sayfası)
        - `app/paketler/[slug]/page.tsx` (Paket detay sayfası)
    3.  **Neden Bu Çözüm:**
        - `export const dynamic = 'force-dynamic'` ifadesi, Next.js'e bu sayfanın her zaman server-side render edilmesi gerektiğini söyler.
        - Bu, admin panelden yapılan değişikliklerin anında yansıması için de uygundur.
        - Sayfalar artık statik olarak oluşturulmaya çalışılmaz, her istekte dinamik olarak render edilir.
    4.  **Deploy:**
        - Değişiklikleri commit edip push edin
        - Vercel otomatik olarak yeni build başlatacak
        - Build başarılı olacak ve hata görünmeyecek

**Not:** Bu çözüm, sayfaların her zaman dinamik olarak render edilmesini sağlar. Bu, admin panelden yapılan değişikliklerin anında görünmesi için idealdir, ancak performans açısından statik sayfalardan biraz daha yavaş olabilir. E-ticaret sitelerinde ürün verilerinin sık değişebilmesi nedeniyle bu yaklaşım genellikle tercih edilir.



