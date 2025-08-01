// /lib/generateThumb.ts
export async function generateThumb(file: File): Promise<{ thumb: string; pages: number }> {
    const pdfjs = await import('pdfjs-dist');

    // @ts-ignore — type declarations missing, but this works fine
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

    const ab = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: ab }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.25 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    return {
        thumb: canvas.toDataURL('image/png'),
        pages: pdf.numPages,
    };
}
