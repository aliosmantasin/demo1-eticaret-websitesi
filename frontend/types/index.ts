// frontend/types/index.ts

export interface Image {
  id: string;
  url: string;
  productId?: string | null; // Opsiyonel olabilir
  bucket?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageId?: string | null;
  image?: Image | null;
  showInNavbar?: boolean;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name?: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

export interface OptionValue {
  id: string;
  value: string;
  color?: string;
  optionId: string;
  option: Option;
}

export interface Option {
  id: string;
  name: string;
  values: OptionValue[];
}

export interface ProductVariant {
  id: string;
  price: number;
  stock: number;
  discounted_price?: number | null;
  productId: string;
  optionValues: OptionValue[];
  images?: Image[]; // Varyant görselleri
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  images: Image[];
  category: Category;
  reviews: Review[];
  variants: ProductVariant[];
  average_star: number;
  comment_count: number;
  options?: Option[];
  short_explanation?: string;
  badge_primary_text?: string | null;
  badge_primary_hidden?: boolean;
  badge_secondary_text?: string | null;
  badge_secondary_hidden?: boolean;
  expiry_date?: string | null; // Son kullanma tarihi
  features?: string | null; // Özellikler (madde işaretli liste)
  nutritional_content?: string | null; // Besin içeriği (içindekiler listesi)
  usage_instructions?: string | null; // Kullanım şekli
  isBestseller?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  id: string;
  shipping_text: string;
  shipping_subtext: string;
  shipping_hidden: boolean;
  customer_count: string;
  customer_label: string;
  customer_hidden: boolean;
  guarantee_percent: string;
  guarantee_text: string;
  guarantee_hidden: boolean;
  infobar_first_text: string;
  infobar_first_subtext: string;
  infobar_second_text: string;
  infobar_second_subtext: string;
  infobar_third_text: string;
  infobar_third_subtext: string;
  marquee_text: string;
  marquee_speed: number;
  homepage_banner_desktop_url?: string | null;
  homepage_banner_mobile_url?: string | null;
  homepage_banner_hidden: boolean;
  category_showcase_hidden: boolean;
  bestsellers_hidden: boolean;
  bestsellers_limit: number;
  homepage_promotion_banner_desktop_url?: string | null;
  homepage_promotion_banner_mobile_url?: string | null;
  homepage_promotion_banner_hidden: boolean;
  assurance_title?: string;
  assurance_text?: string | null;
  assurance_hidden?: boolean;
  logo_image_url?: string | null;
  logo_white_image_url?: string | null;
  footer_copyright_text: string;
  footer_credits_text?: string | null;
  footer_credits_url?: string | null;
  popular_product_slugs: string[];
  popular_products_hidden: boolean;
  popular_products_limit: number;
  popular_products_title: string;
  popular_products_subtitle?: string | null;
  packages_banner_desktop_url?: string | null;
  packages_banner_mobile_url?: string | null;
  packages_banner_hidden: boolean;
}

export interface FooterLink {
  id: string;
  text: string;
  url: string;
  order: number;
  section: 'COMPANY' | 'INFO';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}
