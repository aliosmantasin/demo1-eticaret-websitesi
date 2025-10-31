import { Truck, BadgePercent, ShieldCheck } from 'lucide-react';
import React from 'react';

const InfoBanner = () => {
    const infoItems = [
        {
            icon: <Truck className="h-8 w-8 text-primary" />,
            text: "Aynı Gün Kargo - 16:00'dan Önceki Siparişlerde",
        },
        {
            icon: <BadgePercent className="h-8 w-8 text-primary" />,
            text: "Ücretsiz Kargo - 100₺ Üzeri Siparişlerde",
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-primary" />,
            text: "Güvenli Alışveriş - 1.000.000+ Mutlu Müşteri",
        },
    ];

    return (
        <div className="border-y bg-gray-50">
            <div className="container mx-auto grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-3">
                {infoItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-center gap-4">
                        {item.icon}
                        <span className="text-sm font-medium text-gray-700">{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoBanner;
