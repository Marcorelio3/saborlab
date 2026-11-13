-- SaborLab — Expansão da biblioteca (15 novos materiais + 3 layouts)
-- Rode após o seed original. Mantém idempotência com on conflict (id) do nothing.

-- Bloco para definir o dono do seed (baseado na última conta logada)
do $seed_owner$
begin
  if not exists (select 1 from auth.users) then
    raise exception 'Entre no site ao menos uma vez antes de rodar o seed.';
  end if;
end;
$seed_owner$;

-- Tabela temporária para identificar o dono do seed
drop table if exists pg_temp.seed_owner;
create temp table seed_owner as
  select id from auth.users order by last_sign_in_at desc nulls last limit 1;

-- Remove os três exemplos antigos sem dono, se existirem, para não duplicar.
delete from public.materials
 where created_by is null
   and title in ('Equações do 1º grau — lista inicial',
                 'Trecho para leitura — Machado de Assis',
                 'Linha do tempo — Independência do Brasil');

-- === NOVOS MATERIAIS (15 itens) ===

-- 1. Matemática - Geometria: Ângulos
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'text', 'Geometria: Ângulos', 'Matemática', 'Ângulo é formado por duas linhas que têm o mesmo ponto inicial.

Tipos de ângulos:
- Ângulo reto: mede exactly 90°. Ex: o canto de uma folha de papel.
- Ângulo agudo: mede menos de 90°. Ex: a ponta de um triângulo.
- Ângulo obtuso: mede mais de 90° mas menos de 180°. Ex: a abertura de uma porta quase fechada.

Atividades:
1) Classifique os ângulos como reto, agudo ou obtuso: (desenhos)
2) Um relógio marcado às 3h forma qual tipo de ângulo?
3) Desenhe um ângulo reto e um ângulo obtuso.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 2. Matemática - Medição: Capacidade
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'text', 'Medição: Capacidade', 'Matemática', 'Capacidade é a quantidade de líquido que um recipiente pode conter.

Unidades de capacidade:
- Mililitro (mL): para líquidos menores (uma garrafinha de água)
- Litro (L): para líquidos maiores (uma garrafa de 2L)
- 1 litro = 1.000 mililitros

Conversões:
- Para converter de litros para mililitros: multiplicar por 1.000
- Para converter de mililitros para litros: dividir por 1.000

Atividades:
1) Uma tigela de sopa contém 300 mL. Quanto isso em litros?
2) Uma garrafa de água tem capacidade de 2 L. Quantos mililitros ela guarda?
3) Complete: 5 L = ___ mL', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 3. Matemática - Estatística: Mediana e Moda
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('c3d4e5f6-a7b8-9012-cdef-345678901234', 'text', 'Mediana e Moda', 'Matemática', 'Dados são valores que podem ser contados ou medidos.

Mediana: o valor do meio quando os dados estão em ordem crescente.
- Se tiver número par de valores, a mediana é a média dos dois do meio.
- Se tiver número ímpar, a mediana é o valor exatamente do meio.

Moda: o valor que mais aparece no conjunto de dados.
- Pode ter mais de uma moda (bimodal, multimodal).
- Se nenhum valor se repete, não há moda.

Exemplo: Na turma de 5 alunos com notas 7, 8, 9, 9, 10:
- Mediana: 9 (o do meio)
- Moda: 9 (aparece 2 vezes)

Atividades:
1) Encontre a mediana e a moda dessas notas: 6, 7, 7, 8, 9, 10
2) Em uma pesquisa de altura: 1,50m, 1,55m, 1,55m, 1,60m, 1,65m → mediana e moda', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 4. Português - Gramática: Pronomes Pessoais
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('d4e5f6a7-b890-1234-def1-234567890123', 'text', 'Pronomes Pessoais', 'Português', 'Pronomes substituem nomes para evitar repetições.

Tipos principais:
- Pronomes pessoais pessoais (sujeito): eu, tu, ele, ela, nós, vós, eles, elas
- Pronomes pessoais complemento (C.O.): me, te, o, a, nos, os, lhes, lha

Exemplos:
- Maria chamou **eu** para o passeio.
- Disse **para ele** que voltaria tarde.
- Vejo **ela** todos os dias.

Atividades:
1) Substitua o nome sublinhado por pronome: "João viu **João** no parque."
2) Complete com o pronome adequado: "Disse **para Maria** que...**".', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 5. Português - Literatura: Conto O Relógio Cego
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('e5f6a7b8-9012-3456-ef12-345678901234', 'text', 'Conto: O Relógio Cego', 'Português', 'Numa cidade onde todos corriam o tempo todo, lived an old man who had a special clock. Instead of numbers, his clock had only hands. "Time is not measured in minutes", he said, "but in moments worth living".

One day, a young man asked: "But how do you know what time it is?" The old man answered: "When the sun touches the church tower, I know it\'s morning. When the crickets start singing, I know it\'s evening. The clock only tells me I\'m still here".

The young man realized that the old man was happier than anyone else, because he lived each moment fully, watching the sun rise and set, listening to the crickets, feeling the wind. He didn\'t need to know the exact time to enjoy life.

Moral: A felicidade não está em marcar o tempo, mas em viver cada instante com atenção e gratidão.

Questions:
1) What did the old clock have instead of numbers?
2) How did the old man know it was morning?
3) Why was the old man happier than the young people?
4) What does the moral say about happiness and time?', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 6. Ciências - Física: Força e Movimento
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('f6a7b8c9-1234-5678-f1a2-345678901234', 'text', 'Força e Movimento', 'Ciências', 'Força é o que faz as coisas moverem, pararem ou mudarem de direção.

Principais conceitos:
- Empurrar e Puxar: formas de aplicar força
- Gravidade: força que puxa os objetos para o chão
- Fricção: força que impede o movimento ou faz os objetos desacelerarem

Exemplos do dia a dia:
- Empurrar uma cadeira vazia é mais fácil do que uma cheia de livros
- Um carro freando usa atrito para parar
- Uma bola lançada no ar cai por causa da gravidade

Atividades:
1) Identifique as forças em ação: (desenhos de situações do cotidiano)
2) O que acontece quando você solta uma bola do alto? Quais forças intervêm?
3) Por que é mais difícil empurrar um móvel pesado do que um leve?', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 7. Ciências - Química: Elementos e Símbolos
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('a7b8c9d0-1234-5678-90ab-cdef12345678', 'text', 'Elementos e Símbolos', 'Ciências', 'A tabela periódica organiza todos os elementos conhecidos.

Alguns elementos básicos:
- Hidrogênio (H): o elemento mais simples e abundante do Universo
- Oxigênio (O): necessário para respirar, presente no ar e na água
- Carbono (C): base da vida, presente em tudo o que é vivo
- Ferro (Fe): metal forte, usado em construções e utensílios

Símbolos são abreviações de 1 ou 2 letras (sempre a primeira maiúscula).

Atividades:
1) Qual o símbolo do oxigênio? Do carbono? Do hidrogênio?
2) Complete: H + O = água (H2O)
3) Procure em casa 3 objetos que tenham ferro (caneta, chave, fechador).', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 8. Inglês - Vocabulary: Family Members
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('b8c9d0e1-2345-6789-0abcdef12345', 'text', 'Family Members', 'Inglês', 'Members of the family in English:

Immediate family:
- Mother / Mom = Mom
- Father / Dad = Dad
- Sister = Sister
- Brother = Brother
- Grandmother = Grandma
- Grandfather = Grandpa
- Daughter = Daughter
- Son = Son

Extended family:
- Cousin = Cousin
- Aunt = Aunt
- Uncle = Uncle
- Nephew = Nephew
- Niece = Niece

Possessive adjectives:
- My = Meu / Minha
- Your = Teu / Tua
- His = Seu (masculino)
- Her = Sua (feminino)
- Our = Nosso / Nossa
- Their = Seu (plural) / deles/delas

Atividades:
1) Match the English word with the Portuguese: Mother → Mamãe, Brother → Irmão...
2) Complete the family tree: "My mother\'s mother is my... (grandmother)"
3) Write your family members in English.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 9. Inglês - Grammar: Past Simple Regular
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('c9d0e1f2-3456-7890-1abcdef23456', 'text', 'Past Simple Regular', 'Inglês', 'O Past Simple (Passado Simples) é usado para ações concluídas no passado.

Forma afirmativa (regular): verbo + -ed

Examples:
- Walk → Walked
- Play → Played
- Watch → Watched

Forma negativa: didn\'t + verbo base
- I didn\'t walk
- She didn\'t play

Forma interrogativa: did + verbo base?
- Did you walk?
- Did she play?

Atividades:
1) Put the verbs in Past Simple: play → , watch → , clean →
2) Make the sentences negative: I played soccer. → , She watched TV. →
3) Ask questions: Who played soccer yesterday? → ', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 10. Tecnologia - Algoritmos: Sequência de Passos
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('d0e1f2a3-4567-8901-2bcd ef23456789', 'text', 'Algoritmos: Sequência de Passos', 'Tecnologia', 'Algoritmo é uma sequência de passos para resolver um problema ou completar uma tarefa.

Características de um bom algoritmo:
- Passos claros e na ordem correta
- Cada passo tem uma ação específica
- O algoritmo termina depois de executar todos os passos

Exemplo: Como fazer um sanduíche:
1. Pegue duas fatias de pão
2. Coloque queijo e presunto no meio
3. Feche o sanduíche
4. Corte ao meio (opcional)

Important: O algoritmo deve ser finito (terminar) e claro (ninguém duvide do que fazer).

Atividades:
1) Escreva um algoritmo para "Como lavar as mãos" com 5 passos.
2) Qual está errado neste algoritmo? (mostrar algoritmo com passo repetido ou faltando)
3) Desenhe o algoritmo para "Amarrar o sapato" usando setas e setas.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 11. Educação Financeira - Dinheiro e Moedas
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('e1f2a3b4-5678-9012-3cde f23456789012', 'text', 'Dinheiro e Moedas', 'Educação Financeira', 'Conhecendo o dinheiro no Brasil:

Moedas atuais: R$ 0,01, R$ 0,05, R$ 0,10, R$ 0,25, R$ 0,50, R$ 1,00
Notas atuais: R$ 2,00, R$ 5,00, R$ 10,00, R$ 20,00, R$ 50,00, R$ 100,00

Valor total:
- 2 notas de R$ 10,00 + 3 moedas de R$ 1,00 = R$ 23,00
- 1 nota de R$ 50,00 + 2 moedas de R$ 0,50 = R$ 51,00

Troco:
- Se comprar algo de R$ 15,00 e pagar com R$ 20,00, o troco é R$ 5,00
- Pagar R$ 100,00 por uma conta de R$ 78,50 → troco R$ 21,50

Atividades:
1) Conte o valor total: (mostrar conjunto de notas e moedas)
2) Qual o valor do troco? (cenário de compra)
3) Desenhe/montasete que seria usado para comprar pão custando R$ 3,50 com nota de R$ 10,00.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 12. Meio Ambiente - 3Rs: Reduzir, Reutilizar, Reciclar
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('f2a3b4c5-6789-0123-4def-567890123456', 'text', '3Rs: Reduzir, Reutilizar, Reciclar', 'Meio Ambiente', 'Os 3Rs são hábitos para proteger o planeta:

1. Reduzir: usar menos, gerar menos lixo
   - Ex: levar sacola própria ao mercado, desligar luzes ao sair do quarto
   
2. Reutilizar: usar novamente o que já se tem
   - Ex: potes de vidro para armazenar comida, roupas velhas para trapos
   
3. Reciclar: transformar o lixo em novo material
   - Ex: papel, plástico, vidro e metal vão para lixeiras específicas
   - A reciclagem economiza energia e recursos naturais

Atividades:
1) Classifique: papel, plástico, orgânico, vidro → qual lixeira cada um?
2) Desenhe 3 formas de reduzir o lixo na sua casa.
3) Crie um projeto: reutilize uma caixa de sapato para organizar a mesa.', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 13. Geografia - Mapas: Bússola e Cardeais
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('a3b4c5d6-7890-1234-5678-901234567890', 'text', 'Bússola e Cardeais', 'Geografia', 'Para se orientar em mapas e na natureza, usamos a bússola e os pontos cardeais:

Pontos cardeais principais:
- Norte (N): sempre aponta para o norte magnético (onde está o polo norte)
- Sul (S): direção oposta ao norte
- Leste (L): direção onde o sol nasce
- Oeste (O): direção onde o sol se põe

Pontos intermediários:
- Noroeste (NO): entre N e L
- Nordeste (NE): entre N e L
- Sudoeste (SO): entre S e O
- Sudeste (SE): entre S e O

Exemplo: "A escola fica no Nordeste da praça."

Atividades:
1) Identifique os pontos cardeais em um mapa da sua cidade ou da sala de aula.
2) "A igreja fica no Noreste da praça. O mercado fica no Sudoeste." - Desenhe ou indique nos locais.
3) Qual ponto cardinal o sol nasce? E se põe?', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 14. Artes - Música: Notas Musicais
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('b4c5d6e7-8901-2345-6789-012345678901', 'text', 'Notas Musicais', 'Artes', 'No sistema musical ocidental, temos 7 notas básicas que se repetem:

Notas: Dó, Ré, Mi, Fá, Sol, Lá, Si

Após a Si, volta-se ao Dó (oitava seguinte).

Na partitura, as notas ficam em linhas e espaços das "clefs" (mais comuns: clef de sol e fá).

Exemplo de escala: Dó - Ré - Mi - Fá - Sol - Lá - Si - (Dó da oitava seguinte)

Atividades:
1) Escreva a sequência das 7 notas musicais, começando do Dó.
2) Qual nota vem depois da Si? E antes do Ré?
3) Identifique quais notas aparecem na sua música favorita (ou na que está tocando na rádio).', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- 15. Português - Ortografia: Acentuação
insert into public.materials (id, kind, title, subject, body, source, license, author_name, created_by) values
('c5d6e7f8-9012-3456-7890-123456789012', 'text', 'Acentuação', 'Português', 'As acentos indicam a sílaba tônica (onde a voz mais forte está) e distinguem significados de palavras iguais.

Tipos de acentos:
- Acento agudo (´): é usado quando a sílaba termina em "n", "s" ou outra vogal, e a tônica NÃO está naquela regra padrão.
  Ex: çá, pròprio (nesse caso, a regra é diferente, verifique cada palavra)
  Exemplos comuns: aí, déu (arqueado), mas principalmente: palavras como "falso" vs "falso" (aconsulte regras completas)
  
- Acento grave (`): usado em palavras de origem estrangeira ou para distinguir significados.
  Ex: à (preposição) vs a (artigo), já (advérbio) vs ja (conjunction arcaico)
  
- Circunflexo (^): usado quando a sílaba tônica não está na penúltima posição e a palavra NÃO termina em "n", "s" ou vogal.
  Ex: pódio, ló-gar, ânge-lo

Palavras MÉDIAS (tônica na penúltima sílaba, terminando em "n", "s" ou vogal) NÃO levam acento:
- Casa, mói, computador, rápido, feliz, estudante

Palavras FINAIS (tônica na última sílaba, terminando em "n", "s" ou vogal) NÃO levam acento:
- Farol, café, felino, cão, braço, jaz

Palavras SOBRE-AFINAIS (tônica antes da penúltima) SEMPRE levam acento:
- Árvore, móvel,èdifico, lápis, café (nesse caso,vérifica-se)

Atividades:
1) Identifique se as palavras estão acentuadas ou não: "cidade, escola, fianl, fácil, proveito"
2) Complete: "A palavra '________' leva acento porque a tônica está na última sílaba e a palavra termina em consoante diferente de 'n' ou 's'."
3) Diferencie: "é" (verbo ser, 3ª pessoa do singular) vs "e" (conjunção), "mais" (mais do que) vs "máis" (superlativo).', 'Autoral — SaborLab', 'CC BY-SA 4.0', 'Equipe SaborLab', (select id from seed_owner)),

-- === NOVOS LAYOUTS A4 (3 itens) ===

-- 1. Layout: Geometria: Ângulos
insert into public.layouts (id, title, subject, data, author_name, created_by) values
('1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6', 'Ângulos', 'Matemática', '{"version":1,"blocks":[{"id":"root","type":"text","x":56,"y":44,"w":682,"h":64,"z":1,"html":"<p><strong>Geometria: Ângulos</strong></p>","fontSize":22,"align":"left"},{"id":"header","type":"text","x":56,"y":116,"w":682,"h":28,"z":2,"html":"<p>Matemática · Folha A4 · Nome: ______________________________  Data: ____/____/______</p>","fontSize":11,"align":"left"},{"id":"content","type":"text","x":56,"y":164,"w":682,"h":64,"z":3,"html":"<p><em>Classifique os ângulos como reto, agudo ou obtuso:</em></p>","fontSize":13,"align":"left"},{"id":"exercise-area","type":"text","x":56,"y":248,"w":682,"h":770,"z":4,"html":"<p>1) Ângulo 1: _______________ (reto/águdo/obtuso)</p>\n<p>2) Ângulo 2: _______________ (reto/águdo/obtuso)</p>\n<p>3) Ângulo 3: _______________ (reto/águdo/obtuso)</p>\n<p>4) Ângulo 4: _______________ (reto/águdo/obtuso)</p>\n<p>5) Ângulo 5: _______________ (reto/águdo/obtuso)</p>\n<p>6) Ângulo 6: _______________ (reto/águdo/obtuso)</p>\n<p><br></p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>","fontSize":14,"align":"left"},{"id":"footer","type":"text","x":56,"y":1050,"w":682,"h":24,"z":5,"html":"<p>SaborLab — biblioteca colaborativa de materiais escolares. Uso livre com atribuição (CC BY-SA 4.0).</p>","fontSize":9,"align":"left"}]}'::jsonb, 'Equipe SaborLab', (select id from seed_owner)),

-- 2. Layout: Conto O Relógio Cego
insert into public.layouts (id, title, subject, data, author_name, created_by) values
('2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7', 'O Relógio Cego', 'Português', '{"version":1,"blocks":[{"id":"root","type":"text","x":56,"y":44,"w":682,"h":64,"z":1,"html":"<p><strong>Conto: O Relógio Cego</strong></p>","fontSize":22,"align":"left"},{"id":"header","type":"text","x":56,"y":116,"w":682,"h":28,"z":2,"html":"<p>Português · Folha A4 · Nome: ______________________________  Data: ____/____/______</p>","fontSize":11,"align":"left"},{"id":"content","type":"text","x":56,"y":164,"w":682,"h":64,"z":3,"html":"<p><em>Leia o conto com atenção e responda às perguntas em frases completas:</em></p>","fontSize":13,"align":"left"},{"id":"exercise-area","type":"text","x":56,"y":248,"w":682,"h":770,"z":4,"html":"<p><strong>1.</strong> What did the old clock have instead of numbers?</p>\n<p><strong>2.</strong> How did the old man know it was morning?</p>\n<p><strong>3.</strong> Why was the old man happier than the young people?</p>\n<p><strong>4.</strong> What is the moral of the story?</p>\n<p><br></p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>","fontSize":14,"align":"left"},{"id":"footer","type":"text","x":56,"y":1050,"w":682,"h":24,"z":5,"html":"<p>SaborLab — biblioteca colaborativa de materiais escolares. Uso livre com atribuição (CC BY-SA 4.0).</p>","fontSize":9,"align":"left"}]}'::jsonb, 'Equipe SaborLab', (select id from seed_owner)),

-- 3. Layout: Dinheiro e Moedas
insert into public.layouts (id, title, subject, data, author_name, created_by) values
('3c4d5e6f-7g8h-9i0j-1k2l-m3n4o5p6q7r8', 'Dinheiro e Moedas', 'Educação Financeira', '{"version":1,"blocks":[{"id":"root","type":"text","x":56,"y":44,"w":682,"h":64,"z":1,"html":"<p><strong>Dinheiro e Moedas</strong></p>","fontSize":22,"align":"left"},{"id":"header","type":"text","x":56,"y":116,"w":682,"h":28,"z":2,"html":"<p>Educação Financeira · Folha A4 · Nome: ______________________________  Data: ____/____/______</p>","fontSize":11,"align":"left"},{"id":"content","type":"text","x":56,"y":164,"w":682,"h":64,"z":3,"html":"<p><em>Conte o valor total e encontre o troco:</em></p>","fontSize":13,"align":"left"},{"id":"exercise-area","type":"text","x":56,"y":248,"w":682,"h":770,"z":4,"html":"<p>1) Some as notas e moedas: R$ ___ ,___</p>\n<p>2) Qual o valor do troco? (compra de R$ ___ ,___ paga com R$ ___ ,___)</p>\n<p><br></p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>\n<p>_______________________________________________</p>","fontSize":14,"align":"left"},{"id":"footer","type":"text","x":56,"y":1050,"w":682,"h":24,"z":5,"html":"<p>SaborLab — biblioteca colaborativa de materiais escolares. Uso livre com atribuição (CC BY-SA 4.0).</p>","fontSize":9,"align":"left"}]}'::jsonb, 'Equipe SaborLab', (select id from seed_owner))
on conflict (id) do nothing;