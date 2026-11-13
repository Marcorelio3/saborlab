import { useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Link, Navigate } from 'react-router-dom'
import { errorMessage, supabase } from '../lib/supabase'

export function Login({ session }: { session: Session | null }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (session) return <Navigate to="/" replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const address = email.trim()
    if (!/^\S+@\S+\.\S+$/.test(address)) {
      setError('Digite um e-mail válido.')
      return
    }

    setBusy(true)
    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}`
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: address,
        options: { emailRedirectTo: redirectTo },
      })
      if (authError) {
        setError(`Não foi possível enviar o link: ${errorMessage(authError)}`)
        return
      }
      setSent(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <p className="eyebrow">Entrar no SaborLab</p>
        <h1>Um link no seu e-mail, sem senha.</h1>
        <p className="muted">
          O login é necessário para enviar materiais, publicar atividades e denunciar
          conteúdo. A biblioteca continua aberta para leitura.
        </p>

        {sent ? (
          <div className="form">
            <p className="notice">
              Link enviado para <strong>{email}</strong>. Abra o e-mail e clique no link
              para entrar. Ele expira em cerca de uma hora.
            </p>
            <button className="btn btn-ghost" type="button" onClick={() => setSent(false)}>
              Usar outro e-mail
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Seu e-mail</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="professor@escola.com"
                autoComplete="email"
                autoFocus
              />
            </label>

            {error ? <p className="error" role="alert">{error}</p> : null}

            <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
              {busy ? 'Enviando...' : 'Receber link de acesso'}
            </button>
          </form>
        )}

        <p className="muted small">
          Ao entrar, você concorda com os{' '}
          <Link to="/termos">termos de uso e licenças</Link>.
        </p>
      </div>
    </section>
  )
}
