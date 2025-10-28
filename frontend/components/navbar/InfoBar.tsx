import { Lock, Smile, Truck } from "lucide-react";
import React from "react";

const infoItems = [
    {
        icon: <Truck className="h-6 w-6" />,
        text: "Aynı Gün Kargo",
        subtext: "16:00'dan Önceki Siparişlerde",
    },
    {
        icon: <Smile className="h-6 w-6" />,
        text: "Ücretsiz Kargo",
        subtext: "100₺ Üzeri Siparişlerde",
    },
    {
        icon: <Lock className="h-6 w-6" />,
        text: "Güvenli Alışveriş",
        subtext: "1.000.000+ Mutlu Müşteri",
    },
];

export function InfoBar() {
    return (
        <div className="hidden border-y bg-white md:block">
            <div className="container mx-auto grid grid-cols-3 gap-4 px-4 py-3">
                {infoItems.map((item) => (
                    <div key={item.text} className="flex items-center justify-center gap-4">
                        {item.icon}
                        <div>
                            {/* Tablet görünümü (md ve lg arası) */}
                            <div className="lg:hidden">
                                <p className="text-sm font-semibold">{item.text}</p>
                                <p className="text-xs text-gray-500">{item.subtext}</p>
                            </div>
                            {/* Masaüstü görünümü (lg ve üzeri) */}
                            <p className="hidden text-sm lg:block">
                                <span className="font-semibold">{item.text}</span>
                                <span className="text-gray-600"> - {item.subtext}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
