"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SiteSettings } from "@/types";

export function HomepagePromotionBanner() {
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

    if (!siteSettings || siteSettings.homepage_promotion_banner_hidden) {
        return null;
    }

    const desktopBannerUrl = siteSettings.homepage_promotion_banner_desktop_url;
    const mobileBannerUrl = siteSettings.homepage_promotion_banner_mobile_url;

    if (!desktopBannerUrl && !mobileBannerUrl) {
        return null;
    }

    return (
        <section className="my-8">
            {mobileBannerUrl && (
                <div className="md:hidden">
                    <Image
                        src={mobileBannerUrl}
                        alt="Mobil Promosyon Banner"
                        width={500}
                        height={750}
                        className="h-auto w-full"
                    />
                </div>
            )}
            {desktopBannerUrl && (
                <div className="hidden md:block">
                    <Image
                        src={desktopBannerUrl}
                        alt="Masaüstü Promosyon Banner"
                        width={1920}
                        height={640}
                        className="h-auto w-full"
                    />
                </div>
            )}
        </section>
    );
}
