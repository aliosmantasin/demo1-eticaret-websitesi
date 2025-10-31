"use client";

import Image from 'next/image';
import React, { useState } from 'react';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
    // Şimdilik sadece ilk resmi gösteriyoruz.
    // Daha sonra thumbnail'ler eklendiğinde burası interaktif hale getirilecek.
    const [mainImage, setMainImage] = useState(images[0]);

    if (!images || images.length === 0) {
        return (
            <div className="flex h-96 w-full items-center justify-center rounded-lg bg-gray-200">
                <p className="text-gray-500">Görsel Yok</p>
            </div>
        );
    }

    return (
        <div>
            <div className="relative h-[400px] w-full md:h-[500px]">
                <Image
                    src={mainImage}
                    alt={productName}
                    fill
                    className="rounded-lg object-contain"
                    priority
                />
            </div>
            {/* TODO: Thumbnail galerisi buraya eklenecek */}
        </div>
    );
};



