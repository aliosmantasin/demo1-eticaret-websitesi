"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Product } from "@/types";

interface ProductDetailsAccordionProps {
    product: Product;
}

export function ProductDetailsAccordion({ product }: ProductDetailsAccordionProps) {
    // Özellikler listesini parse et (her satır bir madde)
    const featuresList = product.features 
        ? product.features.split('\n').filter(line => line.trim().length > 0)
        : [];

    // Besin içeriğini parse et (her satır bir içerik)
    const nutritionalList = product.nutritional_content 
        ? product.nutritional_content.split('\n').filter(line => line.trim().length > 0)
        : [];

    return (
        <Accordion type="single" collapsible className="w-full">
            {product.features && featuresList.length > 0 && (
                <AccordionItem value="features">
                    <AccordionTrigger>ÖZELLİKLER</AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc space-y-2 pl-5">
                            {featuresList.map((feature, index) => (
                                <li key={index} className="text-sm text-gray-700">
                                    {feature.trim()}
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            )}
            
            {product.nutritional_content && nutritionalList.length > 0 && (
                <AccordionItem value="nutritional">
                    <AccordionTrigger>BESİN İÇERİĞİ</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {nutritionalList.map((item, index) => {
                                // Eğer satır ":" içeriyorsa, başlık ve içerik olarak ayır
                                if (item.includes(':')) {
                                    const [title, ...contentParts] = item.split(':');
                                    const content = contentParts.join(':').trim();
                                    return (
                                        <div key={index} className="text-sm">
                                            <span className="font-semibold text-gray-900">{title.trim()}:</span>
                                            {content && <span className="text-gray-700"> {content}</span>}
                                        </div>
                                    );
                                }
                                // Normal liste öğesi
                                return (
                                    <div key={index} className="text-sm text-gray-700">
                                        {item.trim()}
                                    </div>
                                );
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            )}
            
            {product.usage_instructions && (
                <AccordionItem value="usage">
                    <AccordionTrigger>KULLANIM ŞEKLİ</AccordionTrigger>
                    <AccordionContent>
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                            {product.usage_instructions}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            )}
        </Accordion>
    )
}



