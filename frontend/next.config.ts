import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  i18n: {
    locales: ["tr"],
    defaultLocale: "tr",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fe1111.projects.academy.onlyjs.com",
      },
      {
        protocol: "https",
        hostname: "vr3j8vmadakibxk6.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
