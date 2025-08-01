'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const SORT_OPTIONS = [
    { label: 'Name (A → Z)', value: 'name-asc' },
    { label: 'Name (Z → A)', value: 'name-desc' },
    { label: 'Date (Old → New)', value: 'date-asc' },
    { label: 'Date (New → Old)', value: 'date-desc' },
    { label: 'Size (Small → Large)', value: 'size-asc' },
    { label: 'Size (Large → Small)', value: 'size-desc' },
] as const;

export type SortOption = typeof SORT_OPTIONS[number]['value'];

export default function SortDropdown({
                                         onChangeAction,
                                     }: {
    onChangeAction: (opt: SortOption) => void;
}) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<SortOption>('name-asc');

    const toggleDropdown = () => setOpen(prev => !prev);

    const handleSelect = (opt: SortOption) => {
        setSelected(opt);
        setOpen(false);
        onChangeAction(opt);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={toggleDropdown}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-100"
            >
                Sort: {SORT_OPTIONS.find(o => o.value === selected)?.label}
                <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {open && (
                <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                        {SORT_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                    selected === opt.value
                                        ? 'bg-red-50 text-red-600 font-semibold'
                                        : 'text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
