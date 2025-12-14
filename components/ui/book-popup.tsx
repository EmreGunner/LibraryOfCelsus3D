"use client"

import { useState, useEffect } from "react"
import type { Book } from "@/lib/data/types"
import BookReader from "./book-reader"

interface BookPopupProps {
  book: Book | null
  onClose: () => void
}

export default function BookPopup({ book, onClose }: BookPopupProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("original")
  const [showReader, setShowReader] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showReader) {
          setShowReader(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [showReader, onClose])

  if (!book) return null

  const availableLanguages = [
    { code: "original", label: book.originalLanguage, file: book.originalFile },
    ...Object.entries(book.translations).map(([code, trans]) => ({
      code,
      label: code.toUpperCase(),
      file: trans,
    })),
  ]

  const currentFile = selectedLanguage === "original" 
    ? book.originalFile 
    : book.translations[selectedLanguage]

  const handleDownload = () => {
    if (currentFile) {
      const link = document.createElement("a")
      link.href = currentFile.fileUrl
      link.download = `${book.title}.${currentFile.fileType}`
      link.click()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-gray-900">{book.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="font-semibold">Era:</span> {book.era}
          </div>
          <div>
            <span className="font-semibold">Author:</span> {book.author}
          </div>
          <div>
            <span className="font-semibold">Original Language:</span> {book.originalLanguage}
          </div>
          <div>
            <span className="font-semibold">Provenance:</span> {book.provenance}
          </div>
          <div>
            <span className="font-semibold">Summary:</span>
            <p className="mt-1 text-gray-700">{book.summary}</p>
          </div>
          <div>
            <span className="font-semibold">Tags:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {book.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block font-semibold mb-2">Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download {currentFile?.fileType.toUpperCase()}
            </button>
            <button
              onClick={() => setShowReader(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Read Now
            </button>
          </div>
        </div>
      </div>
      {showReader && (
        <BookReader
          book={book}
          language={selectedLanguage}
          onClose={() => setShowReader(false)}
        />
      )}
    </div>
  )
}

