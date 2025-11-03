"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus, ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  const fetchCart = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
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
      setIsLoading(false);
    }
  }, [token]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (!token || newQuantity < 1) return;
    
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
        fetchCart();
      }
    } catch (error) {
      console.error('Adet güncelleme hatası:', error);
      alert('Adet güncelleme sırasında bir hata oluştu');
    }
  };

  const handleDeleteClick = (itemId: string, productName: string) => {
    setItemToDelete({ id: itemId, name: productName });
    setShowDeleteModal(true);
  };

  const removeItem = async () => {
    if (!token || !itemToDelete) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/cart/items/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCart();
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error('Ürün silme hatası:', error);
      alert('Ürün silinirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Toplam hesaplama
  const calculateTotal = () => {
    if (!cart || cart.items.length === 0) return 0;
    
    return cart.items.reduce((total, item) => {
      const itemPrice = item.product.discounted_price || item.product.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Alışverişe Devam Et
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Sepetim</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
          </div>
        ) : !token ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <ShoppingCart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Sepetinizi görmek için giriş yapmalısınız</p>
            <Button onClick={() => router.push('/giris-yap')}>
              Giriş Yap
            </Button>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <ShoppingCart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Sepetiniz boş</p>
            <Link href="/">
              <Button>Alışverişe Başla</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sepet Ürünleri */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => {
                    const itemPrice = item.product.discounted_price || item.product.price;
                    const totalItemPrice = itemPrice * item.quantity;

                    return (
                      <div key={item.id} className="p-4">
                        <div className="flex gap-4">
                          {/* Ürün Görseli */}
                          <Link 
                            href={`/urun/${item.product.slug}`}
                            className="shrink-0"
                          >
                            <div className="relative h-24 w-24 overflow-hidden rounded-md border border-gray-200">
                              <Image
                                src={item.product.images[0] || '/placeholder.png'}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </Link>

                          {/* Ürün Bilgileri */}
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={`/urun/${item.product.slug}`}
                              className="text-lg font-semibold text-gray-900 hover:text-primary line-clamp-2"
                            >
                              {item.product.name}
                            </Link>

                            {/* Fiyat ve Adet Kontrolü */}
                            <div className="flex items-center justify-between mt-4">
                              {/* Fiyat */}
                              <div className="flex items-center gap-2">
                                {item.product.discounted_price ? (
                                  <>
                                    <span className="text-xl font-bold text-red-600">
                                      {item.product.discounted_price.toFixed(2)} ₺
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      {item.product.price.toFixed(2)} ₺
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xl font-bold text-gray-900">
                                    {item.product.price.toFixed(2)} ₺
                                  </span>
                                )}
                              </div>

                              {/* Adet Kontrolü */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-lg font-medium w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Toplam Fiyat */}
                              <div className="text-right">
                                <div className="text-xl font-bold text-gray-900">
                                  {totalItemPrice.toFixed(2)} ₺
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Silme Butonu */}
                          <button
                            onClick={() => handleDeleteClick(item.id, item.product.name)}
                            className="shrink-0 h-8 w-8 rounded-full border border-red-300 flex items-center justify-center hover:bg-red-50 transition-colors ml-4"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sepet Özeti */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Ara Toplam:</span>
                    <span>{total.toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Kargo:</span>
                    <span className="text-green-600 font-medium">Ücretsiz</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>KDV:</span>
                    <span>{(total * 0.18).toFixed(2)} ₺</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Toplam:</span>
                      <span>{(total * 1.18).toFixed(2)} ₺</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full mb-3" size="lg">
                  Ödemeye Geç
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Güvenli ödeme ile korunuyorsunuz
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Silme Onay Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              Ürünü Sepetten Çıkar
            </DialogTitle>
            <DialogDescription className="pt-4">
              <p className="text-gray-700">
                <span className="font-semibold">{itemToDelete?.name}</span> adlı ürünü sepetten çıkarmak istediğinize emin misiniz?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="w-full sm:w-auto"
            >
              İptal
            </Button>
            <Button
              onClick={removeItem}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              Sepetten Çıkar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

