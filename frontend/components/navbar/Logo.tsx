"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'white';
}

const FALLBACK_DEFAULT_LOGO = 'https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/logo/ojslogo.webp';
const FALLBACK_WHITE_LOGO = 'https://fyswpiqhfhgygmtaftvy.supabase.co/storage/v1/object/public/logo/logowhite.webp';

const Logo = ({ variant = 'default' }: LogoProps) => {
  const [logoUrls, setLogoUrls] = useState<{ default?: string | null; white?: string | null }>({});

  useEffect(() => {
    let isMounted = true;
    const fetchSiteSettings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/settings`, { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted) {
          setLogoUrls({
            default: data.logo_image_url,
            white: data.logo_white_image_url,
          });
        }
      } catch (error) {
        console.error('Logo bilgileri alınamadı:', error);
      }
    };

    fetchSiteSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const logoSrc =
    variant === 'white'
      ? logoUrls.white || FALLBACK_WHITE_LOGO
      : logoUrls.default || FALLBACK_DEFAULT_LOGO;

  return (
    <div className="flex items-center relative mx-3 md:mx-0 min-w-36">
      <Link href="/">
        <Image
          src={logoSrc}
          alt="Logo"
          width={160}
          height={60}
          priority
          className="object-contain"
        />
      </Link>
    </div>
  );
};

export default Logo;