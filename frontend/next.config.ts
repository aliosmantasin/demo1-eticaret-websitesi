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
      {
        protocol: 'https',
        hostname: 'fyswpiqhfhgygmtaftvy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product-images/**',
      },
      {
        protocol: 'https',
        hostname: 'fyswpiqhfhgygmtaftvy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/category-images/**',
      },
      {
        protocol: 'https',
        hostname: 'fyswpiqhfhgygmtaftvy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/homepage-banner/**',
      },
      {
        protocol: 'https',
        hostname: 'fyswpiqhfhgygmtaftvy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/homepage-banner-desktop/**',
      },
      {
        protocol: 'https',
        hostname: 'fyswpiqhfhgygmtaftvy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/homepage-banner-mobil/**',
      },
      {
        protocol: 'https',
        hostname: 'fyswpiqhfhgygmtaftvy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/homepage-promotion-banner/**',
      },
      {
        protocol: 'https',
        hostname: 'fyswpiqhfhgygmtaftvy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/homepage-promotion-banner-desktop/**',
      },
      {
        protocol: 'https',
        hostname: 'fyswpiqhfhgygmtaftvy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/homepage-promotion-banner-mobil/**',
      },
      {
        protocol: 'https',
        hostname: 'fyswpiqhfhgygmtaftvy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/packages-banner-desktop/**',
      },
      {
        protocol: 'https',
        hostname: 'fyswpiqhfhgygmtaftvy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/packages-banner-mobil/**',
      },
      {
        protocol: 'https',
        hostname: 'fyswpiqhfhgygmtaftvy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/packages-images/**',
      },
      {
        protocol: 'https',
        hostname: 'fyswpiqhfhgygmtaftvy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/logo/**',
      },
    ],
  },
};

export default nextConfig;
