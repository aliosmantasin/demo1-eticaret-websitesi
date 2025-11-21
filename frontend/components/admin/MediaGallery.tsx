import React, { useState, useMemo, ChangeEvent } from 'react';
import { Image as ImageType, Product, Category } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface MediaGalleryProps {
  images: ImageType[];
  fetchImages: () => void;
  products: Product[];
  categories: Category[];
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ images, fetchImages, products, categories }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadBucket, setImageUploadBucket] = useState<
    'product-images' |
    'category-images' |
    'homepage-banner-desktop' |
    'homepage-banner-mobil' |
    'homepage-promotion-banner-desktop' |
    'homepage-promotion-banner-mobil' |
    'packages-banner-desktop' |
    'packages-banner-mobil' |
    'packages-images' |
    'logo'
  >('product-images');
  const [imageFilterBucket, setImageFilterBucket] = useState<
    'all' |
    'product-images' |
    'category-images' |
    'homepage-banner-desktop' |
    'homepage-banner-mobil' |
    'homepage-promotion-banner-desktop' |
    'homepage-promotion-banner-mobil' |
    'packages-banner-desktop' |
    'packages-banner-mobil' |
    'packages-images' |
    'logo'
  >('all');
  const { authFetch } = useAuth();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Lütfen önce bir veya daha fazla dosya seçin.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    formData.append('bucketName', imageUploadBucket);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/images/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Dosyalar yüklenemedi');
      await response.json();
      alert('Görsel(ler) başarıyla yüklendi.');
      setSelectedFiles([]);
      fetchImages();
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      alert('Görsel(ler) yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/images/${imageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Görsel silinemedi');
      fetchImages(); // Call fetchImages to update the parent's images state
      alert('Görsel başarıyla silindi.');
    } catch (error) {
      console.error('Görsel silme hatası:', error);
      alert('Görsel silinirken bir hata oluştu.');
    }
  };

  const displayedImages = useMemo(() => {
    if (imageFilterBucket === 'all') {
      return images;
    }
    return images.filter(img => img.bucket === imageFilterBucket);
  }, [images, imageFilterBucket]);

  const getImageAssociation = (image: ImageType) => {
    const linkedProduct = products.find((product) =>
      product.images?.some((img) => img.id === image.id),
    );
    if (linkedProduct) {
      return { type: 'product' as const, name: linkedProduct.name };
    }
    const linkedCategory = categories.find(
      (category: Category) => category.imageId === image.id,
    );
    if (linkedCategory) {
      return { type: 'category' as const, name: linkedCategory.name };
    }
    return null;
  };

  return (
    <div>
      {/* Upload Form */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Yeni Görsel Yükle</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="bucket-select" className="block text-sm font-medium text-gray-700 mb-1">Görsel Yükleme Yeri</label>
            <select
              id="bucket-select"
              value={imageUploadBucket}
              onChange={(e) => setImageUploadBucket(e.target.value as
                'product-images' |
                'category-images' |
                'homepage-banner-desktop' |
                'homepage-banner-mobil' |
                'homepage-promotion-banner-desktop' |
                'homepage-promotion-banner-mobil' |
                'packages-banner-desktop' |
                'packages-banner-mobil' |
                'packages-images' |
                'logo'
              )}
              className="w-full h-10 px-3 border rounded-md text-sm bg-white"
            >
              <option value="product-images">Ürün Görseli</option>
              <option value="category-images">Kategori Görseli</option>
              <option value="homepage-banner-desktop">Homepage Banner (Desktop)</option>
              <option value="homepage-banner-mobil">Homepage Banner (Mobil)</option>
              <option value="homepage-promotion-banner-desktop">Homepage Promosyon Banner (Desktop)</option>
              <option value="homepage-promotion-banner-mobil">Homepage Promosyon Banner (Mobil)</option>
              <option value="packages-banner-desktop">Paket Banner (Desktop)</option>
              <option value="packages-banner-mobil">Paket Banner (Mobil)</option>
              <option value="packages-images">Paket Ürün Görselleri</option>
              <option value="logo">Logo Görselleri</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
              className="max-w-xs"
            />
            <Button onClick={handleImageUpload} disabled={uploading || selectedFiles.length === 0}>
              {uploading ? 'Yükleniyor...' : 'Yükle'}
            </Button>
          </div>
          {selectedFiles.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              Seçilen dosyalar: {selectedFiles.map(f => f.name).join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Image Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Galeri</h3>
          <div>
            <label htmlFor="filter-bucket-select" className="sr-only">Görsel Tipine Göre Filtrele</label>
            <select
              id="filter-bucket-select"
              value={imageFilterBucket}
              onChange={(e) => setImageFilterBucket(e.target.value as
                'all' |
                'product-images' |
                'category-images' |
                'homepage-banner-desktop' |
                'homepage-banner-mobil' |
                'homepage-promotion-banner-desktop' |
                'homepage-promotion-banner-mobil' |
                'packages-banner-desktop' |
                'packages-banner-mobil' |
                'packages-images' |
                'logo'
              )}
              className="h-10 px-3 border rounded-md text-sm bg-white"
            >
              <option value="all">Tüm Görseller</option>
              <option value="product-images">Ürün Görselleri</option>
              <option value="category-images">Kategori Görselleri</option>
              <option value="homepage-banner-desktop">Homepage Banner (Desktop)</option>
              <option value="homepage-banner-mobil">Homepage Banner (Mobil)</option>
              <option value="homepage-promotion-banner-desktop">Homepage Promosyon Banner (Desktop)</option>
              <option value="homepage-promotion-banner-mobil">Homepage Promosyon Banner (Mobil)</option>
              <option value="packages-banner-desktop">Paket Banner (Desktop)</option>
              <option value="packages-banner-mobil">Paket Banner (Mobil)</option>
              <option value="logo">Logo Görselleri</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {displayedImages.map(image => {
            const association = getImageAssociation(image);
            return (
            <div key={image.id} className="relative aspect-square group border rounded-lg overflow-hidden">
              <Image src={image.url} alt="Medya görseli" className="w-full h-full object-cover" width={100} height={100} />
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow">
                  {association
                    ? association.type === 'product'
                      ? `Ürün: ${association.name}`
                      : `Kategori: ${association.name}`
                    : image.bucket === 'homepage-banner-desktop'
                      ? 'Homepage Banner (Desktop)'
                      : image.bucket === 'homepage-banner-mobil'
                        ? 'Homepage Banner (Mobil)'
                        : image.bucket === 'homepage-promotion-banner-desktop'
                          ? 'Homepage Promosyon (Desktop)'
                          : image.bucket === 'homepage-promotion-banner-mobil'
                            ? 'Homepage Promosyon (Mobil)'
                            : image.bucket === 'packages-banner-desktop'
                              ? 'Paket Banner (Desktop)'
                              : image.bucket === 'packages-banner-mobil'
                                ? 'Paket Banner (Mobil)'
                                : image.bucket === 'packages-images'
                                  ? 'Paket Ürün Görseli'
                                  : image.bucket === 'logo'
                                    ? 'Logo'
                                    : 'Bağımsız görsel'}
                </span>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(image.id)}>Sil</Button>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};
