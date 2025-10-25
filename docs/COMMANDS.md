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

### `prisma db seed`

`prisma/seed.ts` dosyasını çalıştırarak veritabanını başlangıç verileriyle doldurur (tohumlar).

```bash
docker-compose exec backend pnpm prisma db seed
```

### `prisma generate`

`prisma/schema.prisma` dosyasını okur ve `node_modules/@prisma/client` içine TypeScript tiplerini oluşturur. IDE'nin ve projenin Prisma'yı doğru tanıması için gereklidir.

```bash
# Konteyner içinde
docker-compose exec backend pnpm prisma generate

# Lokalde (IDE hatası için)
pnpm --filter ecom-backend exec prisma generate
```
