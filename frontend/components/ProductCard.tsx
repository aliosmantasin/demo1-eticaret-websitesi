// frontend/components/ProductCard.tsx
import { Star } from 'lucide-react';
import { Product } from '@/types';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

// Yıldızları render etmek için bir yardımcı fonksiyon
const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0; // Bu projede kullanmıyoruz ama ilerisi için faydalı olabilir

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />);
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
  }
  return stars;
};


const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const hasDiscount = product.discounted_price && product.discounted_price < product.price;

  return (
    <Link href={`/urun/${product.slug}`} className="flex h-full flex-col">
      <div className="flex h-full flex-col rounded-lg border bg-white shadow-md transition-shadow duration-300 hover:shadow-lg group">
        <div className="relative mb-2 h-48 w-full">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              width={400}
              height={300}
              alt={product.name}
              className="h-full w-full rounded-t-lg object-contain cursor-pointer"
            />
          ) : (
            <div className="h-full w-full rounded-t-lg bg-gray-200"></div>
          )}
          {hasDiscount && (
            <div className="absolute -top-3 right-2 flex h-16 w-16 items-center justify-center rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
              <div className="flex flex-col items-center justify-center">
                <span>%{product.discount_percentage}</span>
                <span>İndirim</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex grow flex-col items-center justify-center p-4">
          <h2 className="mb-2 grow text-center text-base font-semibold text-gray-800">{product.name}</h2>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex">
              {renderStars(product.average_star)}
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {product.comment_count} yorum
          </span>
          <div className="mt-auto">
            {hasDiscount ? (
              <div className="flex items-end gap-2">
                <p className="text-sm text-gray-500 line-through">
                  {product.price.toFixed(2)} TL
                </p>
                <p className="text-xl font-bold text-red-600">
                  {product.discounted_price?.toFixed(2)} TL
                </p>
              </div>
            ) : (
              <p className="text-xl font-bold text-gray-900">
                {product.price.toFixed(2)} TL
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

