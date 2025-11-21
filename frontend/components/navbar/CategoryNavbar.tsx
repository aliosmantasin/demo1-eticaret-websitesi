"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Category } from "@/types";

export function CategoryNavbar() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/categories`, {
                    cache: 'no-store',
                });
                if (response.ok) {
                    const data = await response.json();
                    // Sadece showInNavbar: true olan kategorileri göster
                    const navbarCategories = data.filter((cat: Category) => cat.showInNavbar !== false);
                    setCategories(navbarCategories);
                }
            } catch (error) {
                console.error('Kategoriler yüklenemedi:', error);
            }
        };
        fetchCategories();
    }, []);

    if (categories.length === 0) {
        return null;
    }

    return (
        <nav className="hidden bg-primary md:block border-t border-gray-700">
            <div className="container mx-auto flex items-center justify-center gap-8 px-4 lg:gap-12">
                {categories.map((category) => {
                    // Paketler kategorisi için özel route
                    const href = category.slug === 'paketler' ? '/paketler' : `/kategori/${category.slug}`;
                    return (
                        <Link
                            key={category.slug}
                            href={href}
                            className="py-3 text-sm font-medium text-primary-foreground transition-colors hover:text-gray-300"
                        >
                            {category.name}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
