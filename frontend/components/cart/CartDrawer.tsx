"use client";

import React, { useEffect, useState, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discounted_price?: number;
    images: string[];
  };
}

interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export function CartDrawer() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuth();

  const fetchCart = useCallback(async (showLoading = false) => {
    if (!token) return;
    
    if (showLoading) {
      setIsLoading(true);
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error('Sepet bilgisi alınamadı:', error);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [token]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (!token) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        fetchCart(); // Sepeti yeniden yükle (loading gösterme)
      }
    } catch (error) {
      console.error('Adet güncelleme hatası:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!token) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCart(); // Sepeti yeniden yükle (loading gösterme)
      }
    } catch (error) {
      console.error('Ürün silme hatası:', error);
    }
  };

  // İlk yüklemede sepeti al
  useEffect(() => {
    if (token && !isOpen) {
      fetchCart(false); // Silent update sadece badge için
    }
  }, [token, fetchCart, isOpen]);

  // Drawer açıldığında sepeti yeniden yükle
  useEffect(() => {
    if (isOpen && token) {
      fetchCart(true); // Loading göster
    }
  }, [isOpen, token, fetchCart]);

  // Custom event dinleyicisi - sepete ürün eklendiğinde badge'i güncelle
  useEffect(() => {
    const handleCartUpdate = () => {
      if (token) {
        fetchCart(false); // Silent update
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [token, fetchCart]);

  const totalPrice = cart?.items.reduce((sum, item) => {
    const itemPrice = item.product.discounted_price || item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0) || 0;

  const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center justify-center gap-2 md:h-12 md:w-32 md:rounded-lg md:bg-[#919191] md:px-4 md:hover:bg-gray-600 cursor-pointer">
          <span className='relative'>
            <ShoppingCart className="h-7 w-7 text-black md:text-white " />

            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {totalItems}
              </span>
            )}

          </span>
       
      
          <span className="hidden font-medium text-white md:inline">Sepet</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-110">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-center">SEPETİM</SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p>Yükleniyor...</p>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <ShoppingCart className="h-20 w-20 text-gray-300 mb-4" />
              <p className="text-gray-500">Sepetiniz boş</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                {cart.items.map((item) => {
                  const itemPrice = item.product.discounted_price || item.product.price;
                  const totalItemPrice = itemPrice * item.quantity;

                  return (
                    <div key={item.id} className="flex justify-between items-center border p-2 m-2 relative">
                      <div className="flex gap-4 w-full p-2">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded m-auto"
                          width={80}
                          height={80}
                        />
                        <div className="flex justify-between items-center w-full">
                          
                          <div className="flex flex-col gap-2">
                            <span>
                            <h3 className="font-semibold">{item.product.name}</h3>
                            </span>
                            <span className="text-sm text-gray-500">
                              ürün açıklaması: 
                            </span>
                            <span className="text-sm text-gray-500">
                              ürün gramajı: 100 gr
                            </span>
                          
                          </div>

                         <div className="flex flex-col gap-3">
                            <p className="flex font-semibold text-lg justify-end">{(totalItemPrice).toFixed(2)} TL</p>    
                            <div className="inline-flex items-center gap-2 shadow-md py-1 px-3 rounded-md">

                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded border hover:bg-gray-100 cursor-pointer"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded border hover:bg-gray-100 cursor-pointer"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                         </div>

                        </div>
                      </div>
                    

                      <button
                              onClick={() => removeItem(item.id)}
                              className="ml-auto p-1"
                            >
                              <X className="h-5 w-5 text-red-600 absolute top-1 right-2 cursor-pointer" />
                      </button>
                      
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t pt-4 flex flex-col p-5">
                <div className="inline-flex flex-col justify-center">
                  <span className='flex justify-end text-lg font-bold my-1 pr-2'>Toplam: {totalPrice.toFixed(2)} TL</span>
                  <Link href="/sepet" className="w-full" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-16 mx-auto rounded-md bg-primary hover:bg-primary/90 " size="lg">
                      Sepet Sayfasına Git
                    </Button>
                  </Link>
                </div>
              
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

