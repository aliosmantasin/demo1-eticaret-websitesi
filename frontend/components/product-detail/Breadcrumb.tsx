import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface BreadcrumbProps {
    category: {
        name: string;
        slug: string;
    };
    productName: string;
    customCategoryPath?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ category, productName, customCategoryPath }) => {
    // Paketler kategorisi için özel route veya custom path kullan
    const categoryHref = customCategoryPath || (category.slug === 'paketler' ? '/paketler' : `/kategori/${category.slug}`);
    
    return (
        <nav aria-label="breadcrumb" className="mb-4 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link href="/" className="hover:text-primary">
                        OJS Nutrition
                    </Link>
                </li>
                <li>
                    <ChevronRight className="h-4 w-4" />
                </li>
                <li>
                    <Link href={categoryHref} className="hover:text-primary">
                        {category.name}
                    </Link>
                </li>
                <li>
                    <ChevronRight className="h-4 w-4" />
                </li>
                <li className="font-medium text-gray-700" aria-current="page">
                    {productName}
                </li>
            </ol>
        </nav>
    );
};



