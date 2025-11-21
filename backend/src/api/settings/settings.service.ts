import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Site ayarlarını getirir (singleton pattern)
 */
export const getSiteSettings = async () => {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: 'site-settings' },
  });

  // Eğer ayarlar yoksa, varsayılan değerlerle oluştur
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: 'site-settings',
      },
    });
  }

  return settings;
};

/**
 * Site ayarlarını günceller
 */
export type SiteSettingsUpdateInput = {
  shipping_text?: string;
  shipping_subtext?: string;
  shipping_hidden?: boolean;
  customer_count?: string;
  customer_label?: string;
  customer_hidden?: boolean;
  guarantee_percent?: string;
  guarantee_text?: string;
  guarantee_hidden?: boolean;
  infobar_first_text?: string;
  infobar_first_subtext?: string;
  infobar_second_text?: string;
  infobar_second_subtext?: string;
  infobar_third_text?: string;
  infobar_third_subtext?: string;
  marquee_text?: string;
  marquee_speed?: number;
  homepage_banner_desktop_url?: string | null;
  homepage_banner_mobile_url?: string | null;
  homepage_banner_hidden?: boolean;
  category_showcase_hidden?: boolean;
  bestsellers_hidden?: boolean;
  bestsellers_limit?: number;
  homepage_promotion_banner_desktop_url?: string | null;
  homepage_promotion_banner_mobile_url?: string | null;
  homepage_promotion_banner_hidden?: boolean;
  assurance_title?: string;
  assurance_text?: string | null;
  assurance_hidden?: boolean;
  logo_image_url?: string | null;
  logo_white_image_url?: string | null;
  footer_copyright_text?: string;
  footer_credits_text?: string | null;
  footer_credits_url?: string | null;
  popular_product_slugs?: string[];
  popular_products_hidden?: boolean;
  popular_products_limit?: number;
  popular_products_title?: string;
  popular_products_subtitle?: string | null;
  packages_banner_desktop_url?: string | null;
  packages_banner_mobile_url?: string | null;
  packages_banner_hidden?: boolean;
};

export const updateSiteSettings = async (data: SiteSettingsUpdateInput) => {
  return await prisma.siteSettings.upsert({
    where: { id: 'site-settings' },
    update: data,
    create: {
      id: 'site-settings',
      ...data,
    },
  });
};

