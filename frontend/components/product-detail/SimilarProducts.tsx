"use client";

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

interface SimilarProductsProps {
  categoryId?: string;
  currentProductId: string;
}

async function getSimilarProducts(productId: string, categoryId: string, limit: number = 4): Promise<Product[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/products`);
    
    if (!response.ok) {
      return [];
    }

    const allProducts: Product[] = await response.json();
    
    // Aynı kategorideki ürünleri filtrele (mevcut ürün hariç)
    const similar = allProducts.filter(
      p => p.category?.id === categoryId && p.id !== productId
    );
    
    // Limit'e göre döndür
    return similar.slice(0, limit);
  } catch (error) {
    console.error('Benzer ürünleri yükleme hatası:', error);
    return [];
  }
}

export function SimilarProducts({ categoryId, currentProductId }: SimilarProductsProps) {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }
      const products = await getSimilarProducts(currentProductId, categoryId);
      setSimilarProducts(products);
      setLoading(false);
    };

    fetchSimilar();
  }, [currentProductId, categoryId]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Benzer Ürünler</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (similarProducts.length === 0) {
    return null; // Benzer ürün yoksa hiçbir şey gösterme
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Benzer Ürünler</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {similarProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

