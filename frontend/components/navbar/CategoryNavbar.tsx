import Link from "next/link";
import React from "react";

const categories = [
    { name: "PROTEİN", slug: "protein" },
    { name: "SPOR GIDALARI", slug: "spor-gidalari" },
    { name: "SAĞLIK", slug: "saglik" },
    { name: "GIDA", slug: "gida" },
    { name: "VİTAMİN", slug: "vitamin" },
    { name: "TÜM ÜRÜNLER", slug: "tum-urunler" },
];

export function CategoryNavbar() {
    return (
        <nav className="hidden bg-primary md:block border-t border-gray-700">
            <div className="container mx-auto flex items-center justify-center gap-8 px-4 lg:gap-12">
                {categories.map((category) => (
                    <Link
                        key={category.slug}
                        href={`/kategori/${category.slug}`}
                        className="py-3 text-sm font-medium text-primary-foreground transition-colors hover:text-gray-300"
                    >
                        {category.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
