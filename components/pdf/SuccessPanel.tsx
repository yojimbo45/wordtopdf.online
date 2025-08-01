'use client';

import React, { useState } from 'react';
import {
    ArrowLeft,
    CheckCircle,
    Download,
    FileText,
    Pencil,
    Save,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMerge } from './MergeProvider';

export default function SuccessPanel() {
    const { state, dispatch } = useMerge();

    const [isEditingName, setIsEditingName] = useState(false);
    const [customName, setCustomName] = useState(
        state.items.length > 0
            ? state.items[0].name.replace(/\.pdf$/i, '') + '_merged'
            : 'merged'
    );

    const finalFileName = customName + '.pdf';

    const backToEditing = () => {
        dispatch({ type: 'SET_MERGED_URL', url: null });
        dispatch({ type: 'SET_PROGRESS', value: 0 });
        dispatch({ type: 'SET_STATUS', status: 'idle' });
    };

    const startOver = () => dispatch({ type: 'RESET' });

    if (state.status !== 'done' || !state.mergedUrl) return null;

    return (
        <>
            {/* ✅ Title above container */}
            <div className="flex items-center justify-center gap-3 mb-6">
                <CheckCircle className="h-6 w-6 text-red-600" />
                <h2 className="text-2xl font-semibold text-black">
                    Your document is ready
                </h2>
            </div>

            {/* ✅ Main red container */}
            <Card className="mx-auto w-[1080px] border-red-200">
                <CardContent className="p-6 pb-0">
                    {/* File name row */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-gray-700" />
                        {isEditingName ? (
                            <>
                                <Input
                                    value={customName}
                                    onChange={e => setCustomName(e.target.value)}
                                    className="w-64 h-8 text-sm"
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsEditingName(false)}
                                >
                                    <Save className="w-4 h-4 text-gray-600" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <span className="text-red-700 font-medium break-all">
                                    {finalFileName}
                                </span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsEditingName(true)}
                                >
                                    <Pencil className="w-4 h-4 text-gray-600" />
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Buttons row */}
                    <div className="flex justify-center gap-4 mb-6">
                        <Button
                            asChild
                            className="h-11 px-6 text-sm font-bold bg-red-600 hover:bg-red-700"
                        >
                            <a href={state.mergedUrl} download={finalFileName}>
                                Download
                                <Download className="w-4 h-4 ml-2" />
                            </a>
                        </Button>

                        <Button
                            onClick={backToEditing}
                            className="h-11 px-6 text-sm font-bold text-red-600 border border-red-300 hover:bg-red-50"
                            variant="ghost"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to editing
                        </Button>
                    </div>

                    {/* PDF Viewer */}
                    <div className="-mx-6 h-[80vh] border-t border-gray-200">
                        <iframe
                            src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(state.mergedUrl)}`}
                            title="PDF Viewer"
                            className="w-full h-full border-0"
                        />
                    </div>

                    {/* Start over */}
                    <div className="pt-4">
                        <Button
                            variant="ghost"
                            onClick={startOver}
                            className="w-full text-sm text-gray-600 hover:bg-gray-50"
                        >
                            Start over
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
