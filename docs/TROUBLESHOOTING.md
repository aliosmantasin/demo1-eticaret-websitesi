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



