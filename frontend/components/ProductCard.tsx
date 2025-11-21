// frontend/components/ProductCard.tsx
import { Star } from 'lucide-react';
import { Product } from '@/types';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  showShortExplanation?: boolean;
}

// Yıldızları render etmek için bir yardımcı fonksiyon
const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />);
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
  }
  return stars;
};


const ProductCard: React.FC<ProductCardProps> = ({ product, showShortExplanation = true }) => {
  let displayPrice: number = 0;
  let originalPrice: number | null = null;
  let discountPercentage: number = 0;
  let hasDiscount: boolean = false;

  if (product.variants && product.variants.length > 0) {
    const variantsWithDiscount = product.variants.filter(
      (v) => v.discounted_price != null && v.discounted_price < v.price
    );

    if (variantsWithDiscount.length > 0) {
      // İndirimli varyantlar varsa, en düşük indirimli fiyatı bul
      hasDiscount = true;
      const bestDealVariant = variantsWithDiscount.reduce((best, current) =>
        current.discounted_price! < best.discounted_price! ? current : best
      );
      displayPrice = bestDealVariant.discounted_price!;
      originalPrice = bestDealVariant.price;
      discountPercentage = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
    } else {
      // İndirim yoksa, en düşük başlangıç fiyatını bul
      const prices = product.variants.map((v) => v.price);
      displayPrice = Math.min(...prices);
    }
  }

  return (
    <Link href={`/urun/${product.slug}`} className="group text-center flex flex-col h-full bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <div className="aspect-square w-full overflow-hidden rounded-t-lg">
          {product.images && product.images[0] ? (
            <Image
                src={product.images[0].url}
              width={400}
                height={400}
              alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full rounded-t-lg bg-gray-200"></div>
          )}
        </div>
          {hasDiscount && (
            <div className="absolute top-0 left-0 bg-red-600 text-white text-sm font-bold px-3 py-2 rounded-tl-lg rounded-br-lg">
                %{discountPercentage} İNDİRİM
            </div>
          )}
        </div>
      <div className="flex flex-col p-4 grow">
        <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">{product.name}</h2>
        {showShortExplanation && product.short_explanation && (
            <p className="text-xs text-gray-500 mt-1 h-8">{product.short_explanation}</p>
        )}
        <div className="flex justify-center items-center gap-2 mt-2">
            <div className="flex">
              {renderStars(product.average_star)}
          </div>
          <span className="text-xs text-gray-500">
                {product.comment_count} Yorum
          </span>
        </div>
        <div className="mt-4 grow-0">
            {hasDiscount && originalPrice ? (
                <div className="flex items-baseline justify-center gap-2">
                    <p className="text-lg text-gray-500 line-through">
                        {originalPrice.toFixed(2)} TL
                </p>
                <p className="text-xl font-bold text-green-600">
                        {displayPrice.toFixed(2)} TL
                </p>
              </div>
            ) : (
              <p className="text-xl font-bold text-gray-900">
                    {displayPrice > 0 ? `${displayPrice.toFixed(2)} TL` : 'Fiyat Belirtilmemiş'}
              </p>
            )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

