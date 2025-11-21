"use client";

import { useState, useEffect, useCallback } from 'react';
import { Review } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
  initialReviews?: Review[];
}

export function ProductReviews({ productId, initialReviews }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews ?? []);
  const [loading, setLoading] = useState(!initialReviews);
  const [showForm, setShowForm] = useState(false);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  const fetchReviews = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error('NEXT_PUBLIC_API_URL tanımlı değil. Yorumlar getirilemedi.');
        setLoading(false);
        return;
      }
      const response = await fetch(`${apiUrl}/api/reviews/product/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Yorumları yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert('Yorum yapmak için giriş yapmalısınız');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Yorum eklenemedi');
      }

      // Başarılı olursa formu temizle ve yorumları yenile
      setFormData({ rating: 5, title: '', comment: '' });
      setShowForm(false);
      fetchReviews();
      alert('Yorumunuz başarıyla eklendi!');
    } catch (error) {
      console.error('Yorum ekleme hatası:', error);
      alert(error instanceof Error ? error.message : 'Bir hata oluştu');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { year: '2-digit', month: '2-digit', day: '2-digit' });
  };

  const getUserInitials = (user: Review['user']) => {
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    if (first || last) {
      return `${first}${last}`.toUpperCase();
    }
    const name = user.name?.trim() || '';
    if (!name) return 'A';
    const parts = name.split(' ');
    const initials =
      (parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : '');
    return (initials || name[0]).toUpperCase();
  };

  if (loading) {
    return (
      <div className="mt-12 text-center">
        <p className="text-gray-600">Yorumlar yükleniyor...</p>
      </div>
    );
  }

  const hasReviews = reviews.length > 0;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Değerlendirmeler {hasReviews && <span className="text-gray-500">({reviews.length})</span>}
        </h2>
        {token && !showForm && (
          <Button onClick={() => setShowForm(true)}>Yorum Yap</Button>
        )}
      </div>

      {/* Yorum Formu */}
      {showForm && (
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Yorumunuzu Yazın</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Puanınız</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        i < formData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Başlık (Opsiyonel)</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Yorumunuzun başlığını yazın"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Yorum *</label>
              <textarea
                required
                className="w-full px-3 py-2 border rounded-md min-h-[100px] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Düşüncelerinizi paylaşın..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Yorum Gönder</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ rating: 5, title: '', comment: '' });
                }}
              >
                İptal
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Yorum Listesi */}
      {hasReviews ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {getUserInitials(review.user)}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {review.user.firstName || review.user.name}
                      {review.user.lastName ? ` ${review.user.lastName}` : ''}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-1">{renderStars(review.rating)}</div>
              </div>

              {review.title && (
                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              )}
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Henüz yorum yapılmamış.</p>
          {token && (
            <Button onClick={() => setShowForm(true)}>İlk Yorumu Sen Yap</Button>
          )}
        </div>
      )}
    </div>
  );
}

