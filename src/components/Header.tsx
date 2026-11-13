import type { Session } from '@supabase/supabase-js'
import { Link, NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function Header({ session }: { session: Session | null }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="SaborLab — início">
          <span className="brand-mark" aria-hidden="true">SL</span>
          <span>Sabor<span className="brand-accent">Lab</span></span>
        </Link>

        <nav className="main-nav" aria-label="Navegação principal">
          <NavLink to="/" end>Biblioteca</NavLink>
          <NavLink to="/editor">Editor</NavLink>
          <NavLink to="/termos">Termos</NavLink>
        </nav>

        <div className="auth-area">
          {session ? (
            <>
              <span className="user-email" title={session.user.email}>
                {session.user.email}
              </span>
              <button className="btn btn-ghost" type="button" onClick={() => supabase.auth.signOut()}>
                Sair
              </button>
            </>
          ) : (
            <Link className="btn btn-primary" to="/login">Entrar</Link>
          )}
        </div>
      </div>
    </header>
  )
}
