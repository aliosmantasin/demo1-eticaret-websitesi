import { ProductList } from '@/components/products/ProductList';
import { Product } from '@/types';
import React from 'react';

// Bu sayfa dinamik veri çektiği için her zaman server-side render edilmeli
export const dynamic = 'force-dynamic';

async function getProducts(slug: string): Promise<Product[]> {
    try {
        const apiUrl =
            typeof window === 'undefined'
                ? process.env.INTERNAL_API_URL // Sunucu tarafı (SSR)
                : process.env.NEXT_PUBLIC_API_URL; // Tarayıcı tarafı (Client-side)
        
        if (!apiUrl) {
            console.error('API URL tanımlı değil. Lütfen .env.local veya docker-compose.yml dosyanızı kontrol edin.');
            return [];
        }
        
        // Backend'e kategoriye göre filtreleme isteği gönderiyoruz
        const res = await fetch(`${apiUrl}/api/products?category=${slug}`, {
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

// Next.js 15+ için, `params` objesi asenkron olduğundan önce `await` ile çözülmelidir.
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    if (!slug) {
        // Handle the case where slug is not present, e.g., return a 404 page or default content
        return <div>Kategori bulunamadı.</div>;
    }
    const products = await getProducts(slug);

    const categoryTitle = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-center text-3xl font-bold mb-8">
                    {categoryTitle}
                </h1>
                
                <ProductList products={products} />
                
                <div className="mt-8 text-center text-gray-600">
                    <p>
                        Vücudun tüm fonksiyonlarını sağlıklı bir şekilde yerine getirmesini sağlayan temel yapı taşlarından biri proteindir.
                        Protein kısaca, bir veya daha fazla amino asit artık...
                    </p>
                    <button className="mt-2 font-semibold text-primary hover:underline">
                        Daha fazla göster
                    </button>
                </div>
            </div>
        </div>
    );
};
