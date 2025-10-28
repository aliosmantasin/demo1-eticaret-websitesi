"use client";

import Link from "next/link";
import Logo from "../navbar/Logo";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const Footer = () => {
    const kurumsalLinks = [
        { href: "/iletisim", label: "İletişim" },
        { href: "/hakkimizda", label: "Hakkımızda" },
        { href: "/sikca-sorulan-sorular", label: "Sıkça Sorulan Sorular" },
        { href: "/kvkk", label: "KVKK" },
        { href: "/calisma-ilkelerimiz", label: "Çalışma İlkelerimiz" },
        { href: "/satis-sozlesmesi", label: "Satış Sözleşmesi" },
        { href: "/garanti-ve-iade-kosullari", label: "Garanti ve İade Koşulları" },
        { href: "/gercek-musteri-yorumlari", label: "Gerçek Müşteri Yorumları" },
        { href: "/blog", label: "Blog" },
    ];

    const kategoriLinks = [
        { href: "/kategori/protein", label: "Protein" },
        { href: "/kategori/spor-gidalari", label: "Spor Gıdaları" },
        { href: "/kategori/saglik", label: "Sağlık" },
        { href: "/kategori/gida", label: "Gıda" },
        { href: "/kategori/vitamin", label: "Vitamin" },
        { href: "/kategori/aksesuar", label: "Aksesuar" },
        { href: "/kategori/tum-urunler", label: "Tüm Ürünler" },
        { href: "/kategori/paketler", label: "Paketler" },
        { href: "/kategori/lansmana-ozel", label: "Lansmana Özel Fırsatlar" },
    ];

    const populerUrunLinks = [
        { href: "/urun/whey-protein", label: "Whey Protein" },
        { href: "/urun/cream-of-rice", label: "Cream of Rice" },
        { href: "/urun/creatine", label: "Creatine" },
        { href: "/urun/bcaa-plus", label: "BCAA+" },
        { href: "/urun/pre-workout", label: "Pre-Workout" },
        { href: "/urun/fitness-paketi", label: "Fitness Paketi" },
        { href: "/urun/collagen", label: "Collagen" },
        { href: "/urun/gunluk-vitamin-paketi", label: "Günlük Vitamin Paketi" },
        { href: "/urun/zma", label: "ZMA" },
    ];

    const LinkList = ({ links }: { links: { href: string; label: string }[] }) => (
        <ul className="space-y-2">
            {links.map((link) => (
                <li key={link.href}>
                    <Link href={link.href} className="hover:text-white hover:underline">
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    );

    return (
        <footer className="bg-primary">
            <div className="container mx-auto px-4 py-12 text-gray-300">
                {/* Desktop Footer */}
                <div className="hidden md:grid md:grid-cols-3 md:gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="mb-4">
                            <Logo variant="white" />
                        </div>
                        <LinkList links={kurumsalLinks} />
                    </div>
                    <div>
                        <h3 className="mb-6 text-xl font-bold text-white">Kategoriler</h3>
                        <LinkList links={kategoriLinks} />
                    </div>
                    <div>
                        <h3 className="mb-6 text-xl font-bold text-white">Popüler Ürünler</h3>
                        <LinkList links={populerUrunLinks} />
                    </div>
                </div>

                {/* Mobile Footer */}
                <div className="md:hidden">
                    <div className="mb-8">
                        <Logo variant="white" />
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">OJS NUTRITION</AccordionTrigger>
                            <AccordionContent>
                                <LinkList links={kurumsalLinks} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">KATEGORİLER</AccordionTrigger>
                            <AccordionContent>
                                <LinkList links={kategoriLinks} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">POPÜLER ÜRÜNLER</AccordionTrigger>
                            <AccordionContent>
                                <LinkList links={populerUrunLinks} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 border-t border-gray-700 pt-8">
                    <p className="text-start text-sm text-gray-500">
                        Copyright © - Tüm Hakları Saklıdır.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
