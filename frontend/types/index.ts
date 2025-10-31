// frontend/types/index.ts

export interface Category {
  id: string; // updated to match backend schema (cuid string)
  name: string;
  slug: string; // new field
}

export interface Product {
  id: string; // updated to match backend schema
  name: string;
  slug: string; // new field
  price: number;
  images: string[];
  category: Category;
  short_explanation: string | null;
  discounted_price: number | null;
  discount_percentage: number | null;
  comment_count: number;
  average_star: number;
}
