import { describe, expect, it } from 'vitest'
import { A4_HEIGHT, A4_WIDTH, sanitizeLayout } from '../src/lib/layouts'

const validText = {
  id: 'texto-1',
  type: 'text',
  x: 40,
  y: 60,
  w: 300,
  h: 120,
  z: 1,
  html: '<p>Olá</p>',
  fontSize: 18,
  align: 'center',
}

const validImage = {
  id: 'imagem-1',
  type: 'image',
  x: 100,
  y: 200,
  w: 320,
  h: 240,
  z: 2,
  path: 'uid/foto.webp',
  alt: 'Foto',
}

describe('sanitizeLayout', () => {
  it('mantém blocos válidos', () => {
    const result = sanitizeLayout({ version: 1, blocks: [validText, validImage] })
    expect(result.version).toBe(1)
    expect(result.blocks).toHaveLength(2)
    expect(result.blocks[0]).toMatchObject({ id: 'texto-1', type: 'text', html: '<p>Olá</p>' })
    expect(result.blocks[1]).toMatchObject({ id: 'imagem-1', type: 'image', path: 'uid/foto.webp' })
  })

  it('descarta blocos inválidos e ids repetidos', () => {
    const result = sanitizeLayout({
      blocks: [
        null,
        'texto solto',
        { ...validText, id: '' },
        { ...validText, type: 'video' },
        { ...validText, id: 'sem-html', html: undefined },
        { ...validImage, id: 'sem-caminho', path: '' },
        validText,
        { ...validImage, id: 'texto-1' },
      ],
    })
    expect(result.blocks).toHaveLength(1)
    expect(result.blocks[0].id).toBe('texto-1')
  })

  it('limita posição e tamanho à folha A4', () => {
    const result = sanitizeLayout({
      blocks: [{ ...validText, x: -50, y: 5000, w: 900, h: 2000 }],
    })
    const block = result.blocks[0]
    expect(block.x).toBe(0)
    expect(block.y).toBe(A4_HEIGHT - block.h)
    expect(block.w).toBe(A4_WIDTH)
    expect(block.h).toBe(A4_HEIGHT)
  })

  it('aceita entrada vazia ou inválida', () => {
    expect(sanitizeLayout(null).blocks).toEqual([])
    expect(sanitizeLayout({}).blocks).toEqual([])
    expect(sanitizeLayout('nada').blocks).toEqual([])
  })
})
