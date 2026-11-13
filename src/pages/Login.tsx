import { useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Link, Navigate } from 'react-router-dom'
import { errorMessage, supabase } from '../lib/supabase'

export function Login({ session }: { session: Session | null }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (session) return <Navigate to="/" replace />

  const address = email.trim()

  function authErrorMessage(message: string, fallback: string): string {
    const lower = message.toLowerCase()
    if (lower.includes('rate limit') || lower.includes('only request this after')) {
      return 'Muitos pedidos em pouco tempo. Aguarde alguns minutos antes de tentar de novo.'
    }
    return fallback
  }

  async function sendCode(event?: FormEvent) {
    event?.preventDefault()
    setError('')
    if (!/^\S+@\S+\.\S+$/.test(address)) {
      setError('Digite um e-mail válido.')
      return
    }

    setBusy(true)
    try {
      // Sem link: o provedor de e-mail pode pré-visitar a URL e gastar o token.
      const { error: authError } = await supabase.auth.signInWithOtp({ email: address })
      if (authError) {
        setError(
          authErrorMessage(
            errorMessage(authError),
            `Não foi possível enviar o código: ${errorMessage(authError)}`,
          ),
        )
        return
      }
      setCode('')
      setStep('code')
    } finally {
      setBusy(false)
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault()
    setError('')
    const token = code.replace(/\D/g, '')
    if (token.length !== 6) {
      setError('Digite os 6 dígitos que chegaram no e-mail.')
      return
    }

    setBusy(true)
    try {
      const { error: authError } = await supabase.auth.verifyOtp({
        email: address,
        token,
        type: 'email',
      })
      if (authError) {
        setError(
          authErrorMessage(
            errorMessage(authError),
            'Código inválido ou expirado. Use o código do e-mail mais recente.',
          ),
        )
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <p className="eyebrow">Entrar no SaborLab</p>
        <h1>Um código no seu e-mail, sem senha.</h1>
        <p className="muted">
          O login é necessário para enviar materiais, publicar atividades e denunciar
          conteúdo. A biblioteca continua aberta para leitura.
        </p>

        {step === 'email' ? (
          <form className="form" onSubmit={(event) => void sendCode(event)}>
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
              {busy ? 'Enviando...' : 'Receber código de acesso'}
            </button>
          </form>
        ) : (
          <form className="form" onSubmit={(event) => void verifyCode(event)}>
            <p className="notice">
              Enviamos um código de 6 dígitos para <strong>{address}</strong>. Ele vale por
              cerca de uma hora.
            </p>

            <label className="field">
              <span>Código do e-mail</span>
              <input
                className="code-input"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            </label>

            {error ? <p className="error" role="alert">{error}</p> : null}

            <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
              {busy ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="login-secondary">
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => void sendCode()}
                disabled={busy}
              >
                Reenviar código
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  setStep('email')
                  setCode('')
                  setError('')
                }}
                disabled={busy}
              >
                Usar outro e-mail
              </button>
            </div>
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
