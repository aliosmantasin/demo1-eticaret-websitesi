"use client";
import Image from "next/image";
import React from "react";

const desktopBannerUrl = "https://vr3j8vmadakibxk6.public.blob.vercel-storage.com/e-tic/banner2.webp";
const mobileBannerUrl = "https://vr3j8vmadakibxk6.public.blob.vercel-storage.com/e-tic/banner2Mobil.webp";

export function PromotionBanner() {
    return (
        <section className="my-8">
            {/* Mobil Banner */}
            <div className="md:hidden">
                <Image
                    src={mobileBannerUrl}
                    alt="Mobil Promosyon Banner"
                    width={500}
                    height={750}
                    className="h-auto w-full"
                />
            </div>
            {/* Masaüstü Banner */}
            <div className="hidden md:block">
                <Image
                    src={desktopBannerUrl}
                    alt="Masaüstü Promosyon Banner"
                    width={1920}
                    height={640}
                    className="h-auto w-full"
                />
            </div>
        </section>
    );
}
