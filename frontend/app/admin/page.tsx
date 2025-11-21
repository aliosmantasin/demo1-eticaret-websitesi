"use client";

import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Product, Category, Image as ImageType, Option } from '@/types';
import { Check } from 'lucide-react';
import {
  Tabs,

  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { MediaGallery } from '@/components/admin/MediaGallery';
import { VariantManagement } from '@/components/admin/VariantManagement';
import { CategoryManagement } from '@/components/admin/CategoryManagement';
import { ProductManagement } from '@/components/admin/ProductManagement';
import { NavbarManagement } from '@/components/admin/NavbarManagement';
import { HomepageManagement } from '@/components/admin/HomepageManagement';
import { FooterManagement } from '@/components/admin/FooterManagement';
import Image from 'next/image';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'media' | 'variants' | 'navbar' | 'homepage' | 'footer'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<Option[]>([]);

  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [selectedCategoryImageId, setSelectedCategoryImageId] = useState<string | null>(null);

  const [images, setImages] = useState<ImageType[]>([]);
  // Galeri state'leri ProductManagement'e taşındığı için buradan kaldırılabilir veya
  // kategori galerisi için ayrı yönetilebilir. Şimdilik kategori için bırakıyoruz.
  const [isCategoryGalleryOpen, setIsCategoryGalleryOpen] = useState(false);
  const [tempCategoryImageId, setTempCategoryImageId] = useState<string | null>(null);


  const { token, authFetch } = useAuth();

  const role = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role as string | undefined;
    } catch {
      return null;
    }
  }, [token]);

  const authLoading = token === undefined || (token ? role === null : false);

  const fetchProducts = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/products`); // authFetch kullanılıyor

      if (!response.ok) {
        throw new Error('Ürünler yüklenemedi');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Ürün yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  const fetchCategories = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/categories`); // authFetch kullanılıyor

      if (!response.ok) {
        throw new Error('Kategoriler yüklenemedi');
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Kategori yükleme hatası:', error);
    }
  }, [authFetch]);

  const fetchImages = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/images`);
      if (!response.ok) throw new Error('Görseller yüklenemedi');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
    }
  }, [authFetch]);

  const fetchOptions = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/admin/options`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setOptions(data);
        } else {
          setOptions([]);
        }
      } else {
        setOptions([]);
      }
    } catch (error) {
      setOptions([]);
    }
  }, [authFetch]);

  useEffect(() => {
    if (token && role === 'ADMIN') {
      fetchProducts();
      fetchCategories();
      fetchImages();
      fetchOptions();
    }
  }, [token, role, fetchProducts, fetchCategories, fetchImages, fetchOptions]);

  if (authLoading) {
    return <div>Yükleniyor...</div>;
  }
  if (!token) {
    return <div>Giriş yapmanız gerekiyor.</div>;
  }
  if (role !== 'ADMIN') {
    return <div>Yetkisiz Erişim.</div>;
  }


  const openCategoryGallery = () => {
    setTempCategoryImageId(selectedCategoryImageId);
    setIsCategoryGalleryOpen(true);
  };

  const handleSelectCategoryImages = () => {
    setSelectedCategoryImageId(tempCategoryImageId);
    setIsCategoryGalleryOpen(false);
  };

  const toggleTempCategoryImageSelection = (id: string) => {
    setTempCategoryImageId(prev => (prev === id ? null : id));
  };


  const renderProductsTab = () => (
    <ProductManagement
      products={products}
      categories={categories}
      images={images}
      options={options}
      fetchProducts={fetchProducts}
      selectedImageIds={selectedImageIds}
      setSelectedImageIds={setSelectedImageIds}
    />
  );

  const renderCategoriesTab = () => (
    <CategoryManagement
      categories={categories}
      images={images}
      fetchCategories={fetchCategories}
      openGalleryModalForCategory={openCategoryGallery}
      selectedCategoryImageId={selectedCategoryImageId}
      setSelectedCategoryImageId={setSelectedCategoryImageId}
    />
  );

  const renderVariantsTab = () => (
    <VariantManagement options={options} fetchOptions={fetchOptions} />
  );

  const renderMediaTab = () => (
    <MediaGallery 
      images={images} 
      fetchImages={fetchImages}
      products={products}
      categories={categories}
    />
  );

  const renderNavbarTab = () => (
    <NavbarManagement
      categories={categories}
      fetchCategories={fetchCategories}
    />
  );

  const renderHomepageTab = () => (
    <HomepageManagement
      images={images}
      products={products}
    />
  );

  const renderFooterTab = () => (
    <FooterManagement
      products={products}
    />
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Paneli</h1>
          <p className="mt-2 text-gray-600">Ürün, kategori ve medya yönetimini buradan yapabilirsiniz</p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'products' | 'categories' | 'media' | 'variants' | 'navbar' | 'homepage' | 'footer')}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="products">Ürünler</TabsTrigger>
            <TabsTrigger value="categories">Kategoriler</TabsTrigger>
            <TabsTrigger value="media">Medya Galerisi</TabsTrigger>
            <TabsTrigger value="variants">Varyantlar</TabsTrigger>
            <TabsTrigger value="navbar">Navbar</TabsTrigger>
            <TabsTrigger value="homepage">AnaSayfa</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>

          {activeTab === 'products' && renderProductsTab()}
          {activeTab === 'categories' && renderCategoriesTab()}
          {activeTab === 'media' && renderMediaTab()}
          {activeTab === 'variants' && renderVariantsTab()}
          {activeTab === 'navbar' && renderNavbarTab()}
          {activeTab === 'homepage' && renderHomepageTab()}
          {activeTab === 'footer' && renderFooterTab()}
        </Tabs>
      </div>

      {/* Kategori Galerisi için Dialog */}
      <Dialog open={isCategoryGalleryOpen} onOpenChange={setIsCategoryGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Kategori için Görsel Seç</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {images.map(image => (
              <div
                key={image.id}
                className="relative aspect-square group border rounded-lg overflow-hidden cursor-pointer"
                onClick={() => toggleTempCategoryImageSelection(image.id)}
              >
                <Image src={image.url} alt="Medya görseli" className="w-full h-full object-cover" width={100} height={100} />
                {tempCategoryImageId === image.id && (
                  <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryGalleryOpen(false)}>İptal</Button>
            <Button onClick={handleSelectCategoryImages}>Seçimi Onayla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}







