"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { SiteSettings } from "@/types";

const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(<Star key={i} className="h-6 w-6 text-yellow-500 fill-yellow-500" />);
    }
    return stars;
};

export function Assurance() {
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

    const defaultTitle = "LABORATUVAR TESTLİ ÜRÜNLER\nAYNI GÜN & ÜCRETSİZ KARGO MEMNUNİYET GARANTİSİ";
    const defaultDescription = "200.000’den fazla ürün yorumumuza dayanarak, ürünlerimizi seveceğinize eminiz. Eğer herhangi bir sebeple memnun kalmazsanız, bizimle iletişime geçtiğinizde çözüme kavuşturacağız.";

    const title = siteSettings?.assurance_title?.trim() || defaultTitle;
    const description = siteSettings?.assurance_text?.trim() || defaultDescription;

    if (siteSettings?.assurance_hidden) {
        return null;
    }

    return (
        <section className="bg-primary text-white">
            <div className="container mx-auto p-4 mt-5">
                <div className="flex items-center gap-2 mt-5">
                    {renderStars()}
                    <p className="text-sm text-gray-400">(140.000+)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-5">
                    <div className="gap-2">
                        <h2 className="text-3xl font-bold leading-tight whitespace-pre-line">
                            {title}
                        </h2>
                    </div>

                    <div>
                        <p className="text-lg leading-relaxed text-gray-300">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
