'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult,
    type DroppableProvided,
    type DraggableProvided,
} from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AddFilesDropdown from '@/components/AddFilesDropdown';
import SortDropdown, { SortOption } from '@/components/SortDropdown';

import { useMerge } from './MergeProvider';
import {
    loadPdfThumbnail,
    sortItems,
    MergeStatus,
} from '@/lib/pdf-utils';

/* -------------------------------------------------------- */

export default function UploadPanel() {
    const { state, dispatch } = useMerge();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');

    /* ─────────── Drag‑over guard on <html> ─────────── */
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

    /* ─────────── Local helpers ─────────── */
    const setStatus = (s: MergeStatus) =>
        dispatch({ type: 'SET_STATUS', status: s });

    const handleFiles = async (files: FileList | File[]) => {
        const pdfs = Array.from(files).filter(f => f.type === 'application/pdf');
        if (!pdfs.length) {
            setStatus('error');
            return;
        }

        setStatus('uploading');

        /** generate thumbnails in parallel */
        const thumbs = await Promise.all(pdfs.map(loadPdfThumbnail));

        /** merge with existing items and re‑sort */
        const combined = sortItems([...state.items, ...thumbs], sortOption);

        dispatch({ type: 'ADD_FILES', files: combined }); // reducer sets status=idle
    };

    const handleSort = (opt: SortOption) => {
        setSortOption(opt);
        dispatch({ type: 'ADD_FILES', files: sortItems(state.items, opt) });
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reordered = [...state.items];
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);
        dispatch({ type: 'REORDER', items: reordered });
    };

    /* ─────────── Early‑exit when success view is shown ─────────── */
    if (state.status === 'done') return null;

    /* ─────────── UI ─────────── */
    return (
        <>
            {/* Empty state – initial card */}
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
                                Drop or select PDF files
                            </h3>
                            <p className="text-gray-600 mb-4">Only PDF files are accepted</p>

                            <input
                                ref={inputRef}
                                type="file"
                                accept=".pdf"
                                multiple
                                className="hidden"
                                onChange={e =>
                                    e.target.files && handleFiles(e.target.files)
                                }
                            />

                            <Button
                                onClick={() => inputRef.current?.click()}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Choose PDF Files
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

            {/* Editing state – toolbar + thumbnails */}
            {state.items.length > 0 && (
                <>
                    {/* ✅ Centered toolbar */}
                    <div className="fade-in mb-4 flex flex-wrap justify-center gap-3 relative z-50">
                        <AddFilesDropdown onAddFilesAction={handleFiles} />
                        <SortDropdown onChangeAction={handleSort} />
                    </div>


                    {/* Thumbnails + DnD */}
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="files" direction="horizontal">
                            {(drop: DroppableProvided) => (
                                <div
                                    ref={drop.innerRef}
                                    {...drop.droppableProps}
                                    className="flex flex-wrap gap-4 justify-center"
                                >
                                    {state.items.map((file, i) => (
                                        <Draggable key={file.id} draggableId={file.id} index={i}>
                                            {(drag: DraggableProvided) => (
                                                <div
                                                    ref={drag.innerRef}
                                                    {...drag.draggableProps}
                                                    {...drag.dragHandleProps}
                                                    className="relative w-40 select-none"
                                                >
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
                                            )}
                                        </Draggable>
                                    ))}
                                    {drop.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </>
            )}

            {/* local fade‑in animation */}
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
