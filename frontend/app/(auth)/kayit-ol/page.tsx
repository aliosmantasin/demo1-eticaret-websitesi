'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Backend'den gelen hata mesajını göster
                throw new Error(data.message || 'Kayıt işlemi sırasında bir hata oluştu.');
            }

            alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
            router.push('/giris-yap');

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-500px)] items-center justify-center">
            <div className="w-full h-fit max-w-md rounded-lg  p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold">Hesap Oluştur</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Ad Soyad
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="mt-1"
                            placeholder="Adınız ve soyadınız"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                        <label htmlFor="password" a className="block text-sm font-medium text-gray-700">
                            Şifre
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="mt-1"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <Button type="submit" className="w-full">
                            Kayıt Ol
                        </Button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Zaten bir hesabın var mı?{' '}
                    <Link href="/giris-yap" className="font-medium text-primary hover:underline">
                        Giriş Yap
                    </Link>
                </p>
            </div>
        </div>
    );
}
