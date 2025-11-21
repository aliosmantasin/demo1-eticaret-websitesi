import { HomepageBanner } from '@/components/homepage/Banner';
import { Bestsellers } from '@/components/homepage/Bestsellers';
import { CategoryShowcase } from '@/components/homepage/CategoryShowcase';
import { HomepagePromotionBanner } from '@/components/homepage/PromotionBanner';
import { Reviews } from '@/components/homepage/Reviews';
import { Assurance } from '@/components/homepage/Assurance';
import { PopularProducts } from '@/components/homepage/PopularProducts';
import { PackagesBanner } from '@/components/homepage/PackagesBanner';
import { Product } from '@/types';

// Bu sayfa dinamik veri çektiği için her zaman server-side render edilmeli
export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  try {
    const apiUrl =
            typeof window === 'undefined'
                ? process.env.INTERNAL_API_URL // Sunucu tarafı (SSR)
                : process.env.NEXT_PUBLIC_API_URL; // Tarayıcı tarafı (Client-side)


    if (!apiUrl) {
      console.error('API URL tanımlı değil. Lütfen .env.local veya docker-compose.yml dosyanızı kontrol edin.');
      return [];
    }

    const res = await fetch(`${apiUrl}/api/products`, {
      cache: 'no-store', // Sunucu tarafında her istekte veriyi yeniden çekmek için
    });

    if (!res.ok) {
      console.error('Failed to fetch products:', res.status, res.statusText);
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
      <HomepageBanner />
      <CategoryShowcase />
      <Bestsellers products={products} />
      <HomepagePromotionBanner />
      <PopularProducts products={products} />
      <PackagesBanner />
      <Reviews />
      <Assurance />
    </>
  );
}
