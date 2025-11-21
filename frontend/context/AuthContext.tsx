'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Yönlendirme için eklendi

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>; // Yeni fonksiyon
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('authToken');
  });
  
  const router = useRouter(); // Router hook'u

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('authToken', newToken);
    } else {
      localStorage.removeItem('authToken');
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    // İsteğe bağlı: çıkış yapıldığında direkt giriş sayfasına yönlendirilebilir.
    // router.push('/giris-yap'); 
  }, [router]);

  // Yeni merkezi fetch fonksiyonu
  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const currentToken = localStorage.getItem('authToken'); // Her zaman en güncel token'ı al

    const headers = new Headers(options.headers);
    if (currentToken) {
      headers.set('Authorization', `Bearer ${currentToken}`);
    }
    
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
      // Token süresi dolmuş olabilir, cevabı kontrol et
      const errorBody = await response.clone().json().catch(() => ({}));
      if (errorBody.message && errorBody.message.includes('expired')) {
        alert("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
        logout();
        router.push('/giris-yap');
        // Hata zincirini kırmak için özel bir response döndür
        return new Response(JSON.stringify({ message: 'Token expired' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    
    return response;
  }, [logout, router]);

  return (
    <AuthContext.Provider value={{ token, setToken, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

