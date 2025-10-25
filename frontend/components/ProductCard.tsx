// frontend/components/ProductCard.tsx
import { Star } from 'lucide-react';
import { Product } from '@/types';

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


const ProductCard = ({ product }: ProductCardProps) => {
  const hasDiscount = product.discounted_price && product.discounted_price < product.price;

  return (
    <div className="border rounded-lg shadow-lg flex flex-col h-full group overflow-hidden">
      <div className="relative w-full h-48 mb-2">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain rounded-t-lg transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-t-lg"></div>
        )}
        {hasDiscount && (
           <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            %{product.discount_percentage} İndirim
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-base font-semibold flex-grow mb-2 text-gray-800">{product.name}</h2>
        
        <div className="flex items-center gap-2 mb-2">
           <div className="flex">
            {renderStars(product.average_star)}
          </div>
          <span className="text-xs text-gray-500">
            {product.comment_count} yorum
          </span>
        </div>

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

          <button className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
            İncele
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
