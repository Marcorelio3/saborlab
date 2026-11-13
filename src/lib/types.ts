export type MaterialKind = 'image' | 'text'

export interface Material {
  id: string
  kind: MaterialKind
  title: string
  subject: string
  description: string | null
  body: string | null
  image_path: string | null
  source: string
  license: string
  author_name: string | null
  created_by: string | null
  created_at: string
}

export type BlockAlign = 'left' | 'center' | 'right' | 'justify'

interface BaseBlock {
  id: string
  x: number
  y: number
  w: number
  h: number
  z: number
}

export interface TextBlock extends BaseBlock {
  type: 'text'
  html: string
  fontSize: number
  align: BlockAlign
}

export interface ImageBlock extends BaseBlock {
  type: 'image'
  path: string
  alt: string
}

export type Block = TextBlock | ImageBlock

export interface LayoutData {
  version: 1
  blocks: Block[]
}

export interface SavedLayout {
  id: string
  title: string
  subject: string
  data: LayoutData
  author_name: string | null
  created_by: string | null
  created_at: string
}
