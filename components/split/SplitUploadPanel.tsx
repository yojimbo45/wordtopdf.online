'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSplit } from './SplitProvider';
import { loadPdfThumbnail } from '@/lib/pdf-utils';

export default function SplitUploadPanel() {
    const { state, dispatch } = useSplit();
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const prevent = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
        };
        document.addEventListener('dragover', prevent);
        document.addEventListener('drop', prevent);
        return () => {
            document.removeEventListener('dragover', prevent);
            document.removeEventListener('drop', prevent);
        };
    }, []);

    const handleFiles = async (files: FileList | File[]) => {
        const pdfs = Array.from(files).filter(f => f.type === 'application/pdf');
        if (!pdfs.length) {
            dispatch({ type: 'SET_STATUS', status: 'error' });
            return;
        }

        dispatch({ type: 'SET_STATUS', status: 'uploading' });

        const thumbs = await Promise.all(pdfs.map(loadPdfThumbnail));
        dispatch({ type: 'ADD_FILES', files: thumbs });
    };

    if (state.status === 'done') return null;

    return (
        <>
            {!state.items.length && (
                <Card
                    onDrop={e => {
                        e.preventDefault();
                        handleFiles(e.dataTransfer.files);
                    }}
                    onDragOver={e => e.preventDefault()}
                    className="mx-auto max-w-md"
                >
                    <CardContent className="p-6 text-center">
                        <div className="mt-6 border-2 border-dashed border-red-300 bg-white rounded-lg pt-12 pb-8 px-8 relative">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Drop or select PDF to split
                            </h3>
                            <p className="text-gray-600 mb-4">Only one PDF file is supported</p>

                            <input
                                ref={inputRef}
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={e =>
                                    e.target.files && handleFiles(e.target.files)
                                }
                            />

                            <Button
                                onClick={() => inputRef.current?.click()}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Choose PDF File
                            </Button>
                        </div>

                        {state.status === 'error' && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <span className="text-red-700">Only PDF files are allowed.</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {state.items.length > 0 && (
                <div className="fade-in flex flex-wrap justify-center gap-4">
                    {state.items.map(file => (
                        <div key={file.id} className="relative w-40 select-none">
                            <img
                                src={file.thumb}
                                alt=""
                                className="rounded shadow border"
                            />
                            <div className="mt-1 text-sm text-center truncate">
                                {file.name}
                            </div>
                            <button
                                onClick={() =>
                                    dispatch({ type: 'DELETE_FILE', id: file.id })
                                }
                                className="absolute -top-2 -right-2 bg-white rounded-full border shadow p-1 hover:bg-red-50"
                            >
                                <X className="w-4 h-4 text-red-600" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

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
        </>
    );
}
