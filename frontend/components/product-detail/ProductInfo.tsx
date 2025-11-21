"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Product, Option, OptionValue, Image as ImageType, SiteSettings } from '@/types';
import { Minus, Plus, ShieldCheck, Star, Truck, CheckCircle } from 'lucide-react';
import { VariantChip } from './VariantChip';
import { SizeBox } from './SizeBox';
import { ProductDetailsAccordion } from './ProductDetailsAccordion';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ProductGallery } from './ProductGallery';

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

export const ProductInfo = ({ product }: { product: Product }) => {

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [variantImages, setVariantImages] = useState<ImageType[] | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  const { token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>(() => {
        const initialOptions: { [key: string]: string } = {};
        const params = new URLSearchParams(searchParams);

        if (product.options && Array.isArray(product.options)) {
            product.options.forEach(option => {
                const paramValue = params.get(option.name.toLowerCase());
                if (paramValue) {
                    const foundValue = option.values.find(v => v.value.toLowerCase() === paramValue.toLowerCase());
                    if (foundValue) {
                        initialOptions[option.name] = foundValue.id;
                    }
                }
            });
        }

        // Eğer URL'den tüm seçenekler belirlenemediyse, varsayılan mantığa dön
        if (Object.keys(initialOptions).length !== (product.options?.length || 0)) {
            if (product.variants && product.variants.length > 0) {
                let defaultVariant = product.variants.find(
                    v => v.stock > 0 && v.discounted_price != null && v.discounted_price < v.price
                );
                if (!defaultVariant) {
                    defaultVariant = product.variants.find(v => v.stock > 0);
                }
                if (!defaultVariant) {
                    defaultVariant = product.variants[0];
                }

                if (defaultVariant) {
                    defaultVariant.optionValues.forEach(ov => {
                        initialOptions[ov.option.name] = ov.id;
                    });
                }
            }
        }
        
        return initialOptions;
    });

    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(selectedOptions).forEach(([optionName, valueId]) => {
            const option = product.options?.find(o => o.name === optionName);
            const value = option?.values.find(v => v.id === valueId);
            if (value) {
                params.set(optionName.toLowerCase(), value.value.toLowerCase());
            }
        });

        // Sadece gerçekten bir değişiklik varsa URL'i güncelle
        if (params.toString() !== searchParams.toString()) {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }, [selectedOptions, product.options, pathname, router, searchParams]);


    // Memoize the calculation of available option groups
    const getSizeNumericValue = (value: string) => {
        const match = value.replace(',', '.').match(/[\d.]+/);
        return match ? parseFloat(match[0]) : Number.POSITIVE_INFINITY;
    };

    const optionGroups = useMemo(() => {
        const groups: { [key: string]: Option & { values: OptionValue[] } } = {};
        product.variants?.forEach(variant => {
            variant.optionValues.forEach(ov => {
                if (!groups[ov.option.name]) {
                    groups[ov.option.name] = { ...ov.option, values: [] };
                }
                if (!groups[ov.option.name].values.some(v => v.id === ov.id)) {
                    groups[ov.option.name].values.push(ov);
                }
            });
        });
        return Object.values(groups).map(group => {
            const lowerName = group.name.toLowerCase();
            const sortedValues = [...group.values].sort((a, b) => {
                if (lowerName === 'boyut') {
                    return getSizeNumericValue(a.value) - getSizeNumericValue(b.value);
                }
                return a.value.localeCompare(b.value, 'tr', { sensitivity: 'base' });
            });
            return { ...group, values: sortedValues };
        });
    }, [product.variants]);
    
    // Memoize the complex logic for the currently selected combination
    const selectedCombination = useMemo(() => {
        if (!product.variants || !product.options || Object.keys(selectedOptions).length < product.options.length) {
            return { totalStock: 0, displayPrice: 0, originalPrice: 0, hasDiscount: false, variantToAddToCart: null };
        }

        const selectedValues = Object.values(selectedOptions);

        const matchingVariant = product.variants.find(variant =>
            selectedValues.every(selectedValueId =>
                variant.optionValues.some(ov => ov.id === selectedValueId)
            ) && variant.optionValues.length === selectedValues.length
        );

        if (!matchingVariant) {
            return { totalStock: 0, displayPrice: 0, originalPrice: 0, hasDiscount: false, variantToAddToCart: null };
        }

        const hasDiscount = matchingVariant.discounted_price != null && matchingVariant.discounted_price < matchingVariant.price;

        return {
            totalStock: matchingVariant.stock,
            displayPrice: hasDiscount ? matchingVariant.discounted_price! : matchingVariant.price,
            originalPrice: matchingVariant.price,
            hasDiscount: hasDiscount,
            variantToAddToCart: matchingVariant,
        };

    }, [selectedOptions, product.variants, product.options]);

    // Check if a specific option value is available (i.e., part of any in-stock variant)
    const isOptionValueAvailable = useCallback((valueId: string) => {
        // Bir seçeneğin "tıklanabilir" olması için, o seçeneği içeren stokta olan
        // HERHANGİ BİR varyantın olması yeterlidir. Diğer seçimlerden bağımsızdır.
        return product.variants.some(variant => 
            variant.stock > 0 && variant.optionValues.some(ov => ov.id === valueId)
        );
    }, [product.variants]);
    
    // Reset quantity to 1 if the selected variant changes
    useEffect(() => {
        setQuantity(1);
    }, [selectedOptions]);

    const isCurrentSelectionInStock = useMemo(() => {
        return selectedCombination.totalStock > 0;
    }, [selectedCombination.totalStock]);

    const handleOptionSelect = useCallback((optionName: string, valueId: string) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: valueId }));
    }, []);

    const handleAddToCart = async () => {
        if (!token) {
            router.push('/giris-yap');
            return;
        }

        if (!selectedCombination.variantToAddToCart) {
            setErrorMessage('Lütfen tüm seçenekleri belirleyiniz veya stokta mevcut olan bir varyant seçiniz.');
            setShowErrorModal(true);
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
                    variantId: selectedCombination.variantToAddToCart.id,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Sepete eklenirken bir hata oluştu');
            }
            
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Sepete ekleme hatası:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Ürün sepete eklenirken bir hata oluştu.');
            setShowErrorModal(true);
        } finally {
            setIsAdding(false);
        }
    };

    useEffect(() => {
        if (selectedCombination.variantToAddToCart && selectedCombination.variantToAddToCart.images && selectedCombination.variantToAddToCart.images.length > 0) {
            setVariantImages(selectedCombination.variantToAddToCart.images);
        } else {
            setVariantImages(null); // Varyantın özel resmi yoksa, ana resimlere dön
        }
    }, [selectedCombination.variantToAddToCart]);

    // Site ayarlarını fetch et
    useEffect(() => {
        const fetchSiteSettings = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/settings`);
                if (response.ok) {
                    const data = await response.json();
                    setSiteSettings(data);
                }
            } catch (error) {
                console.error('Site ayarları getirilemedi:', error);
            }
        };
        fetchSiteSettings();
    }, []);

    const detailBadges = [
        {
            key: 'primary',
            text: product.badge_primary_text?.trim(),
            hidden: product.badge_primary_hidden,
        },
        {
            key: 'secondary',
            text: product.badge_secondary_text?.trim(),
            hidden: product.badge_secondary_hidden,
        },
    ].filter((badge) => !badge.hidden && badge.text);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <ProductGallery images={product.images} variantImages={variantImages} />

      <div className="flex flex-col gap-4">
        {/* Ürün Adı ve Yorumlar */}
        <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(product.average_star || 0)}</div>
                    <a href="#reviews" className="text-sm text-gray-500 hover:underline">
                        {product.reviews?.length || 0} Yorum
                    </a>
                </div>

                {/* Kısa Açıklama & Rozetler */}
                {product.short_explanation && (
                    <p className="text-sm font-medium uppercase text-gray-600">{product.short_explanation}</p>
                )}

                {detailBadges.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {detailBadges.map((badge) => (
                            <span key={badge.key} className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                                {badge.text}
                            </span>
                        ))}
                    </div>
                )}

                {optionGroups.map(option => (
                    <div key={option.id} className="mt-4 space-y-2">
                        <h4 className="text-sm font-semibold">{option.name.toUpperCase()}:</h4>
                        <div className="flex flex-wrap gap-2">
                            {option.name.toLowerCase() === 'aroma' ? (
                                option.values.map(value => (
                                    <VariantChip
                                        key={value.id}
                                        label={value.value}
                                        color={value.color || '#ccc'}
                                        isSelected={selectedOptions[option.name] === value.id}
                                        onClick={() => handleOptionSelect(option.name, value.id)}
                                        isAvailable={isOptionValueAvailable(value.id)}
                                    />
                                ))
                            ) : (
                                option.values.map(value => {
                                    return (
                                        <SizeBox
                                            key={value.id}
                                            sizeLabel={value.value}
                                            isSelected={selectedOptions[option.name] === value.id}
                                            onClick={() => handleOptionSelect(option.name, value.id)}
                                            isAvailable={isOptionValueAvailable(value.id)}
                                        />
                                    );
                                })
                            )}
                        </div>
                    </div>
                ))}

                {/* Fiyat */}
                <div className="mt-4">
                     {!isCurrentSelectionInStock && (
                        <p className="text-xl font-bold text-red-600 mb-2">Stok Tükendi</p>
                    )}
                    {selectedCombination.hasDiscount ? (
                        <div className="flex items-end gap-2">
                            <p className={`text-xl text-gray-500 line-through ${!isCurrentSelectionInStock ? 'opacity-50' : ''}`}>
                                {selectedCombination.originalPrice.toFixed(2)} TL
                            </p>
                            <p className={`text-3xl font-bold text-red-600 ${!isCurrentSelectionInStock ? 'opacity-50' : ''}`}>
                                {selectedCombination.displayPrice.toFixed(2)} TL
                            </p>
                        </div>
                    ) : (
                        <p className={`flex justify-between items-end ${!isCurrentSelectionInStock ? 'opacity-50' : ''}`}>
                            <span className='text-3xl font-bold text-primary'>
                                {selectedCombination.displayPrice.toFixed(2)} TL
                            </span>
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
                        disabled={isAdding || !isCurrentSelectionInStock}
                    >
                        <svg className="text-3xl w-12 h-12" focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width: '1.5rem', height: '1.5rem'}}>
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2M1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2"></path>
                        </svg>
                        <span>{isAdding ? 'Ekleniyor...' : 'SEPETE EKLE'}</span>
                    </Button>
                </div>

                {/* Bilgi ikon şeridi */}
                {(() => {
                  const visibleItems = [];
                  if (!siteSettings?.shipping_hidden) {
                    visibleItems.push(
                      <div key="shipping" className='flex items-center gap-2'>
                        <Truck/>
                        <div>
                          <span className="block font-semibold">{siteSettings?.shipping_text || 'Aynı Gün'}</span>
                          <span>{siteSettings?.shipping_subtext || 'Ücretsiz Kargo'}</span>
                        </div>
                      </div>
                    );
                  }
                  if (!siteSettings?.customer_hidden) {
                    visibleItems.push(
                      <div key="customer" className='flex items-center gap-2'>
                        <ShieldCheck />
                        <div>
                          <span className="block font-semibold">{siteSettings?.customer_count || '750.000+'}</span>
                          <span>{siteSettings?.customer_label || 'Mutlu Müşteri'}</span>
                        </div>
                      </div>
                    );
                  }
                  if (!siteSettings?.guarantee_hidden) {
                    visibleItems.push(
                      <div key="guarantee" className='flex items-center gap-2'>
                        <ShieldCheck />
                        <div>
                          <span className="block font-semibold">{siteSettings?.guarantee_percent || '%100'}</span>
                          <span>{siteSettings?.guarantee_text || 'Memnuniyet Garantisi'}</span>
                        </div>
                      </div>
                    );
                  }
                  
                  if (visibleItems.length === 0) return null;
                  
                  return (
                    <div className={`mt-6 grid gap-4 text-center text-xs ${visibleItems.length === 1 ? 'grid-cols-1' : visibleItems.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      {visibleItems}
                    </div>
                  );
                })()}

                {/* Son Kullanma Tarihi */}
                {product.expiry_date && (
                    <p className="mt-4 text-xs text-gray-500">Son Kullanma Tarihi: {product.expiry_date}</p>
                )}

                     {/* Akordiyon Detaylar */}
                     <div className="mt-12">
                        <ProductDetailsAccordion product={product} />
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
                                            src={product.images[0]?.url || '/placeholder.png'}
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
                                        {selectedCombination.displayPrice > 0 && (
                                            <p className="text-lg font-bold text-green-600 mt-2">
                                                {(selectedCombination.displayPrice * quantity).toFixed(2)} ₺
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
    </div>
  );
};



