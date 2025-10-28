import { Banner } from '@/components/homepage/Banner';
import { Bestsellers } from '@/components/homepage/Bestsellers';
import { CategoryShowcase } from '@/components/homepage/CategoryShowcase';
import { PromotionBanner } from '@/components/homepage/PromotionBanner';
import { Reviews } from '@/components/homepage/Reviews';
import { Assurance } from '@/components/homepage/Assurance';
import { Product } from '@/types';

async function getProducts(): Promise<Product[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/api/products`, {
      cache: 'no-store', // Sunucu tarafında her istekte veriyi yeniden çekmek için
    });

    if (!res.ok) {
      console.error('Failed to fetch products:', res.statusText);
      return [];
    }

    const data = await res.json();
    // Gelen verinin doğrudan bir dizi mi yoksa bir obje içinde mi olduğunu kontrol et
    return Array.isArray(data) ? data : data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Banner />
      <CategoryShowcase />
      <Bestsellers products={products} />
      <PromotionBanner />
      <Reviews />
      <Assurance />
    </>
  );
}
