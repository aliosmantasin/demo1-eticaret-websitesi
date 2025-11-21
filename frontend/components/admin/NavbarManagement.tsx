"use client";

import React, { useState, useEffect } from 'react';
import { Category, SiteSettings } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

interface NavbarManagementProps {
  categories: Category[];
  fetchCategories: () => void;
}

export const NavbarManagement: React.FC<NavbarManagementProps> = ({
  categories,
  fetchCategories,
}) => {
  const { authFetch } = useAuth();
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [isSaving, setIsSaving] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isSavingInfobar, setIsSavingInfobar] = useState(false);
  const [isSavingMarquee, setIsSavingMarquee] = useState(false);

  // Site ayarlarını fetch et
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/settings`);
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

  // Kategoriler değiştiğinde local state'i güncelle
  React.useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Değişen kategorileri güncelle
      const updatePromises = localCategories.map(category => {
        const originalCategory = categories.find(c => c.id === category.id);
        if (!originalCategory) return Promise.resolve(null);
        
        // showInNavbar değerini doğru şekilde karşılaştır
        // undefined veya null ise true kabul et, aksi halde gerçek değeri kullan
        const originalShowInNavbar = originalCategory.showInNavbar === undefined || originalCategory.showInNavbar === null 
          ? true 
          : originalCategory.showInNavbar;
        const newShowInNavbar = category.showInNavbar === undefined || category.showInNavbar === null
          ? true
          : category.showInNavbar;
        
        // Değişiklik varsa güncelle
        if (originalShowInNavbar !== newShowInNavbar) {
          console.log(`Kategori ${category.name} güncelleniyor: ${originalShowInNavbar} -> ${newShowInNavbar}`);
          const payload: {
            name: string;
            slug: string;
            showInNavbar: boolean;
            imageId?: string | null;
          } = {
            name: category.name,
            slug: category.slug,
            showInNavbar: newShowInNavbar,
          };
          // imageId varsa ekle
          if (category.imageId) {
            payload.imageId = category.imageId;
          }
          console.log('Gönderilen payload:', JSON.stringify(payload, null, 2));
          return authFetch(`${apiUrl}/api/admin/categories/${category.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }
        return Promise.resolve(null);
      });

      const results = await Promise.all(updatePromises);
      const hasUpdates = results.some(r => r !== null);
      
      if (hasUpdates) {
        await fetchCategories();
        alert('Navbar ayarları başarıyla kaydedildi');
      } else {
        alert('Değişiklik yapılmadı');
      }
    } catch (error) {
      console.error('Navbar ayarları kaydedilirken hata:', error);
      alert('Navbar ayarları kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Navbar Kategori Yönetimi</h2>
          <p className="mt-1 text-sm text-gray-600">
            Navbar&apos;da gösterilecek kategorileri seçin. İşaretlenen kategoriler navbar&apos;da görünecektir.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Navbar&apos;da Göster
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {localCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={category.showInNavbar === undefined || category.showInNavbar === null ? true : category.showInNavbar}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        console.log(`Kategori ${category.name} checkbox değişti: ${category.showInNavbar} -> ${isChecked}`);
                        setLocalCategories(prev =>
                          prev.map(cat =>
                            cat.id === category.id
                              ? { ...cat, showInNavbar: isChecked }
                              : cat
                          )
                        );
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.slug}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infobar Yönetimi */}
      <div className="mt-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Infobar İçerik Yönetimi</h2>
            <p className="mt-1 text-sm text-gray-600">
              Navbar&apos;daki infobar metinlerini düzenleyin.
            </p>
          </div>
          <Button
            onClick={async () => {
              if (!siteSettings) return;
              setIsSavingInfobar(true);
              try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await authFetch(`${apiUrl}/api/settings`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(siteSettings),
                });
                if (response.ok) {
                  alert('Infobar ayarları başarıyla kaydedildi');
                } else {
                  throw new Error('Ayarlar güncellenemedi');
                }
              } catch (error) {
                console.error('Infobar ayarları güncellenemedi:', error);
                alert('Infobar ayarları güncellenirken bir hata oluştu');
              } finally {
                setIsSavingInfobar(false);
              }
            }}
            disabled={isSavingInfobar || !siteSettings}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSavingInfobar ? 'Kaydediliyor...' : 'Infobar Ayarlarını Kaydet'}
          </Button>
        </div>

        {siteSettings && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Birinci Infobar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Birinci Bilgi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Ana Metin</label>
                  <Input
                    value={siteSettings.infobar_first_text || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, infobar_first_text: e.target.value })}
                    placeholder="Aynı Gün Kargo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Alt Metin</label>
                  <Input
                    value={siteSettings.infobar_first_subtext || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, infobar_first_subtext: e.target.value })}
                    placeholder="16:00'dan Önceki Siparişlerde"
                  />
                </div>
              </div>
            </div>

            {/* İkinci Infobar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">İkinci Bilgi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Ana Metin</label>
                  <Input
                    value={siteSettings.infobar_second_text || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, infobar_second_text: e.target.value })}
                    placeholder="Ücretsiz Kargo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Alt Metin</label>
                  <Input
                    value={siteSettings.infobar_second_subtext || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, infobar_second_subtext: e.target.value })}
                    placeholder="1500₺ Üzeri Siparişlerde"
                  />
                </div>
              </div>
            </div>

            {/* Üçüncü Infobar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Üçüncü Bilgi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Ana Metin</label>
                  <Input
                    value={siteSettings.infobar_third_text || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, infobar_third_text: e.target.value })}
                    placeholder="Güvenli Alışveriş"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Alt Metin</label>
                  <Input
                    value={siteSettings.infobar_third_subtext || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, infobar_third_subtext: e.target.value })}
                    placeholder="450.000+ Mutlu Müşteri"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Marquee Yönetimi */}
      <div className="mt-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Akan Yazı (Marquee) Yönetimi</h2>
            <p className="mt-1 text-sm text-gray-600">
              Navbar&apos;daki akan yazı metnini ve hızını düzenleyin.
            </p>
          </div>
          <Button
            onClick={async () => {
              if (!siteSettings) return;
              setIsSavingMarquee(true);
              try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await authFetch(`${apiUrl}/api/settings`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(siteSettings),
                });
                if (response.ok) {
                  alert('Marquee ayarları başarıyla kaydedildi');
                } else {
                  throw new Error('Ayarlar güncellenemedi');
                }
              } catch (error) {
                console.error('Marquee ayarları güncellenemedi:', error);
                alert('Marquee ayarları güncellenirken bir hata oluştu');
              } finally {
                setIsSavingMarquee(false);
              }
            }}
            disabled={isSavingMarquee || !siteSettings}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSavingMarquee ? 'Kaydediliyor...' : 'Marquee Ayarlarını Kaydet'}
          </Button>
        </div>

        {siteSettings && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Akan Yazı Metni</label>
              <Input
                value={siteSettings.marquee_text || ''}
                onChange={(e) => setSiteSettings({ ...siteSettings, marquee_text: e.target.value })}
                placeholder="Yeni kampanyalarımız başladı! %20'ye varan indirimler."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Hız</label>
              <Select
                value={siteSettings.marquee_speed?.toString() || '1'}
                onValueChange={(value) => setSiteSettings({ ...siteSettings, marquee_speed: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hız seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x (Yavaş)</SelectItem>
                  <SelectItem value="2">2x (Orta)</SelectItem>
                  <SelectItem value="3">3x (Hızlı)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

