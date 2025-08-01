'use client';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

export default function PDFViewer({ fileUrl }: { fileUrl: string }) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div className="h-[80vh] border rounded shadow">
            <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}>
                <Viewer
                    fileUrl={fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </Worker>
        </div>
    );
}
