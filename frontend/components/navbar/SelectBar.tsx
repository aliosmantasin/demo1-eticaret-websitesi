
import * as React from "react";

export function SelectBar() {
  return (
    <div className="relative h-12 w-36 lg:w-46">
      {/* Person Icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-6 w-6 text-gray-500"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          data-testid="PersonIcon"
          fill="currentColor"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"></path>
        </svg>
      </div>

      <select
        id="account-select"
        className="h-12 w-full appearance-none rounded-lg border-2 border-gray-300 bg-transparent pl-12 pr-8 font-medium text-gray-900 focus:border-gray-500 focus:outline-none"
        defaultValue=""
      >
        <option value="" disabled>
          HESAP
        </option>
        <option value="GirisYap">Giriş</option>
        <option value="KayitOl">Kayıt Ol</option>
      </select>

      {/* Custom Dropdown Arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          className="h-5 w-5 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
