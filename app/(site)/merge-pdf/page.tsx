'use client'

import React, { useState, useCallback } from 'react'
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from 'react-beautiful-dnd'
import { PDFDocument } from 'pdf-lib'
import * as pdfjs from 'pdfjs-dist'
import { useRouter } from 'next/navigation'
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Progress,
} from '@/components/ui'               // ← adjust to your paths
import {
    Upload, GripVertical, X, Download, CheckCircle, Loader2,
} from 'lucide-react'

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

type MergeStatus = 'idle' | 'uploading' | 'merging'

interface UploadedFile {
    id: string
    file: File
    name: string
    size: number
    pages: number
    thumb: string        // 1st‑page thumbnail <img src=...>
}

const makeId = () => crypto.randomUUID()

/** First‑page thumbnail as a data‑URL (≈ 30–70 kB) */
async function generateThumb(file: File): Promise<{ thumb: string; pages: number }> {
    const ab = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: ab }).promise
    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: 0.25 })      // small preview
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
    const thumb = canvas.toDataURL('image/png')
    return { thumb, pages: pdf.numPages }
}

/** Merge in the order received → returns Blob URL */
async function mergePdfFiles(files: File[]): Promise<string> {
    const merged = await PDFDocument.create()

    for (const f of files) {
        const src = await PDFDocument.load(await f.arrayBuffer())
        const pages = await merged.copyPages(src, src.getPageIndices())
        pages.forEach(p => merged.addPage(p))
    }
    const bytes = await merged.save()
    return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function MergePdfPage() {
    const [items, setItems] = useState<UploadedFile[]>([])
    const [status, setStatus] = useState<MergeStatus>('idle')
    const [progress, setProgress] = useState(0)
    const router = useRouter()

    /* ----------------------------- file intake ----------------------------- */

    const handleFiles = async (fileList: FileList | File[]) => {
        const pdfs = [...fileList].filter(f => f.type === 'application/pdf')
        if (!pdfs.length) return

        setStatus('uploading')
        let done = 0

        const newItems: UploadedFile[] = []
        for (const f of pdfs) {
            const { thumb, pages } = await generateThumb(f)
            newItems.push({
                id: makeId(),
                file: f,
                name: f.name,
                size: f.size,
                pages,
                thumb,
            })
            done++
            setProgress(Math.round((done / pdfs.length) * 100))
        }
        setItems(it => [...it, ...newItems])
        setStatus('idle')
        setProgress(0)
    }

    /* ----------------------------- drag & drop ----------------------------- */

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return
        const reordered = Array.from(items)
        const [moved] = reordered.splice(result.source.index, 1)
        reordered.splice(result.destination.index, 0, moved)
        setItems(reordered)
    }

    /* ------------------------------- merge --------------------------------- */

    const handleMerge = async () => {
        if (items.length < 2) return
        setStatus('merging')
        setProgress(0)

        // tiny fake progress bar so user sees movement; real work is synchronous
        const fake = setInterval(() => setProgress(p => (p >= 95 ? p : p + 5)), 120)
        const url = await mergePdfFiles(items.map(i => i.file))
        clearInterval(fake)

        // store blob‑URL in sessionStorage → hand it over to the success page
        const key = makeId()
        sessionStorage.setItem(key, url)
        router.push(`/merge-pdf/success?id=${key}`)
    }

    /* ------------------------------ render --------------------------------- */

    const totalPages = items.reduce((n, f) => n + f.pages, 0)

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Main area --------------------------------------------------------- */}
            <div className="flex-1 overflow-auto p-8">
                {/* Uploader --------------------------------------------------------- */}
                <Card
                    onDrop={e => {
                        e.preventDefault()
                        handleFiles(e.dataTransfer.files)
                    }}
                    onDragOver={e => e.preventDefault()}
                    className="border-dashed border-2 border-red-300 hover:border-red-500
                     flex flex-col items-center justify-center h-52"
                >
                    <Upload className="w-10 h-10 text-red-500 mb-3" />
                    <p className="font-medium">
                        {items.length ? 'Add more PDF files' : 'Drop PDF files here or click to browse'}
                    </p>
                    <input
                        type="file"
                        multiple
                        accept=".pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={e => e.target.files && handleFiles(e.target.files)}
                    />
                </Card>

                {/* Upload progress -------------------------------------------------- */}
                {status === 'uploading' && (
                    <div className="mt-4">
                        <Progress value={progress} />
                    </div>
                )}

                {/* Thumbnails with DnD -------------------------------------------- */}
                {!!items.length && (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="files" direction="horizontal">
                            {provided => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex gap-6 mt-8 flex-wrap"
                                >
                                    {items.map((f, i) => (
                                        <Draggable key={f.id} draggableId={f.id} index={i}>
                                            {prov => (
                                                <div
                                                    ref={prov.innerRef}
                                                    {...prov.draggableProps}
                                                    {...prov.dragHandleProps}
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
                                                        className="absolute -top-2 -right-2 bg-white rounded-full
                                       border shadow p-1 hover:bg-red-50"
                                                        onClick={() => setItems(it => it.filter(x => x.id !== f.id))}
                                                    >
                                                        <X className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </div>

            {/* Sticky sidebar ---------------------------------------------------- */}
            <aside className="w-80 border-l bg-white p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Merge PDF</h2>

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>{items.length} file(s)</CardTitle>
                        <CardDescription>{totalPages} pages total</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status === 'merging' ? (
                            <div className="text-center">
                                <Loader2 className="h-10 w-10 animate-spin text-red-500 mx-auto mb-4" />
                                <Progress value={progress} />
                                <p className="mt-2 text-sm text-gray-500">{progress}%</p>
                            </div>
                        ) : (
                            <Button
                                disabled={items.length < 2}
                                onClick={handleMerge}
                                className="w-full bg-red-600 hover:bg-red-700"
                            >
                                Merge PDF
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </aside>
        </div>
    )
}
