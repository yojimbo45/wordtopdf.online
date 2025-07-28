'use client'

import { useState, useCallback } from 'react'
import {
    Upload,
    FileText,
    AlertCircle,
    Loader2,
    CheckCircle,
    Download,
    X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type CompressStatus = 'idle' | 'uploading' | 'compressing' | 'completed' | 'error'

export default function CompressPDFPage() {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<CompressStatus>('idle')
    const [progress, setProgress] = useState(0)
    const [compressedSize, setCompressedSize] = useState(0)

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selected = e.target.files[0]
            if (selected.type !== 'application/pdf') {
                setStatus('error')
                return
            }
            setFile(selected)
            simulateUpload()
        }
    }, [])

    const simulateUpload = () => {
        setStatus('uploading')
        let progress = 0
        const interval = setInterval(() => {
            progress += 10
            setProgress(progress)
            if (progress >= 100) {
                clearInterval(interval)
                setStatus('idle')
                setProgress(0)
            }
        }, 100)
    }

    const compressPDF = () => {
        if (!file) return
        setStatus('compressing')
        setProgress(0)
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setStatus('completed')
                    // Simulate a 40–70% reduction
                    const ratio = Math.random() * 0.3 + 0.4
                    setCompressedSize(Math.floor(file.size * ratio))
                    return 100
                }
                return prev + 10
            })
        }, 150)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    const reset = () => {
        setFile(null)
        setStatus('idle')
        setProgress(0)
        setCompressedSize(0)
    }

    const downloadCompressed = () => {
        const link = document.createElement('a')
        link.href = '/placeholder.pdf'
        link.download = `compressed-${file?.name || 'file'}.pdf`
        link.click()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8 px-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Compress PDF</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Reduce the file size of your PDF while maintaining quality.
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="border-2 border-dashed border-red-300 bg-white rounded-lg p-8">
                            <Upload className="h-12 w-12 mx-auto mb-4 text-red-500" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {file ? 'Replace PDF file' : 'Select PDF to compress-pdf'}
                            </h3>
                            <p className="text-gray-600 mb-4">Upload a single PDF file</p>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileInput}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload">
                                <Button className="bg-red-600 hover:bg-red-700">Choose PDF File</Button>
                            </label>
                        </div>

                        {status === 'uploading' && (
                            <div className="mt-4">
                                <div className="flex justify-between mb-1 text-sm text-gray-600">
                                    <span>Uploading...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} />
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                <span className="text-red-700">Only PDF files are allowed.</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {file && status === 'idle' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{file.name}</CardTitle>
                            <CardDescription>Original size: {formatFileSize(file.size)}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button onClick={compressPDF} className="bg-red-600 hover:bg-red-700 px-6 py-2 text-white text-lg">
                                Compress PDF
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {status === 'compressing' && (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Loader2 className="h-10 w-10 text-red-500 mx-auto animate-spin mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Compressing PDF...</h3>
                            <p className="text-gray-600 mb-4">This may take a few seconds</p>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} />
                        </CardContent>
                    </Card>
                )}

                {status === 'completed' && (
                    <Card>
                        <CardHeader className="text-center">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <CardTitle className="text-2xl text-green-700">PDF Compressed</CardTitle>
                            <CardDescription>
                                Reduced from {formatFileSize(file!.size)} to {formatFileSize(compressedSize)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium text-gray-900">compressed-{file?.name}</p>
                                <p className="text-sm text-gray-600">Size: {formatFileSize(compressedSize)}</p>
                            </div>
                            <div className="flex gap-4 justify-center">
                                <Button onClick={downloadCompressed} className="bg-green-600 hover:bg-green-700">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Compressed PDF
                                </Button>
                                <Button variant="outline" onClick={reset}>
                                    <X className="h-4 w-4 mr-2" />
                                    Compress Another PDF
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
