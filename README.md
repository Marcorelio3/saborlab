# SaborLab

Biblioteca colaborativa de materiais escolares com editor de atividades em folha A4.
Professores podem usar textos e imagens prontos, montar a folha, imprimir/salvar em PDF
e publicar a atividade para outras pessoas reutilizarem.

- Site: `https://<usuario>.github.io/saborlab/`
- Idioma: português do Brasil
- Leitura pública, sem login. Enviar, publicar e denunciar exigem entrar com um código enviado por e-mail.

## Stack

- Vite + React + TypeScript
- Supabase (Postgres, Storage e Auth por código de 6 dígitos enviado por e-mail, fluxo PKCE)
- `react-rnd` para os blocos da folha A4, TipTap para o texto
- `idb-keyval` para o rascunho local (IndexedDB)
- CSS puro (um único arquivo), sem Tailwind
- Testes com Vitest

## Rodar localmente

```bash
npm install
cp .env.example .env.local
# edite .env.local com a URL e a chave anon do seu projeto Supabase
npm run dev
```

O `npm run dev` abre em `http://localhost:5173`.

```bash
npm test          # testes unitários
npm test -- --run # uma execução única
npm run build     # build de produção em dist/
```

Sem as variáveis de ambiente, o site mostra uma tela de configuração em vez de quebrar.

## Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, cole e execute o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
   Opcional: execute também [`supabase/seed.sql`](supabase/seed.sql) para começar com
   20 materiais e 8 atividades. Os exemplos ficam vinculados à conta que entrou por
   último no site (rode o seed depois do primeiro login).
3. Em **Authentication → URL Configuration** (opcional, só para links de e-mail):
   - **Site URL**: `https://<usuario>.github.io/saborlab/`
   - **Additional Redirect URLs**: `http://localhost:5173/` e o endereço do GitHub Pages
     (os dois com barra no final).
4. Em **Project Settings → API**, copie:
   - **Project URL**
   - **anon public key** (ou **publishable key**)
5. Em **Authentication → Emails → Templates → Magic Link**, troque o corpo para exibir o
   código de 6 dígitos (o login do app usa o código, não o link):
   ```html
   <h2>Código de acesso ao SaborLab</h2>
   <p>Use este código para entrar. Ele expira em 1 hora.</p>
   <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">{{ .Token }}</p>
   <p>Se você não pediu este código, ignore este e-mail.</p>
   ```

Nunca coloque a chave `service_role` no frontend. A chave `anon` é pública por design;
as políticas de RLS protegem os dados.

## Deploy no GitHub Pages

O deploy roda por GitHub Actions em cada push na `main` (`.github/workflows/deploy.yml`).

1. Crie um repositório público chamado `saborlab`.
2. Configure os segredos do repositório:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL` (mesmo valor da URL)
   - `SUPABASE_ANON_KEY` (mesmo valor da chave anon)
3. Em **Settings → Pages**, escolha **Source: GitHub Actions**.
4. Faça push na `main` e acompanhe o workflow.

O `base: './'` e o `HashRouter` permitem que o site funcione na subpasta `/saborlab/`
sem configuração extra.

## Keep-alive

O plano grátis do Supabase pausa o projeto após cerca de 7 dias sem uso. O workflow
`.github/workflows/keepalive.yml` consulta a API semanalmente (segunda, 06:00 UTC) e
também pode ser disparado manualmente em **Actions → Keep Supabase alive → Run workflow**.

## Moderação

Não há painel de administração no site. A publicação é imediata e a remoção é feita no
painel do Supabase, que usa a chave `service_role` e ignora as políticas de RLS.

Denúncias abertas:

```sql
select * from reports where not resolved order by created_at desc;
```

Para remover um conteúdo:

1. Encontre o item denunciado em `materials` ou `layouts`.
2. Se for material com `image_path`, apague também o arquivo no bucket `materials`
   (caminho `materials/<image_path>`).
3. Apague a linha em `materials`/`layouts`.
4. Marque a denúncia como resolvida:

```sql
update reports set resolved = true where target_id = '<id-do-item>';
```

O `seed.sql` vincula os exemplos à conta que entrou por último no site, então eles
aparecem com o botão "Excluir" para esse usuário. Se precisar trocar o dono, rode:

```sql
update materials set created_by = '<uuid-do-novo-dono>' where author_name = 'Equipe SaborLab';
update layouts   set created_by = '<uuid-do-novo-dono>' where author_name = 'Equipe SaborLab';
```

## Limites conhecidos

- Uma folha A4 por atividade.
- Sem zoom no editor (a folha rola em telas pequenas).
- Atividade publicada não é editada no site: duplique e publique uma nova versão.
- Fotos de alunos e rostos de crianças são proibidos pelos termos.
- O SMTP embutido do Supabase tem limite baixo de e-mails por hora. Para uso real, configure
  SMTP próprio em **Authentication → Emails → SMTP Settings** (Gmail com senha de app ou Brevo).
- Se um material com imagem for excluído, a imagem quebra nas atividades que a usam.
- Rascunho fica só neste navegador (IndexedDB), não na conta.

## Licenças

- Código: [MIT](LICENSE).
- Conteúdo publicado pelos usuários: CC BY-SA 4.0, exceto itens em domínio público
  indicados na fonte.

Ao enviar um material, o usuário declara ter o direito de compartilhá-lo e aceita a
licença CC BY-SA 4.0.
