import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isConfigured = Boolean(url && anonKey)

// Sem credenciais o app mostra a tela de configuração em main.tsx e não usa este cliente.
export const supabase = createClient(
  url ?? 'https://exemplo-nao-configurado.supabase.co',
  anonKey ?? 'chave-nao-configurada',
  {
    auth: {
      // PKCE é obrigatório com HashRouter: o token não pode viver no hash da URL.
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
    },
  },
)

export function publicImageUrl(path: string): string {
  return supabase.storage.from('materials').getPublicUrl(path).data.publicUrl
}

export function errorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) return message
  }
  return fallback
}
