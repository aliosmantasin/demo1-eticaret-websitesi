import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/api/auth/auth.service';

const prisma = new PrismaClient();

const PRODUCT_IMAGES_BASE_URL = "https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/product-images";
const CATEGORY_IMAGES_BASE_URL = "https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/category-images";
const HOMEPAGE_BANNER_DESKTOP_BASE_URL = "https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/homepage-banner-desktop";
const HOMEPAGE_BANNER_MOBILE_BASE_URL = "https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/homepage-banner-mobil";
const HOMEPAGE_PROMOTION_BANNER_DESKTOP_BASE_URL = "https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/homepage-promotion-banner-desktop";
const HOMEPAGE_PROMOTION_BANNER_MOBILE_BASE_URL = "https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/homepage-promotion-banner-mobil";
const PACKAGES_BANNER_DESKTOP_BASE_URL = "https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/packages-banner-desktop";
const PACKAGES_BANNER_MOBILE_BASE_URL = "https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/packages-banner-mobil";
const PACKAGES_IMAGES_BASE_URL = "https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/packages-images";
const LOGO_BASE_URL = "https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/logo";

async function main() {
  console.log('Seed işlemi başlıyor...');

  // 1. Tüm veriyi temizle (doğru sırada)
  // Not: migrate reset zaten tabloları temizliyor, burada sadece güvenlik için temizlik yapıyoruz
  console.log('Eski veriler temizleniyor...');
  try {
    await prisma.productVariant.deleteMany({});
    await prisma.optionValue.deleteMany({});
    await prisma.option.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.footerLink.deleteMany({});
    await prisma.siteSettings.deleteMany({});
    await prisma.image.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (error) {
    // Tablolar yoksa hata verme, migrate reset zaten temizledi
    console.log('Tablolar zaten temizlenmiş veya mevcut değil, devam ediliyor...');
  }

  // 2. Admin kullanıcısını oluştur
  console.log('Admin kullanıcısı oluşturuluyor...');
  const hashedPassword = await hashPassword('Admin123!');
  await prisma.user.create({
    data: {
      email: 'admin@yazilim.tech',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  // 3. Görselleri oluştur
  console.log('Görsel kayıtları oluşturuluyor...');
  const images = await prisma.image.createManyAndReturn({
    data: [
      // Ürün Görselleri (index 0-8)
      { url: `${PRODUCT_IMAGES_BASE_URL}/whey-protein_400_biscuit.webp`, bucket: 'product-images' },
      { url: `${PRODUCT_IMAGES_BASE_URL}/whey-isolate_400_biscuit.webp`, bucket: 'product-images' },
      { url: `${PRODUCT_IMAGES_BASE_URL}/mass-gainer_2500_strawberry.webp`, bucket: 'product-images' },
      { url: `${PRODUCT_IMAGES_BASE_URL}/vegan-gainer_2500_strawberry.webp`, bucket: 'product-images' },
      { url: `${PRODUCT_IMAGES_BASE_URL}/creatine_120_.webp`, bucket: 'product-images' },
      { url: `${PRODUCT_IMAGES_BASE_URL}/cream-of-rice_1000_chocolate.webp`, bucket: 'product-images' },
      { url: `${PRODUCT_IMAGES_BASE_URL}/micellar-casein_400_strawberry.webp`, bucket: 'product-images' },
      { url: `${PRODUCT_IMAGES_BASE_URL}/pea-protein_400_strawberry.webp`, bucket: 'product-images' },
      { url: `${PRODUCT_IMAGES_BASE_URL}/soya-protein_400_strawberry.webp`, bucket: 'product-images' },
 
      // Kategori Görselleri (index 9-14) - Supabase'e yüklenen sabit dosya adları
      { url: `${CATEGORY_IMAGES_BASE_URL}/protein.webp`, bucket: 'category-images' },
      { url: `${CATEGORY_IMAGES_BASE_URL}/gida.webp`, bucket: 'category-images' },
      { url: `${CATEGORY_IMAGES_BASE_URL}/spor-gidalari.webp`, bucket: 'category-images' },
      { url: `${CATEGORY_IMAGES_BASE_URL}/saglik.webp`, bucket: 'category-images' },
      { url: `${CATEGORY_IMAGES_BASE_URL}/vitamin.webp`, bucket: 'category-images' },
      { url: `${CATEGORY_IMAGES_BASE_URL}/tum-urunler.webp`, bucket: 'category-images' },
      { url: `${CATEGORY_IMAGES_BASE_URL}/paketler.webp`, bucket: 'category-images' },
      
      // Ana Sayfa Banner Görselleri (index 15-16)
      // NOT: Bu görseller Supabase'e orijinal isimleriyle yüklenmelidir:
      // - homepage-banner-desktop bucket'ine: desktopBanner.webp
      // - homepage-banner-mobil bucket'ine: mobileBanner.webp
      { url: `${HOMEPAGE_BANNER_DESKTOP_BASE_URL}/desktopBanner.webp`, bucket: 'homepage-banner-desktop' },
      { url: `${HOMEPAGE_BANNER_MOBILE_BASE_URL}/mobileBanner.webp`, bucket: 'homepage-banner-mobil' },
      
      // Ana Sayfa Promosyon Banner Görselleri (index 17-18)
      // NOT: Bu görseller Supabase'e orijinal isimleriyle yüklenmelidir:
      // - homepage-promotion-banner-desktop bucket'ine: promotion-banner.webp
      // - homepage-promotion-banner-mobil bucket'ine: promotion-mobil-banner.webp
      { url: `${HOMEPAGE_PROMOTION_BANNER_DESKTOP_BASE_URL}/promotion-banner.webp`, bucket: 'homepage-promotion-banner-desktop' },
      { url: `${HOMEPAGE_PROMOTION_BANNER_MOBILE_BASE_URL}/promotion-mobil-banner.webp`, bucket: 'homepage-promotion-banner-mobil' },
      
      // Logo Görselleri (index 19-20)
      // NOT: Bu görseller Supabase'e orijinal isimleriyle yüklenmelidir:
      // - logo bucket'ine: ojslogo.webp ve logowhite.webp
      { url: `${LOGO_BASE_URL}/ojslogo.webp`, bucket: 'logo' },
      { url: `${LOGO_BASE_URL}/logowhite.webp`, bucket: 'logo' },
      
      // Paket Banner Görselleri (index 21-22)
      // NOT: Bu görseller Supabase'e orijinal isimleriyle yüklenmelidir:
      // - packages-banner-desktop bucket'ine: packageBanner.webp
      // - packages-banner-mobil bucket'ine: packageMobilBanner.webp
      { url: `${PACKAGES_BANNER_DESKTOP_BASE_URL}/packageBanner.webp`, bucket: 'packages-banner-desktop' },
      { url: `${PACKAGES_BANNER_MOBILE_BASE_URL}/packageMobilBanner.webp`, bucket: 'packages-banner-mobil' },
      
      // Paket Ürün Görselleri (index 23-25)
      // NOT: Bu görseller Supabase'e orijinal isimleriyle yüklenmelidir:
      // - packages-images bucket'ine: creamofricepaket.webp, proteinbar.webp, wheypaket.webp
      { url: `${PACKAGES_IMAGES_BASE_URL}/creamofricepaket.webp`, bucket: 'packages-images' },
      { url: `${PACKAGES_IMAGES_BASE_URL}/proteinbar.webp`, bucket: 'packages-images' },
      { url: `${PACKAGES_IMAGES_BASE_URL}/wheypaket.webp`, bucket: 'packages-images' },
    ],
  });

  // 4. Kategorileri oluştur ve görselleri ata (DAHA GÜVENİLİR YÖNTEM)
  console.log('Kategoriler oluşturuluyor ve görseller atanıyor...');
 
  const findImageBySlug = (slug: string) => {
    const image = images.find(img => img.url.includes(slug));
    if (!image) {
      throw new Error(`Seed: ${slug} için görsel bulunamadı!`);
    }
    return image;
  };
 
  const proteinCategoryImage = findImageBySlug('protein.webp');
  const gidaCategoryImage = findImageBySlug('gida.webp');
  const sporGidalariCategoryImage = findImageBySlug('spor-gidalari.webp');
  const saglikCategoryImage = findImageBySlug('saglik.webp');
  const vitaminCategoryImage = findImageBySlug('vitamin.webp');
  const tumUrunlerCategoryImage = findImageBySlug('tum-urunler.webp');
  const paketlerCategoryImage = findImageBySlug('paketler.webp');
  
  // Banner ve Logo görsellerini bul
  const homepageBannerDesktopImage = images.find(img => img.bucket === 'homepage-banner-desktop');
  const homepageBannerMobileImage = images.find(img => img.bucket === 'homepage-banner-mobil');
  const homepagePromotionBannerDesktopImage = images.find(img => img.bucket === 'homepage-promotion-banner-desktop');
  const homepagePromotionBannerMobileImage = images.find(img => img.bucket === 'homepage-promotion-banner-mobil');
  const packagesBannerDesktopImage = images.find(img => img.bucket === 'packages-banner-desktop');
  const packagesBannerMobileImage = images.find(img => img.bucket === 'packages-banner-mobil');
  const packagesImages = images.filter(img => img.bucket === 'packages-images');
  const logoImage = images.find(img => img.url.includes('ojslogo.webp'));
  const logoWhiteImage = images.find(img => img.url.includes('logowhite.webp'));
 
  const proteinCategory = await prisma.category.create({ data: { name: 'Protein', slug: 'protein', imageId: proteinCategoryImage.id } });
  const gidaCategory = await prisma.category.create({ data: { name: 'Gıda', slug: 'gida', imageId: gidaCategoryImage.id } });
  const sporGidalariCategory = await prisma.category.create({ data: { name: 'Spor Gıdaları', slug: 'spor-gidalari', imageId: sporGidalariCategoryImage.id } });
  const saglikCategory = await prisma.category.create({ data: { name: 'Sağlık', slug: 'saglik', imageId: saglikCategoryImage.id } });
  const vitaminCategory = await prisma.category.create({ data: { name: 'Vitamin', slug: 'vitamin', imageId: vitaminCategoryImage.id } });
  const tumUrunlerCategory = await prisma.category.create({ data: { name: 'Tüm Ürünler', slug: 'tum-urunler', imageId: tumUrunlerCategoryImage.id } });
  const paketlerCategory = await prisma.category.create({ data: { name: 'Paketler', slug: 'paketler', imageId: paketlerCategoryImage.id } });

  await prisma.siteSettings.upsert({
    where: { id: 'site-settings' },
    update: {},
    create: {
      shipping_text: 'Aynı Gün Kargo',
      shipping_subtext: "16:00'dan Önceki Siparişlerde",
      customer_count: '750.000+',
      customer_label: 'Mutlu Müşteri',
      guarantee_percent: '%100',
      guarantee_text: 'Memnuniyet Garantisi',
      infobar_first_text: 'Aynı Gün Kargo',
      infobar_first_subtext: "16:00'dan Önceki Siparişlerde",
      infobar_second_text: 'Ücretsiz Kargo',
      infobar_second_subtext: '1500₺ Üzeri Siparişlerde',
      infobar_third_text: 'Güvenli Alışveriş',
      infobar_third_subtext: '450.000+ Mutlu Müşteri',
      marquee_text: "Yeni kampanyalarımız başladı! %20'ye varan indirimler seni bekliyor.",
      marquee_speed: 1,
      homepage_banner_desktop_url: homepageBannerDesktopImage?.url || 'https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/homepage-banner-desktop/desktopBanner.webp',
      homepage_banner_mobile_url: homepageBannerMobileImage?.url || 'https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/homepage-banner-mobil/mobileBanner.webp',
      homepage_banner_hidden: false,
      category_showcase_hidden: false,
      bestsellers_hidden: false,
      bestsellers_limit: 6,
      homepage_promotion_banner_desktop_url: homepagePromotionBannerDesktopImage?.url || 'https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/homepage-promotion-banner-desktop/promotion-banner.webp',
      homepage_promotion_banner_mobile_url: homepagePromotionBannerMobileImage?.url || 'https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/homepage-promotion-banner-mobil/promotion-mobil-banner.webp',
      homepage_promotion_banner_hidden: false,
      assurance_title: 'LABORATUVAR TESTLİ ÜRÜNLER\nAYNI GÜN & ÜCRETSİZ KARGO MEMNUNİYET GARANTİSİ',
      assurance_text: '200.000’den fazla ürün yorumumuza dayanarak, ürünlerimizi seveceğinize eminiz. Eğer herhangi bir sebeple memnun kalmazsanız, bizimle iletişime geçtiğinizde çözüme kavuşturacağız.',
      assurance_hidden: false,
      logo_image_url: logoImage?.url || 'https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/logo/ojslogo.webp',
      logo_white_image_url: logoWhiteImage?.url || 'https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/logo/logowhite.webp',
      footer_copyright_text: 'Copyright © - Tüm Hakları Saklıdır.',
      footer_credits_text: 'Settobox Dijital Pazarlama tarafından yapılmıştır',
      footer_credits_url: 'https://www.settobox.com/tr',
      popular_product_slugs: ['whey-protein', 'cream-of-rice', 'creatine', 'whey-isolate', 'mass-gainer', 'vegan-gainer', 'micellar-casein', 'pea-protein', 'soya-protein'],
      popular_products_hidden: false,
      popular_products_limit: 9,
      popular_products_title: 'Topluluğun Favorileri',
      popular_products_subtitle: 'Sporcuların en çok tercih ettiği ürünleri keşfet.',
      packages_banner_desktop_url: packagesBannerDesktopImage?.url || 'https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/packages-banner-desktop/packageBanner.webp',
      packages_banner_mobile_url: packagesBannerMobileImage?.url || 'https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/packages-banner-mobil/packageMobilBanner.webp',
      packages_banner_hidden: false,
    } as any,
  });

  await prisma.footerLink.createMany({
    data: [
      // Kurumsal linkler - şimdilik sadece statik görüntü amaçlı (URL olmadan)
      { text: 'İletişim', url: '#', order: 1, section: 'COMPANY' },
      { text: 'Hakkımızda', url: '#', order: 2, section: 'COMPANY' },
      { text: 'Sıkça Sorulan Sorular', url: '#', order: 3, section: 'COMPANY' },
      { text: 'KVKK', url: '#', order: 4, section: 'COMPANY' },
      { text: 'Çalışma İlkelerimiz', url: '#', order: 5, section: 'COMPANY' },
      { text: 'Satış Sözleşmesi', url: '#', order: 6, section: 'COMPANY' },
      { text: 'Garanti ve İade Koşulları', url: '#', order: 7, section: 'COMPANY' },
      { text: 'Gerçek Müşteri Yorumları', url: '#', order: 8, section: 'COMPANY' },
      { text: 'Blog', url: '#', order: 9, section: 'COMPANY' },
      { text: 'KVKK Aydınlatma Metni', url: '/kvkk-aydinlatma', order: 1, section: 'INFO' },
      { text: 'Kampanyalar', url: '/kampanyalar', order: 2, section: 'INFO' },
    ],
  });
  
  // 5. ÖNCE: Varyant Seçeneklerini ve Değerlerini oluştur
  console.log('Varyant seçenekleri ve değerleri oluşturuluyor...');
  const aromaOption = await prisma.option.create({
    data: {
      name: 'Aroma',
      values: {
        create: [
          { value: 'Çikolata', color: '#8B4513' },
          { value: 'Çilek', color: '#F8607B' },
          { value: 'Bisküvi', color: '#F5E4CF' },
          { value: 'Muz', color: '#FEEA69' },
          { value: 'Yaban mersini', color: '#051650' },
        ],
      },
    },
    include: { values: true },
  });

  const boyutOption = await prisma.option.create({
    data: {
      name: 'Boyut',
      values: {
        create: [{ value: '400g' }, { value: '1000g' }, { value: '2300g' }, { value: "6'lı Set" }],
      },
    },
    include: { values: true },
  });
  
  const aromaValues = new Map(aromaOption.values.map((v: { id: string; value: string }) => [v.value, v.id]));
  const boyutValues = new Map(boyutOption.values.map((v: { id: string; value: string }) => [v.value, v.id]));
  
  const aromasArray = ['Çikolata', 'Çilek', 'Bisküvi', 'Muz', 'Yaban mersini'];
  const sizesArray = ['400g', '1000g', '2300g'];
  const paketBoyut = "6'lı Set";

  // 6. SONRA: Ürünleri ve onlara bağlı varyantları oluştur
  console.log('Ürünler ve varyantları oluşturuluyor...');
  
  // Aroma ve Boyut kombinasyonlarını oluşturan fonksiyon
  const createCombinedVariantsForProduct = async (
    productId: string, 
    basePrice: number,
    variantConfig?: {
      discountedAromas?: string[]; // İndirimli olacak aromalar
      discountedSizes?: string[]; // İndirimli olacak boyutlar
      discountPercentage?: number; // İndirim yüzdesi (varsayılan %20)
      stockVariations?: { [key: string]: number }; // Aroma veya boyuta göre stok (örn: { "1000g": 100, "400g": 25 })
      variantImages?: { [key: string]: string }; // Varyant görselleri (key: "aroma-size", value: imageSlug)
    }
  ) => {
    let priceCounter = basePrice;
    const discountPercent = variantConfig?.discountPercentage || 20;
    
    for (const aroma of aromasArray) {
      for (const size of sizesArray) {
        const aromaId = aromaValues.get(aroma);
        const sizeId = boyutValues.get(size);

        if (!aromaId || !sizeId) {
          console.warn(`Varyant değeri bulunamadı: Aroma: ${aroma}, Boyut: ${size}. Atlanıyor.`);
          continue;
        }

        // İndirim kontrolü
        const isDiscounted = 
          variantConfig?.discountedAromas?.includes(aroma) || 
          variantConfig?.discountedSizes?.includes(size);
        const discountedPrice = isDiscounted 
          ? priceCounter * (1 - discountPercent / 100) 
          : null;

        // Stok çeşitliliği
        let stock = 50; // Varsayılan stok
        if (variantConfig?.stockVariations) {
          if (variantConfig.stockVariations[size]) {
            stock = variantConfig.stockVariations[size];
          } else if (variantConfig.stockVariations[aroma]) {
            stock = variantConfig.stockVariations[aroma];
          }
        }

        // Varyant görseli kontrolü
        const variantKey = `${aroma}-${size}`;
        const variantImageSlug = variantConfig?.variantImages?.[variantKey] || 
                                 variantConfig?.variantImages?.[aroma] ||
                                 variantConfig?.variantImages?.[size];
        
        const variantImage = variantImageSlug 
          ? images.find(img => img.url.includes(variantImageSlug))
          : null;

        const variantData: any = {
          productId: productId,
          price: priceCounter,
          stock: stock,
          discounted_price: discountedPrice,
          optionValues: {
            connect: [{ id: aromaId }, { id: sizeId }],
          },
        };

        if (variantImage) {
          variantData.images = { connect: { id: variantImage.id } };
        }

        await prisma.productVariant.create({
          data: variantData,
        });
        priceCounter += 10; // Her kombinasyon için fiyatı hafifçe artır
      }
    }
  };
  
  const createProductWithVariants = async (productData: {
    name: string;
    slug: string;
    price: number;
    short_explanation?: string;
    category_id: string;
    imageSlug: string;
    features?: string | null;
    nutritional_content?: string | null;
    usage_instructions?: string | null;
    expiry_date?: string | null;
    tags?: string[];
    badge_primary_text?: string | null;
    badge_primary_hidden?: boolean;
    badge_secondary_text?: string | null;
    badge_secondary_hidden?: boolean;
    variantConfig?: {
      discountedAromas?: string[];
      discountedSizes?: string[];
      discountPercentage?: number;
      stockVariations?: { [key: string]: number };
      variantImages?: { [key: string]: string };
    };
  }) => {
    const image = images.find(img => img.url.includes(productData.imageSlug));
    if (!image) {
      console.warn(`'${productData.name}' için görsel bulunamadı. Ürün ve varyantları oluşturma atlandı.`);
      return;
    }
    const productDataForCreate: any = {
      name: productData.name,
      slug: productData.slug,
      short_explanation: productData.short_explanation || null,
      category_id: productData.category_id,
      tags: productData.tags || [],
      images: { connect: { id: image.id } },
    };

    if (productData.features !== undefined) {
      productDataForCreate.features = productData.features;
    }
    if (productData.nutritional_content !== undefined) {
      productDataForCreate.nutritional_content = productData.nutritional_content;
    }
    if (productData.usage_instructions !== undefined) {
      productDataForCreate.usage_instructions = productData.usage_instructions;
    }
    if (productData.expiry_date !== undefined) {
      productDataForCreate.expiry_date = productData.expiry_date;
    }
    if (productData.badge_primary_text !== undefined) {
      productDataForCreate.badge_primary_text = productData.badge_primary_text;
    }
    if (productData.badge_primary_hidden !== undefined) {
      productDataForCreate.badge_primary_hidden = productData.badge_primary_hidden;
    }
    if (productData.badge_secondary_text !== undefined) {
      productDataForCreate.badge_secondary_text = productData.badge_secondary_text;
    }
    if (productData.badge_secondary_hidden !== undefined) {
      productDataForCreate.badge_secondary_hidden = productData.badge_secondary_hidden;
    }

    const newProduct = await prisma.product.create({
      data: productDataForCreate,
    });
    // Artık productData.price üzerinden kontrol ediyoruz
    if (newProduct && productData.price) {
      await createCombinedVariantsForProduct(newProduct.id, productData.price, productData.variantConfig);
    } else {
      console.warn(`'${productData.name}' için fiyat bulunamadığından varyant oluşturulamadı.`);
    }
  };

  const productDefinitions = [
    {
      name: 'Whey Protein', slug: 'whey-protein', price: 494.10,
      short_explanation: 'Yüksek kaliteli whey protein tozu... Kas gelişimi için ideal',
      category_id: proteinCategory.id, imageSlug: 'whey-protein',
      tags: ['ÇOK SATAN', 'YENİ ÜRÜN', 'LİMİTED STOK'],
      expiry_date: '12.2025',
      badge_primary_text: 'VEJETARYEN',
      badge_primary_hidden: false,
      badge_secondary_text: 'GLUTENSİZ',
      badge_secondary_hidden: false,
      features: `Yüksek protein içeriği ile kas gelişimini destekler.
Düşük şeker ve yağ oranı ile diyetinize uygundur.
Lezzetli aromaları ile keyifli bir tüketim sunar.
Hızlı emilimi sayesinde antrenman sonrası için idealdir.
DigeZyme® enzim kompleksi ile sindirimi kolaylaştırır.`,
      variantConfig: {
        discountedAromas: ['Çilek', 'Muz'],
        discountPercentage: 15,
        stockVariations: { '1000g': 75, '400g': 30, '2300g': 20 },
      },
      nutritional_content: `İÇİNDEKİLER:

Bisküvi Aromalı:
Whey Proteini Konsantresi (Süt), Aroma Verici, DigeZyme® (Multi-Enzim Karışımı)(Proteaz, Laktaz, Selülaz. Amilaz, Lipaz), Tatlandırıcı: Sukraloz, Emülgatör: Ayçiçek Lesitini, B6 Vitamini (Piridoksin Hidroklorür)

Çikolata Aromalı:
Whey Proteini Konsantresi (Süt), Aroma Verici, Yağı Azaltılmış Kakao, DigeZyme® (Multi-Enzim Karışımı)(Proteaz, Laktaz, Selülaz. Amilaz, Lipaz), Tatlandırıcı: Sukraloz, Emülgatör: Ayçiçek Lesitini, B6 Vitamini (Piridoksin Hidroklorür)

Choco Nut Aromalı:
Whey Proteini Konsantresi (Süt), Aroma Verici, Yağı Azaltılmış Kakao, DigeZyme® (Multi-Enzim Karışımı)(Proteaz, Laktaz, Selülaz. Amilaz, Lipaz), Tatlandırıcı: Sukraloz, Emülgatör: Ayçiçek Lesitini, B6 Vitamini (Piridoksin Hidroklorür)

Salted Caramel Aromalı:
Whey Proteini Konsantresi (Süt), Aroma Verici, Himalaya Tuzu, Renklendirici: Karamel, DigeZyme® (Multi-Enzim Karışımı)(Proteaz, Laktaz, Selülaz. Amilaz, Lipaz), Tatlandırıcı: Sukraloz, Emülgatör: Ayçiçek Lesitini, B6 Vitamini (Piridoksin Hidroklorür)

Muz Aromalı:
Whey Proteini Konsantresi (Süt), Aroma Verici, DigeZyme® (Multi-Enzim Karışımı)(Proteaz, Laktaz, Selülaz. Amilaz, Lipaz), Tatlandırıcı: Sukraloz, Emülgatör: Ayçiçek Lesitini, B6 Vitamini (Piridoksin Hidroklorür)

Çilek Aromalı:
Whey Proteini Konsantresi (Süt), Aroma Verici, Renklendirici: Pancar Kökü Kırmızısı, DigeZyme® (Multi-Enzim Karışımı)(Proteaz, Laktaz, Selülaz. Amilaz, Lipaz), Tatlandırıcı: Sukraloz, Emülgatör: Ayçiçek Lesitini, B6 Vitamini ((Piridoksin Hidroklorür)

Birthday Cake Aromalı:
Whey Proteini Konsantresi (Süt), Aroma Verici, Pasta Süsü, DigeZyme® (Multi-Enzim Karışımı)(Proteaz, Laktaz, Selülaz. Amilaz, Lipaz), Tatlandırıcı: Sukraloz, Vanilin, Emülgatör: Ayçiçek Lesitini, B6 Vitamini ((Piridoksin Hidroklorür)

Dubai Çikolatası Aromalı:
Whey Proteini Konsantresi (Süt), Aroma Verici, Yağı Azatılmış Kakao, Çıtır Kadayıf, DigeZyme® (Multi-Enzim Karışımı), Tatlandırıcı: Sukraloz, Vanilin, Emülgatör: Ayçiçek Lesitini, B6 Vitamini (Piridoksin Hidroklorür)

Cookie & Cream Aromalı:
Whey Proteini Konsantresi (Süt), Aroma Verici, Yağı Azatılmış Kakao, DigeZyme® (Multi-Enzim Karışımı)(Proteaz, Laktaz, Selülaz. Amilaz, Lipaz), Tatlandırıcı: Sukraloz, Vanilin, Emülgatör: Ayçiçek Lesitini, B6 Vitamini (Piridoksin Hidroklorür)`,
      usage_instructions: `Antrenman sonrası ve sabah uyandığında, su veya süt ile karıştırarak tüketilmesini öneririz. 1 ölçek (yaklaşık 25 gram) ürünü 200 ml su veya süt ile karıştırarak tüketebilirsiniz.

Önemli Not: Ürünün köpürmesi doğaldır ve köpüğün geçmesi için birkaç dakika bekletmek yeterlidir.

Bunun dışında ihtiyacına göre pratik ve lezzetli bir şekilde gün içerisinde protein tüketmek için idealdir. Bu şekilde günde 1-4 servis kullanılabilir.

Ne kadar az sıvı kullanırsan tadı o kadar yoğun olacaktır. Damak tadına göre koyacağın sıvı miktarını ayarlayabilirsin.`
    },
    {
      name: 'Whey Isolate', slug: 'whey-isolate', price: 749.00,
      short_explanation: 'Daha saf ve hızlı emilen izole whey protein... Laktoz oranı düşük',
      category_id: proteinCategory.id, imageSlug: 'whey-isolate',
      tags: ['LİMİTED STOK', 'YENİ ÜRÜN'],
      expiry_date: '10.2025',
      features: `%90+ protein içeriği ile maksimum saflık.
Laktoz intoleransı olanlar için uygun.
Hızlı emilim ile antrenman sonrası toparlanmayı hızlandırır.
Düşük karbonhidrat ve yağ içeriği.
Mikrofiltrasyon ile üretilmiş yüksek kalite.`,
      nutritional_content: `İÇİNDEKİLER:
Whey Protein İzolatı (Süt), Aroma Verici, Tatlandırıcı: Sukraloz, Emülgatör: Ayçiçek Lesitini, B6 Vitamini (Piridoksin Hidroklorür)

BESLENME BİLGİLERİ (100g):
Enerji: 1650 kJ / 390 kcal
Protein: 90g
Karbonhidrat: 2g
Yağ: 1g`,
      usage_instructions: `Antrenman sonrası 1 ölçek (30g) ürünü 250ml su veya süt ile karıştırın. Günde 1-3 servis tüketilebilir.`,
      variantConfig: {
        discountedSizes: ['400g'],
        discountPercentage: 10,
        stockVariations: { '1000g': 50, '400g': 15, '2300g': 10 },
      },
    },
    {
      name: 'Mass Gainer', slug: 'mass-gainer', price: 1200.00,
      short_explanation: 'Hacim kazanmak isteyenler için yüksek kalorili karbonhidrat ve protein karışımı.',
      category_id: sporGidalariCategory.id, imageSlug: 'mass-gainer',
      tags: ['ÇOK SATAN', 'YÜKSEK KALORİ'],
      expiry_date: '08.2025',
      features: `Yüksek kalorili içerik ile hızlı kilo alımı sağlar.
Karbonhidrat ve protein dengesi ile kas gelişimini destekler.
Kolay karışım ve lezzetli aromalar.
Antrenman sonrası ve öğün aralarında kullanılabilir.
Vitamin ve mineral desteği içerir.`,
      nutritional_content: `İÇİNDEKİLER:
Protein Karışımı (Whey Proteini, Kazein), Maltodekstrin, Dekstroz, Aroma Verici, Vitamin ve Mineral Karışımı, Tatlandırıcı: Sukraloz, Emülgatör: Ayçiçek Lesitini

BESLENME BİLGİLERİ (100g):
Enerji: 1650 kJ / 390 kcal
Protein: 30g
Karbonhidrat: 55g
Yağ: 5g`,
      usage_instructions: `Günde 1-2 servis tüketin. 1 ölçek (150g) ürünü 400ml su veya süt ile karıştırın. Antrenman sonrası veya öğün aralarında tüketebilirsiniz.`,
      variantConfig: {
        discountedAromas: ['Çikolata', 'Vanilya'],
        discountPercentage: 12,
        stockVariations: { '1000g': 60, '400g': 20, '2300g': 15 },
      },
    },
    {
      name: 'Vegan Gainer', slug: 'vegan-gainer', price: 1350.00,
      short_explanation: 'Bitkisel bazlı, yüksek kalorili ve proteinli hacim arttırıcı.',
      category_id: proteinCategory.id, imageSlug: 'vegan-gainer',
      tags: ['VEJETARYEN', 'GLUTENSİZ', 'YENİ ÜRÜN'],
      expiry_date: '09.2025',
      badge_primary_text: 'VEJETARYEN',
      badge_primary_hidden: false,
      badge_secondary_text: 'GLUTENSİZ',
      badge_secondary_hidden: false,
      features: `%100 bitkisel bazlı protein kaynağı.
Yüksek kalorili içerik ile veganlar için ideal.
Glutensiz ve laktozsuz formülasyon.
Organik ve sürdürülebilir kaynaklardan üretilmiştir.
B12 ve D vitamini ile zenginleştirilmiştir.`,
      nutritional_content: `İÇİNDEKİLER:
Pirinç Proteini, Bezelye Proteini, Organik Pirinç Şurubu, Organik Hindistan Cevizi Tozu, Aroma Verici, Vitamin ve Mineral Karışımı (B12, D Vitamini), Tatlandırıcı: Stevia

BESLENME BİLGİLERİ (100g):
Enerji: 1700 kJ / 405 kcal
Protein: 35g
Karbonhidrat: 50g
Yağ: 6g`,
      usage_instructions: `Günde 1-2 servis tüketin. 1 ölçek (120g) ürünü 350ml bitkisel süt veya su ile karıştırın.`,
      variantConfig: {
        discountPercentage: 8,
        stockVariations: { '1000g': 40, '400g': 12, '2300g': 8 },
      },
    },
    {
      name: 'Creatine', slug: 'creatine', price: 350.00,
      short_explanation: 'Güç ve performans artışı için mikronize kreatin monohidrat.',
      category_id: sporGidalariCategory.id, imageSlug: 'creatine',
      tags: ['ÇOK SATAN', 'YÜKSEK PERFORMANS'],
      expiry_date: '11.2025',
      features: `Mikronize formülasyon ile hızlı emilim.
Güç ve dayanıklılık artışı sağlar.
Kas kütlesi ve performans gelişimini destekler.
%99+ saflık garantisi.
Tatsız ve kokusuz, kolay kullanım.`,
      nutritional_content: `İÇİNDEKİLER:
Kreatin Monohidrat (Mikronize)

BESLENME BİLGİLERİ (5g servis):
Kreatin: 5g`,
      usage_instructions: `Yükleme fazı: İlk hafta günde 4 servis (20g), sonrasında günde 1 servis (5g). 1 servis (5g) ürünü 200ml su veya meyve suyu ile karıştırın. Antrenman öncesi veya sonrası tüketin.`,
      variantConfig: {
        discountedSizes: ['1000g'],
        discountPercentage: 18,
        stockVariations: { '1000g': 100, '400g': 40, '2300g': 25 },
      },
    },
    {
      name: 'Cream of Rice', slug: 'cream-of-rice', price: 239.00,
      short_explanation: 'Sporcular için sindirimi kolay... Hızlı karbonhidrat kaynağı',
      category_id: gidaCategory.id, imageSlug: 'cream-of-rice',
      tags: ['GLUTENSİZ', 'HIZLI KARBONHİDRAT'],
      expiry_date: '06.2025',
      badge_primary_text: 'GLUTENSİZ',
      badge_primary_hidden: false,
      badge_secondary_text: null,
      badge_secondary_hidden: true,
      features: `Hızlı sindirilen karbonhidrat kaynağı.
Glutensiz ve doğal içerik.
Antrenman öncesi enerji desteği.
Kolay hazırlanır ve lezzetli.
Sporcular için ideal öğün alternatifi.`,
      nutritional_content: `İÇİNDEKİLER:
Pirinç Unu, Aroma Verici, Tatlandırıcı: Sukraloz

BESLENME BİLGİLERİ (100g):
Enerji: 1550 kJ / 370 kcal
Protein: 7g
Karbonhidrat: 80g
Yağ: 1g`,
      usage_instructions: `Antrenman öncesi 1 ölçek (50g) ürünü 200ml sıcak su veya süt ile karıştırın. 5 dakika bekleyip tüketin.`,
      variantConfig: {
        discountPercentage: 5,
        stockVariations: { '1000g': 80, '400g': 35, '2300g': 20 },
      },
    },
    {
      name: 'Micellar Casein', slug: 'micellar-casein', price: 899.00,
      short_explanation: 'Yavaş sindirilen, uzun süreli protein salınımı sağlayan kazein.',
      category_id: proteinCategory.id, imageSlug: 'micellar-casein',
      tags: ['GECE PROTEİNİ', 'YAVAŞ SALINIM'],
      expiry_date: '07.2025',
      features: `Yavaş sindirilen protein ile uzun süreli amino asit desteği.
Gece boyunca kas onarımını destekler.
Tokluk hissi sağlar.
Yüksek kazein içeriği.
Kremamsı kıvam ve lezzetli aromalar.`,
      nutritional_content: `İÇİNDEKİLER:
Mikellar Kazein (Süt), Aroma Verici, Tatlandırıcı: Sukraloz, Emülgatör: Ayçiçek Lesitini

BESLENME BİLGİLERİ (100g):
Enerji: 1600 kJ / 380 kcal
Protein: 80g
Karbonhidrat: 4g
Yağ: 2g`,
      usage_instructions: `Yatmadan önce 1 ölçek (35g) ürünü 300ml su veya süt ile karıştırın. Gece boyunca kas onarımı için idealdir.`,
      variantConfig: {
        discountedAromas: ['Vanilya', 'Çikolata'],
        discountPercentage: 10,
        stockVariations: { '1000g': 45, '400g': 18, '2300g': 12 },
      },
    },
    {
      name: 'Pea Protein', slug: 'pea-protein', price: 650.00,
      short_explanation: 'Veganlar için ideal, bezelyeden elde edilmiş yüksek kaliteli protein.',
      category_id: proteinCategory.id, imageSlug: 'pea-protein',
      tags: ['VEJETARYEN', 'GLUTENSİZ', 'DOĞAL'],
      expiry_date: '05.2025',
      badge_primary_text: 'VEJETARYEN',
      badge_primary_hidden: false,
      badge_secondary_text: 'GLUTENSİZ',
      badge_secondary_hidden: false,
      features: `%100 bitkisel protein kaynağı.
Tam amino asit profili.
Glutensiz ve laktozsuz.
Sindirimi kolay ve alerjen riski düşük.
Sürdürülebilir ve çevre dostu.`,
      nutritional_content: `İÇİNDEKİLER:
Bezelye Proteini İzolatı, Aroma Verici, Tatlandırıcı: Stevia, Emülgatör: Ayçiçek Lesitini

BESLENME BİLGİLERİ (100g):
Enerji: 1550 kJ / 370 kcal
Protein: 85g
Karbonhidrat: 3g
Yağ: 2g`,
      usage_instructions: `Günde 1-3 servis tüketin. 1 ölçek (30g) ürünü 250ml su veya bitkisel süt ile karıştırın.`,
      variantConfig: {
        discountPercentage: 7,
        stockVariations: { '1000g': 55, '400g': 22, '2300g': 15 },
      },
    },
    {
      name: 'Soya Protein', slug: 'soya-protein', price: 550.00,
      short_explanation: 'Soya fasulyesinden elde edilen, tam bir amino asit profiline sahip bitkisel protein.',
      category_id: proteinCategory.id, imageSlug: 'soya-protein',
      tags: ['VEJETARYEN', 'EKONOMİK', 'TAM AMİNO ASİT'],
      expiry_date: '04.2025',
      badge_primary_text: 'VEJETARYEN',
      badge_primary_hidden: false,
      badge_secondary_text: 'TAM AMİNO ASİT',
      badge_secondary_hidden: false,
      features: `Tam amino asit profili ile eksiksiz protein kaynağı.
Bitkisel bazlı ve ekonomik seçenek.
İzoflavon içeriği ile sağlık faydaları.
Kolay sindirilebilir formülasyon.
Çevre dostu üretim.`,
      nutritional_content: `İÇİNDEKİLER:
Soya Proteini İzolatı, Aroma Verici, Tatlandırıcı: Sukraloz, Emülgatör: Ayçiçek Lesitini

BESLENME BİLGİLERİ (100g):
Enerji: 1580 kJ / 375 kcal
Protein: 88g
Karbonhidrat: 2g
Yağ: 1g`,
      usage_instructions: `Günde 1-3 servis tüketin. 1 ölçek (30g) ürünü 250ml su veya bitkisel süt ile karıştırın.`,
      variantConfig: {
        discountedSizes: ['400g', '1000g'],
        discountPercentage: 15,
        stockVariations: { '1000g': 70, '400g': 28, '2300g': 18 },
      },
    }
  ];

  for (const productDef of productDefinitions) {
    await createProductWithVariants(productDef);
  }

  // 7. Paket ürünlerini oluştur (sadece boyut varyantı ile, aroma yok)
  console.log('Paket ürünleri oluşturuluyor...');
  
  const createPackageProduct = async (packageData: {
    name: string;
    slug: string;
    price: number;
    short_explanation?: string;
    imageSlug: string; // packages-images bucket'indeki görsel slug'ı
    features?: string | null;
    nutritional_content?: string | null;
    usage_instructions?: string | null;
    expiry_date?: string | null;
    badge_primary_text?: string | null;
    badge_primary_hidden?: boolean;
    badge_secondary_text?: string | null;
    badge_secondary_hidden?: boolean;
  }) => {
    const image = packagesImages.find(img => img.url.includes(packageData.imageSlug));
    if (!image) {
      console.warn(`'${packageData.name}' için paket görseli bulunamadı. Ürün oluşturma atlandı.`);
      return;
    }

    const packageBoyutId = boyutValues.get(paketBoyut);
    if (!packageBoyutId) {
      console.warn(`'${paketBoyut}' boyut değeri bulunamadı. Paket ürünü oluşturulamadı.`);
      return;
    }

    const productDataForCreate: any = {
      name: packageData.name,
      slug: packageData.slug,
      short_explanation: packageData.short_explanation || null,
      category_id: paketlerCategory.id,
      tags: [],
      images: { connect: { id: image.id } },
    };

    if (packageData.features !== undefined) {
      productDataForCreate.features = packageData.features;
    }
    if (packageData.nutritional_content !== undefined) {
      productDataForCreate.nutritional_content = packageData.nutritional_content;
    }
    if (packageData.usage_instructions !== undefined) {
      productDataForCreate.usage_instructions = packageData.usage_instructions;
    }
    if (packageData.expiry_date !== undefined) {
      productDataForCreate.expiry_date = packageData.expiry_date;
    }
    if (packageData.badge_primary_text !== undefined) {
      productDataForCreate.badge_primary_text = packageData.badge_primary_text;
    }
    if (packageData.badge_primary_hidden !== undefined) {
      productDataForCreate.badge_primary_hidden = packageData.badge_primary_hidden;
    }
    if (packageData.badge_secondary_text !== undefined) {
      productDataForCreate.badge_secondary_text = packageData.badge_secondary_text;
    }
    if (packageData.badge_secondary_hidden !== undefined) {
      productDataForCreate.badge_secondary_hidden = packageData.badge_secondary_hidden;
    }

    const newPackage = await prisma.product.create({
      data: productDataForCreate,
    });

    // Sadece "6'lı Set" boyut varyantı oluştur (Aroma yok)
    await prisma.productVariant.create({
      data: {
        productId: newPackage.id,
        price: packageData.price,
        stock: 50, // Varsayılan stok
        discounted_price: null,
        optionValues: {
          connect: [{ id: packageBoyutId }], // Sadece boyut, aroma yok
        },
        images: {
          connect: { id: image.id }, // Paket görseli varyanta da bağlanır
        },
      },
    });
  };

  const packageDefinitions = [
    {
      name: 'Cream of Rice Paket',
      slug: 'cream-of-rice-paket',
      price: 1200.00,
      short_explanation: '6 adet Cream of Rice ürününden oluşan özel paket.',
      imageSlug: 'creamofricepaket',
      features: `6 adet Cream of Rice ürünü.
Özel paket fiyatı ile tasarruf.
Hızlı karbonhidrat kaynağı.
Glutensiz ve doğal içerik.
Sporcular için ideal öğün alternatifi.`,
      nutritional_content: `İÇİNDEKİLER:
Pirinç Unu, Aroma Verici, Tatlandırıcı: Sukraloz

PAKET İÇERİĞİ:
6 adet Cream of Rice ürünü`,
      usage_instructions: `Antrenman öncesi 1 ölçek (50g) ürünü 200ml sıcak su veya süt ile karıştırın. 5 dakika bekleyip tüketin.`,
      expiry_date: '12.2025',
    },
    {
      name: 'Protein Bar Paket',
      slug: 'protein-bar-paket',
      price: 450.00,
      short_explanation: '6 adet Protein Bar ürününden oluşan özel paket.',
      imageSlug: 'proteinbar',
      features: `6 adet Protein Bar ürünü.
Yüksek protein içeriği.
Pratik ve taşınabilir.
Lezzetli çeşitler.
Antrenman öncesi ve sonrası için ideal.`,
      nutritional_content: `PAKET İÇERİĞİ:
6 adet Protein Bar ürünü`,
      usage_instructions: `Günde 1-2 adet tüketebilirsiniz. Antrenman öncesi veya sonrası, öğün aralarında tüketilebilir.`,
      expiry_date: '11.2025',
    },
    {
      name: 'Whey Protein Paket',
      slug: 'whey-protein-paket',
      price: 2500.00,
      short_explanation: '6 adet Whey Protein ürününden oluşan özel paket.',
      imageSlug: 'wheypaket',
      features: `6 adet Whey Protein ürünü.
Özel paket fiyatı ile büyük tasarruf.
Yüksek kaliteli whey protein.
Çeşitli aromalar.
Kas gelişimi için ideal.`,
      nutritional_content: `PAKET İÇERİĞİ:
6 adet Whey Protein ürünü`,
      usage_instructions: `Antrenman sonrası ve sabah uyandığında, su veya süt ile karıştırarak tüketilmesini öneririz. 1 ölçek (yaklaşık 25 gram) ürünü 200 ml su veya süt ile karıştırarak tüketebilirsiniz.`,
      expiry_date: '12.2025',
      badge_primary_text: 'VEJETARYEN',
      badge_primary_hidden: false,
      badge_secondary_text: 'GLUTENSİZ',
      badge_secondary_hidden: false,
    },
  ];

  for (const packageDef of packageDefinitions) {
    await createPackageProduct(packageDef);
  }

  console.log('Seed işlemi başarıyla tamamlandı.');
}

main()
    .catch((e) => {
    console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


