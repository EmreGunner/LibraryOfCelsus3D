"use client"

import { useState, useEffect } from "react"
import type { Book } from "@/lib/data/types"

interface BookReaderProps {
  book: Book | null
  language: string
  onClose: () => void
}

export default function BookReader({ book, language, onClose }: BookReaderProps) {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  useEffect(() => {
    if (!book) return

    const currentFile = language === "original" 
      ? book.originalFile 
      : book.translations[language]

    if (!currentFile) {
      setError("File not available")
      setLoading(false)
      return
    }

    // For text files, fetch and display
    if (currentFile.fileType === "text") {
      fetch(currentFile.fileUrl)
        .then((res) => res.text())
        .then((text) => {
          setContent(text)
          setLoading(false)
        })
        .catch((err) => {
          setError("Failed to load text file")
          setLoading(false)
        })
    } else {
      // For PDF/EPUB, show placeholder (would need pdf.js or epub.js)
      setContent(`This book is available as ${currentFile.fileType.toUpperCase()}. Please download to read.`)
      setLoading(false)
    }
  }, [book, language])

  if (!book) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50">
      <div className="bg-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">{book.title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl px-4"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-white p-6">
        {loading && (
          <div className="text-center py-20">
            <div className="text-lg">Loading...</div>
          </div>
        )}
        {error && (
          <div className="text-center py-20 text-red-600">
            <div className="text-lg">{error}</div>
          </div>
        )}
        {!loading && !error && (
          <div className="max-w-4xl mx-auto">
            <pre className="whitespace-pre-wrap font-serif text-base leading-relaxed">
              {content}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

