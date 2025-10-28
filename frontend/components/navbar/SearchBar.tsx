"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export function SearchBar() {
  return (
    <div className="flex sm:w-[250px] lg:w-md items-center ">
      <div className="relative w-full">
      <svg className="absolute hidden lg:block left-3 top-1/2 h-6 w-6 -translate-y-1/2 " fill="#919191" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchIcon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path></svg>
        <Input
          type="text"
          placeholder="Aradığınız ürünü yazınız"
          className="rounded-r-none lg:pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 border-2 border-gray-300 text-[#919191]"
        />
      </div>
      <Button
        type="submit"
        className="rounded-l-none bg-[#919191] hover:bg-gray-600 h-12  cursor-pointer"
       
      >
        ARA
      </Button>
    </div>
  );
}

