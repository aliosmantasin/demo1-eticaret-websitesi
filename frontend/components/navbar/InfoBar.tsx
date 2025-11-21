"use client";

import { Lock, Smile, Truck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SiteSettings } from "@/types";

export function InfoBar() {
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        const fetchSiteSettings = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/settings`, {
                    cache: 'no-store',
                });
                if (response.ok) {
                    const data = await response.json();
                    setSiteSettings(data);
                }
            } catch (error) {
                console.error('Site ayarları yüklenemedi:', error);
            }
        };
        fetchSiteSettings();
    }, []);

    const infoItems = [
        {
            icon: <Truck className="h-6 w-6" />,
            text: siteSettings?.infobar_first_text || "Aynı Gün Kargo",
            subtext: siteSettings?.infobar_first_subtext || "16:00'dan Önceki Siparişlerde",
        },
        {
            icon: <Smile className="h-6 w-6" />,
            text: siteSettings?.infobar_second_text || "Ücretsiz Kargo",
            subtext: siteSettings?.infobar_second_subtext || "1500₺ Üzeri Siparişlerde",
        },
        {
            icon: <Lock className="h-6 w-6" />,
            text: siteSettings?.infobar_third_text || "Güvenli Alışveriş",
            subtext: siteSettings?.infobar_third_subtext || "450.000+ Mutlu Müşteri",
        },
    ];

    return (
        <div className="hidden border-y bg-white md:block">
            <div className="container mx-auto grid grid-cols-3 gap-4 px-4 py-3">
                {infoItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-center gap-4">
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
