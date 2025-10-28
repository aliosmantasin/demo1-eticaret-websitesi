"use client";

import Image from "next/image";

const categories = [
    {
        name: "PROTEİN",
        image: "https://vr3j8vmadakibxk6.public.blob.vercel-storage.com/e-tic/ProteinCategories.webp",
    },
    {
        name: "VİTAMİNLER",
        image: "https://vr3j8vmadakibxk6.public.blob.vercel-storage.com/e-tic/VitaminCategories.webp",
    },
   
    {
        name: "SAĞLIK",
        image: "https://vr3j8vmadakibxk6.public.blob.vercel-storage.com/e-tic/SaglikCategories.webp",
    },

    {
        name: "SPOR GIDALARI",
        image: "https://vr3j8vmadakibxk6.public.blob.vercel-storage.com/e-tic/GidaCategories.webp",
    },
    {
        name: "GIDA",
        image: "https://vr3j8vmadakibxk6.public.blob.vercel-storage.com/e-tic/GidaCategories.webp",
    },
 
    {
        name: "TÜM ÜRÜNLER",
        image: "https://vr3j8vmadakibxk6.public.blob.vercel-storage.com/e-tic/TumUrun.webp",
    },
];

export function CategoryShowcase() {
    return (
        <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3">
                {categories.map((category) => (
                    <div key={category.name} className=" rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
                        {/* Kategori Görseli */}
                        <div className="relative w-full overflow-hidden">
                            <Image
                                src={category.image}
                                alt={category.name}
                                width={400}
                                height={300}
                                className="h-full w-full object-contain"
                            />
                        </div>

                        {/* Kategori Bilgisi */}
                        <div className="absolute  right-0 sm:-right-3 lg:right-4 top-1/2 -translate-y-1/2 transform p-4">
                       
                            <h3 className="w-18 md:w-32 h-4 sm:h-12 text-end lg:text-center justify-end mb-4 text-xs md:text-lg lg:text-2xl font-bold  text-gray-900">
                                {category.name}
                            </h3>

                            {/* İNCELE Butonu */}
                            <div className="flex justify-end">
                            <a
                                href={`/kategoriler/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                                className="w-20 sm:w-auto xl:w-36 text-center bg-primary text-white px-4 md:px-4  rounded-md text-xs md:text-lg font-medium hover:bg-opacity-90 transition-all"
                            >
                                İNCELE
                            </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
