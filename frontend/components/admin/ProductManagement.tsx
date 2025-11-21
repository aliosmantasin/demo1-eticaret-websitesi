import React, { useState, FormEvent, useEffect, useMemo } from 'react';
import { Product, Category, Image as ImageType, Option, OptionValue, ProductVariant as ProductVariantType, SiteSettings } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, X, Settings } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Check } from 'lucide-react';

const getSizeNumericValue = (value: string) => {
  const match = value.replace(',', '.').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : Number.POSITIVE_INFINITY;
};

const sortOptionValueList = (optionName: string, values: OptionValue[]) => {
  const lower = optionName.toLowerCase();
  const sorted = [...values];
  if (lower === 'boyut') {
    return sorted.sort((a, b) => getSizeNumericValue(a.value) - getSizeNumericValue(b.value));
  }
  return sorted.sort((a, b) => a.value.localeCompare(b.value, 'tr', { sensitivity: 'base' }));
};

// Bileşenin state'i için genişletilmiş varyant tipi
// id ve productId opsiyonel çünkü yeni eklenen varyantlarda henüz yok
interface EditableProductVariant extends Omit<ProductVariantType, 'optionValues' | 'images' | 'id' | 'productId'> {
  tempId: number;
  id?: string; // Mevcut varyantlar için var, yeni eklenenler için yok
  productId?: string; // Mevcut varyantlar için var, yeni eklenenler için yok
  optionValues: { optionId: string; valueId: string }[];
  imageIds: string[];
}

interface ProductManagementProps {
  products: Product[];
  categories: Category[];
  images: ImageType[];
  options: Option[];
  fetchProducts: () => void;
  // openGalleryModal prop'u artık gerekli değil, kendi içinde yönetecek.
  selectedImageIds: string[];
  setSelectedImageIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  categories,
  images,
  options,
  fetchProducts,
  selectedImageIds,
  setSelectedImageIds,
}) => {
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productVariants, setProductVariants] = useState<EditableProductVariant[]>([]);
  const [productFormData, setProductFormData] = useState<{
    id?: string;
    name: string;
    slug: string;
    categoryId: string;
    short_explanation: string;
    badge_primary_text: string;
    badge_primary_hidden: boolean;
    badge_secondary_text: string;
    badge_secondary_hidden: boolean;
    expiry_date?: string | null;
    features?: string | null;
    nutritional_content?: string | null;
    usage_instructions?: string | null;
  }>({
    name: '',
    slug: '',
    categoryId: '',
    short_explanation: '',
    badge_primary_text: 'VEJETARYAN',
    badge_primary_hidden: false,
    badge_secondary_text: 'GLUTENSİZ',
    badge_secondary_hidden: false,
    expiry_date: null,
    features: null,
    nutritional_content: null,
    usage_instructions: null,
  });

  // Galeri modal yönetimi için state'ler
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [tempSelectedImageIds, setTempSelectedImageIds] = useState<string[]>([]);
  const [galleryTarget, setGalleryTarget] = useState<{ type: 'product' | 'variant'; id?: number }>({ type: 'product' });
  const [galleryFilter, setGalleryFilter] = useState<'product' | 'category' | 'all'>('product');
  const galleryFilterOptions: { key: 'product' | 'category' | 'all'; label: string }[] = [
    { key: 'product', label: 'Ürün Görselleri' },
    { key: 'category', label: 'Kategori Görselleri' },
    { key: 'all', label: 'Tümü' },
  ];

  // Site ayarları state'leri
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isSiteSettingsOpen, setIsSiteSettingsOpen] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Kategori filtresi state'i
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { authFetch, token } = useAuth();

  const sortedOptions = useMemo(() => options.map(option => ({
    ...option,
    values: sortOptionValueList(option.name, option.values),
  })), [options]);

  // Kategoriye göre filtrelenmiş ürünler
  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'all') {
      return products;
    }
    return products.filter(product => product.category?.id === categoryFilter);
  }, [products, categoryFilter]);

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

  // Site ayarlarını kaydet
  const handleSaveSiteSettings = async () => {
    if (!siteSettings) return;
    setSavingSettings(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });

      if (response.ok) {
        alert('Site ayarları başarıyla güncellendi!');
        setIsSiteSettingsOpen(false);
      } else {
        throw new Error('Ayarlar güncellenemedi');
      }
    } catch (error) {
      console.error('Site ayarları güncellenemedi:', error);
      alert('Site ayarları güncellenirken bir hata oluştu');
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredImages = useMemo(() => {
    if (galleryFilter === 'product') {
      return images.filter((img) => img.productId);
    }
    if (galleryFilter === 'category') {
      return images.filter((img) => !img.productId);
    }
    return images;
  }, [galleryFilter, images]);

  const getImageAssociation = (image: ImageType) => {
    const linkedProduct = products.find((product) =>
      product.images?.some((img) => img.id === image.id),
    );
    if (linkedProduct) {
      return { type: 'product' as const, name: linkedProduct.name };
    }
    const linkedCategory = categories.find((category) => category.imageId === image.id);
    if (linkedCategory) {
      return { type: 'category' as const, name: linkedCategory.name };
    }
    return null;
  };

  const resetProductForm = () => {
    setProductFormData({ 
      name: '', 
      slug: '', 
      categoryId: '', 
      short_explanation: '', 
      badge_primary_text: 'VEJETARYAN',
      badge_primary_hidden: false,
      badge_secondary_text: 'GLUTENSİZ',
      badge_secondary_hidden: false,
      expiry_date: null,
      features: null,
      nutritional_content: null,
      usage_instructions: null,
    });
    setSelectedImageIds([]);
    setProductVariants([]);
    setIsEditingProduct(false);
    setEditingProductId(null);
  };

  const handleEditProduct = (product: Product) => {
    setIsProductFormOpen(true);
    setEditingProductId(product.id);
    setIsEditingProduct(true);
    setProductFormData({
      id: product.id,
      name: product.name,
      slug: product.slug,
      categoryId: product.category.id,
      short_explanation: product.short_explanation || '',
      badge_primary_text: product.badge_primary_text || 'VEJETARYAN',
      badge_primary_hidden: product.badge_primary_hidden ?? false,
      badge_secondary_text: product.badge_secondary_text || 'GLUTENSİZ',
      badge_secondary_hidden: product.badge_secondary_hidden ?? false,
      expiry_date: product.expiry_date || null,
      features: product.features || null,
      nutritional_content: product.nutritional_content || null,
      usage_instructions: product.usage_instructions || null,
    });
    setSelectedImageIds(product.images.map(img => img.id));
    
    const variantsWithTempIds = (product.variants || []).map((variant, index) => ({
      ...variant,
      tempId: Date.now() + index,
      // Veritabanından gelen optionValues yapısını, state'in kullandığı formata dönüştür
      optionValues: sortedOptions.map(option => {
        const foundValue = variant.optionValues.find(ov => ov.option.id === option.id);
        return {
          optionId: option.id,
          valueId: foundValue ? foundValue.id : '',
        };
      }),
      imageIds: variant.images?.map(img => img.id) || [], // Güvenli erişim, boş dizi fallback
    }));
    setProductVariants(variantsWithTempIds);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/admin/products/${productId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Ürün silinemedi');
      fetchProducts();
      alert('Ürün silindi');
    } catch {
      alert('Ürün silinirken bir hata oluştu');
    }
  };

  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Varyant validasyonu: En az bir option değeri seçilmiş olmalı ve fiyat/stok geçerli olmalı
    const areVariantsValid = productVariants.every(variant => {
      // En az bir option değeri seçilmiş olmalı (tümü boş olamaz)
      const hasAtLeastOneValue = variant.optionValues.some(ov => ov.valueId !== '');
      return hasAtLeastOneValue && 
             variant.price > 0 && 
             variant.stock >= 0 &&
             (variant.discounted_price === null || variant.discounted_price === undefined || variant.discounted_price >= 0);
    });
    
    if (productVariants.length === 0) {
      alert('Lütfen en az bir ürün varyantı ekleyin.');
      return;
    }
    if (!areVariantsValid) {
      alert('Lütfen her varyant için en az bir seçenek değeri seçtiğinizden ve geçerli bir fiyat/stok girdiğinizden emin olun.');
      return;
    }


    const finalProductData = {
      ...productFormData,
      badge_primary_text: productFormData.badge_primary_text?.trim() || null,
      badge_secondary_text: productFormData.badge_secondary_text?.trim() || null,
      imageIds: selectedImageIds,
      variants: productVariants.map((variant: EditableProductVariant) => ({
        price: parseFloat(String(variant.price).replace(',', '.')) || 0,
        stock: parseInt(String(variant.stock), 10) || 0,
        discounted_price: variant.discounted_price ? parseFloat(String(variant.discounted_price).replace(',', '.')) : null,
        // Boş valueId'leri filtrele - sadece seçili olanları gönder
        optionValues: variant.optionValues
          .filter((ov: { valueId: string }) => ov.valueId !== '')
          .map((ov: { valueId: string }) => ({ valueId: ov.valueId })),
        imageIds: variant.imageIds || [], // imageId yerine imageIds, boş dizi fallback
      })),
    };

    // DEBUG: Gönderilen veriyi logla
    console.log('handleProductSubmit - Gönderilen veri:', JSON.stringify(finalProductData, null, 2));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = isEditingProduct ? `${apiUrl}/api/admin/products/${editingProductId}` : `${apiUrl}/api/admin/products`;
    const method = isEditingProduct ? 'PUT' : 'POST';

    try {
      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProductData),
      });

      if (response.ok) {
        const updatedProduct: Product = await response.json();
        console.log('handleProductSubmit - Backend\'den dönen ürün:', JSON.stringify(updatedProduct, null, 2));
        console.log('handleProductSubmit - Varyant sayısı:', updatedProduct.variants?.length || 0);
        
        alert(editingProductId ? 'Ürün başarıyla güncellendi!' : 'Ürün başarıyla oluşturuldu!');
        
        // Formu kapat ve listeyi yenile
        resetProductForm();
        fetchProducts(); // Listeyi yenile
        
        // Eğer düzenleme modundaysak, güncellenmiş ürünü tekrar yükle
        if (isEditingProduct && updatedProduct.id) {
          // Kısa bir gecikme sonrası ürünü tekrar yükle (fetchProducts tamamlanana kadar bekle)
          setTimeout(() => {
            const refreshedProduct = products.find(p => p.id === updatedProduct.id);
            if (refreshedProduct) {
              handleEditProduct(refreshedProduct);
            }
          }, 500);
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Sunucudan okunamayan bir hata oluştu.' }));
        throw new Error(errorData.message || 'Bilinmeyen bir sunucu hatası.');
      }
    } catch (error) {
      console.error('Ürün kaydetme hatası:', error);
      alert(`Bir hata oluştu: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleAddVariant = () => {
    setProductVariants(prev => [
      ...prev,
      {
        tempId: Date.now(),
        price: 0,
        stock: 0,
        discounted_price: null,
        optionValues: sortedOptions.map(o => ({ optionId: o.id, valueId: '' })),
        imageIds: [], // Boş imageIds dizisi
      },
    ]);
  };

  const handleVariantChange = (variantTempId: number, optionId: string, valueId: string) => {
    setProductVariants(prev => prev.map(variant => {
      if (variant.tempId === variantTempId) {
        const newOptionValues = variant.optionValues.map(ov => ov.optionId === optionId ? { ...ov, valueId } : ov);
        return { ...variant, optionValues: newOptionValues };
      }
      return variant;
    }));
  };

  const handleVariantNumericChange = (variantTempId: number, field: 'price' | 'stock' | 'discounted_price', value: string) => {
    setProductVariants(prev => prev.map(variant => variant.tempId === variantTempId ? { ...variant, [field]: value } : variant));
  };

  const handleRemoveVariant = (tempId: number) => {
    setProductVariants(prev => prev.filter(variant => variant.tempId !== tempId));
  };

  // Galeri fonksiyonları
  const openGalleryModal = (type: 'product' | 'variant', id?: number) => {
    setGalleryTarget({ type, id });
    setGalleryFilter(type === 'product' || type === 'variant' ? 'product' : 'all');
    if (type === 'product') {
      setTempSelectedImageIds(selectedImageIds);
    } else if (type === 'variant' && id !== undefined) {
      const variant = productVariants.find(v => v.tempId === id);
      setTempSelectedImageIds(variant?.imageIds || []); // imageId yerine imageIds
    }
    setIsGalleryModalOpen(true);
  };

  const toggleTempImageSelection = (imageId: string) => {
    // Ürün veya varyant fark etmeksizin çoklu seçime izin ver
     setTempSelectedImageIds(prev =>
        prev.includes(imageId) ? prev.filter(id => id !== imageId) : [...prev, imageId]
      );
  };

  const handleSelectImages = () => {
    const { type, id } = galleryTarget;
    if (type === 'product') {
      setSelectedImageIds(tempSelectedImageIds);
    } else if (type === 'variant' && id !== undefined) {
      setProductVariants(prev =>
        prev.map(v => (v.tempId === id ? { ...v, imageIds: tempSelectedImageIds } : v))
      );
    }
    setIsGalleryModalOpen(false);
  };


  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Ürün Yönetimi</h2>
        <Button onClick={() => { resetProductForm(); setIsProductFormOpen(!isProductFormOpen); }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {isProductFormOpen ? 'Formu Kapat' : 'Yeni Ürün Ekle'}
        </Button>
      </div>

      {/* Kategori Filtresi */}
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Kategori Filtresi:</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 px-3 border rounded-md bg-white text-sm"
        >
          <option value="all">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {categoryFilter !== 'all' && (
          <span className="text-sm text-gray-500">
            ({filteredProducts.length} ürün gösteriliyor)
          </span>
        )}
      </div>

      {isProductFormOpen && (
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            {isEditingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
          </h3>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input required value={productFormData.name} onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })} placeholder="Ürün Adı" />
              <Input required value={productFormData.slug} onChange={(e) => setProductFormData({ ...productFormData, slug: e.target.value })} placeholder="urun-adi" />
            </div>
            <select required className="w-full h-9 px-3 border rounded-md" value={productFormData.categoryId} onChange={(e) => setProductFormData({ ...productFormData, categoryId: e.target.value })}>
              <option value="">Kategori Seçiniz</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Ürün Görselleri *</label>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {selectedImageIds.map(id => {
                    const image = images.find(img => img.id === id);
                    return image ? (
                      <div key={id} className="relative aspect-square">
                        <Image src={image.url} alt="Seçilen görsel" fill className="object-cover rounded-md" />
                        <button type="button" onClick={() => setSelectedImageIds((prev: string[]) => prev.filter((imgId: string) => imgId !== id))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
                <Button type="button" variant="outline" onClick={() => openGalleryModal('product')}>
                  Galeriden Görsel Seç ({selectedImageIds.length})
                </Button>
              </div>
            </div>
            <Input value={productFormData.short_explanation} onChange={(e) => setProductFormData({ ... productFormData, short_explanation: e.target.value })} placeholder="Kısa Açıklama" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Rozet 1 Metni</label>
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={productFormData.badge_primary_hidden}
                      onChange={(e) => setProductFormData({ ...productFormData, badge_primary_hidden: e.target.checked })}
                      className="h-4 w-4"
                    />
                    Gizle
                  </label>
                </div>
                <Input
                  value={productFormData.badge_primary_text}
                  onChange={(e) => setProductFormData({ ...productFormData, badge_primary_text: e.target.value })}
                  placeholder="Örn: VEJETARYAN"
                />
                <p className="text-xs text-gray-500 mt-1">Ürün detay sayfasındaki ilk rozet.</p>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Rozet 2 Metni</label>
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={productFormData.badge_secondary_hidden}
                      onChange={(e) => setProductFormData({ ...productFormData, badge_secondary_hidden: e.target.checked })}
                      className="h-4 w-4"
                    />
                    Gizle
                  </label>
                </div>
                <Input
                  value={productFormData.badge_secondary_text}
                  onChange={(e) => setProductFormData({ ...productFormData, badge_secondary_text: e.target.value })}
                  placeholder="Örn: GLUTENSİZ"
                />
                <p className="text-xs text-gray-500 mt-1">İkinci rozet metni.</p>
              </div>
            </div>
            <Input value={productFormData.expiry_date || ''} onChange={(e) => setProductFormData({ ... productFormData, expiry_date: e.target.value || null })} placeholder="Son Kullanma Tarihi (örn: 07.2025)" />
            
            {/* Ürün Detay Bilgileri */}
            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Ürün Detay Bilgileri</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Özellikler (Her satır bir madde)</label>
                <textarea
                  value={productFormData.features || ''}
                  onChange={(e) => setProductFormData({ ... productFormData, features: e.target.value || null })}
                  placeholder="Yüksek protein içeriği ile kas gelişimini destekler.&#10;Düşük şeker ve yağ oranı ile diyetinize uygundur.&#10;Lezzetli aromaları ile keyifli bir tüketim sunar."
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">Her satır bir özellik maddesi olarak gösterilecektir.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Besin İçeriği / İçindekiler</label>
                <textarea
                  value={productFormData.nutritional_content || ''}
                  onChange={(e) => setProductFormData({ ... productFormData, nutritional_content: e.target.value || null })}
                  placeholder="Çikolata Aromalı:&#10;Whey Proteini Konsantresi (Süt), Aroma Verici, Yağı Azaltılmış Kakao, DigeZyme®..."
                  className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={5}
                />
                <p className="text-xs text-gray-500 mt-1">Her satır bir içerik maddesi olarak gösterilecektir. &apos;:&apos; ile başlık ve içerik ayırabilirsiniz.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Kullanım Şekli</label>
                <textarea
                  value={productFormData.usage_instructions || ''}
                  onChange={(e) => setProductFormData({ ... productFormData, usage_instructions: e.target.value || null })}
                  placeholder="Antrenman sonrası ve sabah uyandığında, su veya süt ile karıştırarak tüketilmesini öneririz. 1 ölçek (yaklaşık 25 gram) ürünü 200 ml su veya süt ile karıştırarak tüketebilirsiniz."
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">Ürünün kullanım talimatlarını yazın.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Ürün Varyantları</label>
              <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                {productVariants.map((variant) => (
                    <div key={variant.tempId} className="p-3 border rounded-md bg-white shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                         <p className="text-sm font-medium text-gray-400">Varyant #{variant.tempId}</p>
                        <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => handleRemoveVariant(variant.tempId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {sortedOptions.map(option => {
                            const selectedValue = variant.optionValues.find(ov => ov.optionId === option.id)?.valueId || '';
                            return (
                              <div key={option.id}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">{option.name}</label>
                                <select
                                  className="w-full h-9 px-3 border rounded-md text-sm"
                                  value={selectedValue}
                                  onChange={(e) => handleVariantChange(variant.tempId, option.id, e.target.value)}
                                >
                                  <option value="">- (Boş)</option>
                                  {option.values.map(value => <option key={value.id} value={value.id}>{value.value}</option>)}
                                </select>
                              </div>
                            );
                          })}
                        </div>
                        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                           <div className="sm:col-span-2 grid grid-cols-2 gap-2">
                             <Input type="number" step="0.01" placeholder="Fiyat (TL)" value={variant.price} onChange={(e) => handleVariantNumericChange(variant.tempId, 'price', e.target.value)} />
                            <Input type="number" step="0.01" placeholder="İndirimli Fiyat" value={variant.discounted_price || ''} onChange={(e) => handleVariantNumericChange(variant.tempId, 'discounted_price', e.target.value)} />
                           </div>
                            <Input type="number" placeholder="Stok" value={variant.stock} onChange={(e) => handleVariantNumericChange(variant.tempId, 'stock', e.target.value)} />
                             <div className="flex flex-col gap-2">
                               <Button type="button" variant="outline" size="sm" onClick={() => openGalleryModal('variant', variant.tempId)}>
                                 Görselleri Yönet ({variant.imageIds.length})
                               </Button>
                               <div className="flex flex-wrap gap-1">
                                {variant.imageIds.map(imgId => {
                                    const image = images.find(i => i.id === imgId);
                                    if (!image) return null;
                                    return (
                                        <div key={imgId} className="relative w-9 h-9">
                                            <Image
                                                src={image.url}
                                                alt="Varyant Görseli"
                                                fill
                                                className="rounded-md object-cover"
                                            />
                                        </div>
                                    )
                                })}
                               </div>
                             </div>
                        </div>
                      </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddVariant}>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Varyant Ekle
                </Button>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit">{isEditingProduct ? 'Güncelle' : 'Ekle'}</Button>
              <Button type="button" variant="outline" onClick={() => { resetProductForm(); setIsProductFormOpen(false); }}>
                İptal
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Galeri Modal */}
      <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Görsel Seç</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-3 py-2">
            <div className="inline-flex rounded-md border bg-gray-50">
              {galleryFilterOptions.map((filterOption) => (
                <button
                  key={filterOption.key}
                  type="button"
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    galleryFilter === filterOption.key ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                  }`}
                  onClick={() => setGalleryFilter(filterOption.key)}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Kategori görselleri ürün kartlarında kullanılmaz.
            </p>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {filteredImages.map(image => {
              const association = getImageAssociation(image);
              return (
                <div
                  key={image.id}
                  className={`relative aspect-square group border-2 rounded-lg overflow-hidden cursor-pointer ${
                    tempSelectedImageIds.includes(image.id) ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => toggleTempImageSelection(image.id)}
                >
                  <Image src={image.url} alt="Medya görseli" className="w-full h-full object-cover" width={100} height={100} />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow">
                      {association
                        ? association.type === 'product'
                          ? `Ürün: ${association.name}`
                          : `Kategori: ${association.name}`
                        : 'Bağımsız'}
                    </span>
                  </div>
                  {tempSelectedImageIds.includes(image.id) && (
                    <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGalleryModalOpen(false)}>İptal</Button>
            <Button onClick={handleSelectImages}>Seçimi Onayla ({tempSelectedImageIds.length})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Site Ayarları Bölümü */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Ürün Detay Sayfası Ayarları</h3>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsSiteSettingsOpen(!isSiteSettingsOpen)}
          >
            {isSiteSettingsOpen ? 'Gizle' : 'Göster'}
          </Button>
        </div>

        {isSiteSettingsOpen && (
          <div className="p-6 space-y-6">
            {!siteSettings ? (
              <div className="text-center py-8 text-gray-500">
                Site ayarları yükleniyor...
              </div>
            ) : (
              <>
            {/* Kargo Bilgileri */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold">Kargo Bilgileri</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteSettings.shipping_hidden}
                    onChange={(e) => setSiteSettings({ ...siteSettings, shipping_hidden: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">Gizle</span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Kargo Üst Metni</label>
                  <Input
                    value={siteSettings.shipping_text}
                    onChange={(e) => setSiteSettings({ ...siteSettings, shipping_text: e.target.value })}
                    placeholder="Örn: Aynı Gün"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kargo Alt Metni</label>
                  <Input
                    value={siteSettings.shipping_subtext}
                    onChange={(e) => setSiteSettings({ ...siteSettings, shipping_subtext: e.target.value })}
                    placeholder="Örn: Ücretsiz Kargo"
                  />
                </div>
              </div>
            </div>

            {/* Müşteri Bilgileri */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold">Müşteri Bilgileri</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteSettings.customer_hidden}
                    onChange={(e) => setSiteSettings({ ...siteSettings, customer_hidden: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">Gizle</span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Müşteri Sayısı</label>
                  <Input
                    value={siteSettings.customer_count}
                    onChange={(e) => setSiteSettings({ ...siteSettings, customer_count: e.target.value })}
                    placeholder="Örn: 750.000+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Müşteri Etiketi</label>
                  <Input
                    value={siteSettings.customer_label}
                    onChange={(e) => setSiteSettings({ ...siteSettings, customer_label: e.target.value })}
                    placeholder="Örn: Mutlu Müşteri"
                  />
                </div>
              </div>
            </div>

            {/* Garanti Bilgileri */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold">Garanti Bilgileri</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteSettings.guarantee_hidden}
                    onChange={(e) => setSiteSettings({ ...siteSettings, guarantee_hidden: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">Gizle</span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Garanti Yüzdesi</label>
                  <Input
                    value={siteSettings.guarantee_percent}
                    onChange={(e) => setSiteSettings({ ...siteSettings, guarantee_percent: e.target.value })}
                    placeholder="Örn: %100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Garanti Metni</label>
                  <Input
                    value={siteSettings.guarantee_text}
                    onChange={(e) => setSiteSettings({ ...siteSettings, guarantee_text: e.target.value })}
                    placeholder="Örn: Memnuniyet Garantisi"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSaveSiteSettings} disabled={savingSettings || !siteSettings}>
                {savingSettings ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
              </Button>
            </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat Aralığı (TL)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const originalPrices = product.variants?.map(v => v.price) || [];
                const minOriginalPrice = originalPrices.length > 0 ? Math.min(...originalPrices) : 0;
                const maxOriginalPrice = originalPrices.length > 0 ? Math.max(...originalPrices) : 0;
                const hasAnyDiscount = product.variants?.some(v => v.discounted_price != null && v.discounted_price < v.price);
                const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                const displayPrice = originalPrices.length > 0 ? (minOriginalPrice === maxOriginalPrice ? `${minOriginalPrice.toFixed(2)}` : `${minOriginalPrice.toFixed(2)} - ${maxOriginalPrice.toFixed(2)}`) : 'N/A';
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {displayPrice}
                      {hasAnyDiscount && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">İNDİRİM</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{totalStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
