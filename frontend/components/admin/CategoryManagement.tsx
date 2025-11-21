import React, { useState } from 'react';
import { Category, Image as ImageType } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Image from 'next/image';

interface CategoryManagementProps {
  categories: Category[];
  images: ImageType[];
  fetchCategories: () => void;
  openGalleryModalForCategory: () => void;
  selectedCategoryImageId: string | null;
  setSelectedCategoryImageId: (id: string | null) => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  images,
  fetchCategories,
  openGalleryModalForCategory,
  selectedCategoryImageId,
  setSelectedCategoryImageId
}) => {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', slug: '' });
  const { authFetch, token } = useAuth();

  const resetCategoryForm = () => {
    setCategoryFormData({ name: '', slug: '' });
    setSelectedCategoryImageId(null);
    setIsEditingCategory(false);
    setEditingCategoryId(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setIsEditingCategory(true);
    setIsCategoryFormOpen(true);
    setCategoryFormData({ name: category.name, slug: category.slug });
    setSelectedCategoryImageId(category.imageId || null);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Kategori silinemedi');
      fetchCategories();
      alert('Kategori silindi');
    } catch {
      alert('Kategori silinirken bir hata oluştu');
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const categoryPayload = {
        name: categoryFormData.name,
        slug: categoryFormData.slug,
        imageId: selectedCategoryImageId,
      };
      const url = isEditingCategory ? `${apiUrl}/api/admin/categories/${editingCategoryId}` : `${apiUrl}/api/admin/categories`;
      const method = isEditingCategory ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryPayload),
      });

      if (!response.ok) throw new Error('İşlem başarısız');

      resetCategoryForm();
      setIsCategoryFormOpen(false);
      fetchCategories();
      alert(isEditingCategory ? 'Kategori güncellendi' : 'Kategori eklendi');
    } catch {
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Kategori Yönetimi</h2>
        <Button
          onClick={() => {
            resetCategoryForm();
            setIsCategoryFormOpen(!isCategoryFormOpen);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {isCategoryFormOpen ? 'Formu Kapat' : 'Yeni Kategori Ekle'}
        </Button>
      </div>

      {isCategoryFormOpen && (
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            {isEditingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
          </h3>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Kategori Adı *</label>
                <Input required value={categoryFormData.name} onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Slug *</label>
                <Input required value={categoryFormData.slug} onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })} placeholder="kategori-adi" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Kategori Görseli</label>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {selectedCategoryImageId && images.find(img => img.id === selectedCategoryImageId) && (
                    <div className="relative aspect-square">
                      <Image
                        src={images.find(img => img.id === selectedCategoryImageId)!.url}
                        alt="Seçilen kategori görseli"
                        fill
                        className="object-cover rounded-md"
                      />
                      <button type="button" onClick={() => setSelectedCategoryImageId(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                <Button type="button" variant="outline" onClick={openGalleryModalForCategory}>
                  Galeriden Görsel Seç
                </Button>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit">{isEditingCategory ? 'Güncelle' : 'Ekle'}</Button>
              <Button type="button" variant="outline" onClick={() => { resetCategoryForm(); setIsCategoryFormOpen(false); }}>
                İptal
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Görsel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.imageId ? (
                      <Image
                        src={images.find(img => img.id === category.imageId)?.url || '/assets/image/categories/TumUrun.webp'}
                        alt={`${category.name} görseli`}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-md object-cover border"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-gray-100 border flex items-center justify-center text-xs text-gray-400">
                        Yok
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
