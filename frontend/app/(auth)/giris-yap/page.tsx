'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { setToken } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Giriş işlemi sırasında bir hata oluştu.');
            }
            
            setToken(data.token);
            
            // Kullanıcıyı anasayfaya veya önceki sayfasına yönlendir
            router.push('/');

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Beklenmedik bir hata oluştu.");
            }
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-500px)] items-center justify-center">
            <div className="w-full h-fit max-w-md rounded-lg  p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold">Giriş Yap</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            E-posta Adresi
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="mt-1"
                            placeholder="ornek@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Şifre
                            </label>
                            <div className="text-sm">
                                <Link href="#" className="font-medium text-primary hover:underline">
                                    Şifreni mi unuttun?
                                </Link>
                            </div>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="mt-1"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <Button type="submit" className="w-full">
                            Giriş Yap
                        </Button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Hesabın yok mu?{' '}
                    <Link href="/kayit-ol" className="font-medium text-primary hover:underline">
                        Hesap Oluştur
                    </Link>
                </p>
            </div>
        </div>
    );
}
