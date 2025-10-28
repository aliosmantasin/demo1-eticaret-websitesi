"use client";

import { Star } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const reviews = [
    {
        name: "Burhan K.",
        date: "05/05/24",
        rating: 5,
        title: "Beğendiğim protein",
        text: "Ürünü kullandım lezzeti gayet güzel. İçerik olarakta zengin ne kadar düşük bütçeli olsa da iş görür.",
    },
    {
        name: "Ahmet G.",
        date: "05/05/24",
        rating: 5,
        title: "Beğendim.",
        text: "Hızlı kargo, güzel paketleme. Tadı da gayet güzel protein tozu ve L-carnitine. İkisi de denenmeli.",
    },
    {
        name: "Ayşe B.",
        date: "05/05/24",
        rating: 5,
        title: "Beğendim gayet güzel",
        text: "Tadı ve kokusu çok güzel, topaklanma olmuyor. Ürünü tavsiye ederim.",
    },
    {
        name: "Fatma Y.",
        date: "04/05/24",
        rating: 4,
        title: "Fena değil",
        text: "Fiyatına göre performansı iyi, ancak çikolatalı olanın tadı biraz daha iyi olabilirdi.",
    },
];

const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
            <Star
                key={i}
                className={`h-5 w-5 ${
                    i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                }`}
            />
        );
    }
    return stars;
};

export function Reviews() {
    return (
        <section className="container mx-auto px-4 py-12">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="relative"
            >
                <div className="mb-8 block sm:flex items-center justify-between  border-b-2 border-gray-200 pb-4">
                    <h2 className="text-3xl font-bold my-4 sm:my-0">Gerçek Müşteri Yorumları</h2>
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex text-yellow-500">
                            {renderStars(5)}</div>
                        <span className="font-semibold">198.453 Yorum</span>
                        <div className="relative -top-2 flex gap-2">
                            <CarouselPrevious className="static translate-x-1 translate-y-1" />
                            <CarouselNext className="static translate-x-1 translate-y-1" /> 
                        </div>
                    </div>
                </div>

                <CarouselContent>
                    {reviews.map((review, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="flex h-full flex-col p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex">{renderStars(review.rating)}</div>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">{review.title}</h3>
                                <p className="mb-4 text-gray-600">{review.text}</p>
                                <p className="mt-auto font-medium text-gray-800">{review.name}</p>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
}
