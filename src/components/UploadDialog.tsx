import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { SUBJECTS } from '../lib/subjects'
import { compressImage } from '../lib/compressImage'
import { errorMessage, supabase } from '../lib/supabase'
import type { MaterialKind } from '../lib/types'

interface Props {
  onClose: () => void
  onUploaded: () => void
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export function UploadDialog({ onClose, onUploaded }: Props) {
  const [kind, setKind] = useState<MaterialKind>('text')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState<string>(SUBJECTS[0])
  const [source, setSource] = useState('')
  const [author, setAuthor] = useState('')
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [rights, setRights] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (!title.trim()) return setError('Informe um título.')
    if (title.trim().length > 120) return setError('O título pode ter no máximo 120 caracteres.')
    if (!subject) return setError('Escolha a matéria.')
    if (source.trim().length < 3) return setError('Informe a fonte ou licença (mínimo 3 caracteres).')
    if (source.trim().length > 300) return setError('A fonte pode ter no máximo 300 caracteres.')
    if (author.trim().length > 80) return setError('O nome do autor pode ter no máximo 80 caracteres.')
    if (!rights) return setError('Confirme que você tem o direito de compartilhar este material.')
    if (kind === 'text') {
      if (!body.trim()) return setError('Escreva o texto do material.')
      if (body.length > 5000) return setError('O texto pode ter no máximo 5000 caracteres.')
    } else if (!file) {
      return setError('Escolha uma imagem.')
    }

    setBusy(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      if (!user) {
        setError('Sessão expirada. Entre novamente.')
        return
      }

      let imagePath: string | null = null
      if (kind === 'image' && file) {
        let blob: Blob
        try {
          blob = await compressImage(file)
        } catch {
          setError('Não foi possível ler esta imagem. Tente JPG, PNG ou WebP.')
          return
        }
        if (blob.size > MAX_IMAGE_BYTES) {
          setError('A imagem passou de 5 MB mesmo após a compressão. Use uma imagem menor.')
          return
        }
        imagePath = `${user.id}/${crypto.randomUUID()}.webp`
        const { error: uploadError } = await supabase.storage
          .from('materials')
          .upload(imagePath, blob, { contentType: 'image/webp', upsert: false })
        if (uploadError) {
          setError(`Falha no envio da imagem: ${errorMessage(uploadError)}`)
          return
        }
      }

      const { error: insertError } = await supabase.from('materials').insert({
        kind,
        title: title.trim(),
        subject,
        body: kind === 'text' ? body.trim() : null,
        image_path: imagePath,
        source: source.trim(),
        license: 'CC BY-SA 4.0',
        author_name: author.trim() || null,
        created_by: user.id,
      })

      if (insertError) {
        if (imagePath) {
          await supabase.storage.from('materials').remove([imagePath])
        }
        setError(`Não foi possível publicar: ${errorMessage(insertError)}`)
        return
      }

      onUploaded()
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title="Enviar material" onClose={onClose}>
      <form className="form" onSubmit={handleSubmit}>
        <fieldset className="segmented">
          <legend>Tipo de material</legend>
          <label>
            <input
              type="radio"
              name="kind"
              checked={kind === 'text'}
              onChange={() => setKind('text')}
            />
            Texto
          </label>
          <label>
            <input
              type="radio"
              name="kind"
              checked={kind === 'image'}
              onChange={() => setKind('image')}
            />
            Imagem
          </label>
        </fieldset>

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

        {kind === 'text' ? (
          <label className="field">
            <span>Texto do material</span>
            <textarea
              rows={6}
              value={body}
              maxLength={5000}
              onChange={(event) => setBody(event.target.value)}
            />
            <span className="counter">{body.length}/5000</span>
          </label>
        ) : (
          <label className="field">
            <span>Imagem (JPG, PNG ou WebP)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            {file ? <span className="counter">{file.name}</span> : null}
          </label>
        )}

        <label className="field">
          <span>Fonte ou licença</span>
          <input
            value={source}
            maxLength={300}
            placeholder="Ex.: Autoral, domínio público, site de origem..."
            onChange={(event) => setSource(event.target.value)}
          />
        </label>

        <label className="field">
          <span>Seu nome (opcional)</span>
          <input
            value={author}
            maxLength={80}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </label>

        <label className="check">
          <input
            type="checkbox"
            checked={rights}
            onChange={(event) => setRights(event.target.checked)}
          />
          <span>
            Declaro ter o direito de compartilhar este material e aceito publicá-lo sob
            CC BY-SA 4.0.
          </span>
        </label>

        {error ? <p className="error" role="alert">{error}</p> : null}

        <div className="modal-actions">
          <button className="btn btn-ghost" type="button" onClick={onClose} disabled={busy}>
            Cancelar
          </button>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? 'Enviando...' : 'Publicar material'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
