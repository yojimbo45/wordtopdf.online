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

type SplitStatus = 'idle' | 'uploading' | 'splitting' | 'completed' | 'error'

export default function SplitPDFPage() {
    const [file, setFile] = useState<File | null>(null)
    const [pages, setPages] = useState<number>(0)
    const [status, setStatus] = useState<SplitStatus>('idle')
    const [progress, setProgress] = useState(0)
    const [splitFiles, setSplitFiles] = useState<string[]>([])

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selected = e.target.files[0]
            if (selected.type !== 'application/pdf') {
                setStatus('error')
                return
            }
            setFile(selected)
            setPages(Math.floor(Math.random() * 10) + 2) // simulate 2–12 pages
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

    const splitPDF = () => {
        if (!file) return
        setStatus('splitting')
        setProgress(0)
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setStatus('completed')
                    setSplitFiles(Array.from({ length: pages }, (_, i) => `page-${i + 1}.pdf`))
                    return 100
                }
                return prev + 10
            })
        }, 150)
    }

    const reset = () => {
        setFile(null)
        setStatus('idle')
        setProgress(0)
        setSplitFiles([])
        setPages(0)
    }

    const downloadPage = (name: string) => {
        const link = document.createElement('a')
        link.href = '/placeholder.pdf'
        link.download = name
        link.click()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8 px-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Split PDF</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Upload a PDF and split each page into a separate document.
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="border-2 border-dashed border-red-300 bg-white rounded-lg p-8">
                            <Upload className="h-12 w-12 mx-auto mb-4 text-red-500" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {file ? 'Replace PDF file' : 'Select PDF to split-pdf'}
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
                            <CardDescription>{pages} pages detected</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button onClick={splitPDF} className="bg-red-600 hover:bg-red-700 px-6 py-2 text-white text-lg">
                                Split PDF into {pages} pages
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {status === 'splitting' && (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Loader2 className="h-10 w-10 text-red-500 mx-auto animate-spin mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Splitting PDF...</h3>
                            <p className="text-gray-600 mb-4">Please wait while we split your document</p>
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
                            <CardTitle className="text-2xl text-green-700">PDF Split Completed</CardTitle>
                            <CardDescription>{splitFiles.length} individual files are ready to download.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {splitFiles.map((name) => (
                                <div
                                    key={name}
                                    className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded border hover:bg-gray-100"
                                >
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <FileText className="h-5 w-5 text-red-500" />
                                        <span>{name}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => downloadPage(name)}>
                                        <Download className="h-4 w-4 mr-1" />
                                        Download
                                    </Button>
                                </div>
                            ))}
                            <div className="pt-4 text-center">
                                <Button variant="outline" onClick={reset}>
                                    <X className="h-4 w-4 mr-2" />
                                    Split another PDF
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
