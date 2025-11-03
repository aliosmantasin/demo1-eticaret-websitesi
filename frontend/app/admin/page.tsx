"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product, Category } from '@/types';
import { Plus, Edit, Trash2, Package, FolderOpen } from 'lucide-react';

interface ProductFormData {
  name: string;
  slug: string;
  price: string;
  stock: string;
  categoryId: string;
  images: string;
  description: string;
  short_explanation: string;
  discounted_price: string;
}

interface CategoryFormData {
  name: string;
  slug: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    price: '',
    stock: '',
    categoryId: '',
    images: '',
    description: '',
    short_explanation: '',
    discounted_price: '',
  });
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
  });
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/giris-yap');
      return;
    }

    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchProducts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/products`);

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
  };

  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/categories`);

      if (!response.ok) {
        throw new Error('Kategoriler yüklenemedi');
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Kategori yükleme hatası:', error);
    }
  };

  const resetProductForm = () => {
    setProductFormData({
      name: '',
      slug: '',
      price: '',
      stock: '',
      categoryId: '',
      images: '',
      description: '',
      short_explanation: '',
      discounted_price: '',
    });
    setIsEditingProduct(false);
    setEditingProductId(null);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      slug: '',
    });
    setIsEditingCategory(false);
    setEditingCategoryId(null);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert('Önce giriş yapmalısınız');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const imagesArray = productFormData.images.split(',').map(img => img.trim()).filter(Boolean);
      const productPayload: Record<string, unknown> = {
        name: productFormData.name,
        slug: productFormData.slug,
        price: parseFloat(productFormData.price),
        stock: parseInt(productFormData.stock),
        category: {
          connect: { id: productFormData.categoryId }
        },
        images: imagesArray,
        description: productFormData.description || null,
        short_explanation: productFormData.short_explanation || null,
      };

      if (productFormData.discounted_price) {
        const originalPrice = parseFloat(productFormData.price);
        const discountedPrice = parseFloat(productFormData.discounted_price);
        const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
        
        productPayload.discounted_price = discountedPrice;
        productPayload.discount_percentage = discountPercentage;
      }

      let response;
      if (isEditingProduct && editingProductId) {
        response = await fetch(`${apiUrl}/api/admin/products/${editingProductId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(productPayload),
        });
      } else {
        response = await fetch(`${apiUrl}/api/admin/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(productPayload),
        });
      }

      if (!response.ok) {
        throw new Error('İşlem başarısız');
      }

      resetProductForm();
      setIsProductFormOpen(false);
      fetchProducts();
      alert(isEditingProduct ? 'Ürün güncellendi' : 'Ürün eklendi');
    } catch (error) {
      console.error('Form hatası:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert('Önce giriş yapmalısınız');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const categoryPayload = {
        name: categoryFormData.name,
        slug: categoryFormData.slug,
      };

      let response;
      if (isEditingCategory && editingCategoryId) {
        response = await fetch(`${apiUrl}/api/admin/categories/${editingCategoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(categoryPayload),
        });
      } else {
        response = await fetch(`${apiUrl}/api/admin/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(categoryPayload),
        });
      }

      if (!response.ok) {
        throw new Error('İşlem başarısız');
      }

      resetCategoryForm();
      setIsCategoryFormOpen(false);
      fetchCategories();
      fetchProducts(); // Kategoriler değiştiği için ürünleri de yenile
      alert(isEditingCategory ? 'Kategori güncellendi' : 'Kategori eklendi');
    } catch (error) {
      console.error('Form hatası:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ürün silinemedi');
      }

      setProducts(products.filter(p => p.id !== productId));
      alert('Ürün silindi');
    } catch (error) {
      console.error('Ürün silme hatası:', error);
      alert('Ürün silinirken bir hata oluştu');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz? Bu kategorideki ürünler de silinebilir.')) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Kategori silinemedi');
      }

      setCategories(categories.filter(c => c.id !== categoryId));
      fetchProducts(); // Kategoriler değiştiği için ürünleri de yenile
      alert('Kategori silindi');
    } catch (error) {
      console.error('Kategori silme hatası:', error);
      alert('Kategori silinirken bir hata oluştu');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setIsEditingProduct(true);
    setIsProductFormOpen(true);
    
    setProductFormData({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      stock: product.stock?.toString() || '0',
      categoryId: product.category.id,
      images: product.images.join(', '),
      description: product.description || '',
      short_explanation: product.short_explanation || '',
      discounted_price: product.discounted_price?.toString() || '',
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setIsEditingCategory(true);
    setIsCategoryFormOpen(true);
    
    setCategoryFormData({
      name: category.name,
      slug: category.slug,
    });
  };

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Paneli</h1>
          <p className="mt-2 text-gray-600">Ürün ve kategori yönetimini buradan yapabilirsiniz</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'products'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Ürünler ({products.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'categories'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Kategoriler ({categories.length})
              </div>
            </button>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Ürün Yönetimi</h2>
              <Button
                onClick={() => {
                  resetProductForm();
                  setIsProductFormOpen(!isProductFormOpen);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {isProductFormOpen ? 'Formu Kapat' : 'Yeni Ürün Ekle'}
              </Button>
            </div>

            {/* Product Form */}
            {isProductFormOpen && (
              <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  {isEditingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                </h3>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Ürün Adı *</label>
                      <Input
                        required
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Slug *</label>
                      <Input
                        required
                        value={productFormData.slug}
                        onChange={(e) => setProductFormData({ ...productFormData, slug: e.target.value })}
                        placeholder="urun-adi"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Fiyat (TL) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        required
                        value={productFormData.price}
                        onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">İndirimli Fiyat (TL)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={productFormData.discounted_price}
                        onChange={(e) => setProductFormData({ ...productFormData, discounted_price: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Stok *</label>
                      <Input
                        type="number"
                        required
                        value={productFormData.stock}
                        onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Kategori *</label>
                      <select
                        required
                        className="w-full h-9 px-3 border rounded-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                        value={productFormData.categoryId}
                        onChange={(e) => setProductFormData({ ...productFormData, categoryId: e.target.value })}
                      >
                        <option value="">Seçiniz</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Görseller (virgülle ayırın) *</label>
                    <Input
                      required
                      value={productFormData.images}
                      onChange={(e) => setProductFormData({ ...productFormData, images: e.target.value })}
                      placeholder="url1, url2, url3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Kısa Açıklama</label>
                    <Input
                      value={productFormData.short_explanation}
                      onChange={(e) => setProductFormData({ ...productFormData, short_explanation: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Açıklama</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md min-h-[100px] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit">
                      {isEditingProduct ? 'Güncelle' : 'Ekle'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetProductForm();
                        setIsProductFormOpen(false);
                      }}
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.discounted_price ? (
                            <span>
                              <span className="line-through text-gray-400">{product.price} TL</span>
                              <span className="ml-2 text-red-600 font-bold">{product.discounted_price} TL</span>
                              <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                %{product.discount_percentage}
                              </span>
                            </span>
                          ) : (
                            `${product.price} TL`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.name || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
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
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
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

            {/* Category Form */}
            {isCategoryFormOpen && (
              <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  {isEditingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                </h3>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Kategori Adı *</label>
                      <Input
                        required
                        value={categoryFormData.name}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Slug *</label>
                      <Input
                        required
                        value={categoryFormData.slug}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                        placeholder="kategori-adi"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit">
                      {isEditingCategory ? 'Güncelle' : 'Ekle'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetCategoryForm();
                        setIsCategoryFormOpen(false);
                      }}
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Categories List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori Adı</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
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
        )}
      </div>
    </div>
  );
}
