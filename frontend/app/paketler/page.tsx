import { ProductList } from '@/components/products/ProductList';
import { Product } from '@/types';
import React from 'react';

// Bu sayfa dinamik veri çektiği için her zaman server-side render edilmeli
export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
    try {
        const apiUrl =
            typeof window === 'undefined'
                ? process.env.INTERNAL_API_URL // Sunucu tarafı (SSR)
                : process.env.NEXT_PUBLIC_API_URL; // Tarayıcı tarafı (Client-side)
        
        if (!apiUrl) {
            console.error('API URL tanımlı değil. Lütfen .env.local veya docker-compose.yml dosyanızı kontrol edin.');
            return [];
        }
        
        // Backend'e paketler kategorisine göre filtreleme isteği gönderiyoruz
        const res = await fetch(`${apiUrl}/api/products?category=paketler`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function PackagesPage() {
    const products = await getProducts();

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-center text-3xl font-bold mb-8">
                    Paketler
                </h1>
                
                <ProductList products={products} />
                
                <div className="mt-8 text-center text-gray-600">
                    <p>
                        Özel olarak hazırlanmış paketlerimizle ihtiyacınız olan tüm ürünleri tek seferde alın.
                        Paketlerimiz, sporcuların ve sağlıklı yaşam tutkunlarının ihtiyaçlarına göre özenle seçilmiştir.
                    </p>
                </div>
            </div>
        </div>
    );
};

