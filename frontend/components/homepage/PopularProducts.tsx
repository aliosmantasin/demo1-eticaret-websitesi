"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "../ProductCard";
import { Product, SiteSettings } from "@/types";

interface PopularProductsProps {
  products: Product[];
}

export function PopularProducts({ products }: PopularProductsProps) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/settings`, {
          cache: "no-store",
        });
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

  const slugs = useMemo(
    () => siteSettings?.popular_product_slugs ?? [],
    [siteSettings?.popular_product_slugs],
  );
  const limit = siteSettings?.popular_products_limit ?? 9;
  const isHidden = siteSettings?.popular_products_hidden ?? false;

  const selectedProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0 || slugs.length === 0) {
      return [];
    }
    const productMap = new Map(products.map((product) => [product.slug, product]));
    return slugs
      .map((slug) => productMap.get(slug))
      .filter((product): product is Product => Boolean(product))
      .slice(0, limit);
  }, [products, slugs, limit]);

  if (isHidden || selectedProducts.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Popüler Ürünler
        </p>
        <h2 className="text-3xl font-bold text-gray-900">
          {siteSettings?.popular_products_title || 'Topluluğun Favorileri'}
        </h2>
        {(siteSettings?.popular_products_subtitle ?? '').trim().length > 0 && (
          <p className="text-base text-gray-600 max-w-2xl">
            {siteSettings?.popular_products_subtitle}
          </p>
        )}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {selectedProducts.map((product) => (
          <ProductCard key={product.id} product={product} showShortExplanation={false} />
        ))}
      </div>
    </section>
  );
}

