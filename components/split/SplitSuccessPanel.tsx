'use client';

import React from 'react';
import { CheckCircle, Download } from 'lucide-react';
import { useSplit } from './SplitProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function SplitSuccessPanel() {
    const { state, dispatch } = useSplit();

    if (state.status !== 'done' || !state.splitUrls.length) return null;

    const startOver = () => dispatch({ type: 'RESET' });

    return (
        <>
            <div className="flex items-center justify-center gap-3 mb-6">
                <CheckCircle className="h-6 w-6 text-red-600" />
                <h2 className="text-2xl font-semibold text-black">
                    Your pages are ready
                </h2>
            </div>

            <Card className="mx-auto w-[1080px] border-red-200">
                <CardContent className="p-6 pb-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {state.splitUrls.map((url, index) => (
                            <a
                                key={index}
                                href={url}
                                download={`page-${index + 1}.pdf`}
                                className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 text-sm text-red-600"
                            >
                                Download Page {index + 1}
                                <Download className="w-4 h-4" />
                            </a>
                        ))}
                    </div>

                    <Button
                        onClick={startOver}
                        variant="ghost"
                        className="w-full text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Start over
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}
