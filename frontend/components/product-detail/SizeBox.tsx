'use client';
import { cn } from "@/lib/utils";
import React from "react";

interface SizeBoxProps {
  sizeLabel: string; // e.g. "400G"
  isSelected: boolean;
  onClick: () => void;
  isAvailable: boolean;
}

export const SizeBox: React.FC<SizeBoxProps> = ({ sizeLabel, isSelected, onClick, isAvailable }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-md border bg-white p-3 text-center transition-colors duration-200 focus:outline-none w-28",
        {
          "border-2 border-primary": isSelected,
          "border-gray-300": !isSelected,
          "hover:border-gray-400": isAvailable,
          "opacity-50 cursor-not-allowed": !isAvailable,
        }
      )}
    >
      <span className={cn("text-sm font-semibold text-gray-800", { 'line-through': !isAvailable })}>{sizeLabel}</span>

      {isSelected && (
        <div className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
      </svg>
        </div>
      )}
    </button>
  );
};
