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
  position: {
    x: number
    y: number
    z: number
  }
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
  }
}

