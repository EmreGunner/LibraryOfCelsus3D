"use client"

import booksData from "@/lib/data/books.json"
import type { Book } from "@/lib/data/types"
import BookHotspot from "@/components/three/BookHotspot"
import InteriorModel from "@/components/three/InteriorModel"

interface InteriorSceneProps {
  onBookInteract: (book: Book) => void
}

export default function InteriorScene({ onBookInteract }: InteriorSceneProps) {
  const books = booksData as Book[]

  const handleBookInteract = (bookId: string) => {
    const book = books.find((b) => b.id === bookId)
    if (book) {
      onBookInteract(book)
    }
  }

  return (
    <>
      <InteriorModel />
      {books.map((book) => (
        <BookHotspot
          key={book.id}
          bookId={book.id}
          position={[book.position.x, book.position.y, book.position.z]}
          onInteract={handleBookInteract}
        />
      ))}
    </>
  )
}


