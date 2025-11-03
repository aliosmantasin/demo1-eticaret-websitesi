"use client";

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

async function getBestsellers(limit: number = 8): Promise<Product[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/products`);
    
    if (!response.ok) {
      return [];
    }

    const allProducts: Product[] = await response.json();
    
    // isBestseller olarak işaretlenmiş ürünleri filtrele
    const bestsellers = allProducts.filter(p => p.isBestseller);
    
    // Limit'e göre döndür
    return bestsellers.slice(0, limit);
  } catch (error) {
    console.error('Çok satanları yükleme hatası:', error);
    return [];
  }
}

export function Bestsellers() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      const products = await getBestsellers();
      setBestsellers(products);
      setLoading(false);
    };

    fetchBestsellers();
  }, []);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Çok Satanlar</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (bestsellers.length === 0) {
    return null; // Çok satan ürün yoksa hiçbir şey gösterme
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Çok Satanlar</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {bestsellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

