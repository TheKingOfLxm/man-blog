export interface Post {
  id: string
  title: string
  summary: string
  content: string
  category: string
  date: string
  tags: string[]
  featured?: boolean
  readingTime?: number
  wordCount?: number
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  demo?: string
  source?: string
}

export interface Epigraph {
  label: string
  stanzas: string[]
  attribution: string
}

export interface Site {
  name: string
  kicker: string
  volume: string
  topics: string[]
  author: string
  epigraph: Epigraph
  social: {
    github: string
    email: string
  }
}
