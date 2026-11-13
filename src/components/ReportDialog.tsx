import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { errorMessage, supabase } from '../lib/supabase'

interface Props {
  targetType: 'material' | 'layout'
  targetId: string
  targetTitle: string
  onClose: () => void
}

export function ReportDialog({ targetType, targetId, targetTitle, onClose }: Props) {
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const text = reason.trim()
    if (text.length < 3) return setError('Descreva o motivo com pelo menos 3 caracteres.')
    if (text.length > 500) return setError('O motivo pode ter no máximo 500 caracteres.')

    setBusy(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        setError('Sessão expirada. Entre novamente.')
        return
      }
      const { error: insertError } = await supabase.from('reports').insert({
        target_type: targetType,
        target_id: targetId,
        reason: text,
      })
      if (insertError) {
        setError(`Não foi possível enviar a denúncia: ${errorMessage(insertError)}`)
        return
      }
      setSent(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title="Denunciar conteúdo" onClose={onClose}>
      {sent ? (
        <div className="form">
          <p className="notice">
            Denúncia enviada. O mantenedor do SaborLab vai analisar “{targetTitle}”.
          </p>
          <div className="modal-actions">
            <button className="btn btn-primary" type="button" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <p className="muted">
            Denunciando: <strong>{targetTitle}</strong>
          </p>
          <label className="field">
            <span>Motivo da denúncia</span>
            <textarea
              rows={4}
              maxLength={500}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Ex.: imagem sem autorização, conteúdo inadequado..."
              autoFocus
            />
            <span className="counter">{reason.length}/500</span>
          </label>

          {error ? <p className="error" role="alert">{error}</p> : null}

          <div className="modal-actions">
            <button className="btn btn-ghost" type="button" onClick={onClose} disabled={busy}>
              Cancelar
            </button>
            <button className="btn btn-danger" type="submit" disabled={busy}>
              {busy ? 'Enviando...' : 'Enviar denúncia'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
