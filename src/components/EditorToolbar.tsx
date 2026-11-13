// Hooks para botões de formatação
export function useFormatButton(
  editor: any,
  type: 'bold' | 'italic' | 'underline' | ' strikethrough',
) {
  const isActive = editor?.isActive(type)
  const toggle = () => editor?.command(type, () => true)

  return { isActive, toggle }
}

export function useAlignmentButton(
  editor: any,
  align: 'left' | 'center' | 'right' | 'justify',
) {
  const isActive = editor?.alignment?.type === align
  const toggle = () => editor?.setAlignment(align)

  return { isActive, toggle }
}

// Lista de blocos disponíveis na toolbar
export const AVAILABLE_FORMATS = [
  { type: 'bold' as const, label: 'Negrito', shortcut: 'Ctrl+B' },
  { type: 'italic' as const, label: 'Itálico', shortcut: 'Ctrl+I' },
  { type: 'underline' as const, label: 'Sublinhado', shortcut: 'Ctrl+U' },
  { type: ' strikethrough' as const, label: 'Tachado', shortcut: 'Ctrl+Shift+X' },
] as const