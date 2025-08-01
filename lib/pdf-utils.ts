import { PDFDocument } from 'pdf-lib';
import type { SortOption } from '@/components/SortDropdown';

/* -------------------------------------------------------- *
 * Types
 * -------------------------------------------------------- */
export type MergeStatus = 'idle' | 'uploading' | 'merging' | 'done' | 'error';

export interface UploadedFile {
    id: string;
    file: File;
    name: string;
    lastModified: number;
    size: number;
    pages: number;
    thumb: string;
}

/* -------------------------------------------------------- *
 * Helpers
 * -------------------------------------------------------- */
export const makeId = () => crypto.randomUUID();

/** Sort utility used by UploadPanel */
export const sortItems = (
    arr: UploadedFile[],
    opt: SortOption,
): UploadedFile[] => {
    const items = [...arr]; // never mutate original
    switch (opt) {
        case 'name-asc':
            return items.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return items.sort((a, b) => b.name.localeCompare(a.name));
        case 'date-asc':
            return items.sort((a, b) => a.lastModified - b.lastModified);
        case 'date-desc':
            return items.sort((a, b) => b.lastModified - a.lastModified);
        case 'size-asc':
            return items.sort((a, b) => a.size - b.size);
        case 'size-desc':
            return items.sort((a, b) => b.size - a.size);
        default:
            return items;
    }
};

/** Generate a thumbnail for the first page of a PDF */
export async function loadPdfThumbnail(file: File): Promise<UploadedFile> {
    const [{ getDocument, GlobalWorkerOptions }] = await Promise.all([
        import('pdfjs-dist/build/pdf.mjs'),
    ]);

    GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
    ).toString();

    /* Parse the PDF and render page #1 at 25 % scale */
    const pdf = await getDocument({ data: await file.arrayBuffer() }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.25 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page
        .render({
            canvasContext: canvas.getContext('2d')!,
            viewport,
            canvas, // <‑‑ NEW: satisfies latest pdf‑js type definition
        })
        .promise;

    return {
        id: makeId(),
        file,
        name: file.name,
        lastModified: file.lastModified,
        size: file.size,
        pages: pdf.numPages,
        thumb: canvas.toDataURL('image/png'),
    };
}

/** Merge many PDFs into a single blob URL */
export async function mergePdfs(files: File[]): Promise<string> {
    const merged = await PDFDocument.create();

    for (const f of files) {
        const src = await PDFDocument.load(await f.arrayBuffer());
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach(p => merged.addPage(p));
    }

    const bytes = await merged.save();
    return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
}
