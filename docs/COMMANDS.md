# Proje Komutları Referansı

Bu doküman, projenin geliştirilmesi ve yönetimi sırasında sıkça kullanılan terminal komutlarını içerir.

## Docker Compose

Tüm `docker-compose` komutları, projenin ana dizininde (`docker-compose.yml` dosyasının olduğu yerde) çalıştırılmalıdır.

---

### `docker-compose up`

Tüm servisleri (veritabanı, backend, frontend) başlatır. Eğer servisler zaten çalışıyorsa bir şey yapmaz.

```bash
docker-compose up
```

-   **`--build` parametresi:** Servisleri başlatmadan önce `Dockerfile`'ları kullanarak imajları yeniden inşa etmeye zorlar. `Dockerfile`'da, `package.json`'da veya proje seviyesi ayarlarda (`next.config.ts` gibi) bir değişiklik yapıldığında bu parametre kullanılmalıdır.
    ```bash
    docker-compose up --build
    ```
-   **`-d` parametresi:** Konteynerleri "detached" modda, yani arka planda başlatır. Terminal logları ekrana akmaz ve terminali başka komutlar için kullanmaya devam edebilirsiniz.
    ```bash
    docker-compose up -d
    ```

---

### `docker-compose down`

`up` komutuyla başlatılan tüm konteynerleri durdurur ve kaldırır. Ayrıca oluşturulan ağı da kaldırır.

```bash
docker-compose down
```

-   **`-v` parametresi:** Konteynerlerle birlikte `docker-compose.yml`'de tanımlanan `volume`'leri (örneğin veritabanı verilerini) de siler. **DİKKAT: Bu komut veritabanındaki tüm verileri kalıcı olarak siler!** Sadece her şeyi sıfırlamak istediğinizde kullanın.
    ```bash
    docker-compose down -v
    ```
-   **`--volumes --remove-orphans` parametreleri:** Tüm bağlı volume'leri ve ilişkili olmayan (orphan) konteynerleri kaldırır. Özellikle ağ veya volume kaynaklı hatalarda ortamı sıfırlamak için kullanışlıdır. **Kalıcı verileriniz silinir.**
    ```bash
    docker-compose down --volumes --remove-orphans
    ```

---

### `docker-compose ps`

Projedeki konteynerlerin durumunu (çalışıyor, durdurulmuş vb.) listeler.

```bash
docker-compose ps
```

---

### `docker-compose logs`

Servislerin loglarını (çıktılarını) gösterir. Belirli bir servisin logunu görmek için servis adını ekleyebilirsiniz.

```bash
# Tüm servislerin logları
docker-compose logs

# Sadece backend servisinin logları
docker-compose logs backend
```

-   **`-f` parametresi:** Logları canlı olarak akıtır (`follow`).
    ```bash
    docker-compose logs -f backend
    ```

---

### `docker-compose exec`

Çalışmakta olan bir konteynerin içinde komut çalıştırmanızı sağlar. Geliştirme sırasında veritabanı işlemleri veya hata ayıklama için çok kullanışlıdır.

**Format:** `docker-compose exec <servis_adı> <komut>`

```bash
# Backend konteynerinin içinde 'ls -l' komutunu çalıştırır
docker-compose exec backend ls -l

# Backend konteynerinin içinde interaktif bir shell (bash) başlatır
docker-compose exec backend bash
```

---

## Docker Genel Yönetim

### `docker volume`

Docker'ın kalıcı veri depolama birimlerini (volume) yönetir.

```bash
# Tüm volume'leri listele
docker volume ls

# Belirli bir volume'u sil (Veriler kalıcı olarak gider!)
docker volume rm ecom_postgres_data
```

---

### `docker system prune`

Docker sisteminde temizlik yapar. Durdurulmuş tüm konteynerleri, kullanılmayan ağları ve boştaki (dangling) imajları siler. Geliştirme ortamını temiz tutmak ve disk alanı kazanmak için periyodik olarak çalıştırılması önerilir.

```bash
docker system prune
```

---

## Prisma CLI (Konteyner İçinde Çalıştırma)

Prisma komutları, veritabanı şemasını yönetmek için kullanılır. Bu komutlar, veritabanına erişimi olan `backend` servisi içinde çalıştırılmalıdır.

### `prisma migrate dev`

`prisma/schema.prisma` dosyasındaki değişiklikleri veritabanına uygular. Yeni bir migration dosyası oluşturur ve veritabanı şemasını günceller.

```bash
docker-compose exec backend pnpm prisma migrate dev --name <migration_adi>
```

### `prisma db push`

`schema.prisma` dosyasındaki şemayı migration dosyası oluşturmadan veritabanına yansıtmak için kullanılır. Docker Compose ile ya da doğrudan konteyner adıyla çalıştırabilirsiniz.

```bash
# docker-compose kullanarak
docker-compose exec backend pnpm prisma db push

# docker-compose kullanarak
docker-compose exec backend pnpm prisma db push --accept-data-loss

# konteyner adıyla
docker exec ecom_backend_api pnpm prisma db push
```

### `prisma db seed`

`prisma/seed.ts` dosyasını çalıştırarak veritabanını başlangıç verileriyle doldurur (tohumlar).

```bash
# docker-compose kullanarak
docker-compose exec backend pnpm prisma db seed

# konteyner adıyla
docker exec ecom_backend_api pnpm prisma db seed
```

### `prisma migrate reset`

Veritabanını tamamen sıfırlar, tüm migration'ları geri alır ve seed işlemini otomatik olarak çalıştırır. **DİKKAT: Bu komut veritabanındaki tüm verileri kalıcı olarak siler!** Sadece veritabanını tamamen sıfırlayıp yeniden başlangıç verileriyle doldurmak istediğinizde kullanın.

```bash
# docker-compose kullanarak (--force parametresi onay istemeden çalıştırır)
docker-compose exec backend pnpm prisma migrate reset --force

# konteyner adıyla
docker exec ecom_backend_api pnpm prisma migrate reset --force
```

**Ne Zaman Kullanılır:**
- Veritabanını tamamen sıfırlayıp temiz bir başlangıç yapmak istediğinizde
- Schema değişikliklerinden sonra veritabanını yeniden oluşturmak istediğinizde
- Seed verilerini yeniden yüklemek istediğinizde (otomatik olarak seed çalıştırır)

**Not:** Bu komut `prisma db push` ve `prisma db seed` komutlarını tek seferde çalıştırır. Veritabanı şeması sıfırlanır, yeniden oluşturulur ve seed verileri yüklenir.

### `prisma generate`

`prisma/schema.prisma` dosyasını okur ve `node_modules/@prisma/client` içine TypeScript tiplerini oluşturur. IDE'nin ve projenin Prisma'yı doğru tanıması için gereklidir.

```bash
# Konteyner içinde
docker-compose exec backend pnpm prisma generate

# Lokalde (IDE hatası için)
pnpm --filter ecom-backend exec prisma generate
```

### `docker volume prune`

Bu komut, herhangi bir konteyner tarafından o anda kullanılmayan tüm Docker volume'larını (veri saklama alanlarını) sistemden temizler. Projeleri sık sık yeniden başlatıp kurarken veya eski projelerden kalan artık verileri temizlemek istediğinizde diskte yer açmak için çok kullanışlıdır. Komutu çalıştırdığınızda, silinecek volume'ların bir listesini gösterir ve sizden onay (y/N) ister.

---

## Prisma Komutları Ne Zaman Çalıştırılmalı?

`prisma` komutlarını her `docker-compose up --build` komutunda çalıştırmak **gerekmez**. Veritabanı verilerimiz `ecom_postgres_data` adlı bir `volume` içinde kalıcı olarak saklanır ve `docker-compose down` komutuyla silinmez. Bu komutları yalnızca belirli durumlarda çalıştırmalısınız:

### Hızlı Senaryo Özeti – Bu Komutları Ne Zaman Kullandık?

Aşağıdaki sıralama, bugün yaşadığımız “veriler gelmiyor” sorununu nasıl çözdüğümüzü ve her komutun **neden** gerekli olduğunu özetler. Benzer bir durumla tekrar karşılaşırsanız aynı adımları uygulayabilirsiniz.

1. **Ortamı Sıfırlamak**
   ```bash
   docker-compose down
   ```
   *Tüm servisleri durdurur ve ağı kaldırır. Port/çevre değişkeni değişiklikleri için temiz bir başlangıç sağlar.*

2. **Yeni İmajları Oluşturup Servisleri Başlatmak**
   ```bash
   docker-compose up -d --build
   ```
   *`Dockerfile` değişiklikleri (ör. yeni port ayarı) devreye girsin ve servisler yenilensin.*

3. **Tablolar Oluşmadıysa Prisma Şemasını Yansıtmak**
   ```bash
   docker exec ecom_backend_api pnpm prisma db push
   ```
   *Yeni oluşturulan Postgres volume’ünde henüz tablo yoksa `schema.prisma`’daki modelleri veritabanına gönderir.*

4. **Başlangıç Verilerini Eklemek**
   ```bash
   docker exec ecom_backend_api pnpm prisma db seed
   ```
   *`seed.ts` dosyasındaki örnek ürünler, kategoriler ve admin kullanıcısı veritabanına eklenir.*

5. **Kontrol Etmek**
   ```bash
   docker exec ecom_postgres_db psql -U admin -d ecom_db -c "SELECT COUNT(*) FROM \"Product\";"
   ```
   *Ürün sayısını kontrol ederek seed işleminin başarılı olup olmadığını doğrular.*

Bu beş adım, veritabanı sıfırlandığında (örn. `docker-compose down -v` veya volume silindiğinde) **hem şemayı hem de verileri** geri yüklemek için yeterlidir.

---

## Veritabanı Kontrol ve Sorgulama Komutları

Veritabanındaki verileri kontrol etmek, sayıları görmek veya hızlı sorgular çalıştırmak için PostgreSQL'e doğrudan bağlanabilirsiniz.

### Veritabanına Bağlanma

PostgreSQL container'ına bağlanmak için:

```bash
# PostgreSQL container'ına bağlan
docker exec -it ecom_postgres_db psql -U admin -d ecom_db
```

Bu komut interaktif bir PostgreSQL shell açar. Çıkmak için `\q` yazın.

### Tablo İstatistikleri

Veritabanındaki kayıt sayılarını kontrol etmek için:

```bash
# Ürün sayısını kontrol et
docker exec ecom_postgres_db psql -U admin -d ecom_db -c "SELECT COUNT(*) as product_count FROM \"Product\";"

# Kategori sayısını kontrol et
docker exec ecom_postgres_db psql -U admin -d ecom_db -c "SELECT COUNT(*) as category_count FROM \"Category\";"

# Kullanıcı sayısını kontrol et
docker exec ecom_postgres_db psql -U admin -d ecom_db -c "SELECT COUNT(*) as user_count FROM \"User\";"

# Sepet sayısını kontrol et
docker exec ecom_postgres_db psql -U admin -d ecom_db -c "SELECT COUNT(*) as cart_count FROM \"Cart\";"

# Yorum sayısını kontrol et
docker exec ecom_postgres_db psql -U admin -d ecom_db -c "SELECT COUNT(*) as review_count FROM \"Review\";"
```

### Tablo Yapısını İnceleme

Bir tablonun yapısını (kolonlar, tipler, indeksler) görmek için:

```bash
# Category tablosunun yapısını göster
docker exec ecom_postgres_db psql -U admin -d ecom_db -c "\d \"Category\""

# Product tablosunun yapısını göster
docker exec ecom_postgres_db psql -U admin -d ecom_db -c "\d \"Product\""

# User tablosunun yapısını göster
docker exec ecom_postgres_db psql -U admin -d ecom_db -c "\d \"User\""
```

### Veri Sorgulama Örnekleri

```bash
# İlk 5 ürünü listele
docker exec ecom_postgres_db psql -U admin -d ecom_db -c "SELECT id, name, price FROM \"Product\" LIMIT 5;"

# Tüm kategorileri listele
docker exec ecom_postgres_db psql -U admin -d ecom_db -c "SELECT id, name, slug FROM \"Category\";"

# Admin kullanıcılarını listele
docker exec ecom_postgres_db psql -U admin -d ecom_db -c "SELECT id, email, role FROM \"User\" WHERE role = 'ADMIN';"

#Kullanıcılarını listele
docker exec ecom_postgres_db psql -U admin -d ecom_db -c "SELECT id, email, role FROM \"User\" WHERE role = 'User';"

```

### Seed Verilerini Yeniden Yükleme

Veritabanını sıfırlayıp seed verilerini yeniden yüklemek için:

```bash
# Backend container içinde seed çalıştır
docker exec ecom_backend_api sh -c "cd /usr/src/app/backend && pnpm prisma db seed"
```

**Not:** Bu komut mevcut ürün ve kategori verilerini siler ve seed dosyasındaki verileri yeniden ekler. Kullanıcı verileri (User) silinmez, sadece admin kullanıcısının rolü güncellenir.

### Prisma Client Yeniden Oluşturma

Prisma schema değişikliklerinden sonra TypeScript tiplerini güncellemek için:

```bash
# Backend container içinde Prisma Client generate et
docker exec ecom_backend_api sh -c "cd /usr/src/app/backend && pnpm prisma generate"
```

**Ne Zaman Kullanılır:**
- `schema.prisma` dosyasında değişiklik yaptıktan sonra
- Prisma Client type hataları aldığınızda
- IDE'de Prisma tipleri tanınmıyorsa
