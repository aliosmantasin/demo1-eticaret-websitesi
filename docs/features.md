# Özellik Listesi (Features)

Bu doküman, PRD'de belirtilen özellikleri kullanıcı hikayeleri (User Stories) formatında detaylandırır.

## Müşteri Hikayeleri

### Kimlik Doğrulama
- **Bir ziyaretçi olarak,** e-posta adresim ve şifremle yeni bir hesap oluşturabilmeliyim ki platforma üye olabileyim.
- **Bir kullanıcı olarak,** e-posta adresim ve şifremle sisteme giriş yapabilmeliyim ki alışverişe başlayabileyim.
- **Bir kullanıcı olarak,** oturumumu güvenli bir şekilde sonlandırabilmek için çıkış yapabilmeliyim.
- **Bir kullanıcı olarak,** şifremi unuttuğumda sıfırlama talebi gönderebilmeliyim.

### Ürün Kataloğu
- [x] **Bir kullanıcı olarak,** anasayfadaki banner, kategoriler ve çok satanlar gibi bölümleri görerek siteyi keşfedebilmeliyim.
- [x] **Bir kullanıcı olarak,** tüm ürünlerin listelendiği bir sayfayı gezebilmeliyim ki ne gibi ürünler olduğunu görebileyim.
- [ ] **Bir kullanıcı olarak,** ürünleri kategoriye, fiyata veya popülerliğe göre filtreleyip sıralayabilmeliyim ki aradığımı kolayca bulabileyim.
- [ ] **Bir kullanıcı olarak,** ilgimi çeken bir ürünün detaylarını (açıklama, görseller, fiyat) görmek için detay sayfasına gidebilmeliyim.
- [ ] **Bir kullanıcı olarak,** anahtar kelimelerle ürün araması yapabilmeliyim.

### Alışveriş Sepeti ve Sipariş
- **Bir kullanıcı olarak,** ürün detay sayfasından veya ürün listesinden sepete ürün ekleyebilmeliyim.
- **Bir kullanıcı olarak,** sepetimdeki ürünlerin listesini ve toplam tutarı görebilmeliyim.
- **Bir kullanıcı olarak,** sepetteki bir ürünün adedini artırıp azaltabilmeli veya ürünü tamamen sepetten çıkarabilmeliyim.
- **Bir kullanıcı olarak,** sepetimdeki ürünleri satın almak için ödeme sayfasına ilerleyebilmeliyim.
- **Bir kullanıcı olarak,** teslimat adresimi girebilmeli veya kayıtlı adreslerimden birini seçebilmeliyim.
- **Bir kullanıcı olarak,** siparişimi tamamladıktan sonra bir onay sayfası ve e-postası almalıyım.
- **Bir kullanıcı olarak,** hesabım altından geçmiş siparişlerimin listesini ve durumlarını (hazırlanıyor, kargolandı vb.) görebilmeliyim.

## Yönetici (Admin) Hikayeleri

### Yönetim Paneli Erişimi
- **Bir yönetici olarak,** sadece yetkili kullanıcıların erişebildiği bir admin paneline güvenli bir şekilde giriş yapabilmeliyim.

### Ürün Yönetimi
- **Bir yönetici olarak,** sisteme yeni bir ürün (isim, açıklama, fiyat, stok, kategori, görseller) ekleyebilmeliyim.
- **Bir yönetici olarak,** mevcut bir ürünün bilgilerini düzenleyebilmeliyim.
- **Bir yönetici olarak,** artık satılmayan bir ürünü sistemden silebilmeliyim veya pasif hale getirebilmeliyim.
- **Bir yönetici olarak,** tüm ürünlerin listesini arama ve filtreleme özellikleriyle görebilmeliyim.

### Sipariş Yönetimi
- **Bir yönetici olarak,** gelen tüm siparişlerin bir listesini görebilmeliyim.
- **Bir yönetici olarak,** bir siparişin detaylarını (sipariş edilen ürünler, müşteri bilgileri, adres) inceleyebilmeliyim.
- **Bir yönetici olarak,** bir siparişin durumunu ("Onay Bekliyor", "Hazırlanıyor", "Kargolandı", "Teslim Edildi", "İptal Edildi") güncelleyebilmeliyim.

### Kullanıcı Yönetimi
- **Bir yönetici olarak,** sisteme kayıtlı tüm kullanıcıların bir listesini görebilmeliyim.
- **Bir yönetici olarak,** bir kullanıcının rolünü (örn: Müşteri, Editör) düzenleyebilmeliyim (MVP Sonrası).
