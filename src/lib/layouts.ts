import type { Block, BlockAlign, LayoutData, TextBlock } from './types'

export const A4_WIDTH = 794
export const A4_HEIGHT = 1123

const ALIGNS: BlockAlign[] = ['left', 'center', 'right', 'justify']

export function newId(): string {
  return crypto.randomUUID()
}

export function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return `<p>${escaped.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>')}</p>`
}

export function blockHasContent(block: Block): boolean {
  if (block.type === 'image') return block.path.trim().length > 0
  const text = block.html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&[a-z]+;/gi, ' ')
  return text.trim().length > 0
}

export function createTextBlock(html = '<p></p>', x = 80, y = 100, z = 1): TextBlock {
  return {
    id: newId(),
    type: 'text',
    x,
    y,
    w: 420,
    h: 160,
    z,
    html,
    fontSize: 16,
    align: 'left',
  }
}

function finite(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Aceita dados vindos do banco/rascunho e descarta blocos inválidos. */
export function sanitizeLayout(data: unknown): LayoutData {
  const source =
    typeof data === 'object' && data !== null ? (data as { blocks?: unknown }) : {}
  const rawBlocks = Array.isArray(source.blocks) ? source.blocks : []
  const blocks: Block[] = []
  const seen = new Set<string>()

  for (const raw of rawBlocks) {
    if (typeof raw !== 'object' || raw === null) continue
    const item = raw as Record<string, unknown>
    const id = typeof item.id === 'string' ? item.id : ''
    const type = item.type
    if (!id || seen.has(id)) continue
    if (type !== 'text' && type !== 'image') continue

    const w = clamp(finite(item.w, 200), 40, A4_WIDTH)
    const h = clamp(finite(item.h, 100), 20, A4_HEIGHT)
    const base = {
      id,
      x: clamp(finite(item.x, 0), 0, A4_WIDTH - w),
      y: clamp(finite(item.y, 0), 0, A4_HEIGHT - h),
      w,
      h,
      z: finite(item.z, blocks.length + 1),
    }

    if (type === 'text') {
      if (typeof item.html !== 'string') continue
      const align = ALIGNS.includes(item.align as BlockAlign)
        ? (item.align as BlockAlign)
        : 'left'
      blocks.push({
        ...base,
        type,
        html: item.html,
        fontSize: clamp(finite(item.fontSize, 16), 8, 72),
        align,
      })
    } else {
      if (typeof item.path !== 'string' || !item.path) continue
      blocks.push({
        ...base,
        type,
        path: item.path,
        alt: typeof item.alt === 'string' ? item.alt : '',
      })
    }
    seen.add(id)
  }

  return { version: 1, blocks }
}
