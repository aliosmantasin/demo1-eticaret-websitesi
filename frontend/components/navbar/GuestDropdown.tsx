'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, UserPlus, User, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export function GuestDropdown() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-36 items-center justify-between gap-2 rounded-md border p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-gray-600" />
            <span className="font-medium">Hesap</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push('/giris-yap')} className="cursor-pointer">
          <LogIn className="mr-2 h-4 w-4" />
          <span>Giriş Yap</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/kayit-ol')} className="cursor-pointer">
          <UserPlus className="mr-2 h-4 w-4" />
          <span>Kayıt Ol</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
