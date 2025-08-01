'use client';

import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import type { UploadedFile } from '@/lib/pdf-utils';

import { useMerge } from './MergeProvider';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

/* -------------------------------------------------------- */

export default function MergeSidebar() {
    const { state, merge } = useMerge();

    const hidden = state.status === 'done' || state.items.length === 0;
    if (hidden) return null;

    return (
        <aside className="w-[380px] max-h-[92vh] bg-white border-l border-gray-200 flex flex-col rounded-l-xl shadow-md fade-in">
            <div className="p-4 overflow-y-auto flex-1">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-1 text-black">Tip</p>
                    <p className="text-black">
                        Drag thumbnails to change page order, or use “Add Files” to append
                        more PDFs.
                    </p>
                </div>
            </div>

            <div className="p-4 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
                <Button
                    disabled={state.items.length < 2 || state.status === 'merging'}
                    onClick={merge}
                    className="w-full h-[90px] text-2xl font-extrabold rounded-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center"
                >
                    {state.status === 'merging' ? (
                        <>
                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            Merging…
                        </>
                    ) : (
                        <>
                            Merge PDF
                            <Download className="w-6 h-6 ml-3" />
                        </>
                    )}
                </Button>

                {state.status === 'merging' && (
                    <div className="mt-3">
                        <Progress value={state.progress} />
                    </div>
                )}
            </div>

            {/* fade‑in animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .fade-in {
                    animation: fadeIn 0.35s ease-out forwards;
                }
            `}</style>
        </aside>
    );
}
