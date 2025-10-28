"use client";


import { SearchBar } from "./SearchBar";
import { SelectBar } from "./SelectBar";
import { CartButton } from "./CartButton";
import Logo from "./Logo";


export function HeaderDesktop() {
  return (
    <div className="hidden sm:flex justify-center items-center p-6 border-b ">
      <div className="flex sm:w-1/4 justify-center">
        <Logo />
      </div>

      {/* Kullanıcı Aksiyonları (Hesap, Sepet) buraya gelecek */}
      <div className="flex w-3/5 items-center justify-end gap-4">
        <SearchBar />
        <SelectBar />
        <CartButton count={3} />
      </div>
    </div>
  );
}