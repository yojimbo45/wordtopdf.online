'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    Upload,
    CheckCircle,
    Download,
    X,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult,
    type DraggableProvided,
    type DroppableProvided,
} from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration';
import { PDFDocument } from 'pdf-lib';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

/* ───────────────────────── TYPES ───────────────────────── */
type MergeStatus = 'idle' | 'uploading' | 'merging' | 'done' | 'error';

interface UploadedFile {
    id: string;
    file: File;
    name: string;
    size: number;
    pages: number;
    thumb: string;
}

const makeId = () => crypto.randomUUID();

/* ───────────────────────── COMPONENT ───────────────────────── */
export default function MergePDFPage() {
    const [items, setItems] = useState<UploadedFile[]>([]);
    const [status, setStatus] = useState<MergeStatus>('idle');
    const [progress, setProgress] = useState(0); // used only for merging now
    const [mergedUrl, setMergedUrl] = useState<string | null>(null);
    const [mergedFileName, setMergedFileName] = useState('merged.pdf');

    const inputRef = useRef<HTMLInputElement | null>(null);

    /* ───────────────────────── DRAG‑DROP GUARDS ───────────────────────── */
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

    /* ───────────────────────── FILE HANDLING ───────────────────────── */
    const handleFiles = async (fileList: FileList | File[]) => {
        const pdfs = Array.from(fileList).filter(
            f => f.type === 'application/pdf',
        );
        if (!pdfs.length) {
            setStatus('error');
            return;
        }

        setStatus('uploading');
        setMergedUrl(null);
        const created: UploadedFile[] = [];

        /* lazy‑load pdf.js only when needed */
        const { getDocument, GlobalWorkerOptions } = await import(
            'pdfjs-dist/build/pdf.mjs'
            );
        GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.mjs',
            import.meta.url,
        ).toString();

        for (const f of pdfs) {
            const pdf = await getDocument({ data: await f.arrayBuffer() }).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.25 });

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page
                .render({
                    canvasContext: canvas.getContext('2d')!,
                    viewport,
                    canvas,
                })
                .promise;

            created.push({
                id: makeId(),
                file: f,
                name: f.name,
                size: f.size,
                pages: pdf.numPages,
                thumb: canvas.toDataURL('image/png'),
            });
        }

        setItems(old => [...old, ...created]);
        setStatus('idle'); // immediately idle – no visual loading animation
    };

    /* ───────────────────────── MERGING ───────────────────────── */
    const mergePdfFiles = async (files: File[]) => {
        const merged = await PDFDocument.create();
        for (const f of files) {
            const src = await PDFDocument.load(await f.arrayBuffer());
            const pages = await merged.copyPages(src, src.getPageIndices());
            pages.forEach(p => merged.addPage(p));
        }
        const bytes = await merged.save();
        return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    };

    const handleMerge = async () => {
        setStatus('merging');
        setProgress(0);

        // simple fake progress bar for UX during merge
        const tick = setInterval(
            () => setProgress(p => (p >= 95 ? p : p + 5)),
            120,
        );

        const url = await mergePdfFiles(items.map(i => i.file));
        clearInterval(tick);

        const friendlyName =
            items.length > 0
                ? items[0].name.replace(/\.pdf$/i, '') + '_merged.pdf'
                : 'merged.pdf';

        setMergedFileName(friendlyName);
        setMergedUrl(url);
        setStatus('done');
        setProgress(100);
    };

    const reset = () => {
        setItems([]);
        setStatus('idle');
        setProgress(0);
        setMergedUrl(null);
    };

    /* ───────────────────────── DRAG‑DROP ───────────────────────── */
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const copy = [...items];
        const [moved] = copy.splice(result.source.index, 1);
        copy.splice(result.destination.index, 0, moved);
        setItems(copy);
    };

    /* flags for fade‑in animation */
    const showPreview = items.length > 0 && status !== 'done';

    /* ───────────────────────── RENDER ───────────────────────── */
    return (
        <div className="flex min-h-screen">
            {/* ─────────── LEFT: MAIN AREA ─────────── */}
            <div className="flex-1 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Merge PDF</h1>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                        Upload multiple PDF files and merge them into one.
                    </p>
                </div>

                {/* ─────────── FINAL RED SCREEN ─────────── */}
                {status === 'done' && mergedUrl ? (
                    <Card className="mx-auto max-w-md border-red-200">
                        <CardContent className="p-8 text-center">
                            <CheckCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold text-red-700 mb-2">
                                Your document is ready
                            </h3>
                            <p className="text-red-700 mb-6 break-all">{mergedFileName}</p>

                            <Button
                                asChild
                                className="w-full h-12 text-lg font-bold bg-red-600 hover:bg-red-700"
                            >
                                <a href={mergedUrl} download={mergedFileName}>
                                    Download
                                    <Download className="w-5 h-5 ml-2" />
                                </a>
                            </Button>

                            <Button
                                variant="outline"
                                onClick={reset}
                                className="w-full mt-4 text-sm border-red-600 text-red-600 hover:bg-red-50"
                            >
                                comeback editing
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    /* ─────────── EMPTY OR PREVIEW STATE ─────────── */
                    <>
                        {/* EMPTY: choose files */}
                        {!items.length ? (
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
                                        <Upload className="h-12 w-12 mx-auto mb-4 text-red-500" />
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Drop or select PDF files to merge
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Only PDF files are accepted
                                        </p>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            multiple
                                            ref={inputRef}
                                            onChange={e =>
                                                e.target.files && handleFiles(e.target.files)
                                            }
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => inputRef.current?.click()}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Choose PDF Files
                                        </Button>
                                    </div>

                                    {/* NO loading animation for upload */}
                                    {status === 'error' && (
                                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
                                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                            <span className="text-red-700">
                        Only PDF files are allowed.
                      </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            /* PREVIEW WITH FADE‑IN */
                            <div className={`fade-in ${showPreview ? '' : 'opacity-0'}`}>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="files" direction="horizontal">
                                        {(dropProvided: DroppableProvided) => (
                                            <div
                                                ref={dropProvided.innerRef}
                                                {...dropProvided.droppableProps}
                                                className="flex flex-wrap gap-4 justify-center"
                                            >
                                                {items.map((f, i) => (
                                                    <Draggable key={f.id} draggableId={f.id} index={i}>
                                                        {(dragProvided: DraggableProvided) => (
                                                            <div
                                                                ref={dragProvided.innerRef}
                                                                {...dragProvided.draggableProps}
                                                                {...dragProvided.dragHandleProps}
                                                                className="relative w-40 select-none"
                                                            >
                                                                <img
                                                                    src={f.thumb}
                                                                    alt=""
                                                                    className="rounded shadow border"
                                                                />
                                                                <div className="mt-1 text-sm text-center truncate">
                                                                    {f.name}
                                                                </div>
                                                                <button
                                                                    className="absolute -top-2 -right-2 bg-white rounded-full border shadow p-1 hover:bg-red-50"
                                                                    onClick={() =>
                                                                        setItems(old =>
                                                                            old.filter(x => x.id !== f.id),
                                                                        )
                                                                    }
                                                                >
                                                                    <X className="w-4 h-4 text-red-600" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {dropProvided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ─────────── RIGHT: SIDEBAR (fade‑in, hidden after merge) ─────────── */}
            {items.length > 0 && status !== 'done' && (
                <aside
                    className={`w-[380px] bg-white border-l border-gray-200 flex flex-col h-screen fade-in ${
                        showPreview ? '' : 'opacity-0'
                    }`}
                >
                    {/* scrollable content */}
                    <div className="p-4 overflow-y-auto flex-1">
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-gray-900">
                            <p className="font-medium mb-1 text-black">Tip</p>
                            <p className="text-black">
                                Drag and drop thumbnails to change their order.
                            </p>
                        </div>
                    </div>

                    {/* bottom‑anchored action */}
                    <div className="p-4 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
                        <Button
                            disabled={items.length < 2 || status === 'merging'}
                            onClick={handleMerge}
                            className="w-full h-[90px] text-2xl font-extrabold rounded-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center"
                        >
                            {status === 'merging' ? (
                                <>
                                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                    Merging…
                                </>
                            ) : (
                                <>
                                    Merge&nbsp;PDF
                                    <Download className="w-6 h-6 ml-3" />
                                </>
                            )}
                        </Button>

                        {/* progress while merging */}
                        {status === 'merging' && (
                            <div className="mt-3">
                                <Progress value={progress} />
                            </div>
                        )}
                    </div>
                </aside>
            )}

            {/* ─────────── KEYFRAMES FOR FADE‑IN ─────────── */}
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
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
