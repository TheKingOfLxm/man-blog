export interface Post {
  id: string
  title: string
  summary: string
  content: string
  category: string
  date: string
  tags: string[]
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
