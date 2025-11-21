'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Image as ImageType } from '@/types'; // Assuming you have this type defined
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: ImageType[];
  variantImages: ImageType[] | null;
}

export const ProductGallery = ({ images, variantImages }: ProductGalleryProps) => {
  // Ana görsel her zaman ürün görsellerinden ilki olmalı
  const mainImage = images[0] || null;
  const [activeImage, setActiveImage] = useState<ImageType | null>(mainImage);
  const [userSelectedImage, setUserSelectedImage] = useState<ImageType | null>(null);
  
  // Thumbnail'ler: Önce ürün görselleri, sonra varyant görselleri (varsa)
  const [displayImages, setDisplayImages] = useState<ImageType[]>(images);

  useEffect(() => {
    // Varyant değiştiğinde kullanıcının seçtiği görseli sıfırla
    setUserSelectedImage(null);
    
    // Thumbnail'leri birleştir: Önce ürün görselleri, sonra varyant görselleri
    const combinedImages = [...images];
    if (variantImages && variantImages.length > 0) {
      // Varyant görsellerini ekle, ama zaten ürün görsellerinde varsa tekrar ekleme
      variantImages.forEach(variantImg => {
        if (!combinedImages.find(img => img.id === variantImg.id)) {
          combinedImages.push(variantImg);
        }
      });
    }
    setDisplayImages(combinedImages);
    
    // Ana görseli her zaman ürün görsellerinden ilkine döndür
    if (mainImage) {
      setActiveImage(mainImage);
    }
  }, [variantImages, images, mainImage]);


  if (!activeImage) {
        return (
      <div className="flex items-center justify-center w-full h-[450px] bg-gray-100 rounded-lg">
        <p className="text-gray-500">Görsel bulunamadı</p>
            </div>
        );
    }

    return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-[450px] rounded-lg overflow-hidden shadow-lg">
                <Image
          src={activeImage.url}
          alt="Ürün Görseli"
                    fill
          className="object-contain"
                />
            </div>
      {displayImages.length > 1 && (
         <div className="grid grid-cols-5 gap-2">
         {displayImages.map((image) => (
           <button
             key={image.id}
             onClick={() => {
               setActiveImage(image);
               setUserSelectedImage(image);
             }}
             className={cn(
               "relative w-full aspect-square rounded-md overflow-hidden transition-all duration-200",
               "ring-2 ring-transparent hover:ring-indigo-500 focus:ring-indigo-500",
               { "ring-indigo-500 ring-offset-2": activeImage.id === image.id }
             )}
           >
             <Image
               src={image.url}
               alt="Ürün Thumbnail"
               fill
               className="object-cover"
             />
           </button>
         ))}
       </div>
      )}
        </div>
    );
};



