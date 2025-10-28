"use client";
import Image from "next/image";
import React from "react";

const desktopBannerUrl = "https://vr3j8vmadakibxk6.public.blob.vercel-storage.com/e-tic/banner.webp";
const mobileBannerUrl = "https://vr3j8vmadakibxk6.public.blob.vercel-storage.com/e-tic/mobil-banner.webp";

export function Banner() {
    return (
        <section className="my-4">
            {/* Mobil Banner */}
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
            {/* Masaüstü Banner */}
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
        </section>
    );
}
