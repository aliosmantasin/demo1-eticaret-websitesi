"use client";

import { Star } from "lucide-react";

const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(<Star key={i} className="h-6 w-6 text-yellow-500 fill-yellow-500" />);
    }
    return stars;
};

export function Assurance() {
    return (
        <section className="bg-primary text-white">
            <div className="container mx-auto p-4 mt-5">
                <div className="flex items-center gap-2 mt-5">
                    {renderStars()}
                    <p className="text-sm text-gray-400">(140.000+)</p>
                </div>
                  
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-5">
                  
                    <div className="gap-2">
                        <h2 className="text-3xl font-bold leading-tight">
                            LABORATUVAR TESTLİ ÜRÜNLER <br />
                              AYNI GÜN & ÜCRETSİZ KARGO MEMNUNİYET GARANTİSİ
                        </h2>

                    </div>

                    <div>
                    <p className="text-lg leading-relaxed text-gray-300">
                        200.000’den fazla ürün yorumumuza dayanarak, ürünlerimizi seveceğinize eminiz. Eğer herhangi bir sebeple memnun kalmazsanız, bizimle iletişime geçtiğinizde çözüme kavuşturacağız.
                    </p>
                </div>

                </div>

                {/* Sağ Sütun */}
             
            </div>
        </section>
    );
}
