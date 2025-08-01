'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Scissors, Loader2, Plus, X } from 'lucide-react';
import { useSplit } from './SplitProvider';
import { Progress } from '@/components/ui/progress';

export default function SplitSidebar() {
    const { state, split } = useSplit();
    const [activeTab, setActiveTab] = useState<'range' | 'pages'>('range');
    const [rangeMode, setRangeMode] = useState<'ranges' | 'fixed_range'>('ranges');
    const [extractMode, setExtractMode] = useState<'all' | 'custom'>('custom');
    const [ranges, setRanges] = useState([{ from: 1, to: 1 }]);
    const [fixedPages, setFixedPages] = useState<number>(5);
    const totalPages = 118;

    const handleAddRange = () => {
        setRanges([...ranges, { from: 1, to: 1 }]);
    };

    const handleRemoveRange = (index: number) => {
        setRanges((prev) => prev.filter((_, i) => i !== index));
    };

    const hidden = state.status === 'done' || state.items.length === 0;
    if (hidden) return null;

    return (
        <aside className="w-[380px] max-h-[92vh] bg-white border-l border-gray-200 flex flex-col rounded-l-xl shadow-md fade-in text-neutral-900">
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <h2 className="text-2xl font-bold text-center text-red-600">Split your PDF</h2>

                {/* Tabs */}
                <div className="flex gap-2">
                    <div
                        onClick={() => setActiveTab('range')}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer w-1/2 border ${
                            activeTab === 'range'
                                ? 'bg-red-100 border-red-500 text-red-700'
                                : 'bg-gray-100 border-gray-300 text-gray-700'
                        }`}
                    >
                        <Image src="/range.svg" alt="Range" width={28} height={28} />
                        <span className="font-medium">Range</span>
                    </div>
                    <div
                        onClick={() => setActiveTab('pages')}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer w-1/2 border ${
                            activeTab === 'pages'
                                ? 'bg-red-100 border-red-500 text-red-700'
                                : 'bg-gray-100 border-gray-300 text-gray-700'
                        }`}
                    >
                        <Image src="/page.svg" alt="Pages" width={28} height={28} />
                        <span className="font-medium">Pages</span>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="text-sm space-y-6 mt-4">
                    {activeTab === 'range' && (
                        <>
                            <p className="font-semibold">Range mode:</p>
                            <div className="flex gap-2">
                                <div
                                    onClick={() => setRangeMode('ranges')}
                                    className={`px-3 py-2 rounded-lg border cursor-pointer ${
                                        rangeMode === 'ranges'
                                            ? 'bg-red-100 text-red-700 border-red-500'
                                            : 'border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Custom ranges
                                </div>
                                <div
                                    onClick={() => setRangeMode('fixed_range')}
                                    className={`px-3 py-2 rounded-lg border cursor-pointer ${
                                        rangeMode === 'fixed_range'
                                            ? 'bg-red-100 text-red-700 border-red-500'
                                            : 'border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Fixed ranges
                                </div>
                            </div>

                            {/* CUSTOM RANGES */}
                            {rangeMode === 'ranges' && (
                                <>
                                    <div className="space-y-3">
                                        {ranges.map((r, i) => (
                                            <div key={i} className="bg-gray-100 p-3 rounded-lg relative">
                                                {ranges.length > 1 && (
                                                    <div
                                                        className="absolute right-2 top-2 cursor-pointer text-gray-500 hover:text-black"
                                                        onClick={() => handleRemoveRange(i)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </div>
                                                )}
                                                <p className="font-semibold text-black text-sm mb-3">Range {i + 1}</p>
                                                <div className="flex gap-3">
                                                    <div className="relative w-28">
                                                        <span className="absolute left-2 top-1 text-xs text-gray-500">
                                                            from
                                                        </span>
                                                        <input
                                                            type="number"
                                                            defaultValue={r.from}
                                                            className="border pl-10 pr-2 py-2 rounded-md w-full"
                                                        />
                                                    </div>
                                                    <div className="relative w-28">
                                                        <span className="absolute left-2 top-1 text-xs text-gray-500">
                                                            to
                                                        </span>
                                                        <input
                                                            type="number"
                                                            defaultValue={r.to}
                                                            className="border pl-8 pr-2 py-2 rounded-md w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="text-center">
                                            <button
                                                onClick={handleAddRange}
                                                className="border border-red-500 text-red-600 hover:bg-red-50 font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Range
                                            </button>
                                        </div>
                                        <label className="flex items-center gap-2 mt-2 text-black">
                                            <input type="checkbox" className="form-checkbox" />
                                            Merge all ranges into one PDF file.
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* FIXED RANGES */}
                            {rangeMode === 'fixed_range' && (
                                <div className="space-y-4">
                                    <label className="text-xs mb-1 block text-black font-medium">
                                        Split into page ranges of:
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        className="border px-3 py-2 rounded-md w-full"
                                        value={fixedPages}
                                        onChange={(e) => setFixedPages(Number(e.target.value))}
                                    />
                                    <div className="text-sm bg-gray-50 border border-gray-200 p-3 rounded-md text-black">
                                        This PDF will be split into files of{' '}
                                        <strong>{fixedPages}</strong> pages.
                                        <br />
                                        <strong>
                                            {Math.ceil(totalPages / fixedPages)} PDF
                                            {Math.ceil(totalPages / fixedPages) > 1 ? 's' : ''}
                                        </strong>{' '}
                                        will be created.
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* EXTRACT PAGES */}
                    {activeTab === 'pages' && (
                        <>
                            <p className="font-semibold">Extract mode:</p>
                            <div className="flex gap-2">
                                <div
                                    className={`px-3 py-2 rounded-md border cursor-pointer ${
                                        extractMode === 'all'
                                            ? 'bg-red-100 text-red-700 border-red-500'
                                            : 'border-gray-300 text-gray-700'
                                    }`}
                                    onClick={() => setExtractMode('all')}
                                >
                                    Extract all pages
                                </div>
                                <div
                                    className={`px-3 py-2 rounded-md border cursor-pointer ${
                                        extractMode === 'custom'
                                            ? 'bg-red-100 text-red-700 border-red-500'
                                            : 'border-gray-300 text-gray-700'
                                    }`}
                                    onClick={() => setExtractMode('custom')}
                                >
                                    Select pages
                                </div>
                            </div>

                            {extractMode === 'all' && (
                                <div className="mt-3 text-sm bg-gray-50 border border-gray-200 p-3 rounded-md text-black">
                                    Selected pages will be converted into separate PDF files.
                                    <br />
                                    <strong>{totalPages} PDF</strong> will be created.
                                </div>
                            )}

                            {extractMode === 'custom' && (
                                <div className="mt-3 space-y-3">
                                    <div>
                                        <label className="block text-xs mb-1 text-black">Pages to extract:</label>
                                        <input
                                            type="text"
                                            className="border px-2 py-2 rounded-md w-full"
                                            defaultValue="1,3-5"
                                            placeholder="e.g. 1,5-7"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 text-black">
                                        <input type="checkbox" className="form-checkbox" />
                                        Merge extracted pages into one PDF file.
                                    </label>
                                    <div className="text-sm bg-gray-50 border border-gray-200 p-3 rounded-md text-black">
                                        Selected pages will be converted into separate PDF files.
                                        <br />
                                        <strong>0 PDF</strong> will be created.
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Action */}
            <div className="p-4 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
                <button
                    disabled={state.items.length === 0 || state.status === 'splitting'}
                    onClick={split}
                    className="w-full h-[90px] text-2xl font-bold font-sans rounded-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {state.status === 'splitting' ? (
                        <>
                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            Splitting…
                        </>
                    ) : (
                        <>
                            Split PDF
                            <Scissors className="w-6 h-6 ml-3" />
                        </>
                    )}
                </button>
                {state.status === 'splitting' && (
                    <div className="mt-3">
                        <Progress value={state.progress} />
                    </div>
                )}
            </div>
        </aside>
    );
}
