"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Category, SiteSettings } from "@/types";

export function CategoryShowcase() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const [categoriesResponse, settingsResponse] = await Promise.all([
                    fetch(`${apiUrl}/api/categories`, { cache: 'no-store' }),
                    fetch(`${apiUrl}/api/settings`, { cache: 'no-store' }),
                ]);

                if (categoriesResponse.ok) {
                    const data: Category[] = await categoriesResponse.json();
                    // Tüm kategorileri göster (paketler dahil)
                    setCategories(data);
                }

                if (settingsResponse.ok) {
                    const settings: SiteSettings = await settingsResponse.json();
                    setSiteSettings(settings);
                }
            } catch (error) {
                console.error("Kategori vitrin verileri getirilemedi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="rounded-lg overflow-hidden shadow-md bg-gray-200 animate-pulse aspect-4/3"></div>
                    ))}
                </div>
            </section>
        );
    }

    if (siteSettings?.category_showcase_hidden || categories.length === 0) {
        return null;
    }

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {categories.map((category) => (
                    <div key={category.id} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
                        <div className="relative w-full overflow-hidden aspect-4/2">
                            <Image
                                src={category.image?.url || "https://via.placeholder.com/400x300"}
                                alt={category.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="absolute right-0 sm:-right-3 lg:right-4 top-1/2 -translate-y-1/2 transform p-4">
                            <h3 className="w-18 md:w-32 h-4 sm:h-12 text-end lg:text-center justify-end mb-4 text-xs md:text-lg lg:text-2xl font-bold text-gray-900">
                                {category.name}
                            </h3>
                            <div className="flex justify-end">
                                <a
                                    href={category.slug === 'paketler' ? '/paketler' : `/kategori/${category.slug}`}
                                    className="w-20 sm:w-auto xl:w-36 text-center bg-primary text-white px-4 md:px-4 rounded-md text-xs md:text-lg font-medium hover:bg-opacity-90 transition-all"
                                >
                                    İNCELE
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
