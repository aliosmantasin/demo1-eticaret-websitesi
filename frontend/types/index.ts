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
  stock?: number; // Yeni alan
  description?: string | null; // Yeni alan
  isBestseller?: boolean; // Çok satanlar için
}

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number; // 1-5
  title: string | null;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}
