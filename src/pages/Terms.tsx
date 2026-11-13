import { Link } from 'react-router-dom'

export function Terms() {
  return (
    <article className="terms-page prose">
      <p className="eyebrow">Regras da biblioteca</p>
      <h1>Termos de uso e licenças</h1>
      <p className="muted">
        O SaborLab é uma biblioteca colaborativa de materiais escolares. Ao enviar ou
        publicar conteúdo, você concorda com as regras abaixo.
      </p>

      <h2>1. Direitos autorais</h2>
      <p>
        Você só pode enviar textos e imagens que tenha o direito de compartilhar. Isso
        inclui material autoral, obras em domínio público e materiais com licença que
        permita a redistribuição. Sempre informe a fonte ou licença no formulário de envio.
        Não envie apostilas, livros ou imagens de terceiros sem autorização.
      </p>

      <h2>2. Licença do conteúdo</h2>
      <p>
        Todo material e toda atividade publicados no SaborLab ficam disponíveis sob a
        licença <strong>Creative Commons Atribuição-CompartilhaIgual 4.0 (CC BY-SA 4.0)</strong>.
        Outras pessoas podem usar, adaptar e redistribuir o conteúdo, desde que citem a
        autoria e mantenham a mesma licença. Itens em domínio público seguem a licença
        indicada na fonte.
      </p>

      <h2>3. Proteção de crianças e dados pessoais</h2>
      <p>
        É proibido enviar fotos de alunos, imagens com rostos de crianças identificáveis,
        nomes completos de estudantes, notas, laudos ou qualquer dado pessoal de terceiros.
        Materiais escolares devem ser genéricos e não identificar pessoas. O SaborLab segue
        os princípios da LGPD: não pedimos dados além do necessário e não usamos o conteúdo
        para publicidade.
      </p>

      <h2>4. Conteúdo não permitido</h2>
      <p>
        Não publique conteúdo ilegal, ofensivo, discriminatório, violento, sexual,
        desinformação ou material que viole direitos autorais. O mantenedor pode remover
        qualquer conteúdo sem aviso prévio, especialmente após denúncia.
      </p>

      <h2>5. Denúncias</h2>
      <p>
        Qualquer pessoa com conta pode denunciar um material ou atividade pelo botão
        “Denunciar” no card. A denúncia é registrada e analisada pelo mantenedor. Se o seu
        próprio conteúdo for removido por engano, entre em contato pelo repositório do
        projeto no GitHub.
      </p>

      <h2>6. Responsabilidade</h2>
      <p>
        O conteúdo é enviado por usuários e não passa por revisão prévia. O SaborLab não
        garante a qualidade pedagógica nem a adequação de cada material à sua turma. Confira
        o conteúdo antes de imprimir e usar.
      </p>

      <h2>7. Código do projeto</h2>
      <p>
        O código-fonte do SaborLab é aberto sob a licença MIT. O conteúdo publicado pelos
        usuários é CC BY-SA 4.0, exceto itens em domínio público indicados na fonte.
      </p>

      <p className="muted small">
        Dúvidas ou pedidos de remoção? Abra uma issue no repositório do projeto no GitHub.
      </p>

      <Link className="btn btn-outline" to="/">Voltar para a biblioteca</Link>
    </article>
  )
}
