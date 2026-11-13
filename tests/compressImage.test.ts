import { describe, expect, it } from 'vitest'
import { targetSize } from '../src/lib/compressImage'

describe('targetSize', () => {
  it('mantém a proporção ao limitar o maior lado', () => {
    expect(targetSize(3200, 1600, 1600)).toEqual({ width: 1600, height: 800 })
    expect(targetSize(1600, 3200, 1600)).toEqual({ width: 800, height: 1600 })
  })

  it('não amplia imagens menores', () => {
    expect(targetSize(800, 600, 1600)).toEqual({ width: 800, height: 600 })
  })

  it('arredonda para pixels inteiros', () => {
    expect(targetSize(1000, 300, 700)).toEqual({ width: 700, height: 210 })
  })

  it('devolve zero para dimensões inválidas', () => {
    expect(targetSize(0, 100, 1600)).toEqual({ width: 0, height: 0 })
  })
})
