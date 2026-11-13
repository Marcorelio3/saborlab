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

  return (
    <article className="card">
      <div className="card-preview layout-preview">
        <div className="paper-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="layout-count">
          {count} {count === 1 ? 'bloco' : 'blocos'} na folha A4
        </p>
        <span className="kind-tag">Atividade</span>
      </div>

      <div className="card-body">
        <div className="card-topline">
          <span className="badge">{layout.subject}</span>
          <span className="muted small">A4</span>
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
