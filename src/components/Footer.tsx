import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          <strong>SaborLab</strong> — materiais de professores para professores.
        </p>
        <p className="muted small">
          Código MIT · Conteúdo CC BY-SA 4.0 ·{' '}
          <Link to="/termos">Denuncie conteúdo</Link>
        </p>
      </div>
    </footer>
  )
}
