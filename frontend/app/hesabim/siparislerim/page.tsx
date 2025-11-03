"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Package, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock order data - MVP için
interface MockOrder {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const router = useRouter();

  // Mock orders - MVP için
  const mockOrders: MockOrder[] = [
    {
      id: '1',
      orderNumber: '290405',
      status: 'Teslim Edildi',
      date: '14 Aralık 2022',
      total: 770,
      items: [
        {
          name: 'MELATONIN',
          quantity: 2,
          price: 62,
          image: 'https://via.placeholder.com/80x80?text=BETAINE',
        },
        {
          name: 'GÜNLÜK VİTAMİN PAKETİ',
          quantity: 1,
          price: 449,
          image: 'https://via.placeholder.com/80x80?text=5-HTP',
        },
        {
          name: 'BROMELAIN',
          quantity: 1,
          price: 197,
          image: 'https://via.placeholder.com/80x80?text=C',
        },
      ],
    },
  ];

  useEffect(() => {
    if (!token) {
      router.push('/giris-yap');
      return;
    }
    setLoading(false);
  }, [token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Siparişlerim</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Menü</h2>
              <div className="space-y-2">
                <Link href="/hesabim">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                    <User className="h-5 w-5" />
                    <span>Hesap Bilgilerim</span>
                  </button>
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white font-medium">
                  <Package className="h-5 w-5" />
                  <span>Siparişlerim</span>
                </button>
                <Link href="/hesabim/adreslerim">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                    <MapPin className="h-5 w-5" />
                    <span>Adreslerim</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Sağ İçerik */}
          <div className="lg:col-span-2">
            {mockOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Henüz siparişiniz yok</p>
                <Link href="/">
                  <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    Alışverişe Başla
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {/* Başlık */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Sipariş #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {order.status}
                        </span>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          {order.total.toFixed(2)} ₺
                        </p>
                      </div>
                    </div>

                    {/* Ürünler */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="relative w-20 h-20 overflow-hidden rounded-md border border-gray-200 shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {(item.price * item.quantity).toFixed(2)} ₺
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Detaylar Butonu */}
                    <div className="flex justify-end">
                      <Link href={`/hesabim/siparislerim/${order.id}`}>
                        <button className="text-primary hover:underline font-medium">
                          Sipariş Detaylarını Görüntüle
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

