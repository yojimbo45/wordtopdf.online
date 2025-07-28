"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { DndContext, useDroppable } from '@dnd-kit/core'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'

export default function LandingPageClient() {
  const router = useRouter()

  // Setup droppable area
  const { setNodeRef } = useDroppable({ id: 'landing-drop-zone' })

  // Handle drop (for demonstration)
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    // If a user actually drags in a file, we can route them to /upload
    router.push('/upload')
  }

  // Required to allow dropping
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  // If user clicks on the area
  const handleClick = () => {
    router.push('/upload')
  }

  return (
    <main className="min-h-screen p-6 flex flex-col items-center">
      {/* Title / Hero Section */}
      <section className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Remove Watermark from Photos</h1>
        <p className="text-lg text-gray-600">
          Quickly remove watermarks online with AI.
        </p>
      </section>

      {/* Drag and Drop / Click Section */}
      <section className="w-full max-w-md mb-12">
        <DndContext>
          <div
            ref={setNodeRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}
            className="border-4 border-dashed border-gray-300 rounded-lg p-8
                       text-center flex flex-col items-center justify-center
                       cursor-pointer hover:border-gray-400 transition-colors"
            style={{ minHeight: '200px' }}
          >
            <p className="text-gray-500 mb-2">
              Drag and drop an image here
            </p>
            <p className="text-sm text-gray-400">
              or click to upload
            </p>
          </div>
        </DndContext>
      </section>

      {/* Optional: Example Image Comparison Slider (centered at 50%) */}
      <section className="w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Example Comparison
        </h2>
        <ReactCompareSlider
          position={0.5}
          itemOne={
            <ReactCompareSliderImage
              src="/images/image-watermark.png"
              alt="Image with Watermark"
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src="/images/image-no-watermark.png"
              alt="Image without Watermark"
            />
          }
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
          }}
        />
      </section>
    </main>
  )
}
