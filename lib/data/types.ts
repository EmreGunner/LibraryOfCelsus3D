export interface Book {
  id: string
  title: string
  era: string
  originalLanguage: string
  author: string
  provenance: string
  summary: string
  tags: string[]
  coverImage?: string
  corePurpose?: string
  position: {
    x: number
    y: number
    z: number
  }
  scale?: number // Optional scale for 3D models
  translations: {
    [languageCode: string]: {
      title: string
      fileUrl: string
      fileType: "pdf" | "epub" | "text"
    }
  }
  originalFile: {
    fileUrl: string
    fileType: "pdf" | "epub" | "text"
    embedUrl?: string // Archive.org embed URL
  }
}

