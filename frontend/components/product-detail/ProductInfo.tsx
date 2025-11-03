"use client";

import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { Minus, Plus, ShieldCheck, Star, Truck, CheckCircle } from 'lucide-react';
import { VariantChip } from './VariantChip';
import { SizeBox } from './SizeBox';
import React, { useState } from 'react';
import { ProductDetailsAccordion } from './ProductDetailsAccordion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';

interface ProductInfoProps {
    product: Product;
}

const renderStars = (average_star: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
            <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(average_star) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                    }`}
            />
        );
    }
    return stars;
};

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { token } = useAuth();
    const router = useRouter();
    const hasDiscount = product.discounted_price && product.discounted_price < product.price;

    // TEMP: Sabit aromalar ve boyutlar (backend entegrasyonu sonrası product datasından gelecek)
    const aromaOptions = [
        { label: 'Bisküvi', color: '#F5E4CF' },
        { label: 'Çikolata', color: '#8B4513' },
        { label: 'Muz', color: '#FEEA69' },
        { label: 'Salted Caramel', color: '#C67A55' },
        { label: 'Choco Nut', color: '#5D3B18' },
        { label: 'Hindistan Cevizi', color: '#ECE4D9' },
        { label: 'Raspberry Cheesecake', color: '#EFB0C9' },
        { label: 'Çilek', color: '#F8607B' },
    ];

    const sizeOptions = [
        { size: '400G', sub: '16 servis' },
        { size: '1.6KG', sub: '64 servis' },
        { size: '1.6KG X 2 ADET', sub: '128 servis', highlight: true },
    ];

    const [selectedAroma, setSelectedAroma] = useState(aromaOptions[0].label);
    const [selectedSize, setSelectedSize] = useState(sizeOptions[0].size);

    const pricePerServing = ((hasDiscount ? product.discounted_price! : product.price) / 16).toFixed(2); // TODO dynamic serving

    const handleAddToCart = async () => {
        if (!token) {
            router.push('/giris-yap');
            return;
        }

        setIsAdding(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${apiUrl}/api/cart/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: quantity,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Sepete eklenirken bir hata oluştu');
            }

            // Sepet güncellemesini tetikle
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Sepete ekleme hatası:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Ürün sepete eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
            setShowErrorModal(true);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Ürün Adı ve Yorumlar */}
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
                <div className="flex">{renderStars(product.average_star)}</div>
                <a href="#reviews" className="text-sm text-gray-500 hover:underline">
                    {product.comment_count} Yorum
                </a>
            </div>

            {/* Kısa Açıklama & Rozetler */}
            {product.short_explanation && (
                <p className="text-sm font-medium uppercase text-gray-600">{product.short_explanation}</p>
            )}

            <div className="flex gap-2">
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">VEJETARYEN</span>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">GLUTENSİZ</span>
            </div>

            {/* Aroma Seçimi */}
            <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold">AROMA:</h4>
                <div className="flex flex-wrap gap-2">
                    {aromaOptions.map((opt) => (
                        <VariantChip
                            key={opt.label}
                            label={opt.label}
                            color={opt.color}
                            selected={selectedAroma === opt.label}
                            onClick={() => setSelectedAroma(opt.label)}
                        />
                    ))}
                </div>
            </div>

            {/* Boyut Seçimi */}
            <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold">BOYUT:</h4>
                <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((s) => (
                        <SizeBox
                            key={s.size}
                            sizeLabel={s.size}
                            subLabel={s.sub}    
                            selected={selectedSize === s.size}
                            onClick={() => setSelectedSize(s.size)}
                        />
                    ))}
                </div>
            </div>

            {/* Fiyat */}
            <div className="mt-4">
                {hasDiscount ? (
                    <div className="flex items-end gap-2">
                        <p className="text-xl text-gray-500 line-through">
                            {product.price.toFixed(2)} TL
                        </p>
                        <p className="text-3xl font-bold text-red-600">
                            {product.discounted_price?.toFixed(2)} TL
                        </p>
                    </div>
                ) : (
                    <p className="flex justify-between">
                        <span className='text-3xl font-bold text-primary'>
                            {product.price.toFixed(2)} TL</span>

                              {/* Fiyat / Servis alt metni */}
                        <span className='text-xl text-gray-500'>{pricePerServing} TL / Servis</span>
                    </p>
                )}
            </div>

 

            {/* Adet ve Sepet Butonu */}
            <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center rounded-md border">
                    <Button className='bg-gray-100 cursor-pointer rounded-r-none' variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-bold">{quantity}</span>
                    <Button className='bg-gray-100 cursor-pointer rounded-l-none' variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <Button 
                    size="lg" 
                    className="grow bg-primary hover:bg-primary/90"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                >
                    <svg className="text-3xl w-12 h-12" focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width: '1.5rem', height: '1.5rem'}}>
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2M1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2"></path>
                    </svg>
                    <span>{isAdding ? 'Ekleniyor...' : 'SEPETE EKLE'}</span>
                </Button>
            </div>

            {/* Bilgi ikon şeridi */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs">
                <div className='flex items-center gap-2'>
                    <Truck/>
                    <div>
                    <span className="block font-semibold">Aynı Gün</span>
                    <span>Ücretsiz Kargo</span>
                    </div>
                   
                </div>

                <div className='flex items-center gap-2'>
                    <ShieldCheck />
                    <div>
                        <span className="block font-semibold">750.000+</span>
                        <span>Mutlu Müşteri</span>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <ShieldCheck />
                    <div>
                        <span className="block font-semibold">%100</span>
                        <span>Memnuniyet Garantisi</span>
                    </div>
                </div>

            </div>

            {/* Son Kullanma Tarihi */}
            <p className="mt-4 text-xs text-gray-500">Son Kullanma Tarihi: 07.2025</p>

                 {/* Akordiyon Detaylar */}
                 <div className="mt-12">
                    <ProductDetailsAccordion />
                </div>

            {/* Başarı Modal */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                            Ürün Sepete Eklendi
                        </DialogTitle>
                        <DialogDescription className="pt-4">
                            <div className="flex gap-4 items-center">
                                <div className="relative w-24 h-24 overflow-hidden rounded-md border border-gray-200 shrink-0">
                                    <Image
                                        src={product.images[0] || '/placeholder.png'}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {quantity} adet sepete eklendi
                                    </p>
                                    {(hasDiscount ? product.discounted_price! : product.price) * quantity > 0 && (
                                        <p className="text-lg font-bold text-green-600 mt-2">
                                            {((hasDiscount ? product.discounted_price! : product.price) * quantity).toFixed(2)} ₺
                                        </p>
                                    )}
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full sm:w-auto"
                        >
                            Alışverişe Devam Et
                        </Button>
                        <Link href="/sepet" onClick={() => setShowSuccessModal(false)} className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto">
                                Sepete Git
                            </Button>
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Hata Modal */}
            <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">
                            Hata Oluştu
                        </DialogTitle>
                        <DialogDescription className="pt-4">
                            {errorMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setShowErrorModal(false)}
                            className="w-full sm:w-auto"
                        >
                            Tamam
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};



