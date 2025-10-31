"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function ProductDetailsAccordion() {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>ÖZELLİKLER</AccordionTrigger>
                <AccordionContent>
                    <ul className="list-disc space-y-2 pl-5">
                        <li>Yüksek protein içeriği ile kas gelişimini destekler.</li>
                        <li>Düşük şeker ve yağ oranı ile diyetinize uygundur.</li>
                        <li>Lezzetli aromaları ile keyifli bir tüketim sunar.</li>
                        <li>Hızlı emilimi sayesinde antrenman sonrası için idealdir.</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>BESİN İÇERİĞİ</AccordionTrigger>
                <AccordionContent>
                    Buraya besin içeriği tablosu gelecek. Şimdilik bu bir yer tutucudur.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>KULLANIM ŞEKLİ</AccordionTrigger>
                <AccordionContent>
                    Bir porsiyonu (1 ölçek) 250-300 ml su veya süt ile karıştırarak antrenmandan önce veya sonra tüketebilirsiniz.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}



