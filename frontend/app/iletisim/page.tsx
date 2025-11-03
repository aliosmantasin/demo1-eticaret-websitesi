"use client";

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Backend API entegrasyonu
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle API call

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', surname: '', email: '', message: '' });

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Bize Ulaşın</h1>
        <p className="text-gray-600 mb-8">
          Bize aşağıdaki iletişim formundan ulaşabilirsiniz.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* İletişim Bilgileri */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">İletişim Bilgileri</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Telefon</h3>
                  <p className="text-gray-600">0850 303 29 89</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Hafta içi 09:00 - 17:00 arası arayabilirsiniz
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">E-posta</h3>
                  <p className="text-gray-600">iletisim@ojsnutrition.com</p>
                  <p className="text-sm text-gray-500 mt-1">
                    7/24 bize ulaşabilirsiniz
                  </p>
                </div>
              </div>
            </div>

            {/* Kargo Bilgileri */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Kargo Bilgileri</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Aynı gün kargo:</strong> Hafta içi 16:00, Cumartesi ise 11:00'a kadar verilen 
                siparişler için geçerlidir.
              </p>
              <p className="text-sm text-gray-600">
                Siparişler kargoya verilince e-posta ve SMS ile bilgilendirme yapılır.
              </p>
            </div>
          </div>

          {/* İletişim Formu */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mesaj Gönderin</h2>
            
            {submitted && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✓ Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    İsim <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad
                  </label>
                  <Input
                    id="surname"
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-Posta
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mesaj
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12"
              >
                {isSubmitting ? (
                  'Gönderiliyor...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    GÖNDER
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

