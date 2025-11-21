"use client";

import React, { useEffect, useState } from "react";
import { SiteSettings } from "@/types";

export function Marquee() {
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

    if (!siteSettings?.marquee_text) {
        return null;
    }

    // Hız ayarını CSS animation duration'a çevir
    const speedMap: Record<number, string> = {
        1: '30s',
        2: '20s',
        3: '15s',
    };
    const animationDuration = speedMap[siteSettings.marquee_speed] || '30s';

    return (
        <div className="bg-primary text-primary-foreground overflow-hidden">
            <div 
                className="flex whitespace-nowrap"
                style={{
                    animation: `scroll ${animationDuration} linear infinite`,
                }}
            >
                <span className="px-4 py-2 inline-block">{siteSettings.marquee_text}</span>
                <span className="px-4 py-2 inline-block">{siteSettings.marquee_text}</span>
                <span className="px-4 py-2 inline-block">{siteSettings.marquee_text}</span>
            </div>
        </div>
    );
}

