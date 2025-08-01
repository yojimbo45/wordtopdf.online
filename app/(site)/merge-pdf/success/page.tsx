'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Success() {
    const params = useSearchParams();
    const router = useRouter();
    const id = params.get('id') ?? '';
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        const blobUrl = sessionStorage.getItem(id);
        setUrl(blobUrl);
        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
            sessionStorage.removeItem(id);
        };
    }, [id]);

    if (!url) return null;

    return (
        <section className="min-h-screen flex flex-col items-center justify-center">
            <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">PDFs have been merged!</h1>
            <p className="mb-6 text-gray-600">Download your document below.</p>

            <a href={url} download="merged.pdf">
                <Button className="bg-green-600 hover:bg-green-700">
                    <Download className="w-5 h-5 mr-2" />
                    Download merged PDF
                </Button>
            </a>

            <Button
                variant="link"
                className="mt-8"
                onClick={() => router.push('/merge-pdf')}
            >
                Merge another file
            </Button>
        </section>
    );
}
