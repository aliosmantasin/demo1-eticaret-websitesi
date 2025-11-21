"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SiteSettings } from "@/types";

export function HomepageBanner() {
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

    if (!siteSettings || siteSettings.homepage_banner_hidden) {
        return null;
    }

    const desktopBannerUrl = siteSettings.homepage_banner_desktop_url;
    const mobileBannerUrl = siteSettings.homepage_banner_mobile_url;

    if (!desktopBannerUrl && !mobileBannerUrl) {
        return null;
    }

    return (
        <section className="my-4">
            {/* Mobil Banner */}
            {mobileBannerUrl && (
                <div className="md:hidden">
                    <Image
                        src={mobileBannerUrl}
                        alt="Mobil Banner"
                        width={500}
                        height={300}
                        className="h-auto w-full"
                        priority
                    />
                </div>
            )}
            {/* Masaüstü Banner */}
            {desktopBannerUrl && (
                <div className="hidden md:block">
                    <Image
                        src={desktopBannerUrl}
                        alt="Masaüstü Banner"
                        width={1920}
                        height={400}
                        className="h-auto w-full"
                        priority
                    />
                </div>
            )}
        </section>
    );
}
