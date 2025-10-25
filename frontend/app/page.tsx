import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://backend:5000/api/products', {
      cache: 'no-store', // Sunucu tarafında her istekte veriyi yeniden çekmek için
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Hata durumunda boş dizi dön
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Çok Satanlar</h1>

      {products.length === 0 ? (
        <p>Gösterilecek ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
