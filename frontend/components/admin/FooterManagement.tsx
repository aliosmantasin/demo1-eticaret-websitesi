"use client";

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Product, FooterLink, SiteSettings } from '@/types';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';

type FooterSection = 'COMPANY' | 'INFO';

interface FooterManagementProps {
  products: Product[];
}

interface EditableLink extends FooterLink {
  isNew?: boolean;
}

const emptyLink = (section: FooterSection): EditableLink => ({
  id: `temp-${Date.now()}-${Math.random()}`,
  text: '',
  url: '',
  order: 0,
  section,
  createdAt: '',
  updatedAt: '',
  isNew: true,
});

export const FooterManagement: React.FC<FooterManagementProps> = ({
  products,
}) => {
  const { authFetch } = useAuth();
  const [companyLinks, setCompanyLinks] = useState<EditableLink[]>([]);
  const [infoLinks, setInfoLinks] = useState<EditableLink[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [selectedPopularSlugs, setSelectedPopularSlugs] = useState<string[]>([]);

  const maxPopularProducts = siteSettings?.popular_products_limit ?? 9;

  const fetchFooterLinks = async () => {
    try {
      setIsLoadingLinks(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const [companyRes, infoRes] = await Promise.all([
        authFetch(`${apiUrl}/api/footer-links?section=COMPANY`),
        authFetch(`${apiUrl}/api/footer-links?section=INFO`),
      ]);

      const companyData = companyRes.ok ? await companyRes.json() : [];
      const infoData = infoRes.ok ? await infoRes.json() : [];
      setCompanyLinks(companyData);
      setInfoLinks(infoData);
    } catch (error) {
      console.error('Footer linkleri getirilemedi:', error);
    } finally {
      setIsLoadingLinks(false);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/settings`);
      if (!response.ok) throw new Error('Site ayarları getirilemedi');
      const data = await response.json();
      setSiteSettings(data);
      setSelectedPopularSlugs(data.popular_product_slugs || []);
    } catch (error) {
      console.error('Site ayarları yüklenemedi:', error);
    }
  };

  useEffect(() => {
    fetchFooterLinks();
    fetchSiteSettings();
  }, []);

  const handleAddLink = (section: FooterSection) => {
    if (section === 'COMPANY') {
      setCompanyLinks((prev) => [...prev, emptyLink(section)]);
    } else {
      setInfoLinks((prev) => [...prev, emptyLink(section)]);
    }
  };

  const handleLinkChange = (
    section: FooterSection,
    linkId: string,
    field: keyof EditableLink,
    value: string,
  ) => {
    const updater =
      section === 'COMPANY' ? setCompanyLinks : setInfoLinks;

    updater((prev) =>
      prev.map((link) =>
        link.id === linkId ? { ...link, [field]: field === 'order' ? Number(value) : value } : link,
      ),
    );
  };

  const handleSaveLink = async (link: EditableLink) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const payload = {
        text: link.text,
        url: link.url,
        order: link.order || 0,
        section: link.section,
      };

      const response = link.isNew
        ? await authFetch(`${apiUrl}/api/footer-links`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await authFetch(`${apiUrl}/api/footer-links/${link.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      if (!response.ok) throw new Error('Link kaydedilemedi');
      await fetchFooterLinks();
    } catch (error) {
      console.error('Link kaydedilemedi:', error);
      alert('Link kaydedilirken bir hata oluştu.');
    }
  };

  const handleDeleteLink = async (link: EditableLink) => {
    if (link.isNew) {
      const updater = link.section === 'COMPANY' ? setCompanyLinks : setInfoLinks;
      updater((prev) => prev.filter((item) => item.id !== link.id));
      return;
    }

    if (!confirm('Bu linki silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/footer-links/${link.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Link silinemedi');
      await fetchFooterLinks();
    } catch (error) {
      console.error('Link silinemedi:', error);
      alert('Link silinirken bir hata oluştu.');
    }
  };

  const togglePopularProduct = (slug: string) => {
    setSelectedPopularSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((item) => item !== slug);
      }
      if (prev.length >= maxPopularProducts) {
        alert(`En fazla ${maxPopularProducts} ürün seçebilirsiniz.`);
        return prev;
      }
      return [...prev, slug];
    });
  };

  const handleSaveFooterSettings = async () => {
    if (!siteSettings) return;
    setIsSavingSettings(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          footer_copyright_text: siteSettings.footer_copyright_text,
          footer_credits_text: siteSettings.footer_credits_text,
          footer_credits_url: siteSettings.footer_credits_url,
          popular_product_slugs: selectedPopularSlugs,
          popular_products_hidden: siteSettings.popular_products_hidden,
          popular_products_limit: siteSettings.popular_products_limit,
        }),
      });
      if (!response.ok) throw new Error('Footer ayarları kaydedilemedi');
      alert('Footer ayarları kaydedildi');
    } catch (error) {
      console.error('Footer ayarları kaydedilemedi:', error);
      alert('Footer ayarları kaydedilirken bir hata oluştu.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const sectionTitleMap: Record<FooterSection, string> = {
    COMPANY: 'Kurumsal Linkler',
    INFO: 'Bilgi Linkleri',
  };

  const renderLinkSection = (section: FooterSection, links: EditableLink[]) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{sectionTitleMap[section]}</h3>
          <p className="text-sm text-gray-600">
            Bu bölümde yer alacak linkleri ekleyebilir, düzenleyebilir veya silebilirsiniz.
          </p>
        </div>
        <Button variant="outline" onClick={() => handleAddLink(section)}>
          <Plus className="h-4 w-4 mr-1" />
          Yeni Link
        </Button>
      </div>
      <div className="space-y-4">
        {isLoadingLinks && links.length === 0 ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Linkler yükleniyor...
          </div>
        ) : links.length === 0 ? (
          <p className="text-sm text-gray-500">Henüz link eklenmemiş.</p>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className="grid gap-3 md:grid-cols-[2fr_2fr_1fr_auto] items-center border border-gray-100 rounded-lg p-3"
            >
              <div>
                <label className="text-xs font-medium text-gray-600">Başlık</label>
                <Input
                  value={link.text}
                  onChange={(e) => handleLinkChange(link.section, link.id, 'text', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">URL</label>
                <Input
                  value={link.url}
                  onChange={(e) => handleLinkChange(link.section, link.id, 'url', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Sıra</label>
                <Input
                  type="number"
                  value={link.order ?? 0}
                  onChange={(e) => handleLinkChange(link.section, link.id, 'order', e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSaveLink(link)}
                  disabled={!link.text || !link.url}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Kaydet
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteLink(link)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const popularProductOptions = useMemo(
    () =>
      products.map((product) => ({
        label: product.name,
        slug: product.slug,
      })),
    [products],
  );

  return (
    <div className="space-y-6">
      {renderLinkSection('COMPANY', companyLinks)}
      {renderLinkSection('INFO', infoLinks)}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Popüler Ürünler</h3>
            <p className="text-sm text-gray-600">
              Footer ve ana sayfadaki Popüler Ürünler alanında gösterilecek ürünleri seçin (en fazla {maxPopularProducts}).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              checked={siteSettings?.popular_products_hidden ?? false}
              onCheckedChange={(checked) =>
                setSiteSettings((prev) =>
                  prev ? { ...prev, popular_products_hidden: checked === true } : prev,
                )
              }
            />
            <span className="text-sm text-gray-700">
              Popüler ürünleri tamamen gizle
            </span>
          </div>
        </div>
        <div className="rounded-md bg-gray-50 border border-dashed border-gray-200 p-3 text-xs text-gray-500">
          Gösterim limiti AnaSayfa sekmesindeki Popüler Ürünler kartından ayarlanır. Şu anda maksimum {maxPopularProducts} ürün seçebilirsiniz.
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularProductOptions.map((option) => {
            const checked = selectedPopularSlugs.includes(option.slug);
            return (
              <label
                key={option.slug}
                className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                  checked ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <span>{option.label}</span>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={checked}
                  onChange={() => togglePopularProduct(option.slug)}
                />
              </label>
            );
          })}
          {popularProductOptions.length === 0 && (
            <p className="text-sm text-gray-500">Listelenecek ürün bulunamadı.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Footer Metni</h3>
        <p className="text-sm text-gray-600">
          Footer'ın alt kısmında gösterilecek telif hakkı metnini düzenleyin.
        </p>
        <textarea
          value={siteSettings?.footer_copyright_text || ''}
          onChange={(e) =>
            setSiteSettings((prev) =>
              prev ? { ...prev, footer_copyright_text: e.target.value } : prev,
            )
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[100px]"
          placeholder="Örn: Copyright © - Tüm Hakları Saklıdır."
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Footer Credits (Yapım Bilgisi)</h3>
        <p className="text-sm text-gray-600">
          Footer'ın alt kısmında gösterilecek yapım bilgisi metni ve linki (ör: "Settobox Dijital Pazarlama tarafından yapılmıştır").
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credits Metni</label>
            <Input
              value={siteSettings?.footer_credits_text || ''}
              onChange={(e) =>
                setSiteSettings((prev) =>
                  prev ? { ...prev, footer_credits_text: e.target.value } : prev,
                )
              }
              placeholder="Örn: Settobox Dijital Pazarlama tarafından yapılmıştır"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credits Linki</label>
            <Input
              value={siteSettings?.footer_credits_url || ''}
              onChange={(e) =>
                setSiteSettings((prev) =>
                  prev ? { ...prev, footer_credits_url: e.target.value } : prev,
                )
              }
              placeholder="https://www.settobox.com/tr"
            />
            <p className="text-xs text-gray-500 mt-1">
              Metin tıklanabilir bir link olarak gösterilecek. Boş bırakılırsa sadece metin gösterilir.
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveFooterSettings} disabled={isSavingSettings || !siteSettings}>
            {isSavingSettings ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Ayarları Kaydet
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 text-blue-800 text-sm rounded-md p-4">
        <p>
          Kategoriler bölümü, yayınlanan tüm kategorileri otomatik olarak listeler. Popüler ürünler
          seçimleri ise sitede mevcut ürünlerin slug değerleriyle eşleştirilir ve footer’da gösterilir.
        </p>
      </div>
    </div>
  );
};


