import { useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Rnd } from 'react-rnd'
import { PublishDialog } from '../components/PublishDialog'
import { clearDraft, loadDraft, saveDraft } from '../lib/drafts'
import {
  A4_HEIGHT,
  A4_WIDTH,
  blockHasContent,
  createTextBlock,
  newId,
  sanitizeLayout,
  textToHtml,
} from '../lib/layouts'
import { printPage } from '../lib/print'
import { publicImageUrl, supabase } from '../lib/supabase'
import type { Block, BlockAlign, Material, SavedLayout, TextBlock } from '../lib/types'

interface Props {
  session: Session | null
}

const ALIGN_OPTIONS: { value: BlockAlign; label: string }[] = [
  { value: 'left', label: 'Esquerda' },
  { value: 'center', label: 'Centro' },
  { value: 'right', label: 'Direita' },
  { value: 'justify', label: 'Justificar' },
]

function makeMaterialBlock(material: Material, existing: Block[], offset: number): Block {
  const z = Math.max(0, ...existing.map((block) => block.z)) + 1
  const isImage = material.kind === 'image' && Boolean(material.image_path)
  const w = isImage ? 320 : 420
  const h = isImage ? 240 : 180
  const x = Math.max(20, Math.min(80 + offset, A4_WIDTH - w - 20))
  const y = Math.max(40, Math.min(100 + offset, A4_HEIGHT - h - 20))

  if (isImage) {
    return {
      id: newId(),
      type: 'image',
      x,
      y,
      w,
      h,
      z,
      path: material.image_path as string,
      alt: material.title,
    }
  }

  return {
    id: newId(),
    type: 'text',
    x,
    y,
    w,
    h,
    z,
    html: textToHtml(material.body ?? ''),
    fontSize: 16,
    align: 'left',
  }
}

function TextBlockContent({ block, onUpdate }: { block: TextBlock; onUpdate: (html: string) => void }) {
  const editor = useEditor(
    {
      extensions: [StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] })],
      content: block.html,
      onUpdate: ({ editor: current }) => onUpdate(current.getHTML()),
      editorProps: {
        attributes: {
          class: 'tiptap',
          'aria-label': 'Conteúdo do bloco de texto',
        },
      },
    },
    [],
  )

  return (
    <EditorContent
      editor={editor}
      className="block-text"
      style={{ fontSize: block.fontSize, textAlign: block.align }}
    />
  )
}

export function Editor({ session }: Props) {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [materialQuery, setMaterialQuery] = useState('')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const cascade = useRef(0)

  useEffect(() => {
    void supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data }) => {
        if (data) setMaterials(data as Material[])
      })
  }, [])

  useEffect(() => {
    let cancelled = false

    async function start() {
      let initialBlocks: Block[] = []
      let nextTitle = ''
      let nextSubject = ''
      let nextAuthor = ''
      let selected: string | null = null

      try {
        const draft = await loadDraft()
        if (draft) {
          initialBlocks = sanitizeLayout({ blocks: draft.blocks }).blocks
          nextTitle = draft.title
          nextSubject = draft.subject
          nextAuthor = draft.authorName
        }
      } catch {
        // IndexedDB indisponível (navegação privada): segue sem rascunho.
      }

      const layoutId = params.get('layout')
      const addId = params.get('add')

      if (layoutId) {
        const { data, error: fetchError } = await supabase
          .from('layouts')
          .select('*')
          .eq('id', layoutId)
          .single()
        if (cancelled) return
        if (fetchError || !data) {
          setError('Não foi possível carregar esta atividade para duplicar.')
        } else {
          const layout = data as SavedLayout
          initialBlocks = sanitizeLayout(layout.data).blocks
          nextTitle = layout.title
          nextSubject = layout.subject
          nextAuthor = layout.author_name ?? ''
        }
      } else if (addId) {
        const { data, error: fetchError } = await supabase
          .from('materials')
          .select('*')
          .eq('id', addId)
          .single()
        if (cancelled) return
        if (fetchError || !data) {
          setError('Não foi possível carregar este material.')
        } else {
          const block = makeMaterialBlock(data as Material, initialBlocks, 0)
          initialBlocks = [...initialBlocks, block]
          selected = block.id
        }
      }

      if (cancelled) return
      setBlocks(initialBlocks)
      setTitle(nextTitle)
      setSubject(nextSubject)
      setAuthorName(nextAuthor)
      setSelectedId(selected)
      setReady(true)
      if (layoutId || addId) setParams({}, { replace: true })
    }

    void start()
    return () => {
      cancelled = true
    }
    // Executa apenas na entrada do editor; os parâmetros são lidos uma vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedBlock = blocks.find((block) => block.id === selectedId) ?? null

  const filteredMaterials = materials.filter((material) => {
    const term = materialQuery.trim().toLowerCase()
    if (!term) return true
    return [material.title, material.subject, material.body]
      .some((value) => value?.toLowerCase().includes(term))
  })

  function addBlock(block: Block) {
    setBlocks((current) => [...current, block])
    setSelectedId(block.id)
    setStatus('')
  }

  function addMaterial(material: Material) {
    const offset = (cascade.current++ % 8) * 24
    addBlock(makeMaterialBlock(material, blocks, offset))
  }

  function addTextBox() {
    const offset = (cascade.current++ % 8) * 24
    const z = Math.max(0, ...blocks.map((block) => block.z)) + 1
    addBlock(
      createTextBlock(
        '<p></p>',
        Math.min(80 + offset, A4_WIDTH - 440),
        Math.min(100 + offset, A4_HEIGHT - 180),
        z,
      ),
    )
  }

  function updateBlock(id: string, patch: Partial<Block>) {
    setBlocks((current) =>
      current.map((block) => (block.id === id ? ({ ...block, ...patch } as Block) : block)),
    )
  }

  function bringToFront() {
    if (!selectedBlock) return
    const z = Math.max(0, ...blocks.map((block) => block.z)) + 1
    updateBlock(selectedBlock.id, { z })
  }

  function removeSelected() {
    if (!selectedId) return
    setBlocks((current) => current.filter((block) => block.id !== selectedId))
    setSelectedId(null)
  }

  async function newSheet() {
    if (!confirm('Começar uma nova folha? O rascunho atual será apagado.')) return
    setBlocks([])
    setSelectedId(null)
    setTitle('')
    setSubject('')
    setAuthorName('')
    setError('')
    setStatus('Nova folha em branco.')
    try {
      await clearDraft()
    } catch {
      // Sem IndexedDB não há rascunho para limpar.
    }
  }

  async function handleSaveDraft() {
    setError('')
    setStatus('')
    try {
      await saveDraft({ blocks, title, subject, authorName })
      setStatus('Rascunho salvo neste navegador.')
    } catch {
      setError('Não foi possível salvar o rascunho neste navegador.')
    }
  }

  function openPublish() {
    setError('')
    if (!session) {
      navigate('/login')
      return
    }
    if (!blocks.some(blockHasContent)) {
      setError('Adicione pelo menos um bloco com conteúdo antes de publicar.')
      return
    }
    setPublishOpen(true)
  }

  async function handlePublished() {
    setPublishOpen(false)
    try {
      await clearDraft()
    } catch {
      // Sem IndexedDB não há rascunho para limpar.
    }
    navigate('/')
  }

  if (!ready) {
    return <p className="empty-state">Carregando a folha...</p>
  }

  return (
    <div className="editor-page">
      <div className="editor-top">
        <div>
          <h1>Editor A4</h1>
          <p className="muted small">
            Clique em um material para adicionar à folha. Arraste pelo topo do bloco e
            redimensione pelas alças.
          </p>
        </div>
        <div className="editor-actions">
          <button className="btn btn-ghost" type="button" onClick={() => void newSheet()}>
            Nova folha
          </button>
          <button className="btn btn-outline" type="button" onClick={addTextBox}>
            Adicionar texto
          </button>
          <button className="btn btn-outline" type="button" onClick={() => void printPage()}>
            Imprimir / PDF
          </button>
          <button className="btn btn-outline" type="button" onClick={() => void handleSaveDraft()}>
            Salvar rascunho
          </button>
          <button className="btn btn-primary" type="button" onClick={openPublish}>
            Publicar
          </button>
        </div>
      </div>

      {status ? <p className="notice" role="status">{status}</p> : null}
      {error ? <p className="error" role="alert">{error}</p> : null}

      <div className="selection-bar">
        {selectedBlock ? (
          <>
            <span className="selection-label">
              {selectedBlock.type === 'text' ? 'Bloco de texto' : 'Bloco de imagem'}
            </span>
            {selectedBlock.type === 'text' ? (
              <>
                <label className="inline-field">
                  <span>Tamanho</span>
                  <input
                    type="number"
                    min={8}
                    max={72}
                    value={selectedBlock.fontSize}
                    onChange={(event) =>
                      updateBlock(selectedBlock.id, {
                        fontSize: Math.min(72, Math.max(8, Number(event.target.value) || 16)),
                      })
                    }
                  />
                </label>
                <div className="align-group" role="group" aria-label="Alinhamento do texto">
                  {ALIGN_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={
                        selectedBlock.align === option.value ? 'chip is-active' : 'chip'
                      }
                      aria-pressed={selectedBlock.align === option.value}
                      onClick={() => updateBlock(selectedBlock.id, { align: option.value })}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            ) : null}
            <button className="btn btn-ghost" type="button" onClick={bringToFront}>
              Trazer para frente
            </button>
            <button className="btn btn-danger-ghost" type="button" onClick={removeSelected}>
              Excluir bloco
            </button>
          </>
        ) : (
          <span className="muted small">
            Nenhum bloco selecionado. Clique em um bloco da folha para editar.
          </span>
        )}
      </div>

      <div className="editor-shell">
        <aside className="editor-sidebar" aria-label="Materiais da biblioteca">
          <h2>Materiais</h2>
          <input
            type="search"
            placeholder="Buscar material..."
            value={materialQuery}
            onChange={(event) => setMaterialQuery(event.target.value)}
            aria-label="Buscar material"
          />
          <div className="material-list">
            {filteredMaterials.length === 0 ? (
              <p className="muted small">
                Nenhum material encontrado. Envie materiais pela Biblioteca.
              </p>
            ) : (
              filteredMaterials.map((material) => (
                <button
                  key={material.id}
                  type="button"
                  className="material-pick"
                  onClick={() => addMaterial(material)}
                >
                  <span className="material-pick-kind">
                    {material.kind === 'image' ? 'Imagem' : 'Texto'}
                  </span>
                  <span className="material-pick-title">{material.title}</span>
                  <span className="material-pick-subject">{material.subject}</span>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="canvas-area">
          <div className="a4" aria-label="Folha A4">
            {blocks.length === 0 ? (
              <div className="a4-hint">
                <p>Folha em branco</p>
                <p className="muted small">
                  Clique em um material à esquerda ou em “Adicionar texto”.
                </p>
              </div>
            ) : null}

            {blocks.map((block) => (
              <Rnd
                key={block.id}
                size={{ width: block.w, height: block.h }}
                position={{ x: block.x, y: block.y }}
                bounds="parent"
                minWidth={60}
                minHeight={40}
                dragHandleClassName="block-head"
                className={block.id === selectedId ? 'block is-selected' : 'block'}
                style={{ zIndex: block.z }}
                onDragStart={() => setSelectedId(block.id)}
                onDragStop={(_event, data) => updateBlock(block.id, { x: data.x, y: data.y })}
                onResizeStart={() => setSelectedId(block.id)}
                onResizeStop={(_event, _direction, elementRef) =>
                  updateBlock(block.id, {
                    w: elementRef.offsetWidth,
                    h: elementRef.offsetHeight,
                  })
                }
              >
                <div className="block-inner" onMouseDown={() => setSelectedId(block.id)}>
                  <div className="block-head" title="Arraste para mover o bloco">
                    <span>{block.type === 'text' ? 'Texto' : 'Imagem'}</span>
                  </div>
                  {block.type === 'image' ? (
                    <img
                      className="block-image"
                      src={publicImageUrl(block.path)}
                      alt={block.alt}
                      draggable={false}
                    />
                  ) : (
                    <TextBlockContent
                      key={block.id}
                      block={block}
                      onUpdate={(html) => updateBlock(block.id, { html })}
                    />
                  )}
                </div>
              </Rnd>
            ))}
          </div>
        </div>
      </div>

      {publishOpen ? (
        <PublishDialog
          blocks={blocks}
          defaultTitle={title}
          defaultSubject={subject}
          defaultAuthor={authorName}
          onClose={() => setPublishOpen(false)}
          onPublished={() => void handlePublished()}
        />
      ) : null}
    </div>
  )
}
