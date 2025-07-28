'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FileText, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const convertToPDF = [
    { label: 'JPG to PDF', icon: '/assets/tools/jpgtopdf.svg', href: '/jpg-to-pdf' },
    { label: 'WORD to PDF', icon: '/icons/word.png', href: '/word-to-pdf' },
    { label: 'POWERPOINT to PDF', icon: '/icons/ppt.png', href: '/powerpoint-to-pdf' },
    { label: 'EXCEL to PDF', icon: '/icons/excel.png', href: '/excel-to-pdf' },
    { label: 'HTML to PDF', icon: '/icons/html.png', href: '/html-to-pdf' },
]

const convertFromPDF = [
    { label: 'PDF to JPG', icon: '/icons/jpg.png', href: '/pdf-to-jpg' },
    { label: 'PDF to WORD', icon: '/icons/word.png', href: '/pdf-to-word' },
    { label: 'PDF to POWERPOINT', icon: '/icons/ppt.png', href: '/pdf-to-powerpoint' },
    { label: 'PDF to EXCEL', icon: '/icons/excel.png', href: '/pdf-to-excel' },
    { label: 'PDF to PDF/A', icon: '/icons/pdfa.png', href: '/pdf-to-pdfa' },
]

const toolSections = [
    {
        title: 'Organize PDF',
        items: [
            { label: 'Merge PDF', icon: '/icons/merge-pdf.png', href: '/merge-pdf' },
            { label: 'Split PDF', icon: '/icons/split-pdf.png', href: '/split-pdf' },
            { label: 'Remove pages', icon: '/icons/remove.png', href: '/remove-pages' },
            { label: 'Extract pages', icon: '/icons/extract.png', href: '/extract-pages' },
            { label: 'Organize PDF', icon: '/icons/organize.png', href: '/organize' },
            { label: 'Scan to PDF', icon: '/icons/scan.png', href: '/scan-to-pdf' },
        ],
    },
    {
        title: 'Optimize PDF',
        items: [
            { label: 'Compress PDF', icon: '/icons/compress-pdf.png', href: '/compress-pdf' },
            { label: 'Repair PDF', icon: '/icons/repair.png', href: '/repair' },
            { label: 'OCR PDF', icon: '/icons/ocr.png', href: '/ocr' },
        ],
    },
    {
        title: 'Convert to PDF',
        items: convertToPDF,
    },
    {
        title: 'Convert from PDF',
        items: convertFromPDF,
    },
    {
        title: 'Edit PDF',
        items: [
            { label: 'Rotate PDF', icon: '/icons/rotate.png', href: '/rotate' },
            { label: 'Add page numbers', icon: '/icons/pagenumbers.png', href: '/add-page-numbers' },
            { label: 'Add watermark', icon: '/icons/watermark.png', href: '/add-watermark' },
            { label: 'Crop PDF', icon: '/icons/crop.png', href: '/crop' },
            { label: 'Edit PDF', icon: '/icons/edit.png', href: '/edit' },
        ],
    },
    {
        title: 'PDF Security',
        items: [
            { label: 'Unlock PDF', icon: '/icons/unlock.png', href: '/unlock' },
            { label: 'Protect PDF', icon: '/icons/lock.png', href: '/protect' },
            { label: 'Sign PDF', icon: '/icons/sign.png', href: '/sign' },
            { label: 'Redact PDF', icon: '/icons/redact.png', href: '/redact' },
            { label: 'Compare PDF', icon: '/icons/compare.png', href: '/compare' },
        ],
    },
]

export default function Header() {
    const convertRef = useRef<HTMLDivElement>(null)
    const allRef = useRef<HTMLDivElement>(null)
    const [openMenu, setOpenMenu] = useState<'convert' | 'all' | null>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                convertRef.current &&
                !convertRef.current.contains(e.target as Node) &&
                allRef.current &&
                !allRef.current.contains(e.target as Node)
            ) {
                setOpenMenu(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <FileText className="h-8 w-8 text-red-600" />
                        <span className="text-2xl font-bold text-gray-900">PDFTools</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        {['Merge PDF', 'Split PDF', 'Compress PDF'].map((label) => (
                            <Link
                                key={label}
                                href={`/${label.toLowerCase().replace(/ /g, '-')}`}
                                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                            >
                                {label}
                            </Link>
                        ))}

                        {/* Convert Dropdown */}
                        <div
                            ref={convertRef}
                            className="relative"
                            onMouseEnter={() => setOpenMenu('convert')}
                            onMouseLeave={() => setOpenMenu(null)}
                        >
                            <button className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium">
                                <span>Convert PDF</span>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                        openMenu === 'convert' ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            {openMenu === 'convert' && (
                                <div className="absolute top-10 right-0 z-50 w-[600px] bg-white border border-gray-200 shadow-lg p-6 rounded-xl grid grid-cols-2 gap-6 text-sm">
                                    {[{ title: 'Convert to PDF', items: convertToPDF }, { title: 'Convert from PDF', items: convertFromPDF }].map(
                                        (section) => (
                                            <div key={section.title}>
                                                <h4 className="font-semibold text-gray-700 mb-3">{section.title}</h4>
                                                <ul className="space-y-3">
                                                    {section.items.map(({ label, icon, href }) => (
                                                        <li key={label}>
                                                            <Link
                                                                href={href}
                                                                className="flex items-center space-x-3 text-gray-800 hover:text-red-600"
                                                            >
                                                                <Image src={icon} alt={label} width={20} height={20} />
                                                                <span>{label}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* All Tools Dropdown */}
                        <div
                            ref={allRef}
                            className="relative"
                            onMouseEnter={() => setOpenMenu('all')}
                            onMouseLeave={() => setOpenMenu(null)}
                        >
                            <button className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium">
                                <span>All PDF tools</span>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                        openMenu === 'all' ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            {openMenu === 'all' && (
                                <div className="absolute top-10 right-0 z-50 w-[1150px] bg-white border border-gray-200 shadow-lg p-6 rounded-xl grid grid-cols-6 gap-6 text-sm">
                                    {toolSections.map((section) => (
                                        <div key={section.title}>
                                            <h4 className="font-semibold text-gray-700 mb-3">{section.title}</h4>
                                            <ul className="space-y-3">
                                                {section.items.map(({ label, icon, href }) => (
                                                    <li key={label}>
                                                        <Link
                                                            href={href}
                                                            className="flex items-center space-x-3 text-gray-800 hover:text-red-600"
                                                        >
                                                            <Image src={icon} alt={label} width={20} height={20} />
                                                            <span>{label}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}
