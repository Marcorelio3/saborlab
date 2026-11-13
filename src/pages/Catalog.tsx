import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Link, useNavigate } from 'react-router-dom'
import { MaterialCard } from '../components/MaterialCard'
import { LayoutCard } from '../components/LayoutCard'
import { UploadDialog } from '../components/UploadDialog'
import { ReportDialog } from '../components/ReportDialog'
import { SUBJECTS } from '../lib/subjects'
import { errorMessage, supabase } from '../lib/supabase'
import { sanitizeLayout } from '../lib/layouts'
import type { Material, SavedLayout } from '../lib/types'

interface Props {
  session: Session | null
}

interface ReportTarget {
  targetType: 'material' | 'layout'
  targetId: string
  targetTitle: string
}

export function Catalog({ session }: Props) {
  const navigate = useNavigate()
  const [materials, setMaterials] = useState<Material[]>([])
  const [layouts, setLayouts] = useState<SavedLayout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('')
  const [tab, setTab] = useState<'materiais' | 'atividades'>('materiais')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [report, setReport] = useState<ReportTarget | null>(null)

  const load = useCallback(async () => {
    const [materialsResult, layoutsResult] = await Promise.all([
      supabase.from('materials').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('layouts').select('*').order('created_at', { ascending: false }).limit(200),
    ])
    if (materialsResult.error || layoutsResult.error) {
      setError(
        errorMessage(materialsResult.error ?? layoutsResult.error, 'Não foi possível carregar a biblioteca.'),
      )
    } else {
      setError('')
      setMaterials((materialsResult.data ?? []) as Material[])
      setLayouts(
        ((layoutsResult.data ?? []) as SavedLayout[]).map((layout) => ({
          ...layout,
          data: sanitizeLayout(layout.data),
        })),
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const term = query.trim().toLowerCase()

  const filteredMaterials = materials.filter((material) => {
    if (subject && material.subject !== subject) return false
    if (!term) return true
    return [material.title, material.body, material.source, material.author_name, material.subject]
      .some((value) => value?.toLowerCase().includes(term))
  })

  const filteredLayouts = layouts.filter((layout) => {
    if (subject && layout.subject !== subject) return false
    if (!term) return true
    return [layout.title, layout.author_name, layout.subject]
      .some((value) => value?.toLowerCase().includes(term))
  })

  function openUpload() {
    if (!session) {
      navigate('/login')
      return
    }
    setUploadOpen(true)
  }

  function openReport(target: ReportTarget) {
    if (!session) {
      navigate('/login')
      return
    }
    setReport(target)
  }

  async function deleteMaterial(material: Material) {
    if (!confirm(`Excluir “${material.title}” da biblioteca?`)) return
    setError('')
    if (material.image_path) {
      const { error: storageError } = await supabase.storage
        .from('materials')
        .remove([material.image_path])
      if (storageError) {
        setError(`Não foi possível remover a imagem: ${errorMessage(storageError)}`)
        return
      }
    }
    const { error: deleteError } = await supabase.from('materials').delete().eq('id', material.id)
    if (deleteError) {
      setError(`Não foi possível excluir: ${errorMessage(deleteError)}`)
      return
    }
    setMaterials((current) => current.filter((item) => item.id !== material.id))
  }

  async function deleteLayout(layout: SavedLayout) {
    if (!confirm(`Excluir a atividade “${layout.title}”?`)) return
    setError('')
    const { error: deleteError } = await supabase.from('layouts').delete().eq('id', layout.id)
    if (deleteError) {
      setError(`Não foi possível excluir: ${errorMessage(deleteError)}`)
      return
    }
    setLayouts((current) => current.filter((item) => item.id !== layout.id))
  }

  return (
    <div className="catalog">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Biblioteca colaborativa</p>
          <h1>
            Materiais prontos,<br />
            atividades para <em>imprimir</em>.
          </h1>
          <p className="hero-text">
            Textos e imagens compartilhados por professores. Monte a folha A4, ajuste os
            blocos e imprima — ou publique a sua atividade para a próxima pessoa usar.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" type="button" onClick={openUpload}>
              Enviar material
            </button>
            <Link className="btn btn-outline btn-lg" to="/editor">
              Criar atividade
            </Link>
          </div>
          <p className="hero-stats">
            <strong>{materials.length}</strong> materiais
            <span className="dot" aria-hidden="true" />
            <strong>{layouts.length}</strong> atividades
            <span className="dot" aria-hidden="true" />
            <strong>{SUBJECTS.length}</strong> matérias
          </p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-sheet">
            <span className="hero-sheet-title" />
            <span className="hero-sheet-line" />
            <span className="hero-sheet-line short" />
            <span className="hero-sheet-box" />
            <span className="hero-sheet-line" />
            <span className="hero-sheet-line short" />
          </div>
          <span className="hero-note">1 folha A4 · pronto para imprimir</span>
        </div>
      </section>

      <section className="library" aria-labelledby="library-title">
        <div className="library-head">
          <h2 id="library-title">Biblioteca</h2>
          <div className="filters">
            <label className="search-field">
              <span className="sr-only">Buscar na biblioteca</span>
              <input
                type="search"
                placeholder="Buscar por título, texto ou autor..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="subject-chips" role="group" aria-label="Filtrar por matéria">
          <button
            type="button"
            className={subject === '' ? 'subject-chip is-active' : 'subject-chip'}
            aria-pressed={subject === ''}
            onClick={() => setSubject('')}
          >
            Todas
          </button>
          {SUBJECTS.map((item) => (
            <button
              key={item}
              type="button"
              className={subject === item ? 'subject-chip is-active' : 'subject-chip'}
              aria-pressed={subject === item}
              onClick={() => setSubject(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="tabs" role="tablist" aria-label="Tipo de conteúdo">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'materiais'}
            className={tab === 'materiais' ? 'tab is-active' : 'tab'}
            onClick={() => setTab('materiais')}
          >
            Materiais <span className="tab-count">{filteredMaterials.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'atividades'}
            className={tab === 'atividades' ? 'tab is-active' : 'tab'}
            onClick={() => setTab('atividades')}
          >
            Atividades <span className="tab-count">{filteredLayouts.length}</span>
          </button>
          <div className="tabs-spacer" />
          <button className="btn btn-primary" type="button" onClick={openUpload}>
            + Enviar material
          </button>
        </div>

        {error ? <p className="error" role="alert">{error}</p> : null}

        {loading ? (
          <p className="empty-state">Carregando a biblioteca...</p>
        ) : tab === 'materiais' ? (
          filteredMaterials.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum material encontrado.</p>
              <p className="muted">
                Ajuste a busca ou <button className="link-btn" type="button" onClick={openUpload}>envie o primeiro material</button>.
              </p>
            </div>
          ) : (
            <div className="card-grid">
              {filteredMaterials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  session={session}
                  onUse={() => navigate(`/editor?add=${material.id}`)}
                  onReport={() =>
                    openReport({
                      targetType: 'material',
                      targetId: material.id,
                      targetTitle: material.title,
                    })
                  }
                  onDelete={() => void deleteMaterial(material)}
                />
              ))}
            </div>
          )
        ) : filteredLayouts.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma atividade publicada ainda.</p>
            <p className="muted">
              <Link to="/editor">Monte a primeira folha no editor</Link> e publique para a biblioteca.
            </p>
          </div>
        ) : (
          <div className="card-grid">
            {filteredLayouts.map((layout) => (
              <LayoutCard
                key={layout.id}
                layout={layout}
                session={session}
                onDuplicate={() => navigate(`/editor?layout=${layout.id}`)}
                onReport={() =>
                  openReport({
                    targetType: 'layout',
                    targetId: layout.id,
                    targetTitle: layout.title,
                  })
                }
                onDelete={() => void deleteLayout(layout)}
              />
            ))}
          </div>
        )}
      </section>

      {uploadOpen ? (
        <UploadDialog onClose={() => setUploadOpen(false)} onUploaded={() => void load()} />
      ) : null}

      {report ? (
        <ReportDialog
          targetType={report.targetType}
          targetId={report.targetId}
          targetTitle={report.targetTitle}
          onClose={() => setReport(null)}
        />
      ) : null}
    </div>
  )
}
