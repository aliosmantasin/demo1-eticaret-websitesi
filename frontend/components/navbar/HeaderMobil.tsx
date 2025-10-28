"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronRight, Menu } from "lucide-react";

import { CartButton } from "./CartButton";
import Logo from "./Logo";

const categories = [
    { name: "PROTEİN" },
    { name: "SPOR GIDALARI" },
    { name: "SAĞLIK" },
    { name: "GIDA" },
    { name: "VİTAMİN" },
    { name: "TÜM ÜRÜNLER" },
];

const links = [
    { name: "HESABIM" },
    { name: "MÜŞTERİ YORUMLARI" },
    { name: "İLETİŞİM" },
];

export function HeaderMobil() {
    return (
        <div className="flex items-center justify-between border-b p-4 md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Menu className="h-6 w-6 cursor-pointer" />
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Menü</SheetTitle>
                    </SheetHeader>
                    <div className="flex h-full flex-col">
                        <ul className="grow pt-8">
                            {categories.map((category) => (
                                <li
                                    key={category.name}
                                    className="border-b border-gray-200"
                                >
                                    <a
                                        href="#"
                                        className="flex items-center justify-between p-4 text-sm font-medium"
                                    >
                                        {category.name}
                                        <ChevronRight className="h-5 w-5" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-200 bg-gray-50">
                            <ul>
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href="#"
                                            className="block p-4 text-sm font-medium text-gray-700"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            <Logo />
            <CartButton count={3} />
        </div>
    );
}