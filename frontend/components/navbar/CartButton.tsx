"use client";

import * as React from "react";

const CartIconWithBadge = ({ count }: { count: number; className?: string }) => {
    return (
        <span>
            <svg className="h-7 w-7 relative " focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2M1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2"></path>
                {count > 0 && (
                <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {count}
                </span>
            )}
            </svg>
          
        </span>
    );
};

interface CartButtonProps {
    count?: number;
}

export function CartButton({ count: propCount }: CartButtonProps) {
    const [cartCount, setCartCount] = React.useState(propCount || 0);

    React.useEffect(() => {
        // Component mount olduğunda sepetteki ürün sayısını al
        const fetchCartCount = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setCartCount(0);
                    return;
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/cart`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const cart = await response.json();
                    const totalItems = cart.items?.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0) || 0;
                    setCartCount(totalItems);
                }
            } catch (error) {
                console.error('Sepet bilgisi alınamadı:', error);
            }
        };

        fetchCartCount();
    }, []);

    return (
        <button className="flex items-center justify-center gap-2 md:h-12 md:w-32 md:rounded-lg md:bg-[#919191] md:px-4 md:hover:bg-gray-600 cursor-pointer">
            
            <span className="hidden font-medium text-white md:inline">
                Sepet
            </span>
        </button>
    );
}

