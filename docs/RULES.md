# Proje Kuralları ve Standartları

Bu doküman, projenin geliştirme sürecinde tutarlılığı ve kaliteyi sağlamak için uyulması gereken kuralları ve standartları içerir.

## 1. Versiyon Kontrolü ve Branch Stratejisi

- **Ana Branch'ler:**
    - `main`: Her zaman canlıdaki (production) kodu yansıtır. Doğrudan bu branch'e commit atılmaz.
    - `develop`: Geliştirmenin yapıldığı ana branch'tir. Tamamlanan özellikler bu branch'te birleşir.

- **Destek Branch'leri:**
    - `feature/<ozellik-adi>`: Yeni bir özellik geliştirilirken `develop` branch'inden oluşturulur. (Örn: `feature/product-search`)
    - `fix/<hata-adi>`: Hataları düzeltmek için `develop` branch'inden oluşturulur. (Örn: `fix/login-button-bug`)
    - `release/<versiyon>`: Yeni bir sürüm çıkılacağı zaman `develop` branch'inden oluşturulur. Sadece sürüm hazırlığı ve küçük hata düzeltmeleri içerir.

## 2. Commit Mesajları Standardı

Projede **Conventional Commits** standardı kullanılacaktır. Bu, okunabilir bir geçmiş oluşturur ve versiyonlamayı otomatikleştirir.

**Format:** `<type>(<scope>): <subject>`

- **Type (Tip):**
    - `feat`: Yeni bir özellik eklendiğinde.
    - `fix`: Bir hata düzeltildiğinde.
    - `docs`: Sadece dokümantasyon değiştirildiğinde.
    - `style`: Kodun anlamını etkilemeyen formatlama değişiklikleri (boşluk, noktalı virgül vb.).
    - `refactor`: Hata düzeltmeyen veya özellik eklemeyen kod yeniden yapılandırması.
    - `test`: Test eklendiğinde veya mevcut testler düzeltildiğinde.
    - `chore`: Build süreçleri veya yardımcı araçlarla ilgili değişiklikler.

- **Scope (Kapsam - Opsiyonel):** Değişikliğin etki ettiği alan. (Örn: `api`, `auth`, `products`, `cart`)
- **Subject (Konu):** Değişikliğin kısa ve net açıklaması.

**Örnekler:**
```
feat(auth): add password reset functionality
fix(api): correct product price calculation
docs(readme): update setup instructions
```

## 3. Kod Stili ve Linting

- **Otomatik Formatlama:** Kod tabanında tutarlılığı sağlamak için `Prettier` kullanılacaktır. Commit öncesi otomatik formatlama için bir hook (husky) ayarlanacaktır.
- **Kod Analizi (Linting):** Hataları erken tespit etmek ve stil kurallarını zorunlu kılmak için `ESLint` kullanılacaktır.
- Tüm geliştiricilerin IDE'lerinde Prettier ve ESLint eklentilerini kurması önerilir.

## 4. Pull Request (PR) Süreci

- Her `feature` veya `fix` branch'i, `develop` branch'ine bir Pull Request (PR) ile birleştirilir.
- PR açıklaması, yapılan değişikliği ve nedenini net bir şekilde açıklamalıdır.
- PR, en az bir başka geliştiriciden onay (review) almalıdır.
- Tüm testlerin ve lint kontrollerinin başarıyla geçtiğinden emin olunmalıdır.

## 5. Geliştirme Süreci Kuralları

- **Kod Bütünlüğü:** Onay alınmadan mevcut kod yapısı silinmeyecek veya büyük çaplı refactor işlemleri yapılmayacaktır. Her önemli değişiklik için onay istenecektir.
- **Teknoloji Yığınına Bağlılık:** Proje için `README.md` dosyasında tanımlanan teknolojiler dışına çıkılmayacaktır. Yeni bir kütüphane veya araç eklemek/çıkarmak için ortak karar alınmalıdır.
- **Standartlara Uyum:**
    - Paket yöneticisi olarak yalnızca `pnpm` kullanılacaktır.
    - Stil için `Tailwind CSS` prensiplerine ve projenin tasarım sistemine uyulacaktır.
    - `TypeScript` kurallarına tam uyum sağlanacak, kodlama tamamlandığında herhangi bir `type` hatası bırakılmayacaktır.
- **Kod Kalitesi:** Gereksiz, tekrarlayan veya aşırı karmaşık kod yazımından kaçınılacaktır. Her kodlama adımından sonra daha iyi bir alternatif (daha okunabilir, daha performanslı) varsa bu belirtilecektir.
- **Görev Takibi ve Dokümantasyon Senkronizasyonu:**
    - Proje görevleri `docs/TASK.md` dosyasında belirtilen sırayla işlenecektir.
    - Eklenen her yeni görev veya yapılan her geliştirme, `docs` klasöründeki ilgili tüm dosyalara (PRD, features.md vb.) yansıtılmalıdır. Bu dosyalar arasında tutarlılık sağlanması kritiktir.
    - Herhangi bir göreve başlamadan veya bir sonraki göreve geçmeden önce, `docs` klasöründeki tüm dosyalar gözden geçirilecek ve `TASK.md` dosyasındaki görevin gereksinimlerinin tam olarak anlaşıldığından emin olunacaktır.
- **Öğrenme Süreci:** Bu proje aynı zamanda bir öğrenme sürecidir. `docs/learnin.md` dosyası, öğrenilen yeni konuları ve aşılan zorlukları kaydetmek için aktif olarak kullanılacaktır.
- **Onay Mekanizması:** Bir görev tamamlandığında, bir sonraki göreve geçmeden önce kullanıcı onayı alınacaktır.

### 6. Yapay Zeka (AI) ile Çalışma Kuralları

- **Öğrenme Süreci Takibi:** AI, `docs/learnin.md` dosyasında "Geliştirilecek Alanlar" olarak belirtilen konularla ilgili bir kodlama yaptığında, görevin sonunda kullanıcıya bu konuyu anlayıp anlamadığını soracaktır. Amaç, sadece kodu tamamlamak değil, aynı zamanda kullanıcının bu süreçte teknik olarak gelişimini sağlamaktır.

## 7. Dokümantasyon Kuralları

- **Komutların Belgelenmesi:** Projede kullanılan, özellikle kurulum, veritabanı yönetimi ve build süreçleri gibi kritik işlemlere ait tüm komutlar `docs/COMMANDS.md` dosyasında belgelenmelidir. Her komutun ne işe yaradığı, hangi parametreleri aldığı ve ne zaman kullanılması gerektiği net bir şekilde açıklanmalıdır.
