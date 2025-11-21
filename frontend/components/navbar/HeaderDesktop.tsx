"use client";

import { SearchBar } from "./SearchBar";
import Logo from "./Logo";
import { useAuth } from "@/context/AuthContext";
import { AccountDropdown } from "./AccountDropdown";
import { GuestDropdown } from "./GuestDropdown";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function NavbarDesktop() {
  const { token } = useAuth();

  return (
    <div className="hidden sm:flex justify-center items-center p-6 border-b ">
      <div className="flex sm:w-1/4 justify-center">
        <Logo />
      </div>

      <div className="flex w-3/5 items-center justify-end gap-4">
        <SearchBar />
        {token ? <AccountDropdown /> : <GuestDropdown />}
        <CartDrawer />
      </div>
    </div>
  );
}