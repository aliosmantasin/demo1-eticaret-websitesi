import { Product } from "@/types";
import ProductCard from "../ProductCard";

interface BestsellersProps {
    products: Product[];
}

export function Bestsellers({ products }: BestsellersProps) {
    return (
        <section className="container mx-auto px-4 py-8">
            <h1 className="mb-8 mt-12 text-center text-4xl font-bold">
                Çok Satanlar
            </h1>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
                {Array.isArray(products) &&
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
            </div>
        </section>
    );
}
