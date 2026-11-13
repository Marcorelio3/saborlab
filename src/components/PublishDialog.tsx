import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { SUBJECTS } from '../lib/subjects'
import { blockHasContent } from '../lib/layouts'
import { errorMessage, supabase } from '../lib/supabase'
import type { Block } from '../lib/types'

interface Props {
  blocks: Block[]
  defaultTitle: string
  defaultSubject: string
  defaultAuthor: string
  onClose: () => void
  onPublished: () => void
}

export function PublishDialog({
  blocks,
  defaultTitle,
  defaultSubject,
  defaultAuthor,
  onClose,
  onPublished,
}: Props) {
  const [title, setTitle] = useState(defaultTitle)
  const [subject, setSubject] = useState<string>(
    (SUBJECTS as readonly string[]).includes(defaultSubject) ? defaultSubject : SUBJECTS[0],
  )
  const [author, setAuthor] = useState(defaultAuthor)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (!title.trim()) return setError('Dê um título para a atividade.')
    if (title.trim().length > 120) return setError('O título pode ter no máximo 120 caracteres.')
    if (!subject) return setError('Escolha a matéria.')
    if (author.trim().length > 80) return setError('O nome do autor pode ter no máximo 80 caracteres.')
    if (!blocks.some(blockHasContent)) return setError('Adicione pelo menos um bloco com conteúdo.')

    setBusy(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      if (!user) {
        setError('Sessão expirada. Entre novamente.')
        return
      }

      const { error: insertError } = await supabase.from('layouts').insert({
        title: title.trim(),
        subject,
        data: { version: 1, blocks },
        author_name: author.trim() || null,
        created_by: user.id,
      })
      if (insertError) {
        setError(`Não foi possível publicar: ${errorMessage(insertError)}`)
        return
      }
      onPublished()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title="Publicar atividade" onClose={onClose}>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Título</span>
          <input
            value={title}
            maxLength={120}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
          />
        </label>

        <label className="field">
          <span>Matéria</span>
          <select value={subject} onChange={(event) => setSubject(event.target.value)}>
            {SUBJECTS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Seu nome (opcional)</span>
          <input
            value={author}
            maxLength={80}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </label>

        <p className="muted small">
          A atividade será publicada na biblioteca sob CC BY-SA 4.0. Para mudar depois,
          duplique e publique uma nova versão.
        </p>

        {error ? <p className="error" role="alert">{error}</p> : null}

        <div className="modal-actions">
          <button className="btn btn-ghost" type="button" onClick={onClose} disabled={busy}>
            Cancelar
          </button>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
