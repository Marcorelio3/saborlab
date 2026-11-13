import type { Session } from '@supabase/supabase-js'
import type { Material } from '../lib/types'
import { publicImageUrl } from '../lib/supabase'

interface Props {
  material: Material
  session: Session | null
  onUse: () => void
  onReport: () => void
  onDelete: () => void
}

export function MaterialCard({ material, session, onUse, onReport, onDelete }: Props) {
  const isAuthor = Boolean(session && material.created_by === session.user.id)

  return (
    <article className="card">
      <div className="card-preview">
        {material.kind === 'image' && material.image_path ? (
          <img src={publicImageUrl(material.image_path)} alt={material.title} loading="lazy" />
        ) : (
          <p className="text-preview">{material.body}</p>
        )}
        <span className="kind-tag">{material.kind === 'image' ? 'Imagem' : 'Texto'}</span>
      </div>

      <div className="card-body">
        <div className="card-topline">
          <span className="badge">{material.subject}</span>
          <span className="muted small">{material.license}</span>
        </div>
        <h3>{material.title}</h3>
        <p className="source-line">Fonte: {material.source}</p>
        {material.author_name ? (
          <p className="muted small">por {material.author_name}</p>
        ) : null}

        <div className="card-actions">
          <button className="btn btn-primary" type="button" onClick={onUse}>
            Usar no editor
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
