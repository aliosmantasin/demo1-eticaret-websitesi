import React from "react";

const categories = [
    "PROTEİN",
    "SPOR GIDALARI",
    "SAĞLIK",
    "GIDA",
    "VİTAMİN",
    "TÜM ÜRÜNLER",
];

export function CategoryNavbar() {
    return (
        <nav className="hidden bg-primary md:block">
            <div className="container mx-auto flex items-center justify-center gap-8 px-4 lg:gap-12">
                {categories.map((category) => (
                    <a
                        key={category}
                        href="#"
                        className="py-3 text-sm font-medium text-primary-foreground transition-colors hover:text-gray-300"
                    >
                        {category}
                    </a>
                ))}
            </div>
        </nav>
    );
}
