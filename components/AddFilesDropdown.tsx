'use client';

import { useState, useRef, useEffect } from 'react';
import { UploadCloud, ChevronDown, Folder } from 'lucide-react';

/**********************
 * types
 **********************/
interface AddFilesDropdownProps {
    onAddFilesAction: (files: FileList) => void;
}

/**********************
 * useClickOutside – closes the pop-over when the user clicks elsewhere
 **********************/
function useClickOutside(
    ref: React.RefObject<HTMLElement | null>,
    handler: () => void
) {
    useEffect(() => {
        const listener = (e: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(e.target as Node)) return;
            handler();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}

/**********************
 * AddFilesDropdown Component
 **********************/
export default function AddFilesDropdown({ onAddFilesAction }: AddFilesDropdownProps) {
    const [open, setOpen] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useClickOutside(popoverRef, () => setOpen(false));

    const handleLocalFileClick = () => {
        fileRef.current?.click();
        setOpen(false);
    };

    return (
        <div ref={popoverRef} className="relative inline-block text-left">
            {/* Trigger Button */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
                aria-haspopup="true"
                aria-expanded={open}
            >
                <UploadCloud aria-hidden="true" className="h-4 w-4 text-black" />
                Add Files
                <ChevronDown aria-hidden="true" className="h-4 w-4 text-black" />
            </button>

            {/* Dropdown */}
            {open && (
                <ul className="absolute left-0 z-[9999] mt-2 w-60 overflow-hidden rounded-md bg-white text-black shadow-lg ring-1 ring-gray-900/10">
                    <li className="relative group">
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0 pointer-events-none rounded-md" />

                        {/* Clickable item */}
                        <button
                            onClick={handleLocalFileClick}
                            className="relative z-10 flex w-full items-center gap-3 px-4 py-2 text-sm text-black cursor-pointer"
                        >
                            <Folder aria-hidden="true" className="h-4 w-4 text-black" />
                            Local files
                        </button>

                        {/* Hidden file input */}
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".pdf"
                            hidden
                            multiple
                            onChange={(e) => {
                                if (e.target.files) onAddFilesAction(e.target.files);
                            }}
                        />
                    </li>
                </ul>
            )}
        </div>
    );
}
