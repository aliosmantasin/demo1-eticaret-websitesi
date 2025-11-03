"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Package, MapPin, Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

// Mock address data - MVP için
interface MockAddress {
  id: string;
  title: string;
  firstname: string;
  lastname: string;
  address: string;
  district: string;
  city: string;
  country: string;
  phone?: string;
}

export default function AddressesPage() {
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  // Mock addresses - MVP için
  const [addresses, setAddresses] = useState<MockAddress[]>([
    {
      id: '1',
      title: 'Ev',
      firstname: 'Ahmet Mah. Mehmetoğlu Sk., No: 1 Daire: 2',
      lastname: 'Fatmaoğlu',
      address: 'Ataşehir, İstanbul, Türkiye',
      district: 'Ataşehir',
      city: 'İstanbul',
      country: 'Türkiye',
    },

  ]);

  const [formData, setFormData] = useState({
    title: '',
    firstname: '',
    lastname: '',
    address: '',
    district: '',
    city: '',
    phone: '',
  });

  useEffect(() => {
    if (!token) {
      router.push('/giris-yap');
      return;
    }
    setLoading(false);
  }, [token, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock - MVP için
    alert('Adres ekleme/düzenleme özelliği yakında eklenecek');
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      firstname: '',
      lastname: '',
      address: '',
      district: '',
      city: '',
      phone: '',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu adresi silmek istediğinize emin misiniz?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleEdit = (address: MockAddress) => {
    setEditingId(address.id);
    setFormData({
      title: address.title,
      firstname: address.firstname,
      lastname: address.lastname,
      address: address.address.split(',')[0] || '',
      district: address.district,
      city: address.city,
      phone: address.phone || '',
    });
    setShowAddForm(true);
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Adreslerim</h1>

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
                <Link href="/hesabim/siparislerim">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                    <Package className="h-5 w-5" />
                    <span>Siparişlerim</span>
                  </button>
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white font-medium">
                  <MapPin className="h-5 w-5" />
                  <span>Adreslerim</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sağ İçerik */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Adreslerim ({addresses.length})
              </h2>
              <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Yeni Adres Ekle
              </Button>
            </div>

            {/* Adres Formu */}
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres Başlığı <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="ev, iş vb..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.firstname}
                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Soyad
                      </label>
                      <Input
                        value={formData.lastname}
                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Şehir
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İlçe <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      Kaydet
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId(null);
                        setFormData({
                          title: '',
                          firstname: '',
                          lastname: '',
                          address: '',
                          district: '',
                          city: '',
                          phone: '',
                        });
                      }}
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Adres Listesi */}
            {addresses.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-700">
                  Kayıtlı bir adresiniz yok. Lütfen yukarıdaki butondan adres oluşturunuz.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{address.title}</h3>
                        </div>
                        <p className="text-gray-700">{address.firstname}</p>
                        <p className="text-gray-600">{address.address}</p>
                        <p className="text-gray-600">{address.district}, {address.city}, {address.country}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(address)}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
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

