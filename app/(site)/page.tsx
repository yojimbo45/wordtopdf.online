'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Scissors,
  Archive,
  RefreshCw,
  RotateCw,
  Unlock,
  Droplets,
  Upload,
  Download,
  Shield,
  Zap,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const pdfTools = [
    {
      title: "Merge PDF",
      description: "Combine multiple PDFs into one document",
      icon: FileText,
      color: "bg-red-500",
      href: "/merge",
    },
    {
      title: "Split PDF",
      description: "Extract pages from your PDF",
      icon: Scissors,
      color: "bg-blue-500",
      href: "/split",
    },
    {
      title: "Compress PDF",
      description: "Reduce PDF file size while maintaining quality",
      icon: Archive,
      color: "bg-green-500",
      href: "/compress",
    },
    {
      title: "Convert PDF",
      description: "Convert PDF to Word, Excel, PowerPoint and more",
      icon: RefreshCw,
      color: "bg-purple-500",
      href: "/convert",
    },
    {
      title: "Rotate PDF",
      description: "Rotate pages in your PDF document",
      icon: RotateCw,
      color: "bg-orange-500",
      href: "/rotate",
    },
    {
      title: "Unlock PDF",
      description: "Remove password protection from PDF",
      icon: Unlock,
      color: "bg-yellow-500",
      href: "/unlock",
    },
    {
      title: "Watermark PDF",
      description: "Add text or image watermarks to PDF",
      icon: Droplets,
      color: "bg-cyan-500",
      href: "/watermark",
    },
    {
      title: "PDF to JPG",
      description: "Convert PDF pages to high-quality images",
      icon: Download,
      color: "bg-pink-500",
      href: "/pdf-to-jpg",
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "Your files are processed securely and deleted after 1 hour",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process your PDFs in seconds with our optimized tools",
    },
    {
      icon: Globe,
      title: "Works Everywhere",
      description: "Access from any device, anywhere. No installation required",
    },
  ]

  return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Every tool you need to work with PDFs in one place
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Merge, split, compress, convert, rotate, unlock and watermark PDFs in just a few clicks. No sign-up needed.
            </p>

            {/* Upload Area */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="border-2 border-dashed border-red-300 rounded-lg p-12 bg-white/50 hover:bg-white/70 transition-colors cursor-pointer">
                <Upload className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop your PDF here</h3>
                <p className="text-gray-600 mb-4">or click to browse</p>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">Choose PDF File</Button>
              </div>
            </div>
          </div>
        </section>

        {/* PDF Tools Grid */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Choose your PDF tool</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pdfTools.map((tool, index) => {
                const Icon = tool.icon
                return (
                    <Link href={tool.href} key={index}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                        <CardHeader className="text-center pb-4">
                          <div
                              className={`w-16 h-16 ${tool.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-900">{tool.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pt-0">
                          <CardDescription className="text-gray-600">{tool.description}</CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-red-600">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to work with your PDFs?</h2>
            <p className="text-red-100 mb-8 text-lg">Start using our free PDF tools now. No registration required.</p>
            <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Get Started Free
            </Button>
          </div>
        </section>
      </main>
  )
}
