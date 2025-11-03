"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Package, MapPin } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export default function AccountPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const { token, logout } = useAuth();
  const router = useRouter();

  const fetchUserProfile = async () => {
    try {
      // JWT token'dan kullanıcı bilgilerini çözümle (basit yaklaşım)
      // Gerçek uygulamada backend'den kullanıcı bilgilerini çekmek daha doğru olur
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email,
        });
      } else {
        // Fallback: localStorage'dan email al (basit çözüm)
        const email = localStorage.getItem('userEmail');
        if (email) {
          const [first, ...rest] = email.split('@')[0].split('.');
          setUserProfile({
            id: '',
            firstName: first || '',
            lastName: rest.join(' ') || '',
            email: email,
          });
          setFormData({
            firstName: first || '',
            lastName: rest.join(' ') || '',
            email: email,
          });
        }
      }
    } catch (error) {
      console.error('Profil bilgilerini yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push('/giris-yap');
      return;
    }

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert('Önce giriş yapmalısınız');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profil güncellenirken bir hata oluştu');
      }

      // Güncellenmiş bilgileri state'e kaydet
      setUserProfile(data);
      setIsEditing(false);
      alert('Profil başarıyla güncellendi!');
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      alert(error instanceof Error ? error.message : 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hesabım</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Menü</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white font-medium">
                  <User className="h-5 w-5" />
                  <span>Hesap Bilgilerim</span>
                </button>
                <Link href="/hesabim/siparislerim">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                    <Package className="h-5 w-5" />
                    <span>Siparişlerim</span>
                  </button>
                </Link>
                <Link href="/hesabim/adreslerim">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                    <MapPin className="h-5 w-5" />
                    <span>Adreslerim</span>
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50"
                >
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sağ İçerik */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Hesap Bilgilerim</h2>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)}>Düzenle</Button>
                )}
              </div>

              {!isEditing ? (
                // Görüntüleme Modu
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Ad</label>
                    <p className="text-gray-900">{userProfile?.firstName || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Soyad</label>
                    <p className="text-gray-900">{userProfile?.lastName || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">E-posta</label>
                    <p className="text-gray-900">{userProfile?.email || '-'}</p>
                  </div>
                </div>
              ) : (
                // Düzenleme Modu
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Ad</label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Soyad</label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">E-posta</label>
                    <Input
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit">Kaydet</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

