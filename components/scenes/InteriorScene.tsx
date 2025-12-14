"use client"

import { Box } from "@react-three/drei"
import booksData from "@/lib/data/books.json"
import type { Book } from "@/lib/data/types"
import BookHotspot from "@/components/three/BookHotspot"

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
      {/* Floor */}
      <Box args={[20, 0.1, 20]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B7355" />
      </Box>
      
      {/* Walls */}
      <Box args={[20, 10, 0.5]} position={[0, 5, -10]}>
        <meshStandardMaterial color="#D4A574" />
      </Box>
      <Box args={[0.5, 10, 20]} position={[-10, 5, 0]}>
        <meshStandardMaterial color="#D4A574" />
      </Box>
      <Box args={[0.5, 10, 20]} position={[10, 5, 0]}>
        <meshStandardMaterial color="#D4A574" />
      </Box>
      
      {/* Simple book shelf */}
      <Box args={[8, 6, 0.3]} position={[0, 3, -9.5]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      
      {/* Interactive books - all 5 books */}
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

