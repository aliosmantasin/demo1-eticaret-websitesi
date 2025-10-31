import React from "react";

interface VariantChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  color?: string; // optional background color hex
}

export const VariantChip: React.FC<VariantChipProps> = ({ label, selected, onClick, color }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded px-7 py-1 m-1 text-sm font-medium transition relative cursor-pointer
        ${selected ? "border-[#2a0aa9] border-3" : "border-2 border-gray-300"}`}
        
    >
      {label}
      <svg className={`absolute -top-3 -right-3 z-10 w-6 h-6 bg-white rounded-full
      ${selected ? "block" : "hidden"}`}
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
         fill="#2a0aa9"
         d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z" />
      </svg>
     
      <span className={`absolute right-0 top-0  w-5 h-full
         ${color ? "" : "bg-gray-100"}`} 
         style={color ? { backgroundColor: color } : undefined}>
  
      </span>
    </button>
  );
};
