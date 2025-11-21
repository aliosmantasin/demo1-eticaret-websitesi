'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface VariantChipProps {
  label: string;
  color?: string;
  isSelected: boolean;
  onClick: () => void;
  isAvailable: boolean;
}

export const VariantChip: React.FC<VariantChipProps> = ({ label, color, isSelected, onClick, isAvailable }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-between gap-4 rounded-md border bg-white px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none',
        {
          'border-2 border-primary': isSelected,
          'border-gray-300': !isSelected,
          'hover:border-gray-400': isAvailable,
          'opacity-50 cursor-not-allowed': !isAvailable,
        }
      )}
    >
      <span className={cn({ 'line-through': !isAvailable })}>{label}</span>
      {color && <span className="h-4 w-4 rounded-sm" style={{ backgroundColor: color }} />}

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
