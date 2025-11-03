"use client";

import { CheckCircle, Award, Users, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sağlıklı ve Fit Yaşamayı Zevkli ve Kolay Hale Getirmek İçin Varız
          </h1>
        </div>

        {/* Mission */}
        <div className="mb-12">
          <p className="text-gray-700 leading-relaxed mb-4">
            2016 yılından beri faaliyet gösteren <strong>OJS NUTRITION</strong>, 
            yüksek kaliteli, lezzetli ve kolay tüketilebilir spor gıda, takviye ve fonksiyonel 
            besin üretimi ve dağıtımında öncü rol oynamaktadır.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Misyonumuz, müşteri memnuniyetini ön planda tutarak, en yüksek kalite standartlarında, 
            sağlığa uygun, faydalı ve güvenli ürünler sunmaktır. Protein tozları, amino asitler, 
            vitaminler ve mineraller gibi çeşitli beslenme çözümlerimizle, her yaştan ve her 
            seviyeden insanın sağlıklı yaşam hedeflerine ulaşmasına yardımcı oluyoruz.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Sadece ürün satmıyoruz; sağlıklı yaşam felsefesini destekliyor, bilimsel araştırmalara 
            dayanan çözümler sunuyor ve müşterilerimizin yaşam kalitesini artırmak için sürekli 
            yenilikçi yaklaşımlar benimsiyoruz. Kalite, inovasyon, sağlık ve güvenlik konularında 
            öncü olarak, spor beslenmesi ve sağlıklı yaşam alanında bir lider olma hedefindeyiz.
          </p>
        </div>

        {/* Stats */}
        <div className="bg-primary/5 rounded-2xl p-8 mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-gray-900">
              1.000.000+ den Fazla Mutlu Müşteri
            </h2>
          </div>
          <p className="text-gray-700 text-center">
            1.000.000'den fazla kişiye ulaştık. Sanatçılardan profesyonel sporculara, 
            doktorlardan öğrencilere kadar, sağlıklı yaşam ve beslenme hedefi olan herkese 
            hizmet veriyoruz.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Kalite</h3>
            </div>
            <p className="text-gray-600">
              Ürünlerimizde en yüksek kalite standartlarını uyguluyor, düzenli olarak test 
              ediyor ve iyileştirmeler yapıyoruz.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">İnovasyon</h3>
            </div>
            <p className="text-gray-600">
              Sürekli araştırma ve geliştirme yaparak, müşterilerimize en son teknoloji ve 
              bilimsel bulguları sunuyoruz.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Sağlık</h3>
            </div>
            <p className="text-gray-600">
              Ürünlerimizi sağlık ve güvenlik kurallarına uygun üretiyor, doğal ve etkili 
              bileşenler kullanıyoruz.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Müşteri Odaklılık</h3>
            </div>
            <p className="text-gray-600">
              Müşteri memnuniyetini her şeyin üzerinde tutuyor, 7/24 destek sunuyor ve 
              geri bildirimlerinize değer veriyoruz.
            </p>
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sertifikalarımız
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {/* Certification logos - Admin panelden yönetilecek */}
            <div className="bg-gray-100 p-4 rounded-lg w-24 h-24 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500">ISO 9001</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg w-24 h-24 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500">HELAL</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg w-24 h-24 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500">ISO 22000</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg w-24 h-24 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500">GMP</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg w-24 h-24 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500">ISO 10002</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg w-24 h-24 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500">GHP</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg w-24 h-24 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500">IQS</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Tüm ürünlerimiz uluslararası kalite standartlarına uygundur.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-primary text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ürünlerimizi Keşfedin
          </h2>
          <p className="mb-6 opacity-90">
            Sağlıklı yaşam yolculuğunuzda yanınızdayız. Premium kalitede ürünlerimizi inceleyin.
          </p>
          <a 
            href="/kategori/protein"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Ürünlere Göz Atın
          </a>
        </div>
      </div>
    </div>
  );
}

