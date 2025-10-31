# Ürün Gereksinimleri Dokümanı (PRD) - E-Ticaret Platformu

## 1. Giriş ve Amaç

Bu doküman, geliştirilecek olan E-Ticaret Platformu'nun hedeflerini, özelliklerini ve gereksinimlerini tanımlar. Projenin amacı, küçük ve orta ölçekli işletmelerin ürünlerini online olarak satabilecekleri, yönetebilecekleri ve müşterileriyle etkileşim kurabilecekleri modern, hızlı ve güvenilir bir platform oluşturmaktır.

## 2. Hedefler ve Başarı Metrikleri

### Hedefler

- Kullanıcı dostu bir alışveriş deneyimi sunmak.
- Site yöneticileri için kolay kullanılabilir bir admin paneli sağlamak.
- Hem web hem de mobil platformlarda tutarlı bir deneyim sunacak bir altyapı (API) oluşturmak.
- Güvenli ve ölçeklenebilir bir mimari tasarlamak.

### Başarı Metrikleri

- **Kullanıcı:** Başarılı sipariş tamamlama oranı, sepet terk etme oranının düşüklüğü.
- **Yönetici:** Yeni ürün ekleme/güncelleme süresinin kısalığı.
- **Sistem:** Sayfa yükleme hızları, API yanıt süreleri, sunucu hata oranları.

## 3. Kullanıcı Profilleri (Personalar)

- **Müşteri (Alışveriş Yapan):** Ürünleri incelemek, sepete eklemek ve sipariş vermek isteyen son kullanıcı.
- **Yönetici (Satıcı):** Ürünleri, siparişleri, müşterileri ve site içeriğini yöneten site sahibi veya çalışanı.

## 4. Özellikler ve Gereksinimler (MVP Kapsamı)

### 4.1. Ürün Kataloğu ve Keşif (Tamamlandı)
- **Anasayfa:** Banner, kategori tanıtımları, çok satan ürünler gibi dinamik modüllerin yer aldığı vitrin sayfası.
- **Ürün Listeleme:** Ürünlerin kategori bazında listelendiği sayfalar (sayfalama, sıralama, filtreleme).
- **Ürün Detay:** Tek bir ürünün tüm bilgilerinin (açıklama, görseller, fiyat) görüntülendiği sayfa.
- **Ürün Arama:** Kullanıcıların anahtar kelime ile ürün araması yapabilmesi.

### 4.2. Kullanıcı Kimlik Doğrulama
- E-posta ve şifre ile yeni kullanıcı kaydı oluşturma.
- Giriş yapma ve oturumu yönetme (JWT).
- Şifre sıfırlama (opsiyonel).

### 4.3. Alışveriş Sepeti
- Sepete ürün ekleme/çıkarma.
- Sepetteki ürün miktarını güncelleme.
- Sepet içeriğini görüntüleme.

### 4.4. Sipariş ve Ödeme
- Teslimat adresi ekleme/seçme.
- Ödeme bilgilerini girme (Başlangıç için sahte bir ödeme entegrasyonu).
- Siparişi tamamlama ve sipariş özeti görüntüleme.
- Geçmiş siparişleri listeleme.

### 4.5. Yönetim Paneli (Admin)
- Güvenli giriş.
- **Ürün Yönetimi:** Yeni ürün ekleme, mevcut ürünleri düzenleme (fiyat, stok, görsel vb.), ürün silme.
- **Sipariş Yönetimi:** Gelen siparişleri listeleme, sipariş detaylarını görüntüleme, sipariş durumunu güncelleme (örn: "Hazırlanıyor", "Kargolandı").
- **Kullanıcı Yönetimi:** Kayıtlı kullanıcıları listeleme.

## 5. Kapsam Dışı (MVP Sonrası)

- Gelişmiş indirim kuponu ve kampanya sistemi.
- Çoklu dil ve para birimi desteği.
- Ürün yorumları ve puanlama.
- Detaylı raporlama ve analiz.
- Sosyal medya ile giriş (OAuth).

## 6. Varsayımlar ve Bağımlılıklar

- Proje, başlangıç için tek bir satıcıyı destekleyecektir (Pazar yeri modeli değildir).
- Ödeme altyapısı olarak başlangıçta sahte (mock) bir servis kullanılacaktır.
- Medya (görsel) dosyaları için başlangıçta yerel depolama kullanılabilir, ancak hedef S3 uyumlu bir servistir.
