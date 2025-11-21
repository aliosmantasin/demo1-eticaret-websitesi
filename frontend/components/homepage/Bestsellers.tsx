"use client";

import { useEffect, useState } from "react";
import { Product, SiteSettings } from "@/types";
import ProductCard from "../ProductCard";

interface BestsellersProps {
    products: Product[];
}

export function Bestsellers({ products }: BestsellersProps) {
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        const fetchSiteSettings = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/settings`, { cache: "no-store" });
                if (response.ok) {
                    const data: SiteSettings = await response.json();
                    setSiteSettings(data);
                }
            } catch (error) {
                console.error("Site ayarları getirilemedi:", error);
            }
        };

        fetchSiteSettings();
    }, []);

    const limit = Math.min(
        Math.max(siteSettings?.bestsellers_limit ?? 6, 1),
        6
    );

    const displayedProducts = Array.isArray(products)
        ? products.slice(0, limit)
        : [];

    const isHidden = siteSettings?.bestsellers_hidden ?? false;
    if (isHidden) {
        return null;
    }

    if (displayedProducts.length === 0) {
        return null;
    }

    return (
        <section className="container mx-auto px-4 py-8">
            <h1 className="mb-8 mt-12 text-center text-4xl font-bold">
                Çok Satanlar
            </h1>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
                {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} showShortExplanation={false} />
                ))}
            </div>
        </section>
    );
}
