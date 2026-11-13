import type { Session } from '@supabase/supabase-js'
import type { SavedLayout } from '../lib/types'

interface Props {
  layout: SavedLayout
  session: Session | null
  onDuplicate: () => void
  onReport: () => void
  onDelete: () => void
}

export function LayoutCard({ layout, session, onDuplicate, onReport, onDelete }: Props) {
  const isAuthor = Boolean(session && layout.created_by === session.user.id)
  const count = layout.data?.blocks?.length ?? 0
  const textBlocks = layout.data?.blocks?.filter((block) => block.type === 'text') ?? []
  const excerpt = textBlocks.reduce((best, block) => {
    if (block.type !== 'text') return best
    const text = block.html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    return text.length > best.length ? text : best
  }, '')

  return (
    <article className="card">
      <div className="card-preview layout-preview">
        {excerpt ? (
          <p className="text-preview">{excerpt}</p>
        ) : (
          <div className="paper-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}
        <span className="kind-tag">Atividade</span>
      </div>

      <div className="card-body">
        <div className="card-topline">
          <span className="badge">{layout.subject}</span>
          <span className="muted small">
            {count} {count === 1 ? 'bloco' : 'blocos'} · A4
          </span>
        </div>
        <h3>{layout.title}</h3>
        {layout.author_name ? (
          <p className="muted small">por {layout.author_name}</p>
        ) : (
          <p className="muted small">Sem autor informado</p>
        )}

        <div className="card-actions">
          <button className="btn btn-primary" type="button" onClick={onDuplicate}>
            Duplicar
          </button>
          <button className="btn btn-ghost" type="button" onClick={onReport}>
            Denunciar
          </button>
          {isAuthor ? (
            <button className="btn btn-danger-ghost" type="button" onClick={onDelete}>
              Excluir
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
