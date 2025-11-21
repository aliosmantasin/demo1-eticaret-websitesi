import { Breadcrumb } from "@/components/product-detail/Breadcrumb";
import { ProductInfo } from "@/components/product-detail/ProductInfo";
import { SimilarProducts } from "@/components/product-detail/SimilarProducts";
import { Bestsellers } from "@/components/product-detail/Bestsellers";
import { Product } from "@/types";
import React from "react";
import { notFound } from "next/navigation";

// Bu sayfa dinamik veri çektiği için her zaman server-side render edilmeli
export const dynamic = 'force-dynamic';

async function getProduct(slug: string): Promise<Product | null> {
    try {
        const apiUrl =
            typeof window === 'undefined'
                ? process.env.INTERNAL_API_URL // Sunucu tarafı (SSR)
                : process.env.NEXT_PUBLIC_API_URL; // Tarayıcı tarafı (Client-side)
                
        if (!apiUrl) {
            console.error('API URL tanımlı değil. Lütfen .env.local veya docker-compose.yml dosyanızı kontrol edin.');
            return null;
        }

        const res = await fetch(`${apiUrl}/api/products/${slug}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            if (res.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch product');
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-8">
                <Breadcrumb category={product.category} productName={product.name} />
                
                <div className="mt-8">
                    <ProductInfo product={product} />
                </div>

                <div className="mt-16">
                    <SimilarProducts categoryId={product.category?.id} currentProductId={product.id} />
                </div>
                 <div className="mt-16">
                    <Bestsellers />
                </div>
            </div>
        </div>
    );
}
