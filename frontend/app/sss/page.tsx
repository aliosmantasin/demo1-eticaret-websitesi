"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqCategories = [
  {
    id: 'genel',
    name: 'Genel',
    questions: [
      {
        id: '1',
        question: 'OJS Nutrition ürünleri nerede satılıyor?',
        answer: 'Tüm OJS Nutrition ürünleri sadece resmi web sitemizden ve yetkili satış noktalarından satılmaktadır. Güvenlik ve kalite için başka platformlardan satın alma konusunda dikkatli olmanızı öneririz.',
      },
      {
        id: '2',
        question: 'OJS Nutrition ürünlerinin menşei neresi?',
        answer: 'Tüm ürünlerimiz Türkiye\'de, ISO 22000, GMP ve Helal sertifikalı tesislerde üretilmektedir. Kalite standartlarına sıkı şekilde uygun üretim yapıyoruz.',
      },
      {
        id: '3',
        question: 'Hangi sertifikalarınız var?',
        answer: 'ISO 9001:2015 (Kalite Yönetimi), ISO 22000:2005 (Gıda Güvenliği), GMP (İyi Üretim Uygulamaları), Helal Sertifikası, ISO 10002:2018 (Müşteri Memnuniyeti), GHP (İyi Hijyen Uygulamaları) ve IQS (Uluslararası Kalite Standardı) sertifikalarına sahibiz.',
      },
      {
        id: '4',
        question: 'Satılan ürünler garantili midir? Değişim var mı?',
        answer: 'Evet, tüm ürünlerimiz üretim tarihinden itibaren 2 yıl garanti kapsamındadır. Ürünle ilgili herhangi bir sorun yaşarsanız, 14 gün içinde koşulsuz değişim veya iade hakkınız bulunmaktadır.',
      },
      {
        id: '5',
        question: 'Sipariş verirken sorun yaşıyorum, ne yapmam gerekir?',
        answer: 'Sipariş verirken sorun yaşıyorsanız, öncelikle tarayıcınızın önbelleğini temizlemeyi deneyin. Sorun devam ederse, 0850 303 29 89 numaralı telefonu arayabilir veya iletişim formumuzdan bize ulaşabilirsiniz. Hafta içi 09:00-17:00 saatleri arasında destek ekibimiz size yardımcı olacaktır.',
      },
    ],
  },
  {
    id: 'urunler',
    name: 'Ürünler',
    questions: [
      {
        id: '6',
        question: 'Yüksek proteinli ürünleri kimler kullanabilir?',
        answer: 'Yüksek proteinli ürünlerimiz, sağlıklı bireyler tarafından güvenle kullanılabilir. Spor yapanlar, kilo vermek isteyenler, kas kütlesini artırmak isteyenler ve günlük protein ihtiyacını karşılamakta zorlanan herkes için uygundur. Kronik hastalığı olan bireyler, doktor onayı aldıktan sonra kullanmalıdır.',
      },
      {
        id: '7',
        question: 'Taksit seçeneği neden yok?',
        answer: 'Müşterilerimizin finansal esnekliğine önem veriyoruz ve taksit seçeneklerimiz bulunmaktadır. Kredi kartı ile yapılan alışverişlerde, bankanızın sunduğu taksit seçeneklerini kullanabilirsiniz.',
      },
      {
        id: '8',
        question: 'Sattığınız ürünler ilaç mıdır?',
        answer: 'Hayır, OJS Nutrition ürünleri ilaç değildir. Tüm ürünlerimiz gıda takviyesi kategorisindedir ve Tarım ve Orman Bakanlığı onaylıdır. Herhangi bir hastalığın tanı, tedavi veya önlenmesinde kullanılmaz.',
      },
      {
        id: '9',
        question: 'Kapağın altındaki folyo açılmış veya tam yapışmamış gibi duruyor?',
        answer: 'Bu durum genellikle üretim sürecindeki sıcaklık değişimlerinden kaynaklanan normal bir durumdur. Ürünün güvenliği açısından bir sorun yoktur. Ancak endişeleriniz varsa, koşulsuz değişim yapabiliriz.',
      },
    ],
  },
  {
    id: 'kargo',
    name: 'Kargo',
    questions: [
      {
        id: '10',
        question: 'Siparişimi nasıl iptal edebilirim?',
        answer: 'Siparişinizi iptal etmek için, siparişiniz kargoya verilmeden önce (siparişinizden sonra en geç 1 saat içinde) bize ulaşmanız gerekmektedir. İletişim formumuzdan veya 0850 303 29 89 numaralı telefonu arayarak iptal talebinizi iletebilirsiniz.',
      },
      {
        id: '11',
        question: 'Siparişimi teslim alırken nelere dikkat etmeliyim?',
        answer: 'Kargo tesliminde mutlaka paketi kontrol edin. Paket açılmış, yırtılmış veya hasarlıysa, kargo personeline iade edin ve bize bilgi verin. Ürün içeriğinde eksik veya bozuk ürün varsa, teslim aldıktan sonraki 24 saat içinde bildirin.',
      },
      {
        id: '12',
        question: 'Kapıda ödeme hizmetiniz var mı?',
        answer: 'Evet, kapıda ödeme seçeneğimiz mevcuttur. Teslimat sırasında kargo personeline nakit veya kredi kartı ile ödeme yapabilirsiniz.',
      },
      {
        id: '13',
        question: 'Sipariş takibimi nasıl yapabilirim?',
        answer: 'Siparişiniz kargoya verildiğinde, size e-posta ve SMS ile takip numarası gönderilir. Bu numara ile kargo firmasının web sitesinden siparişinizin durumunu takip edebilirsiniz.',
      },
      {
        id: '14',
        question: 'İptal ve İade ettiğim ürünlerin tutarı hesabıma ne zaman aktarılır?',
        answer: 'İade edilen ürünlerimiz kargoya verildikten sonra, ürünlerimizin depomuza ulaştığını doğruladıktan sonra 3-5 iş günü içinde tutar hesabınıza iade edilir. Kredi kartı ile yapılan ödemelerde, bankanızın işlem süresi farklılık gösterebilir.',
      },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('genel');
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (questionId: string) => {
    const newOpen = new Set(openQuestions);
    if (newOpen.has(questionId)) {
      newOpen.delete(questionId);
    } else {
      newOpen.add(questionId);
    }
    setOpenQuestions(newOpen);
  };

  const currentCategory = faqCategories.find(cat => cat.id === activeCategory);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Sıkça Sorulan Sorular
        </h1>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 border-b border-gray-200 pb-4">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-12">
          {currentCategory?.questions.map((faq) => {
            const isOpen = openQuestions.has(faq.id);
            return (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-6 bg-white border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="bg-primary/5 rounded-2xl p-8 text-center border border-primary/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Cevabını Bulamadınız mı?
          </h2>
          <p className="text-gray-600 mb-6">
            Aklınıza takılan başka bir sorunuz varsa, bize iletişim formundan ulaşabilirsiniz.
          </p>
          <a
            href="/iletisim"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            İletişime Geçin
          </a>
        </div>
      </div>
    </div>
  );
}

