'use client';

import React from 'react';
import SplitUploadPanel from '@/components/split/SplitUploadPanel';
import SplitSuccessPanel from '@/components/split/SplitSuccessPanel';
import SplitSidebar from '@/components/split/SplitSidebar';
import { SplitProvider, useSplit } from '@/components/split/SplitProvider';

function SplitPDFContent() {
    const { state } = useSplit();

    return (
        <main className="flex min-h-screen bg-white">
            {/* LEFT MAIN PANEL */}
            <div className="flex-1 p-8">
                {state.status !== 'done' && (
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Split PDF</h1>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto">
                            Upload a PDF file and split it into individual pages.
                        </p>
                    </div>
                )}

                <SplitUploadPanel />
                <SplitSuccessPanel />
            </div>

            {/* RIGHT SIDEBAR */}
            <SplitSidebar />
        </main>
    );
}

export default function SplitPDFPage() {
    return (
        <SplitProvider>
            <SplitPDFContent />
        </SplitProvider>
    );
}
