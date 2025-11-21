"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronRight, Menu, LogOut, User,LogIn, UserPlus   } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Category } from "@/types";

import Logo from "./Logo";
import { useAuth } from "@/context/AuthContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function NavbarMobil() {
    const { token, logout } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/categories`, {
                    cache: 'no-store',
                });
                if (response.ok) {
                    const data = await response.json();
                    // Sadece showInNavbar: true olan kategorileri göster
                    const navbarCategories = data.filter((cat: Category) => cat.showInNavbar !== false);
                    setCategories(navbarCategories);
                }
            } catch (error) {
                console.error('Kategoriler yüklenemedi:', error);
            }
        };
        fetchCategories();
    }, []);

    const staticLinks = [
        { name: "MÜŞTERİ YORUMLARI", href: "/yorumlar" },
        { name: "İLETİŞİM", href: "/iletisim" },
    ];
    
    return (
        <div className="flex items-center justify-between border-b p-4 sm:hidden">
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
                            {categories.map((category) => {
                                // Paketler kategorisi için özel route
                                const href = category.slug === 'paketler' ? '/paketler' : `/kategori/${category.slug}`;
                                return (
                                    <li
                                        key={category.slug}
                                        className="border-b border-gray-200"
                                    >
                                        <Link
                                            href={href}
                                            className="flex items-center justify-between p-4 text-sm font-medium"
                                        >
                                            {category.name}
                                            <ChevronRight className="h-5 w-5" />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="border-t border-gray-200 bg-gray-50">
                            <ul>
                                {token ? (
                                    <>
                                        <li key="hesabim">
                                            <Link href="/hesabim" className="flex items-center p-4 text-sm font-medium text-gray-700">
                                                <User className="mr-2 h-4 w-4" />
                                                Hesabım
                                            </Link>
                                        </li>
                                        <li key="cikis">
                                            <button onClick={logout} className="flex w-full items-center p-4 text-sm font-medium text-red-500">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Çıkış Yap
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li key="giris">
                                            <Link href="/giris-yap" className="flex items-center p-4 text-sm font-medium text-gray-700">
                                                <LogIn className="mr-2 h-4 w-4" />
                                                Giriş Yap
                                            </Link>
                                        </li>
                                        <li key="kayit">
                                            <Link href="/kayit-ol" className="flex items-center p-4 text-sm font-medium text-gray-700">
                                                <UserPlus className="mr-2 h-4 w-4" />
                                                Kayıt Ol
                                            </Link>
                                        </li>
                                    </>
                                )}
                                {staticLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="block p-4 text-sm font-medium text-gray-700"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            <Logo />
            <CartDrawer />
        </div>
    );
}