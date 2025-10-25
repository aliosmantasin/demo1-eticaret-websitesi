// frontend/types/index.ts

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  category: Category;
  short_explanation: string | null;
  discounted_price: number | null;
  discount_percentage: number | null;
  comment_count: number;
  average_star: number;
}
