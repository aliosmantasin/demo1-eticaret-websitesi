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

// Tip tanımını ana sepet sayfasıyla aynı hale getir
interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: { id: string; url: string }[];
  };
  variant: {
    id: string;
    price: number;
    discounted_price: number | null;
    optionValues: {
      value: string;
      option: { name: string };
    }[];
  } | null;
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
  const { token, authFetch } = useAuth(); // authFetch'i kullan

  const fetchCart = useCallback(async (showLoading = false) => {
    if (!token) return;
    
    if (showLoading) setIsLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await authFetch(`${apiUrl}/api/cart`); // authFetch kullan

      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error('Sepet bilgisi alınamadı:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [token, authFetch]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (!token || newQuantity < 1) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await authFetch(`${apiUrl}/api/cart/items/${itemId}`, { // authFetch kullan
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      fetchCart();
    } catch (error) {
      console.error('Adet güncelleme hatası:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!token) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await authFetch(`${apiUrl}/api/cart/items/${itemId}`, { // authFetch kullan
        method: 'DELETE',
      });
      fetchCart();
    } catch (error) {
      console.error('Ürün silme hatası:', error);
    }
  };

  useEffect(() => {
    if (token && !isOpen) {
      fetchCart(false);
    }
  }, [token, fetchCart, isOpen]);

  useEffect(() => {
    if (isOpen && token) {
      fetchCart(true);
    }
  }, [isOpen, token, fetchCart]);

  useEffect(() => {
    const handleCartUpdate = () => {
      if (token) fetchCart(false);
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [token, fetchCart]);

  const totalPrice = cart?.items.reduce((sum, item) => {
    const itemPrice = item.variant?.discounted_price ?? item.variant?.price ?? 0;
    return sum + (itemPrice * item.quantity);
  }, 0) || 0;

  const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-[#919191] text-white hover:bg-gray-600 cursor-pointer">
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs">
                {totalItems}
              </span>
            )}
          </div>
          <span className="font-medium">Sepet</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-center">SEPETİM</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center"><p>Yükleniyor...</p></div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-20 w-20 text-gray-300 mb-4" />
              <p className="text-gray-500">Sepetiniz boş</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                {cart.items.map((item) => {
                  const itemPrice = item.variant?.discounted_price ?? item.variant?.price ?? 0;
                  const totalItemPrice = itemPrice * item.quantity;
                  const variantText = item.variant?.optionValues.map(ov => ov.value).join(', ');

                  return (
                    <div key={item.id} className="flex justify-between items-center border p-2 m-2 relative">
                      <div className="flex gap-4 w-full p-2">
                        <Image
                          src={item.product.images?.[0]?.url || '/placeholder.png'}
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
                            {variantText && (
                            <span className="text-sm text-gray-500">
                                {variantText}
                            </span>
                            )}
                          </div>
                         <div className="flex flex-col gap-3">
                            <p className="flex font-semibold text-lg justify-end">
                              {totalItemPrice.toFixed(2)} TL
                            </p>
                            <div className="inline-flex items-center gap-2 shadow-md py-1 px-3 rounded-md">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded border hover:bg-gray-100 cursor-pointer"
                                disabled={item.quantity <= 1}
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
                        className="ml-auto p-1 absolute top-1 right-2"
                            >
                        <X className="h-5 w-5 text-red-600 cursor-pointer" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-4 p-5">
                <div className="flex justify-end text-lg font-bold my-1 pr-2">
                  <span>Toplam: {totalPrice.toFixed(2)} TL</span>
                </div>
                  <Link href="/sepet" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" size="lg">
                      Sepet Sayfasına Git
                    </Button>
                  </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

