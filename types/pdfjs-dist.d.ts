// types/pdfjs-dist.d.ts

declare module 'pdfjs-dist/build/pdf.mjs' {
    export * from 'pdfjs-dist/types/src/pdf';
export as namespace pdfjsLib;
}

declare module 'pdfjs-dist/build/pdf.worker.min.mjs?url' {
    const url: string;
    export default url;
}
