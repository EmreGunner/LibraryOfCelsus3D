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

    // Check if it's an Archive.org embed
    if (currentFile.embedUrl || (currentFile.fileUrl && currentFile.fileUrl.includes("archive.org"))) {
      setLoading(false)
      return // Will render iframe
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

  const currentFile = language === "original" 
    ? book.originalFile 
    : book.translations[language]

  const embedUrl = currentFile?.embedUrl || 
    (currentFile?.fileUrl?.includes("archive.org") 
      ? currentFile.fileUrl.replace("/details/", "/embed/")
      : null)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col z-50">
      <div className="bg-gradient-to-r from-amber-900 to-amber-700 p-4 flex justify-between items-center shadow-lg">
        <h2 className="text-xl font-bold text-white">{book.title}</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-3xl px-4 font-bold"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-hidden bg-gray-100">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-lg">Loading...</div>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full text-red-600">
            <div className="text-lg">{error}</div>
          </div>
        )}
        {!loading && !error && embedUrl && (
          <div className="w-full h-full">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              className="border-0"
              allow="fullscreen"
            />
          </div>
        )}
        {!loading && !error && !embedUrl && (
          <div className="max-w-4xl mx-auto p-6 h-full overflow-y-auto">
            <pre className="whitespace-pre-wrap font-serif text-base leading-relaxed bg-white p-6 rounded shadow">
              {content}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
