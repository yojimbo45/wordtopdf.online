"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DndContext, useDroppable } from '@dnd-kit/core'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'

export default function UploadPage() {
  const router = useRouter()

  // Store original & cleaned images as base64
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [cleanedImage, setCleanedImage] = useState<string | null>(null)

  // DnDKit setup
  const { setNodeRef } = useDroppable({ id: 'upload-drop-zone' })

  // Handle file drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  // Handle file input (click-based)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  // Convert file to base64, then call the API
  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      setOriginalImage(base64)

      // Call /api/remove-watermark
      try {
        const res = await fetch('/api/remove-watermark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageData: base64 }),
        })
        const data = await res.json()
        if (data.success && data.cleanedImage) {
          setCleanedImage(data.cleanedImage)
        }
      } catch (error) {
        console.error('Error removing watermark:', error)
      }
    }
    reader.readAsDataURL(file)
  }

  // Go back to homepage
  const handleGoBack = () => {
    router.push('/')
  }

  return (
    <main className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Upload Your Image</h1>

      {/* Drag-and-drop area */}
      <div className="w-full max-w-md mb-4">
        <DndContext>
          <div
            ref={setNodeRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-4 border-dashed border-gray-300 rounded-lg p-8
                       text-center flex flex-col items-center justify-center
                       cursor-pointer hover:border-gray-400 transition-colors"
            style={{ minHeight: '150px' }}
          >
            <p className="text-gray-500 mb-2">Drag and drop an image here</p>
            <p className="text-sm text-gray-400">or select below</p>
          </div>
        </DndContext>
      </div>

      {/* File input (click-based) */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-6"
      />

      {/* Show comparison slider if we have both original and cleaned */}
      {originalImage && cleanedImage && (
        <div className="w-full max-w-2xl mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Comparison</h2>
          <ReactCompareSlider
            position={0.5} // Start in the middle
            itemOne={
              <ReactCompareSliderImage
                src={originalImage}
                alt="Original with Watermark"
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={cleanedImage}
                alt="Cleaned (No Watermark)"
              />
            }
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </div>
      )}

      {/* Go Back button */}
      <button
        onClick={handleGoBack}
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Go Back
      </button>
    </main>
  )
}
