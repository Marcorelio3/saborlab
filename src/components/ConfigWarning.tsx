export function ConfigWarning() {
  return (
    <main className="config-screen">
      <div className="config-card">
        <p className="eyebrow">Configuração pendente</p>
        <h1>SaborLab precisa das credenciais do Supabase</h1>
        <p>
          Crie um arquivo <code>.env.local</code> na raiz do projeto com estas duas linhas
          e reinicie o servidor:
        </p>
        <pre>{`VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica`}</pre>
        <p className="muted small">
          Use apenas a chave <strong>anon public</strong>. Nunca coloque a chave
          <code> service_role</code> no frontend.
        </p>
        <p className="muted small">
          No GitHub Pages, as mesmas variáveis vêm dos segredos do repositório
          <code> VITE_SUPABASE_URL</code> e <code> VITE_SUPABASE_ANON_KEY</code>.
        </p>
      </div>
    </main>
  )
}
