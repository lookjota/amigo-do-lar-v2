# Etapa 4 — composição da Home

Implementação da HIGH-FIDELITY VISUAL SPEC / UI COMPOSITION v1 fornecida pelo usuário. O Hero, Text Display e Reveal existentes foram preservados como referência do checkpoint aprovado.

## Arquivos alterados

| Arquivo | Responsabilidade |
| --- | --- |
| `src/apps/amigo-do-lar/content/pageFactory.ts` | Payloads e sequência da Home |
| `src/apps/amigo-do-lar/pages/PageRoute.tsx` | Escopo visual da Home |
| `src/apps/amigo-do-lar/sections/redesignSections.tsx` | Problem, Solution, Lista, Padrão e Founders |
| `src/apps/amigo-do-lar/sections/sections.tsx` | Trust, serviços, áreas e CTA |
| `src/apps/amigo-do-lar/styles.css` | Composição, responsividade e microinterações |
| `src/domain/pages/PageSection.ts` | Variante opcional de CTA da Home, preservando páginas internas |
| `src/apps/amigo-do-lar/sections/HomeComposition.test.tsx` | Nove testes de composição |
| `src/apps/amigo-do-lar/sections/TrustStrip.test.tsx` | Dois testes de Trust Strip |
| `docs/HOME_COMPOSITION_STAGE_4.md` | Registro da entrega e validação |

## Composição

Header → Hero → Trust Strip → Problem → Solution → Services → Lista da Casa → Padrão Amigo do Lar → Founders → Areas → FAQ → Final CTA → Footer.

Proof Gallery e Reviews continuam OFF: sem seção, espaço reservado, imagens, ratings ou JSON-LD de avaliações.

- Trust Strip: quatro condições aprovadas, ícones outline e divisores leves.
- Problem: placeholder editorial e texto curto sobre pendências e coordenação de profissionais. A spec fixa o título; o parágrafo expressa o objetivo informado para a etapa.
- Solution, Lista da Casa, Padrão e Final CTA: copy da especificação.
- Founders: título/eyebrow da spec e os dois parágrafos institucionais já existentes na Home.
- Services: catálogo, slugs, links e merge API/fallback preservados. Nenhum serviço novo é publicado pela composição.
- Areas: mesmos links publicados, agora em lista editorial.
- FAQ: perguntas, respostas, details/summary e FAQPage preservados.
- Lista da Casa: exemplos explicitamente identificados e WhatsApp contextual. Nenhuma rota nova.

## Responsividade e movimento

Verificação em Chromium com 390, 768 e 1440px: documento sem overflow horizontal; links/controles visíveis verificados com altura mínima de 48px; FAQ abre com Enter e fecha com Espaço. Mobile empilha as composições, mantém Trust em 2×2 e serviços em uma coluna. Checklist vem após a proposta; Founders mantém imagem antes do texto. Desktop usa serviços/processo em três colunas.

Ajustes de integração: ocultar corretamente o CTA desktop do Header no mobile (a regra genérica de botão sobrepunha o display), impedir compressão do hamburger, adequar H1/H2 ao intervalo 768–1023px e garantir alvos de toque no Header/Footer. Hero em 390/1440px preservado. Sticky permanece com espaço no fim da página.

Reveal existente: threshold 15%, 420ms, execução única, opacity/transform e reduced motion. Stagger de Padrão: 0/80/160ms; serviços: 0/55/110ms. FAQ mantém semântica nativa e animação discreta de abertura de 200ms, desativada com reduced motion. Conteúdo presente e visível no SSR sem JavaScript. CLS medido na sessão local de carregamento/scroll: 0 (não é uma medição de campo).

## Testes e gates

Novos testes: `HomeComposition.test.tsx` e `TrustStrip.test.tsx`. Cobrem ordem, textos, catálogo/URLs com API e fallback, exemplos da Lista, estágios, Founders, links regionais, FAQ, CTA, SSR, reduced motion e ausência de evidência fictícia. Teclado nativo de details/summary foi validado no Chromium; JSDOM cobre expansão por clique.

Gates: TypeScript, ESLint, testes direcionados, suíte completa, build client, build SSR, prerender, validação SEO e git diff --check. Build mantém 24 rotas públicas indexáveis e nenhuma rota de Lista da Casa. Nenhuma dependência adicionada ao projeto; Playwright foi instalado apenas em /tmp para inspeção local.

## Assets pendentes

- Hero: asset temporário existente, sem substituição nesta etapa.
- Editorial de pequenas pendências residenciais.
- Fotografias reais das seis categorias de serviços.
- Processo: Antes, Durante e Depois.
- João + pai uniformizados.

Placeholders neutros estão explicitamente identificados. Não representam atendimentos realizados. Proof/Reviews só poderão entrar com evidência real em etapa futura. Fotos definitivas ainda precisarão de conferência de recorte e alt text.

Escopo encerrado na Etapa 4, sem alteração de API, Admin, Auth/RBAC, contratos backend, novas páginas, merge ou deploy.
