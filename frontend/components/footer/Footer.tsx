"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Logo from "../navbar/Logo";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Category, FooterLink, Product, SiteSettings } from "@/types";

type SimpleLink = { href?: string; label: string };

const LinkList = ({ links }: { links: SimpleLink[] }) => (
    <ul className="space-y-2">
        {links.map((link) => (
            <li key={`${link.href || 'no-href'}-${link.label}`}>
                {link.href ? (
                    <Link href={link.href} className="hover:text-white hover:underline">
                        {link.label}
                    </Link>
                ) : (
                    <span className="text-gray-300">{link.label}</span>
                )}
            </li>
        ))}
    </ul>
);

const Footer = () => {
    const [companyLinks, setCompanyLinks] = useState<FooterLink[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [popularProducts, setPopularProducts] = useState<Product[]>([]);
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFooterData = async () => {
            setIsLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const [companyRes, categoriesRes, productsRes, settingsRes] = await Promise.all([
                    fetch(`${apiUrl}/api/footer-links?section=COMPANY`, { cache: "no-store" }),
                    fetch(`${apiUrl}/api/categories`, { cache: "no-store" }),
                    fetch(`${apiUrl}/api/products`, { cache: "no-store" }),
                    fetch(`${apiUrl}/api/settings`, { cache: "no-store" }),
                ]);

                if (companyRes.ok) {
                    setCompanyLinks(await companyRes.json());
                }
                if (categoriesRes.ok) {
                    setCategories(await categoriesRes.json());
                }
                let productsData: Product[] = [];
                if (productsRes.ok) {
                    productsData = await productsRes.json();
                }
                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json();
                    setSiteSettings(settingsData);
                    const slugs: string[] = settingsData.popular_product_slugs || [];
                    if (slugs.length > 0 && productsData.length > 0) {
                        const productMap = new Map(productsData.map((p) => [p.slug, p]));
                        const orderedProducts = slugs
                            .map((slug) => productMap.get(slug))
                            .filter((product): product is Product => Boolean(product));
                        setPopularProducts(orderedProducts);
                    } else {
                        setPopularProducts([]);
                    }
                }
            } catch (error) {
                console.error("Footer verileri yüklenemedi:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFooterData();
    }, []);

    const categoryLinks: SimpleLink[] = useMemo(
        () =>
            categories.map((category) => ({
                // Paketler kategorisi için özel route
                href: category.slug === 'paketler' ? '/paketler' : `/kategori/${category.slug}`,
                label: category.name,
            })),
        [categories],
    );

    const popularProductLinks: SimpleLink[] = useMemo(
        () =>
            popularProducts.map((product) => ({
                href: `/urun/${product.slug}`,
                label: product.name,
            })),
        [popularProducts],
    );

    const hidePopularProducts = siteSettings?.popular_products_hidden ?? false;
    const showPopularSection = !hidePopularProducts && popularProductLinks.length > 0;

    const companyLinkItems: SimpleLink[] = useMemo(
        () =>
            companyLinks.map((link) => ({
                href: link.url === '#' ? undefined : link.url,
                label: link.text,
            })),
        [companyLinks],
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
                        {isLoading && companyLinkItems.length === 0 ? (
                            <p className="text-sm text-gray-400">Linkler yükleniyor...</p>
                        ) : (
                            <LinkList links={companyLinkItems} />
                        )}
                    </div>
                    <div className="flex justify-center">
                        <div>
                            <h3 className="mb-6 text-xl font-bold text-white">Kategoriler</h3>
                            {isLoading && categoryLinks.length === 0 ? (
                                <p className="text-sm text-gray-400">Kategoriler yükleniyor...</p>
                            ) : (
                                <LinkList links={categoryLinks} />
                            )}
                        </div>
                    </div>
                    {showPopularSection && (
                        <div className="flex justify-end">
                            <div>
                                <h3 className="mb-6 text-xl font-bold text-white">Popüler Ürünler</h3>
                                {isLoading && popularProductLinks.length === 0 ? (
                                    <p className="text-sm text-gray-400">Ürünler yükleniyor...</p>
                                ) : (
                                    <LinkList links={popularProductLinks} />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Footer */}
                <div className="md:hidden">
                    <div className="mb-8">
                        <Logo variant="white" />
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                OJS NUTRITION
                            </AccordionTrigger>
                            <AccordionContent>
                                {isLoading && companyLinkItems.length === 0 ? (
                                    <p className="text-sm text-gray-400">Linkler yükleniyor...</p>
                                ) : (
                                    <LinkList links={companyLinkItems} />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                KATEGORİLER
                            </AccordionTrigger>
                            <AccordionContent>
                                {isLoading && categoryLinks.length === 0 ? (
                                    <p className="text-sm text-gray-400">Kategoriler yükleniyor...</p>
                                ) : (
                                    <LinkList links={categoryLinks} />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        {showPopularSection && (
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                    POPÜLER ÜRÜNLER
                                </AccordionTrigger>
                                <AccordionContent>
                                    {isLoading && popularProductLinks.length === 0 ? (
                                        <p className="text-sm text-gray-400">Ürünler yükleniyor...</p>
                                    ) : (
                                        <LinkList links={popularProductLinks} />
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 border-t border-gray-700 pt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="text-start text-sm text-gray-500">
                            {siteSettings?.footer_copyright_text ||
                                "Copyright © - Tüm Hakları Saklıdır."}
                        </p>
                        {siteSettings?.footer_credits_text && (
                            <p className="text-start text-sm text-gray-500">
                                {siteSettings.footer_credits_url ? (
                                    <Link
                                        href={siteSettings.footer_credits_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white hover:underline"
                                    >
                                        {siteSettings.footer_credits_text}
                                    </Link>
                                ) : (
                                    siteSettings.footer_credits_text
                                )}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
