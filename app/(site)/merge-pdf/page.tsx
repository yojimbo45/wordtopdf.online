'use client';

import React from 'react';
import UploadPanel from '@/components/pdf/UploadPanel';
import SuccessPanel from '@/components/pdf/SuccessPanel';
import MergeSidebar from '@/components/pdf/MergeSidebar';
import { MergeProvider, useMerge } from '@/components/pdf/MergeProvider';

function MergePDFContent() {
    const { state } = useMerge();

    return (
        <main className="flex min-h-screen bg-white">
            {/* LEFT MAIN PANEL */}
            <div className="flex-1 p-8">
                {state.status !== 'done' && (
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Merge PDF</h1>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto">
                            Upload multiple PDF files, reorder them, and merge into one document.
                        </p>
                    </div>
                )}

                <UploadPanel />
                <SuccessPanel />
            </div>

            {/* RIGHT SIDEBAR */}
            <MergeSidebar />
        </main>
    );
}

export default function MergePDFPage() {
    return (
        <MergeProvider>
            <MergePDFContent />
        </MergeProvider>
    );
}
