"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { SiteSettings, Image as ImageType, Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Save, Image as ImageIcon, Search, PlusCircle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Check } from 'lucide-react';

interface HomepageManagementProps {
  images: ImageType[];
  products: Product[];
}

export const HomepageManagement: React.FC<HomepageManagementProps> = ({
  images,
  products,
}) => {
  const { authFetch } = useAuth();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDesktopBannerGalleryOpen, setIsDesktopBannerGalleryOpen] = useState(false);
  const [isMobileBannerGalleryOpen, setIsMobileBannerGalleryOpen] = useState(false);
  const [tempDesktopBannerImageId, setTempDesktopBannerImageId] = useState<string | null>(null);
  const [tempMobileBannerImageId, setTempMobileBannerImageId] = useState<string | null>(null);
  const [isPromoDesktopGalleryOpen, setIsPromoDesktopGalleryOpen] = useState(false);
  const [isPromoMobileGalleryOpen, setIsPromoMobileGalleryOpen] = useState(false);
  const [tempPromoDesktopImageId, setTempPromoDesktopImageId] = useState<string | null>(null);
  const [tempPromoMobileImageId, setTempPromoMobileImageId] = useState<string | null>(null);
  const [isLogoDefaultGalleryOpen, setIsLogoDefaultGalleryOpen] = useState(false);
  const [isLogoWhiteGalleryOpen, setIsLogoWhiteGalleryOpen] = useState(false);
  const [tempLogoDefaultImageId, setTempLogoDefaultImageId] = useState<string | null>(null);
  const [tempLogoWhiteImageId, setTempLogoWhiteImageId] = useState<string | null>(null);
  const [isPackagesDesktopGalleryOpen, setIsPackagesDesktopGalleryOpen] = useState(false);
  const [isPackagesMobileGalleryOpen, setIsPackagesMobileGalleryOpen] = useState(false);
  const [tempPackagesDesktopImageId, setTempPackagesDesktopImageId] = useState<string | null>(null);
  const [tempPackagesMobileImageId, setTempPackagesMobileImageId] = useState<string | null>(null);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  // Site ayarlarını fetch et
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/settings`, {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          setSiteSettings(data);
        }
      } catch (error) {
        console.error('Site ayarları getirilemedi:', error);
      }
    };
    fetchSiteSettings();
  }, []);

  const handleSave = async () => {
    if (!siteSettings) return;
    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });
      if (response.ok) {
        alert('AnaSayfa ayarları başarıyla kaydedildi');
      } else {
        throw new Error('Ayarlar güncellenemedi');
      }
    } catch (error) {
      console.error('AnaSayfa ayarları güncellenemedi:', error);
      alert('AnaSayfa ayarları güncellenirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const openDesktopBannerGallery = () => {
    setTempDesktopBannerImageId(siteSettings?.homepage_banner_desktop_url || null);
    setIsDesktopBannerGalleryOpen(true);
  };

  const openMobileBannerGallery = () => {
    setTempMobileBannerImageId(siteSettings?.homepage_banner_mobile_url || null);
    setIsMobileBannerGalleryOpen(true);
  };

  const openPromoDesktopGallery = () => {
    setTempPromoDesktopImageId(siteSettings?.homepage_promotion_banner_desktop_url || null);
    setIsPromoDesktopGalleryOpen(true);
  };

  const openPromoMobileGallery = () => {
    setTempPromoMobileImageId(siteSettings?.homepage_promotion_banner_mobile_url || null);
    setIsPromoMobileGalleryOpen(true);
  };

  const openLogoDefaultGallery = () => {
    setTempLogoDefaultImageId(siteSettings?.logo_image_url || null);
    setIsLogoDefaultGalleryOpen(true);
  };

  const openLogoWhiteGallery = () => {
    setTempLogoWhiteImageId(siteSettings?.logo_white_image_url || null);
    setIsLogoWhiteGalleryOpen(true);
  };

  const handleSelectDesktopBanner = () => {
    if (siteSettings && tempDesktopBannerImageId) {
      setSiteSettings({
        ...siteSettings,
        homepage_banner_desktop_url: tempDesktopBannerImageId,
      });
    }
    setIsDesktopBannerGalleryOpen(false);
  };

  const handleSelectMobileBanner = () => {
    if (siteSettings && tempMobileBannerImageId) {
      setSiteSettings({
        ...siteSettings,
        homepage_banner_mobile_url: tempMobileBannerImageId,
      });
    }
    setIsMobileBannerGalleryOpen(false);
  };

  const handleSelectPromoDesktopBanner = () => {
    if (siteSettings && tempPromoDesktopImageId) {
      setSiteSettings({
        ...siteSettings,
        homepage_promotion_banner_desktop_url: tempPromoDesktopImageId,
      });
    }
    setIsPromoDesktopGalleryOpen(false);
  };

  const handleSelectPromoMobileBanner = () => {
    if (siteSettings && tempPromoMobileImageId) {
      setSiteSettings({
        ...siteSettings,
        homepage_promotion_banner_mobile_url: tempPromoMobileImageId,
      });
    }
    setIsPromoMobileGalleryOpen(false);
  };

  const handleSelectLogoDefault = () => {
    if (siteSettings && tempLogoDefaultImageId) {
      setSiteSettings({
        ...siteSettings,
        logo_image_url: tempLogoDefaultImageId,
      });
    }
    setIsLogoDefaultGalleryOpen(false);
  };

  const handleSelectLogoWhite = () => {
    if (siteSettings && tempLogoWhiteImageId) {
      setSiteSettings({
        ...siteSettings,
        logo_white_image_url: tempLogoWhiteImageId,
      });
    }
    setIsLogoWhiteGalleryOpen(false);
  };

  const toggleTempDesktopBannerSelection = (url: string) => {
    setTempDesktopBannerImageId(prev => (prev === url ? null : url));
  };

  const toggleTempMobileBannerSelection = (url: string) => {
    setTempMobileBannerImageId(prev => (prev === url ? null : url));
  };

  const toggleTempPromoDesktopSelection = (url: string) => {
    setTempPromoDesktopImageId(prev => (prev === url ? null : url));
  };

  const toggleTempPromoMobileSelection = (url: string) => {
    setTempPromoMobileImageId(prev => (prev === url ? null : url));
  };

  const toggleTempLogoDefaultSelection = (url: string) => {
    setTempLogoDefaultImageId(prev => (prev === url ? null : url));
  };

  const toggleTempLogoWhiteSelection = (url: string) => {
    setTempLogoWhiteImageId(prev => (prev === url ? null : url));
  };

  const openPackagesDesktopGallery = () => {
    setTempPackagesDesktopImageId(siteSettings?.packages_banner_desktop_url || null);
    setIsPackagesDesktopGalleryOpen(true);
  };

  const openPackagesMobileGallery = () => {
    setTempPackagesMobileImageId(siteSettings?.packages_banner_mobile_url || null);
    setIsPackagesMobileGalleryOpen(true);
  };

  const handleSelectPackagesDesktopBanner = () => {
    if (siteSettings && tempPackagesDesktopImageId) {
      setSiteSettings({
        ...siteSettings,
        packages_banner_desktop_url: tempPackagesDesktopImageId,
      });
    }
    setIsPackagesDesktopGalleryOpen(false);
  };

  const handleSelectPackagesMobileBanner = () => {
    if (siteSettings && tempPackagesMobileImageId) {
      setSiteSettings({
        ...siteSettings,
        packages_banner_mobile_url: tempPackagesMobileImageId,
      });
    }
    setIsPackagesMobileGalleryOpen(false);
  };

  const toggleTempPackagesDesktopSelection = (url: string) => {
    setTempPackagesDesktopImageId(prev => (prev === url ? null : url));
  };

  const toggleTempPackagesMobileSelection = (url: string) => {
    setTempPackagesMobileImageId(prev => (prev === url ? null : url));
  };

  const selectedDesktopBanner = images.find(img => img.url === siteSettings?.homepage_banner_desktop_url);
  const selectedMobileBanner = images.find(img => img.url === siteSettings?.homepage_banner_mobile_url);
  const selectedPromoDesktopBanner = images.find(img => img.url === siteSettings?.homepage_promotion_banner_desktop_url);
  const selectedPromoMobileBanner = images.find(img => img.url === siteSettings?.homepage_promotion_banner_mobile_url);
  const selectedLogoDefault = images.find(img => img.url === siteSettings?.logo_image_url);
  const selectedLogoWhite = images.find(img => img.url === siteSettings?.logo_white_image_url);
  const selectedPackagesDesktopBanner = images.find(img => img.url === siteSettings?.packages_banner_desktop_url);
  const selectedPackagesMobileBanner = images.find(img => img.url === siteSettings?.packages_banner_mobile_url);

  const popularProductOptions = useMemo(
    () =>
      products.map((product) => ({
        label: product.name,
        slug: product.slug,
      })),
    [products],
  );

  const selectedPopularSlugs = useMemo(
    () => siteSettings?.popular_product_slugs ?? [],
    [siteSettings?.popular_product_slugs],
  );
  const maxPopularProducts = siteSettings?.popular_products_limit ?? 9;

  const handleTogglePopularProduct = (slug: string) => {
    if (!siteSettings) return;
    const current = siteSettings.popular_product_slugs ?? [];
    const exists = current.includes(slug);
    if (!exists && current.length >= maxPopularProducts) {
      alert(`En fazla ${maxPopularProducts} ürün seçebilirsiniz. Limiti artırmak için aşağıdaki alanı kullanın.`);
      return;
    }
    const updated = exists
      ? current.filter((item) => item !== slug)
      : [...current, slug];
    setSiteSettings({
      ...siteSettings,
      popular_product_slugs: updated,
    });
  };

  const handlePopularLimitChange = (value: number) => {
    if (!siteSettings) return;
    const clamped = Math.min(Math.max(value, 1), 12);
    setSiteSettings({
      ...siteSettings,
      popular_products_limit: clamped,
    });
  };


  const selectedPopularProducts = useMemo(() => {
    if (selectedPopularSlugs.length === 0) return [];
    const optionMap = new Map(popularProductOptions.map((opt) => [opt.slug, opt.label]));
    return selectedPopularSlugs.map((slug) => ({
      slug,
      label: optionMap.get(slug) ?? slug,
    }));
  }, [selectedPopularSlugs, popularProductOptions]);

  const filteredProductOptions = useMemo(() => {
    const term = productSearchTerm.trim().toLowerCase();
    if (!term) {
      return products;
    }
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.slug.toLowerCase().includes(term),
    );
  }, [products, productSearchTerm]);

  const canAddMorePopularProducts = selectedPopularSlugs.length < maxPopularProducts;

  const handleAddPopularProduct = (slug: string) => {
    if (selectedPopularSlugs.includes(slug)) return;
    handleTogglePopularProduct(slug);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AnaSayfa Banner Yönetimi</h2>
          <p className="mt-1 text-sm text-gray-600">
            AnaSayfa banner görsellerini ve ayarlarını düzenleyin.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || !siteSettings}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </Button>
      </div>

      {siteSettings && (
        <>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Desktop Banner */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Masaüstü Banner</h3>
            <div className="flex items-center gap-4">
              {selectedDesktopBanner ? (
                <div className="relative w-48 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={selectedDesktopBanner.url}
                    alt="Desktop Banner"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <Button variant="outline" onClick={openDesktopBannerGallery}>
                {selectedDesktopBanner ? 'Görseli Değiştir' : 'Görsel Seç'}
              </Button>
            </div>
          </div>

          {/* Mobile Banner */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Mobil Banner</h3>
            <div className="flex items-center gap-4">
              {selectedMobileBanner ? (
                <div className="relative w-48 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={selectedMobileBanner.url}
                    alt="Mobile Banner"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <Button variant="outline" onClick={openMobileBannerGallery}>
                {selectedMobileBanner ? 'Görseli Değiştir' : 'Görsel Seç'}
              </Button>
            </div>
          </div>

          {/* Hidden Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={siteSettings.homepage_banner_hidden}
              onCheckedChange={(checked) => {
                setSiteSettings({
                  ...siteSettings,
                  homepage_banner_hidden: checked === true,
                });
              }}
            />
            <label className="text-sm font-medium text-gray-700">
              Banner&apos;i gizle
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Promosyon Banner (HomepagePromotionBanner)</h3>
            <p className="text-sm text-gray-600">Ana sayfadaki ikinci banner alanını yönetir.</p>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={siteSettings.homepage_promotion_banner_hidden}
                onCheckedChange={(checked) =>
                  setSiteSettings({
                    ...siteSettings,
                    homepage_promotion_banner_hidden: checked === true,
                  })
                }
              />
              <label className="text-sm font-medium text-gray-700">
                Promosyon banner&apos;ı gizle
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900">Masaüstü Banner</h4>
            <div className="flex items-center gap-4">
              {selectedPromoDesktopBanner ? (
                <div className="relative w-48 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={selectedPromoDesktopBanner.url}
                    alt="Promosyon Desktop Banner"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <Button variant="outline" onClick={openPromoDesktopGallery}>
                {selectedPromoDesktopBanner ? 'Görseli Değiştir' : 'Görsel Seç'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900">Mobil Banner</h4>
            <div className="flex items-center gap-4">
              {selectedPromoMobileBanner ? (
                <div className="relative w-48 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={selectedPromoMobileBanner.url}
                    alt="Promosyon Mobile Banner"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <Button variant="outline" onClick={openPromoMobileGallery}>
                {selectedPromoMobileBanner ? 'Görseli Değiştir' : 'Görsel Seç'}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Logo Yönetimi</h3>
            <p className="mt-1 text-sm text-gray-600">
              Navbar (renkli) ve footer (beyaz) logolarını Supabase&apos;deki <code>logo</code> bucket&apos;ından seçin.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <h4 className="text-md font-semibold text-gray-900">Navbar Logosu</h4>
                <p className="text-sm text-gray-600">Koyu arka planlarda kullanılan standart logo.</p>
              </div>
              <div className="flex items-center gap-4">
                {selectedLogoDefault ? (
                  <div className="relative w-48 h-20 border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                    <Image
                      src={selectedLogoDefault.url}
                      alt="Navbar Logosu"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <Button variant="outline" onClick={openLogoDefaultGallery}>
                  {selectedLogoDefault ? 'Görseli Değiştir' : 'Görsel Seç'}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Supabase &quot;logo&quot; bucket&apos;ına yüklediğiniz <code>ojslogo.webp</code> gibi dosyaları seçebilirsiniz.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-md font-semibold text-gray-900">Footer Logosu (Beyaz)</h4>
                <p className="text-sm text-gray-600">Açık arka planlarda kullanılacak beyaz logo.</p>
              </div>
              <div className="flex items-center gap-4">
                {selectedLogoWhite ? (
                  <div className="relative w-48 h-20 border rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                    <Image
                      src={selectedLogoWhite.url}
                      alt="Footer Logosu"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <Button variant="outline" onClick={openLogoWhiteGallery}>
                  {selectedLogoWhite ? 'Görseli Değiştir' : 'Görsel Seç'}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Footer&apos;da kullanılan beyaz logo için Supabase &quot;logo&quot; bucket&apos;ındaki <code>logowhite.webp</code> dosyasını seçin.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4 mt-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Category Showcase Ayarları</h3>
            <p className="mt-1 text-sm text-gray-600">
              Ana sayfadaki kategori vitrinini görünür/gizli hale getirin.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={siteSettings.category_showcase_hidden}
              onCheckedChange={(checked) =>
                setSiteSettings({
                  ...siteSettings,
                  category_showcase_hidden: checked === true,
                })
              }
            />
            <label className="text-sm font-medium text-gray-700">
              Category Showcase&apos;i gizle
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Bu ayar aktifken kategori vitrin bileşeni ana sayfada gösterilmez.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bestsellers Ayarları</h3>
            <p className="mt-1 text-sm text-gray-600">
              Çok Satanlar bölümünü yönetmek için görünürlük ve ürün sayısı ayarlarını yapın.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={siteSettings.bestsellers_hidden}
              onCheckedChange={(checked) =>
                setSiteSettings({
                  ...siteSettings,
                  bestsellers_hidden: checked === true,
                })
              }
            />
            <label className="text-sm font-medium text-gray-700">
              Bestsellers bölümünü gizle
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gösterilecek ürün sayısı (1-6)
            </label>
            <Input
              type="number"
              min={1}
              max={6}
              value={siteSettings.bestsellers_limit ?? 6}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (isNaN(value)) return;
                const clamped = Math.min(Math.max(value, 1), 6);
                setSiteSettings({
                  ...siteSettings,
                  bestsellers_limit: clamped,
                });
              }}
              className="w-32"
            />
            <p className="text-xs text-gray-500 mt-1">
              En fazla 6 ürün gösterilebilir. En az 1 ürün seçilmelidir.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Popüler Ürünler Ayarları</h3>
            <p className="mt-1 text-sm text-gray-600">
              Ana sayfada müşteri yorumlarının üstünde yer alan ve footer ile paylaşılan popüler ürün listesini yönetin.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={siteSettings.popular_products_hidden}
                onCheckedChange={(checked) =>
                  setSiteSettings({
                    ...siteSettings,
                    popular_products_hidden: checked === true,
                  })
                }
              />
              <label className="text-sm font-medium text-gray-700">
                Popüler Ürünler bölümünü gizle
              </label>
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gösterilecek ürün sayısı (1-12)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={siteSettings.popular_products_limit ?? 9}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (isNaN(value)) return;
                    handlePopularLimitChange(value);
                  }}
                  className="w-32"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Seçebileceğiniz maksimum ürün sayısını belirler. Limit arttıkça seçim panelinde daha fazla ürün işaretleyebilirsiniz.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başlık
                  </label>
                  <Input
                    value={siteSettings.popular_products_title || ''}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        popular_products_title: e.target.value,
                      })
                    }
                    placeholder="Örn: Topluluğun Favorileri"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Başlık
                  </label>
                  <textarea
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[80px]"
                    value={siteSettings.popular_products_subtitle || ''}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        popular_products_subtitle: e.target.value,
                      })
                    }
                    placeholder="Örn: Sporcuların en çok tercih ettiği ürünleri keşfet."
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Seçili ürün sıralaması</h4>
                {selectedPopularProducts.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Henüz popüler ürün seçilmedi. Aşağıdaki listeden ürün ekleyin.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {selectedPopularProducts.map((item, index) => (
                      <li
                        key={item.slug}
                        className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.slug}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleTogglePopularProduct(item.slug)}
                            aria-label={`${item.label} ürününü listeden kaldır`}
                          >
                            ✕
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsProductPickerOpen(true)}
                  disabled={!canAddMorePopularProducts && selectedPopularSlugs.length === products.length}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Popüler Ürün Ekle
                </Button>
                {!canAddMorePopularProducts && (
                  <p className="mt-2 text-xs text-yellow-600">
                    Mevcut limit dolu. Yeni bir ürün eklemek için önce listedeki bir ürünü kaldırın veya limit değerini artırın.
                  </p>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Bilgilendirme</h4>
              <p className="text-xs text-gray-500 mb-3">
                “Popüler Ürün Ekle” butonuna tıkladığınızda tüm ürün kataloğunu arayabileceğiniz bir seçim penceresi açılır. Arama yaparak dilediğiniz ürünü ekleyin.
              </p>
              <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600 space-y-2">
                <p>• Seçilen ürünler yukarıdaki listede sıralanır.</p>
                <p>• Aynı ürün iki kez eklenemez.</p>
                <p>• Limit dolduğunda yeni ürün eklemek için önce listeden bir ürünü kaldırın veya limit değerini artırın.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Paket Banner Yönetimi</h3>
            <p className="text-sm text-gray-600">Ana sayfadaki paketler bölümünün üstünde gösterilecek banner görsellerini yönetin.</p>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={siteSettings.packages_banner_hidden}
                onCheckedChange={(checked) =>
                  setSiteSettings({
                    ...siteSettings,
                    packages_banner_hidden: checked === true,
                  })
                }
              />
              <label className="text-sm font-medium text-gray-700">
                Paket banner&apos;ı gizle
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900">Masaüstü Banner</h4>
            <div className="flex items-center gap-4">
              {selectedPackagesDesktopBanner ? (
                <div className="relative w-48 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={selectedPackagesDesktopBanner.url}
                    alt="Paket Desktop Banner"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <Button variant="outline" onClick={openPackagesDesktopGallery}>
                {selectedPackagesDesktopBanner ? 'Görseli Değiştir' : 'Görsel Seç'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900">Mobil Banner</h4>
            <div className="flex items-center gap-4">
              {selectedPackagesMobileBanner ? (
                <div className="relative w-48 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={selectedPackagesMobileBanner.url}
                    alt="Paket Mobile Banner"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <Button variant="outline" onClick={openPackagesMobileGallery}>
                {selectedPackagesMobileBanner ? 'Görseli Değiştir' : 'Görsel Seç'}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Assurance Metni</h3>
            <p className="mt-1 text-sm text-gray-600">Ana sayfanın güvence bölümünde görünen metni düzenleyin.</p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={siteSettings.assurance_hidden}
              onCheckedChange={(checked) =>
                setSiteSettings({
                  ...siteSettings,
                  assurance_hidden: checked === true,
                })
              }
            />
            <label className="text-sm font-medium text-gray-700">
              Assurance bölümünü gizle
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
            <Input
              value={siteSettings.assurance_title || ''}
              onChange={(e) =>
                setSiteSettings({
                  ...siteSettings,
                  assurance_title: e.target.value,
                })
              }
              placeholder="Örn: LABORATUVAR TESTLİ ÜRÜNLER..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metin</label>
            <textarea
              className="w-full min-h-[120px] rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={siteSettings.assurance_text || ''}
              onChange={(e) =>
                setSiteSettings({
                  ...siteSettings,
                  assurance_text: e.target.value,
                })
              }
              placeholder="Örn: 200.000’den fazla ürün yorumumuza dayanarak, ürünlerimizi seveceğinize eminiz..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Bu alan boş bırakılırsa varsayılan güvence metni gösterilir.
            </p>
          </div>
        </div>
        </>
      )}

      {/* Popular Product Picker Dialog */}
      <Dialog open={isProductPickerOpen} onOpenChange={setIsProductPickerOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Popüler Ürün Seç</span>
            </DialogTitle>
            <p className="text-sm text-gray-500">
              Arama alanını kullanarak katalogdaki ürünleri filtreleyin. Bir ürünü eklemek için “Ekle” butonuna tıklayın.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                placeholder="Ürün adı veya slug ara..."
                className="pl-9"
              />
            </div>
            <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
              {filteredProductOptions.length === 0 && (
                <p className="text-sm text-gray-500">Aramanızla eşleşen ürün bulunamadı.</p>
              )}
              {filteredProductOptions.map((product) => {
                const alreadySelected = selectedPopularSlugs.includes(product.slug);
                const disabled = alreadySelected || !canAddMorePopularProducts;
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.slug}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={alreadySelected ? 'secondary' : 'default'}
                      disabled={disabled}
                      onClick={() => handleAddPopularProduct(product.slug)}
                    >
                      {alreadySelected ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Eklendi
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Ekle
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductPickerOpen(false)}>
              Kapat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Desktop Banner Gallery Dialog */}
      <Dialog open={isDesktopBannerGalleryOpen} onOpenChange={setIsDesktopBannerGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Masaüstü Banner Görseli Seç</span>
              <span className="text-xs font-normal text-gray-500">(Geniş görseller seçin)</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {images
              .filter(image => image.bucket === 'homepage-banner-desktop')
              .map(image => (
                <div
                  key={image.id}
                  className="relative aspect-square group border-2 rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    borderColor: tempDesktopBannerImageId === image.url ? 'var(--primary)' : 'transparent',
                  }}
                  onClick={() => toggleTempDesktopBannerSelection(image.url)}
                >
                  <Image src={image.url} alt="Medya görseli" className="w-full h-full object-cover" width={100} height={100} />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center rounded-full bg-blue-500/90 px-2 py-1 text-[10px] font-medium text-white shadow">
                      Desktop
                    </span>
                  </div>
                  {tempDesktopBannerImageId === image.url && (
                    <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDesktopBannerGalleryOpen(false)}>İptal</Button>
            <Button onClick={handleSelectDesktopBanner} disabled={!tempDesktopBannerImageId}>Seçimi Onayla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile Banner Gallery Dialog */}
      <Dialog open={isMobileBannerGalleryOpen} onOpenChange={setIsMobileBannerGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Mobil Banner Görseli Seç</span>
              <span className="text-xs font-normal text-gray-500">(Dikey görseller seçin)</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {images
              .filter(image => image.bucket === 'homepage-banner-mobil')
              .map(image => (
                <div
                  key={image.id}
                  className="relative aspect-square group border-2 rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    borderColor: tempMobileBannerImageId === image.url ? 'var(--primary)' : 'transparent',
                  }}
                  onClick={() => toggleTempMobileBannerSelection(image.url)}
                >
                  <Image src={image.url} alt="Medya görseli" className="w-full h-full object-cover" width={100} height={100} />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center rounded-full bg-green-500/90 px-2 py-1 text-[10px] font-medium text-white shadow">
                      Mobile
                    </span>
                  </div>
                  {tempMobileBannerImageId === image.url && (
                    <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMobileBannerGalleryOpen(false)}>İptal</Button>
            <Button onClick={handleSelectMobileBanner} disabled={!tempMobileBannerImageId}>Seçimi Onayla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo Desktop Banner Gallery Dialog */}
      <Dialog open={isPromoDesktopGalleryOpen} onOpenChange={setIsPromoDesktopGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Promosyon Masaüstü Banner Görseli Seç</span>
              <span className="text-xs font-normal text-gray-500">(Geniş görseller seçin)</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {images
              .filter(image => image.bucket === 'homepage-promotion-banner-desktop')
              .map(image => (
                <div
                  key={image.id}
                  className="relative aspect-square group border-2 rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    borderColor: tempPromoDesktopImageId === image.url ? 'var(--primary)' : 'transparent',
                  }}
                  onClick={() => toggleTempPromoDesktopSelection(image.url)}
                >
                  <Image src={image.url} alt="Medya görseli" className="w-full h-full object-cover" width={100} height={100} />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center rounded-full bg-blue-500/90 px-2 py-1 text-[10px] font-medium text-white shadow">
                      Desktop
                    </span>
                  </div>
                  {tempPromoDesktopImageId === image.url && (
                    <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromoDesktopGalleryOpen(false)}>İptal</Button>
            <Button onClick={handleSelectPromoDesktopBanner} disabled={!tempPromoDesktopImageId}>Seçimi Onayla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo Mobile Banner Gallery Dialog */}
      <Dialog open={isPromoMobileGalleryOpen} onOpenChange={setIsPromoMobileGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Promosyon Mobil Banner Görseli Seç</span>
              <span className="text-xs font-normal text-gray-500">(Dikey görseller seçin)</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {images
              .filter(image => image.bucket === 'homepage-promotion-banner-mobil')
              .map(image => (
                <div
                  key={image.id}
                  className="relative aspect-square group border-2 rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    borderColor: tempPromoMobileImageId === image.url ? 'var(--primary)' : 'transparent',
                  }}
                  onClick={() => toggleTempPromoMobileSelection(image.url)}
                >
                  <Image src={image.url} alt="Medya görseli" className="w-full h-full object-cover" width={100} height={100} />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center rounded-full bg-green-500/90 px-2 py-1 text-[10px] font-medium text-white shadow">
                      Mobile
                    </span>
                  </div>
                  {tempPromoMobileImageId === image.url && (
                    <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromoMobileGalleryOpen(false)}>İptal</Button>
            <Button onClick={handleSelectPromoMobileBanner} disabled={!tempPromoMobileImageId}>Seçimi Onayla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Packages Desktop Banner Gallery Dialog */}
      <Dialog open={isPackagesDesktopGalleryOpen} onOpenChange={setIsPackagesDesktopGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Paket Masaüstü Banner Görseli Seç</span>
              <span className="text-xs font-normal text-gray-500">(Geniş görseller seçin)</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {images
              .filter(image => image.bucket === 'packages-banner-desktop')
              .map(image => (
                <div
                  key={image.id}
                  className="relative aspect-square group border-2 rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    borderColor: tempPackagesDesktopImageId === image.url ? 'var(--primary)' : 'transparent',
                  }}
                  onClick={() => toggleTempPackagesDesktopSelection(image.url)}
                >
                  <Image src={image.url} alt="Medya görseli" className="w-full h-full object-cover" width={100} height={100} />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center rounded-full bg-blue-500/90 px-2 py-1 text-[10px] font-medium text-white shadow">
                      Desktop
                    </span>
                  </div>
                  {tempPackagesDesktopImageId === image.url && (
                    <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPackagesDesktopGalleryOpen(false)}>İptal</Button>
            <Button onClick={handleSelectPackagesDesktopBanner} disabled={!tempPackagesDesktopImageId}>Seçimi Onayla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Packages Mobile Banner Gallery Dialog */}
      <Dialog open={isPackagesMobileGalleryOpen} onOpenChange={setIsPackagesMobileGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Paket Mobil Banner Görseli Seç</span>
              <span className="text-xs font-normal text-gray-500">(Dikey görseller seçin)</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {images
              .filter(image => image.bucket === 'packages-banner-mobil')
              .map(image => (
                <div
                  key={image.id}
                  className="relative aspect-square group border-2 rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    borderColor: tempPackagesMobileImageId === image.url ? 'var(--primary)' : 'transparent',
                  }}
                  onClick={() => toggleTempPackagesMobileSelection(image.url)}
                >
                  <Image src={image.url} alt="Medya görseli" className="w-full h-full object-cover" width={100} height={100} />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center rounded-full bg-green-500/90 px-2 py-1 text-[10px] font-medium text-white shadow">
                      Mobile
                    </span>
                  </div>
                  {tempPackagesMobileImageId === image.url && (
                    <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPackagesMobileGalleryOpen(false)}>İptal</Button>
            <Button onClick={handleSelectPackagesMobileBanner} disabled={!tempPackagesMobileImageId}>Seçimi Onayla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logo (Default) Gallery Dialog */}
      <Dialog open={isLogoDefaultGalleryOpen} onOpenChange={setIsLogoDefaultGalleryOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
    <DialogTitle className="flex items-center gap-2">
      <span>Navbar Logosu Seç</span>
      <span className="text-xs font-normal text-gray-500">(Renkli logo)</span>
    </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {images
              .filter(image => image.bucket === 'logo')
              .map(image => (
                <div
                  key={image.id}
                  className="relative aspect-square group border-2 rounded-lg overflow-hidden cursor-pointer bg-white"
                  style={{
                    borderColor: tempLogoDefaultImageId === image.url ? 'var(--primary)' : 'transparent',
                  }}
                  onClick={() => toggleTempLogoDefaultSelection(image.url)}
                >
                  <Image src={image.url} alt="Logo görseli" className="w-full h-full object-contain p-4" width={120} height={120} />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center rounded-full bg-amber-500/90 px-2 py-1 text-[10px] font-medium text-white shadow">
                      Logo
                    </span>
                  </div>
                  {tempLogoDefaultImageId === image.url && (
                    <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoDefaultGalleryOpen(false)}>İptal</Button>
            <Button onClick={handleSelectLogoDefault} disabled={!tempLogoDefaultImageId}>Seçimi Onayla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logo (White) Gallery Dialog */}
      <Dialog open={isLogoWhiteGalleryOpen} onOpenChange={setIsLogoWhiteGalleryOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Footer Logosu Seç</span>
              <span className="text-xs font-normal text-gray-500">(Beyaz logo)</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {images
              .filter(image => image.bucket === 'logo')
              .map(image => (
                <div
                  key={image.id}
                  className="relative aspect-square group border-2 rounded-lg overflow-hidden cursor-pointer bg-gray-900"
                  style={{
                    borderColor: tempLogoWhiteImageId === image.url ? 'var(--primary)' : 'transparent',
                  }}
                  onClick={() => toggleTempLogoWhiteSelection(image.url)}
                >
                  <Image src={image.url} alt="Logo görseli" className="w-full h-full object-contain p-4" width={120} height={120} />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center rounded-full bg-white/80 px-2 py-1 text-[10px] font-medium text-gray-800 shadow">
                      Logo
                    </span>
                  </div>
                  {tempLogoWhiteImageId === image.url && (
                    <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoWhiteGalleryOpen(false)}>İptal</Button>
            <Button onClick={handleSelectLogoWhite} disabled={!tempLogoWhiteImageId}>Seçimi Onayla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

