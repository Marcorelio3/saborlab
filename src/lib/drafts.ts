import { del, get, set } from 'idb-keyval'
import type { Block } from './types'

export interface Draft {
  blocks: Block[]
  title: string
  subject: string
  authorName: string
}

const KEY = 'saborlab:draft'

export const loadDraft = () => get<Draft>(KEY)
export const saveDraft = (draft: Draft) => set(KEY, draft)
export const clearDraft = () => del(KEY)
