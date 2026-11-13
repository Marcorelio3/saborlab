-- SaborLab — conteúdo inicial da biblioteca
-- Rode este arquivo uma vez no SQL Editor do Supabase, depois de aplicar o schema.
-- Os exemplos ficam vinculados à conta que entrou por último no site.

do $seed_owner$
begin
  if not exists (select 1 from auth.users) then
    raise exception 'Entre no site ao menos uma vez antes de rodar o seed.';
  end if;
end;
$seed_owner$;

drop table if exists pg_temp.seed_owner;
create temp table seed_owner as
  select id from auth.users order by last_sign_in_at desc nulls last limit 1;

-- Remove os três exemplos antigos sem dono, se existirem, para não duplicar.
delete from public.materials
 where created_by is null
   and title in ('Equações do 1º grau — lista inicial',
                 'Trecho para leitura — Machado de Assis',
                 'Linha do tempo — Independência do Brasil');

insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('196ab511-ab21-43d8-917b-fa0399388e96', 'text', 'Equações do 1º grau — lista inicial', 'Matemática', 'Resolva: 1) x + 5 = 12. 2) 3x = 21. 3) 2x - 4 = 10. 4) x/2 + 3 = 8. 5) 5x + 2 = 3x + 10.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('e8b0d5b9-75ba-43f5-b196-3ba7c51acc91', 'text', 'Frações equivalentes — exercícios', 'Matemática', 'Complete as frações equivalentes e simplifique quando possível.

1) 1/2 = ___/4 = ___/8
2) 2/3 = ___/6 = ___/9
3) 3/4 = ___/8 = ___/12
4) 6/8 = ___/4
5) 9/12 = ___/4
6) Compare usando < ou >: 1/2 ___ 1/3; 2/5 ___ 3/7.
7) Uma pizza tem 8 fatias. Ana comeu 2 e Bia comeu 4. Que fração da pizza as duas comeram juntas? Simplifique.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('c6226e76-123f-46cb-b389-dbbea944bb14', 'text', 'Problemas com as quatro operações', 'Matemática', '1) Uma escola comprou 8 caixas com 24 lápis cada. Quantos lápis foram comprados?
2) Um livro tem 186 páginas. Lia já leu 79. Quantas páginas faltam?
3) Uma feira recebeu 1.250 maçãs e vendeu 875. Quantas sobraram?
4) Um ônibus leva 42 passageiros. Quantos passageiros levam 6 ônibus iguais?
5) 144 figurinhas serão divididas igualmente entre 12 crianças. Quantas cada uma recebe?
6) Escreva um problema que possa ser resolvido com a conta 320 ÷ 8.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('d968bc92-738f-4cb4-ab32-5d71d285c5ca', 'text', 'Perímetro e área de retângulos', 'Matemática', 'Perímetro é a soma de todos os lados. Área do retângulo = base × altura.

1) Retângulo de 8 cm por 5 cm: calcule o perímetro e a área.
2) Quadrado de 7 cm de lado: calcule o perímetro e a área.
3) Uma sala mede 6 m por 4 m. Quantos metros de rodapé são necessários para contorná-la?
4) Um terreno retangular tem 12 m de frente e 25 m de profundidade. Qual é a sua área?
5) A área de um retângulo é 48 cm² e a base mede 8 cm. Qual é a altura?', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('dd77e7bf-918b-40c8-be53-b8515038b219', 'text', 'Trecho para leitura — Machado de Assis', 'Português', 'Algum tempo hesitei se devia abrir estas memórias pelo princípio ou pelo fim, isto é, se poria em primeiro lugar o meu nascimento ou a minha morte. Suposto o uso vulgar seja começar pelo nascimento, duas considerações me levaram a adotar diferente método: a primeira é que eu não sou propriamente um autor defunto, mas um defunto autor.', 'Domínio público — Machado de Assis, Memórias Póstumas de Brás Cubas (1881)', 'Domínio público', 'Equipe SaborLab', (select id from seed_owner)),
('88cb0d32-410e-4854-80c2-fb9cac96e7ab', 'text', 'Ortografia — quando usar S ou SS', 'Português', 'Use SS entre vogais, quando o som é de S forte: passo, missa, osso. Também em palavras terminadas em -ssão, -ssor e -ssivo: pressão, professor, progressivo.

Use S no início da palavra ou depois de consoante: sapato, curso. E nos substantivos terminados em -são derivados de verbos com -nder, -ndir, -verter e -pelir: compreensão, expansão, inversão.

Complete com S ou SS: pa__o, mi__a, pro__e__or, a__ado, progre__o, compre__ão, cur__o, cla__e, deci__ão, expre__ão.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('6d9ace57-83f4-4963-aeea-25506c3bfb4c', 'text', 'Produção de texto — carta para um amigo', 'Português', 'Escreva uma carta para um amigo contando sobre um livro que você leu.

Estrutura:
1) Local e data.
2) Saudação inicial.
3) Primeiro parágrafo: por que você está escrevendo.
4) Segundo parágrafo: o que acontece na história e por que vale a pena ler.
5) Despedida e assinatura.

Use linguagem informal, parágrafos curtos e pelo menos uma pergunta direta ao seu amigo.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('2780a9da-d739-4f2e-9def-fd9ef238134c', 'text', 'Linha do tempo — Independência do Brasil', 'História', '1822: proclamação da Independência. 1824: primeira Constituição. 1888: abolição da escravatura. 1889: Proclamação da República. Organize os acontecimentos em ordem cronológica e escreva uma frase sobre cada um.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('79760ad2-777f-4488-9820-d083b8fe4bba', 'text', 'Grandes navegações — resumo e perguntas', 'História', 'Entre os séculos XV e XVI, portugueses e espanhóis atravessaram o Atlântico em busca de novas rotas comerciais para as Índias. As viagens foram financiadas por reis e comerciantes e dependeram de instrumentos como a bússola, o astrolábio e as caravelas.

Perguntas:
1) Por que os europeus buscavam novas rotas para o Oriente?
2) Que instrumentos ajudavam os navegadores a se orientar?
3) Qual foi a consequência das viagens para os povos que já viviam na América?
4) Explique, com suas palavras, o que foi o Tratado de Tordesilhas.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('d63c4db3-8957-4fe1-b290-fd1d592f1fdd', 'text', 'Grécia Antiga — democracia e cidadania', 'História', 'A democracia ateniense nasceu no século V a.C. Apenas homens adultos, livres e filhos de pais atenienses podiam participar da Assembleia. Mulheres, escravizados e estrangeiros ficavam de fora.

Perguntas:
1) Quem participava da democracia em Atenas?
2) Quem era excluído da vida política?
3) Compare a democracia ateniense com a democracia atual.
4) Por que podemos dizer que a democracia ateniense era limitada?', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('448553b2-3bbb-4be4-88b9-81f20783a99c', 'text', 'Ciclo da água — texto e questões', 'Geografia', 'A água circula continuamente entre a superfície, a atmosfera e os seres vivos. O calor do sol evapora a água de rios, lagos e mares. O vapor sobe, esfria e se condensa, formando nuvens. Quando as gotas ficam pesadas, ocorre a precipitação: chuva, neve ou granizo. Parte da água penetra no solo e abastece os lençóis freáticos.

Questões:
1) Explique com suas palavras o que é evaporação.
2) O que precisa acontecer para que a chuva caia?
3) Por que a água dos rios não acaba?
4) Cite duas atitudes para economizar água.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('7ef51961-8dec-41bc-b433-bc3d7223c17a', 'text', 'Regiões do Brasil — atividade de localização', 'Geografia', 'O Brasil é dividido em cinco regiões: Norte, Nordeste, Centro-Oeste, Sudeste e Sul.

Atividades:
1) Escreva o nome das cinco regiões.
2) Em qual região fica o estado onde você mora?
3) Cite dois estados de cada região.
4) Qual é a maior região em extensão territorial? E a mais populosa?
5) Explique uma diferença cultural entre duas regiões brasileiras.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('50160b30-594e-486c-88af-2a81678dc02e', 'text', 'Célula — partes e funções', 'Ciências', 'A célula é a menor unidade viva dos organismos.

Principais partes:
- Membrana plasmática: controla o que entra e o que sai da célula.
- Citoplasma: onde ocorrem muitas reações químicas.
- Núcleo: guarda o material genético.
- Mitocôndrias: produzem energia para a célula.
- Cloroplastos (nas plantas): realizam a fotossíntese.

Questões:
1) Qual parte da célula guarda o material genético?
2) Que organela produz energia?
3) Qual é a diferença entre células animais e vegetais?
4) Por que dizemos que a célula é a unidade viva dos organismos?', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('1f2ea719-274c-4681-aee1-7d9e6fce7c08', 'text', 'Estados físicos da matéria', 'Ciências', 'A matéria pode se apresentar em três estados físicos principais: sólido, líquido e gasoso.

Mudanças de estado:
- Fusão: sólido para líquido (gelo derretendo).
- Vaporização: líquido para gasoso (água fervendo).
- Condensação: gasoso para líquido (nuvens).
- Solidificação: líquido para sólido (água no congelador).

Questões:
1) Dê um exemplo de fusão e um de condensação.
2) O que acontece com as partículas quando a água é aquecida?
3) Por que o gelo flutua na água?
4) Classifique: vapor de água, gelo, suco, pedra.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('e62e2596-9f7a-4a1c-8e95-da0e5dd604d6', 'text', 'Cadeia alimentar — exemplos', 'Ciências', 'A cadeia alimentar mostra como a energia passa de um ser vivo para outro.

Produtores: plantas e algas, que produzem seu próprio alimento.
Consumidores primários: herbívoros.
Consumidores secundários e terciários: carnívoros e onívoros.
Decompositores: fungos e bactérias, que reciclam a matéria.

Exemplo: capim → gafanhoto → sapo → cobra → gavião.

Questões:
1) Monte uma cadeia alimentar com quatro seres vivos.
2) O que acontece com a população de sapos se a de gafanhotos diminuir?
3) Por que os decompositores são importantes?
4) O ser humano pode ocupar mais de um nível na cadeia? Explique.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('c4f62fc1-a32f-48e2-b5ce-62702ecb3d83', 'text', 'Verb to be — exercícios', 'Inglês', 'Complete com am, is ou are.

1) I ___ a student.
2) She ___ my teacher.
3) They ___ from Brazil.
4) He ___ ten years old.
5) We ___ in the classroom.
6) It ___ a blue pencil.
7) You ___ my friend.

Passe para a forma negativa:
8) I am tired. →
9) He is at school. →

Responda em inglês:
10) How are you today?', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('e14c6520-7237-4a4d-a9dc-b4c43ccc7fd4', 'text', 'Colors and numbers — vocabulário', 'Inglês', 'Colors: blue (azul), red (vermelho), yellow (amarelo), green (verde), orange (laranja), purple (roxo), black (preto), white (branco).

Numbers: one, two, three, four, five, six, seven, eight, nine, ten.

Activities:
1) Complete: one, ___, three, ___, five, ___, seven, ___, nine, ___.
2) Escreva em inglês a cor do céu, da grama e do sol.
3) Quantos lápis há na sua mesa? Responda em inglês.
4) Desenhe e legende três objetos usando uma cor e um número.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('6fe36de0-7135-4850-86d7-68adb5fdc8a1', 'text', 'Cores primárias e secundárias', 'Artes', 'As cores primárias não podem ser obtidas pela mistura de outras cores: azul, amarelo e vermelho.

As cores secundárias são formadas pela mistura de duas primárias: verde (azul + amarelo), laranja (amarelo + vermelho) e violeta (vermelho + azul).

Atividades:
1) Pinte três círculos com as cores primárias e escreva o nome de cada uma.
2) Misture as cores e descubra as três secundárias.
3) Escolha uma obra ou objeto do seu dia a dia e liste as cores que aparecem nele.
4) Crie uma paleta com uma cor quente e uma cor fria e explique sua escolha.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('d488b838-a910-46be-8a72-e15016af40b8', 'text', 'Elementos da linguagem visual — linha e forma', 'Artes', 'Linha, forma, cor, textura e espaço são elementos da linguagem visual.

A linha pode ser reta, curva, tracejada, grossa ou fina. Ela conduz o olhar e cria contornos. A forma pode ser geométrica (círculo, quadrado, triângulo) ou orgânica (como as formas da natureza).

Atividades:
1) Desenhe uma paisagem usando apenas linhas.
2) Divida uma folha em quatro partes e crie: formas geométricas, formas orgânicas, linhas curvas e linhas retas.
3) Observe a sala de aula e encontre três formas geométricas.
4) Explique a diferença entre forma geométrica e forma orgânica.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),
('e79a12dd-09a7-40e0-aeea-77cfd7077a94', 'text', 'Rotina de estudos — planejamento semanal', 'Outros', 'Um bom plano de estudos distribui as matérias ao longo da semana e reserva pausas.

Monte sua rotina:
1) Liste as matérias que você estuda.
2) Defina dois horários de estudo por dia, com duração de 30 a 45 minutos.
3) Escolha um dia para revisar o que aprendeu.
4) Reserve um tempo livre no fim de semana.
5) Anote uma meta para a semana.

Dica: estude em um lugar tranquilo, sem celular por perto, e faça pausas curtas entre os blocos.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner))
on conflict (id) do nothing;

insert into public.layouts (id, title, subject, data, author_name, created_by) values
('733f188d-9298-4a1c-a4af-91b4cfc7f0d1', 'Frações equivalentes — lista de exercícios', 'Matemática', '{"version":1,"blocks":[{"id":"51ea2299-931b-4837-899e-314d573aabda","type":"text","x":56,"y":44,"w":682,"h":64,"z":1,"html":"<p><strong>Frações equivalentes — lista de exercícios</strong></p>","fontSize":22,"align":"left"},{"id":"1e4d4bed-5985-48e7-943f-5553e1149e80","type":"text","x":56,"y":116,"w":682,"h":28,"z":2,"html":"<p>Matemática · Folha A4 · Nome: ______________________________  Data: ____/____/______</p>","fontSize":11,"align":"left"},{"id":"8935f2f3-a19a-4a2a-bf33-c655cfe58ca7","type":"text","x":56,"y":164,"w":682,"h":64,"z":3,"html":"<p><em>Complete as frações para que fiquem equivalentes. Simplifique quando possível e mostre o cálculo.</em></p>","fontSize":13,"align":"left"},{"id":"29d0d38a-e047-43aa-85b2-0aee4cd5a017","type":"text","x":56,"y":248,"w":682,"h":770,"z":4,"html":"<p><strong>1.</strong> 1/2 = ___/4 = ___/8 = ___/16</p>\n<p><strong>2.</strong> 2/3 = ___/6 = ___/9 = ___/12</p>\n<p><strong>3.</strong> 3/4 = ___/8 = ___/12 = ___/16</p>\n<p><strong>4.</strong> 5/10 = ___/2 = ___/20</p>\n<p><strong>5.</strong> Simplifique: a) 6/8  b) 9/12  c) 10/15  d) 14/21</p>\n<p><strong>6.</strong> Compare usando &lt; ou &gt;: a) 1/2 ___ 1/3  b) 2/5 ___ 3/7  c) 4/8 ___ 1/2</p>\n<p><strong>7.</strong> Uma pizza foi dividida em 8 fatias iguais. Ana comeu 2 fatias e Bia comeu 4. Que fração da pizza as duas comeram juntas? Simplifique o resultado.</p>\n<p><strong>8.</strong> Desafio: encontre duas frações equivalentes a 3/5 com denominador maior que 20.</p>\n<p><br></p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>","fontSize":14,"align":"left"},{"id":"5e778187-8bfc-4659-b55b-6ee7def5cf14","type":"text","x":56,"y":1050,"w":682,"h":24,"z":5,"html":"<p>SaborLab — biblioteca colaborativa de materiais escolares. Uso livre com atribuição (CC BY-SA 4.0).</p>","fontSize":9,"align":"left"}]}'::jsonb, 'Equipe SaborLab', (select id from seed_owner)),
('2adfa9f6-d366-4baf-8113-b598f8a3feb8', 'Interpretação de texto — O leão e o rato', 'Português', '{"version":1,"blocks":[{"id":"937ad2ba-ac3b-4574-b222-29a2787bd93c","type":"text","x":56,"y":44,"w":682,"h":64,"z":1,"html":"<p><strong>Interpretação de texto — O leão e o rato</strong></p>","fontSize":22,"align":"left"},{"id":"6d0e4dc2-b8e6-4e09-9543-dc4bd618bc89","type":"text","x":56,"y":116,"w":682,"h":28,"z":2,"html":"<p>Português · Folha A4 · Nome: ______________________________  Data: ____/____/______</p>","fontSize":11,"align":"left"},{"id":"edd4f546-19c1-44f4-a39e-91c2085ddb89","type":"text","x":56,"y":164,"w":682,"h":64,"z":3,"html":"<p><em>Leia a fábula com atenção e responda às perguntas em frases completas.</em></p>","fontSize":13,"align":"left"},{"id":"f2e8964f-5743-48cd-89da-cf78ea80e12b","type":"text","x":56,"y":248,"w":682,"h":770,"z":4,"html":"<p>Um leão dormia quando um rato passou correndo sobre seu focinho. O leão acordou, prendeu o ratinho com a pata e abriu a boca para engoli-lo.</p>\n<p>— Perdoe-me, senhor leão — pediu o rato. — Se me deixar ir, um dia poderei retribuir o favor.</p>\n<p>O leão riu da ideia de que um animal tão pequeno pudesse ajudá-lo, mas soltou o rato.</p>\n<p>Dias depois, o leão caiu numa rede de caçadores. O rato ouviu os rugidos, correu até lá e roeu as cordas até libertá-lo.</p>\n<p>— Você riu de mim — disse o rato —, mas agora vê que um pequeno também pode ajudar um grande.</p>\n<p><br></p>\n<p><strong>1.</strong> Quem são os personagens da história?</p>\n<p><strong>2.</strong> Por que o rato pediu perdão ao leão?</p>\n<p><strong>3.</strong> O que o leão fez depois de ouvir o pedido? Por quê?</p>\n<p><strong>4.</strong> Como o rato conseguiu ajudar o leão?</p>\n<p><strong>5.</strong> Qual é a moral da fábula? Explique com suas palavras.</p>","fontSize":14,"align":"left"},{"id":"fba7fd5c-ec91-4722-a8ae-b2ef7bbc7850","type":"text","x":56,"y":1050,"w":682,"h":24,"z":5,"html":"<p>SaborLab — biblioteca colaborativa de materiais escolares. Uso livre com atribuição (CC BY-SA 4.0).</p>","fontSize":9,"align":"left"}]}'::jsonb, 'Equipe SaborLab', (select id from seed_owner)),
('fb31a113-cc67-4f62-92eb-b5da0c82afc8', 'Ortografia — S ou SS', 'Português', '{"version":1,"blocks":[{"id":"cff03e68-d789-4641-8d03-12aafb54c22a","type":"text","x":56,"y":44,"w":682,"h":64,"z":1,"html":"<p><strong>Ortografia — S ou SS</strong></p>","fontSize":22,"align":"left"},{"id":"7d05458a-fe98-4a89-8b0d-03b7b3237e76","type":"text","x":56,"y":116,"w":682,"h":28,"z":2,"html":"<p>Português · Folha A4 · Nome: ______________________________  Data: ____/____/______</p>","fontSize":11,"align":"left"},{"id":"6c33f912-8ec1-451c-804e-47942c1f317a","type":"text","x":56,"y":164,"w":682,"h":64,"z":3,"html":"<p><em>Complete as palavras e depois escreva duas frases usando três das palavras estudadas.</em></p>","fontSize":13,"align":"left"},{"id":"374a6c4c-cf07-4ab5-9cc1-7ecf480ef187","type":"text","x":56,"y":248,"w":682,"h":770,"z":4,"html":"<p><strong>1.</strong> Complete com S ou SS:</p>\n<p>pa____o &nbsp;&nbsp; mi____a &nbsp;&nbsp; pro____e____or &nbsp;&nbsp; a____ado &nbsp;&nbsp; progre____o</p>\n<p>compre____ão &nbsp;&nbsp; cur____o &nbsp;&nbsp; cla____e &nbsp;&nbsp; deci____ão &nbsp;&nbsp; expre____ão</p>\n<p><br></p>\n<p><strong>2.</strong> Marque a alternativa correta:</p>\n<p>a) ( ) professora  ( ) profesora</p>\n<p>b) ( ) compreensão  ( ) compreenção</p>\n<p>c) ( ) acessado  ( ) acesado</p>\n<p><br></p>\n<p><strong>3.</strong> Corrija as palavras destacadas:</p>\n<p>\"A preção do pneu estava baixa. O profesôr explicou a lição com paciência.\"</p>\n<p><br></p>\n<p><strong>4.</strong> Escreva duas frases usando palavras com S e SS.</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>","fontSize":14,"align":"left"},{"id":"3fac107a-66ca-4d18-b05b-793171a8f340","type":"text","x":56,"y":1050,"w":682,"h":24,"z":5,"html":"<p>SaborLab — biblioteca colaborativa de materiais escolares. Uso livre com atribuição (CC BY-SA 4.0).</p>","fontSize":9,"align":"left"}]}'::jsonb, 'Equipe SaborLab', (select id from seed_owner)),
('95f5c957-d6c0-44f2-b7e6-8e82f6113e5f', 'Estados físicos da água — revisão', 'Ciências', '{"version":1,"blocks":[{"id":"702c2774-e437-4ebe-9ae9-1ae9a058d1bc","type":"text","x":56,"y":44,"w":682,"h":64,"z":1,"html":"<p><strong>Estados físicos da água — revisão</strong></p>","fontSize":22,"align":"left"},{"id":"d7bc9fbe-7317-41dc-b7be-879db7bfda72","type":"text","x":56,"y":116,"w":682,"h":28,"z":2,"html":"<p>Ciências · Folha A4 · Nome: ______________________________  Data: ____/____/______</p>","fontSize":11,"align":"left"},{"id":"251adf07-61f1-456f-bbe4-437152d8868d","type":"text","x":56,"y":164,"w":682,"h":64,"z":3,"html":"<p><em>Responda às questões e complete o quadro das mudanças de estado.</em></p>","fontSize":13,"align":"left"},{"id":"3f0f6872-7419-4114-82f8-ee08faf3acc1","type":"text","x":56,"y":248,"w":682,"h":770,"z":4,"html":"<p><strong>1.</strong> Escreva o nome dos três estados físicos da água.</p>\n<p>_______________________________ &nbsp;&nbsp; _______________________________ &nbsp;&nbsp; _______________________________</p>\n<p><strong>2.</strong> Complete o quadro:</p>\n<p>Gelo → água líquida: ______________________ (fusão / condensação)</p>\n<p>Água líquida → vapor: ______________________ (solidificação / vaporização)</p>\n<p>Vapor → gotas de água: ______________________ (condensação / fusão)</p>\n<p><br></p>\n<p><strong>3.</strong> Dê um exemplo de cada mudança de estado no dia a dia.</p>\n<p>Fusão: _______________________________________________</p>\n<p>Vaporização: __________________________________________</p>\n<p>Condensação: _________________________________________</p>\n<p><br></p>\n<p><strong>4.</strong> Por que a roupa seca no varal, mesmo sem ferver?</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p><br></p>\n<p><strong>5.</strong> Desenhe ou descreva o ciclo da água usando as palavras: evaporação, nuvem, chuva e rio.</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>","fontSize":14,"align":"left"},{"id":"03486378-c745-41a0-bebc-9ba2400371c6","type":"text","x":56,"y":1050,"w":682,"h":24,"z":5,"html":"<p>SaborLab — biblioteca colaborativa de materiais escolares. Uso livre com atribuição (CC BY-SA 4.0).</p>","fontSize":9,"align":"left"}]}'::jsonb, 'Equipe SaborLab', (select id from seed_owner)),
('d8da7b61-6ea9-4ea4-9721-d873fa5136c6', 'Linha do tempo — Brasil colônia', 'História', '{"version":1,"blocks":[{"id":"4358a28d-ecdf-48c8-b7e6-393439d13f44","type":"text","x":56,"y":44,"w":682,"h":64,"z":1,"html":"<p><strong>Linha do tempo — Brasil colônia</strong></p>","fontSize":22,"align":"left"},{"id":"8d9719a5-b20d-4155-b50f-69753b0b2def","type":"text","x":56,"y":116,"w":682,"h":28,"z":2,"html":"<p>História · Folha A4 · Nome: ______________________________  Data: ____/____/______</p>","fontSize":11,"align":"left"},{"id":"31c0e287-450d-4737-a688-7fd9122b529a","type":"text","x":56,"y":164,"w":682,"h":64,"z":3,"html":"<p><em>Ordene os acontecimentos do mais antigo ao mais recente e escreva uma frase explicando cada um.</em></p>","fontSize":13,"align":"left"},{"id":"864c42a1-0be0-4841-9357-5c7adb4698ab","type":"text","x":56,"y":248,"w":682,"h":770,"z":4,"html":"<p><strong>Acontecimentos:</strong></p>\n<p>Proclamação da República · Chegada dos portugueses · Abolição da escravatura · Independência do Brasil · Primeira Constituição</p>\n<p><br></p>\n<p><strong>1.</strong> Complete a linha do tempo:</p>\n<p>1500 — _______________________________________________</p>\n<p>1822 — _______________________________________________</p>\n<p>1824 — _______________________________________________</p>\n<p>1888 — _______________________________________________</p>\n<p>1889 — _______________________________________________</p>\n<p><br></p>\n<p><strong>2.</strong> Qual acontecimento você considerou mais importante? Justifique.</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p><br></p>\n<p><strong>3.</strong> Que relação existe entre a abolição e a Proclamação da República?</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>","fontSize":14,"align":"left"},{"id":"8d652317-3d6f-4d6c-aabe-dcffaa4da7e7","type":"text","x":56,"y":1050,"w":682,"h":24,"z":5,"html":"<p>SaborLab — biblioteca colaborativa de materiais escolares. Uso livre com atribuição (CC BY-SA 4.0).</p>","fontSize":9,"align":"left"}]}'::jsonb, 'Equipe SaborLab', (select id from seed_owner)),
('2f24efec-35a6-4177-9b87-e77a37f23ff2', 'Verb to be — practice', 'Inglês', '{"version":1,"blocks":[{"id":"c18d2cca-62a4-4ecc-b813-1ad38cfb02cf","type":"text","x":56,"y":44,"w":682,"h":64,"z":1,"html":"<p><strong>Verb to be — practice</strong></p>","fontSize":22,"align":"left"},{"id":"3a4b9881-7fe1-430e-a1fa-815fa5e7cdec","type":"text","x":56,"y":116,"w":682,"h":28,"z":2,"html":"<p>Inglês · Folha A4 · Nome: ______________________________  Data: ____/____/______</p>","fontSize":11,"align":"left"},{"id":"6aaa16d2-465a-4e08-b43d-7d6d93393ae8","type":"text","x":56,"y":164,"w":682,"h":64,"z":3,"html":"<p><em>Complete as frases com am, is ou are. Depois passe as frases para a forma negativa.</em></p>","fontSize":13,"align":"left"},{"id":"9b74fd91-a4a8-49b7-b0bc-ceb3bc210e55","type":"text","x":56,"y":248,"w":682,"h":770,"z":4,"html":"<p><strong>1.</strong> I _____ a student.</p>\n<p><strong>2.</strong> She _____ my teacher.</p>\n<p><strong>3.</strong> They _____ from Brazil.</p>\n<p><strong>4.</strong> He _____ ten years old.</p>\n<p><strong>5.</strong> We _____ in the classroom.</p>\n<p><strong>6.</strong> It _____ a blue pencil.</p>\n<p><strong>7.</strong> You _____ my friend.</p>\n<p><br></p>\n<p><strong>8.</strong> Negativa: I am tired. → _______________________________</p>\n<p><strong>9.</strong> Negativa: He is at school. → _______________________________</p>\n<p><strong>10.</strong> Negativa: They are happy. → _______________________________</p>\n<p><br></p>\n<p><strong>11.</strong> Complete as perguntas:</p>\n<p>a) _____ you a student? &nbsp;&nbsp; b) _____ she your sister?</p>\n<p><br></p>\n<p><strong>12.</strong> Responda em inglês:</p>\n<p>How are you today? _______________________________________</p>","fontSize":14,"align":"left"},{"id":"a29317b4-c7bd-4059-aa8a-acdbbcc1cbcf","type":"text","x":56,"y":1050,"w":682,"h":24,"z":5,"html":"<p>SaborLab — biblioteca colaborativa de materiais escolares. Uso livre com atribuição (CC BY-SA 4.0).</p>","fontSize":9,"align":"left"}]}'::jsonb, 'Equipe SaborLab', (select id from seed_owner)),
('d6e4e88d-abd6-4ab0-8be7-11611e37342e', 'Cores primárias e secundárias — desenho guiado', 'Artes', '{"version":1,"blocks":[{"id":"4b746e75-7ec6-479a-a4be-c5d0e5710ddd","type":"text","x":56,"y":44,"w":682,"h":64,"z":1,"html":"<p><strong>Cores primárias e secundárias — desenho guiado</strong></p>","fontSize":22,"align":"left"},{"id":"fd456ba3-d975-4e82-8d13-96555e2fcd98","type":"text","x":56,"y":116,"w":682,"h":28,"z":2,"html":"<p>Artes · Folha A4 · Nome: ______________________________  Data: ____/____/______</p>","fontSize":11,"align":"left"},{"id":"32ed1e6a-0d75-4e52-8554-beec6de09417","type":"text","x":56,"y":164,"w":682,"h":64,"z":3,"html":"<p><em>Use lápis de cor ou tinta para completar a atividade. Preste atenção às misturas.</em></p>","fontSize":13,"align":"left"},{"id":"e91ebec1-e27b-45d3-b366-00e6c65be89f","type":"text","x":56,"y":248,"w":682,"h":770,"z":4,"html":"<p><strong>1.</strong> Pinte os três círculos com as cores primárias e escreva o nome de cada uma.</p>\n<p>◯ ______________ &nbsp;&nbsp; ◯ ______________ &nbsp;&nbsp; ◯ ______________</p>\n<p><br></p>\n<p><strong>2.</strong> Misture duas cores primárias em cada quadro e escreva o resultado:</p>\n<p>Azul + amarelo = ______________</p>\n<p>Amarelo + vermelho = ______________</p>\n<p>Vermelho + azul = ______________</p>\n<p><br></p>\n<p><strong>3.</strong> Crie um desenho usando apenas as três cores primárias.</p>\n<p>(espaço para o desenho)</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p><br></p>\n<p><strong>4.</strong> Explique a diferença entre cor primária e cor secundária.</p>","fontSize":14,"align":"left"},{"id":"fb9e0bb5-784c-4f59-989f-798b7e53e261","type":"text","x":56,"y":1050,"w":682,"h":24,"z":5,"html":"<p>SaborLab — biblioteca colaborativa de materiais escolares. Uso livre com atribuição (CC BY-SA 4.0).</p>","fontSize":9,"align":"left"}]}'::jsonb, 'Equipe SaborLab', (select id from seed_owner)),
('5047136b-d761-4260-a96d-5aaa3a1bdf72', 'Plano de estudos da semana', 'Outros', '{"version":1,"blocks":[{"id":"70031060-9fd3-401a-a3d1-d92a68f75e2a","type":"text","x":56,"y":44,"w":682,"h":64,"z":1,"html":"<p><strong>Plano de estudos da semana</strong></p>","fontSize":22,"align":"left"},{"id":"9018206c-e85f-41e6-821d-ba760c26930b","type":"text","x":56,"y":116,"w":682,"h":28,"z":2,"html":"<p>Outros · Folha A4 · Nome: ______________________________  Data: ____/____/______</p>","fontSize":11,"align":"left"},{"id":"62787c89-e531-4193-b1c7-d51eabdbe8c0","type":"text","x":56,"y":164,"w":682,"h":64,"z":3,"html":"<p><em>Organize sua semana de estudos. Defina horários realistas, pausas e uma meta.</em></p>","fontSize":13,"align":"left"},{"id":"733532d3-4ee4-4519-bfe7-4b57f2f63442","type":"text","x":56,"y":248,"w":682,"h":770,"z":4,"html":"<p><strong>Segunda-feira</strong></p>\n<p>Matéria: ______________________ Horário: ______ h às ______ h</p>\n<p><strong>Terça-feira</strong></p>\n<p>Matéria: ______________________ Horário: ______ h às ______ h</p>\n<p><strong>Quarta-feira</strong></p>\n<p>Matéria: ______________________ Horário: ______ h às ______ h</p>\n<p><strong>Quinta-feira</strong></p>\n<p>Matéria: ______________________ Horário: ______ h às ______ h</p>\n<p><strong>Sexta-feira</strong></p>\n<p>Matéria: ______________________ Horário: ______ h às ______ h</p>\n<p><br></p>\n<p><strong>Revisão da semana:</strong> dia ______________</p>\n<p><strong>Meta da semana:</strong> _______________________________________________</p>\n<p><strong>Como vou saber que cumpri a meta?</strong> _______________________________________________</p>\n<p><br></p>\n<p><strong>Pausas:</strong> anote dois momentos de descanso que você vai respeitar.</p>\n<p>1) _______________________________________________</p>\n<p>2) _______________________________________________</p>","fontSize":14,"align":"left"},{"id":"23698392-8597-4bd6-9a1b-c24b36d4bca2","type":"text","x":56,"y":1050,"w":682,"h":24,"z":5,"html":"<p>SaborLab — biblioteca colaborativa de materiais escolares. Uso livre com atribuição (CC BY-SA 4.0).</p>","fontSize":9,"align":"left"}]}'::jsonb, 'Equipe SaborLab', (select id from seed_owner))
on conflict (id) do nothing;
