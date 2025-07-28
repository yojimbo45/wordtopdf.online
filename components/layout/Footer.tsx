'use client'

import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <FileText className="h-6 w-6 text-red-500" />
                            <span className="text-xl font-bold">PDFTools</span>
                        </div>
                        <p className="text-gray-400">The complete solution for all your PDF needs. Fast, secure, and free.</p>
                    </div>

                    {[
                        {
                            title: 'PDF Tools',
                            links: [
                                { href: '/merge-pdf', label: 'Merge PDF' },
                                { href: '/split-pdf', label: 'Split PDF' },
                                { href: '/compress-pdf', label: 'Compress PDF' },
                                { href: '/convert', label: 'Convert PDF' },
                            ],
                        },
                        {
                            title: 'More Tools',
                            links: [
                                { href: '/rotate', label: 'Rotate PDF' },
                                { href: '/unlock', label: 'Unlock PDF' },
                                { href: '/watermark', label: 'Watermark PDF' },
                                { href: '/pdf-to-jpg', label: 'PDF to JPG' },
                            ],
                        },
                        {
                            title: 'Support',
                            links: [
                                { href: '/help', label: 'Help Center' },
                                { href: '/contact', label: 'Contact Us' },
                                { href: '/privacy', label: 'Privacy Policy' },
                                { href: '/terms', label: 'Terms of Service' },
                            ],
                        },
                    ].map((section, i) => (
                        <div key={i}>
                            <h4 className="font-semibold mb-4">{section.title}</h4>
                            <ul className="space-y-2 text-gray-400">
                                {section.links.map(link => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="hover:text-white">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} PDFTools. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
