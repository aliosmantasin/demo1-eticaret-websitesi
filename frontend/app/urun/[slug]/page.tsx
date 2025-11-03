import { Breadcrumb } from "@/components/product-detail/Breadcrumb";
import { ProductGallery } from "@/components/product-detail/ProductGallery";
import { ProductInfo } from "@/components/product-detail/ProductInfo";
import { ProductReviews } from "@/components/product-detail/ProductReviews";
import { SimilarProducts } from "@/components/product-detail/SimilarProducts";
import { Bestsellers } from "@/components/product-detail/Bestsellers";
import { Product } from "@/types";
import React from "react";

async function getProduct(slug: string): Promise<Product | null> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-3xl font-bold">Ürün Bulunamadı</h1>
                <p className="mt-4">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-8">
                <Breadcrumb category={product.category} productName={product.name} />

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Sol Sütun: Ürün Galerisi */}
                    <div>
                        <ProductGallery images={product.images} productName={product.name} />
                    </div>

                    {/* Sağ Sütun: Ürün Bilgileri */}
                    <div>
                        <ProductInfo product={product} />
                    </div>
                </div>

                {/* Benzer Ürünler */}
                <SimilarProducts product={product} />

                {/* Yorumlar Bölümü */}
                <ProductReviews productId={product.id} />

                {/* Çok Satanlar */}
                <Bestsellers />
            </div>
        </div>
    );
}
