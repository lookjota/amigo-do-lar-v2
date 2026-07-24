# Logos Page Engine — Current State Audit

Data da auditoria: 24 de julho de 2026

Escopo: estado atual de `package.json`, `src/`, `docs/`, Vite, TypeScript, ESLint, roteamento, domínio, repositories, factories, registries, renderers, páginas, componentes antigos e dados estáticos. Esta auditoria não altera a implementação.

# 1. Executive Summary

O repositório contém o núcleo inicial de uma Page Engine, mas ainda não um produto genérico, completo ou publicável. A parte efetivamente operacional é pequena: uma lista de `PageSection` é percorrida por `PageRenderer`; cada seção é encaminhada a `SectionRenderer`; o tipo da seção é resolvido no `pageSectionRegistry`; e um de quatro componentes React é renderizado.

Há duas entradas de aplicação:

- `/` carrega uma `Page` pelo `PageRepository`, porém a Home tem `sections: []`. Na prática, a Engine não produz conteúdo na Home; apenas `Navbar` e `WhatsAppButton`, montados fora dela, aparecem.
- `/:citySlug/:serviceSlug` resolve diretamente `Service` e `ServiceArea`, passa `service.sections` a `ServicePage` e então ao renderer. Esse fluxo renderiza as quatro seções cadastradas para `eletricista`, mas não converte o serviço em `Page`, não usa `PageFactory`, não consulta `PageRepository`, não personaliza o conteúdo pela cidade e não aplica SEO.

O projeto está em uma transição incompleta. Abstrações importantes existem, mas várias estão desconectadas: `PageFactory`, `ServicePageModel`, `citiesData`, o arquivo vazio `CityRepository.ts`, `ServicesSection` e as páginas específicas de serviços. Ao mesmo tempo, componentes antigos do Amigo do Lar permanecem no código, junto de textos, telefone, WhatsApp, cidades, estilos e assets específicos da aplicação original.

O estado de qualidade também impede uma release: `npm run lint` e `npm run build` falham. Não há testes, documentação de uso da Engine, API pública, pacote de biblioteca, contratos genéricos de seção, tratamento de SEO, boundary de configuração, nem separação entre runtime da Engine e exemplo Amigo do Lar.

Conclusão executiva: existe um protótipo funcional do pipeline de seções, integrado parcialmente a uma aplicação Amigo do Lar. Ainda não existe uma Page Engine reutilizável como biblioteca.

# 2. Current Architecture

## Inicialização

```text
index.html
  → src/main.tsx
    → React StrictMode
      → App
```

`main.tsx` monta `App` em `#root` e importa o CSS global. `App.tsx` importa o CSS legado do template, cria um `BrowserRouter` e declara duas rotas.

## Fluxo da Home

```text
GET /
  → App
    → Home
      → PageRepository.getHome()
        → homePage
      → Navbar                         (fora da Engine)
      → PageRenderer(page.sections)
        → nenhuma seção: sections = []
      → WhatsAppButton                 (fora da Engine)
```

Embora a Home já obtenha uma entidade `Page`, ela não tem composição ativa. Todo o conteúdo de seção em `homePage.ts` está comentado. A implementação comercial anterior também permanece comentada em `Home.tsx`.

## Fluxo dinâmico de serviço

```text
GET /brasilia/eletricista
  → App
    → DynamicPageFactory
      → useParams()
      → ServiceRepository.getBySlug("eletricista")
      → ServiceAreaRepository.exists("eletricista", "brasilia")
      → ServicePage(service, citySlug)
        → PageRenderer(service.sections)
          → SectionRenderer(section)
            → pageSectionRegistry[section.type]
              → HeroSection | BenefitsSection | FaqSection | CtaSection
```

`DynamicPageFactory` é, na realidade, um controller/resolver de rota específico para serviço e cidade. Ele não cria uma `Page` e não chama `PageFactory`. `ServicePage` ignora `citySlug` e envia somente `service.sections` ao renderer. `PageRenderer` também não recebe `Page`, apenas `PageSection[]`.

Se os parâmetros faltarem, o serviço não existir ou a área não estiver cadastrada, o resolver retorna um `<h1>` textual. Não há rota curinga, página 404, status HTTP, redirect, boundary de erro ou layout compartilhado.

# 3. Implemented Architecture

Somente os itens abaixo estão implementados e conectados a algum fluxo ativo:

- Bootstrap React 19 com Vite e `BrowserRouter`.
- Rota `/` para `Home`.
- Rota dinâmica `/:citySlug/:serviceSlug`.
- Entidades tipadas `Page`, `PageSection`, `PageSectionType`, `Seo`, `Service`, `City` e `ServiceArea`.
- Contratos de conteúdo `Hero`, `Benefit`, `Faq` e `Cta`.
- `PageRepository` em memória com uma única página: `homePage`.
- `ServiceRepository` em memória com um único serviço: `eletricista`.
- `ServiceAreaRepository` em memória, usado para autorizar combinações de URL.
- `PageRenderer`, que preserva a ordem do array e usa `section.id` como key.
- `SectionRenderer`, que consulta o registry e não renderiza tipos sem componente.
- `pageSectionRegistry` com quatro tipos registrados: `hero`, `benefits`, `faq` e `cta`.
- Componentes correspondentes aos quatro tipos.
- Renderização data-driven das seções de `eletricista` nas duas áreas válidas que também têm um serviço existente: Brasília e Águas Claras.
- Home conectada nominalmente a `PageRepository` e `PageRenderer`, ainda que sem conteúdo renderizado pela Engine.

# 4. Partial or Incomplete Architecture

- `PageFactory.fromService()` converte `Service` em `Page`, mas não é importado por nenhum fluxo.
- `PageRepository` centraliza apenas a Home; páginas de serviço continuam fora dele.
- `PageRenderer` não renderiza uma `Page`; recebe somente `sections`, portanto ignora `slug`, `title` e `seo`.
- `ServicePageModel` descreve tipos, obrigatoriedade e ordem, mas não tipa explicitamente sua estrutura, não valida páginas, não ordena seções e não é consumido.
- `CityRepository.ts` está vazio. `citiesData` não é consultado.
- `ServiceAreaRepository` verifica strings relacionais, mas não garante integridade com serviços e cidades existentes.
- `ServicesSection`, `ServiceGrid` e `ServiceCard` existem, porém `ServicesSection` não recebe dados, consulta um repository diretamente e não está registrada.
- A Home possui uma `Page`, mas suas seções estão vazias e seus exemplos comentados usam tipos de serviço para representar conteúdo de Home.
- `Seo` está armazenado em `Page` e `Service`, porém não atualiza `<title>`, meta description, canonical, robots ou Open Graph.
- Campos de `Hero` como `image`, `secondaryButton` e os destinos dos botões não são efetivamente utilizados pelo componente.
- `Benefit.icon` e `Benefit.highlight` não são renderizados.
- O conteúdo de cidade chega a `ServicePage` somente como slug e é descartado.
- Os assets referenciados pelo serviço (`/images/services/eletricista/hero.webp`) não existem em `public/`.
- Falta uma estratégia explícita para layout, navegação, widgets globais e seções compartilhadas.

# 5. Legacy Architecture

## Componentes comerciais antigos

`About.tsx`, `Contact.tsx`, `Feature.tsx`, `Hero.tsx`, `Navbar.tsx`, `ServicosPremium.tsx` e `WhatsAppButton.tsx` pertencem ao site Amigo do Lar/Lar & Soluções e não seguem o contrato do registry. `Navbar` e `WhatsAppButton` ainda são usados diretamente pela Home; os demais estão desconectados.

Os componentes antigos contêm conteúdo, comportamento e layout fixos, inclusive telefone, URL de WhatsApp, regiões, categorias de serviço e identidade textual. `Contact` abre diretamente uma URL externa. `ServicosPremium` mantém um segundo catálogo de serviços em código, paralelo a `servicesData`.

## Home anterior

`Home.tsx` preserva comentado o fluxo anterior:

```text
Navbar → Hero → Feature → ServicosPremium → About → Contact → WhatsAppButton
```

Esse código comentado não executa, mas documenta a coexistência da composição manual com a nova composição data-driven.

## Páginas específicas

`src/pages/servicos/Eletrica.tsx`, `Hidraulica.tsx`, `Instalacoes.tsx`, `Manutencao.tsx`, `Marcenaria.tsx` e `Pintura.tsx` são placeholders não roteados. Representam a estratégia antiga de uma página React por serviço e hoje causam parte da falha do build por imports `React` não utilizados.

## Resíduos do template

`App.css`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/favicon.svg`, `public/golden.svg`, `public/icons.svg` e o `README.md` de template não descrevem nem sustentam a Engine atual. Grande parte de `index.css` também é CSS de template comentado.

# 6. Coupling Analysis

## Acoplamento explícito ao Amigo do Lar

- `homePage` usa “Amigo do Lar”, “marido de aluguel”, Brasília e serviços residenciais.
- `servicesData` incorpora a marca no SEO e conteúdo comercial de eletricista.
- `BenefitsSection` fixa o título “Por que escolher o Amigo do Lar?”.
- `About`, `Hero`, `Contact`, `Navbar`, `ServicosPremium` e `WhatsAppButton` contêm marca, textos, telefone, regiões e navegação específicos.
- Os quatro componentes registrados estão sob `components/service/`, fazendo a implementação visual parecer intrinsecamente ligada a páginas de serviço.
- `DynamicPageFactory` conhece `ServiceRepository`, `ServiceAreaRepository`, a semântica cidade/serviço e `ServicePage`.
- `Service` mistura entidade de negócio, SEO e definição visual de página.
- `ServicePage` recebe `Service`, não `Page`.
- `ServicePageModel` codifica uma composição específica de página de serviço dentro de `domain/`.

## Acoplamento estrutural

O registry em `core/` importa componentes concretos da aplicação. Isso torna `core` dependente da camada visual do Amigo do Lar. Uma aplicação externa não consegue fornecer seu próprio registry sem editar o módulo.

Os repositories são classes estáticas ligadas diretamente a arrays concretos. Não há interfaces, injeção de dependência, ports, adapters alternativos ou configuração do consumidor.

Os tipos de seção são um objeto fechado com quatro valores. Estender a Engine exige alterar o domínio central e o registry central. Isso pode ser aceitável em uma aplicação, mas não é uma API extensível de biblioteca.

## Resultado

A Engine conhece menos detalhes de negócio do que os componentes legados, mas sua composição, resolução de URL, fontes de dados e renderer ainda estão montados dentro da aplicação Amigo do Lar. A separação é conceitual, não de pacote nem de dependências.

# 7. Domain Analysis

## Page

`Page` é uma boa abstração inicial: separa página de serviço e agrega identidade, SEO e seções. Porém:

- `slug` sozinho não modela rota, locale, hierarquia ou fonte.
- não há identificador separado do slug;
- não há layout, template, status, versão ou metadados extensíveis;
- `sections` aceita qualquer combinação sem validação;
- a abstração não é o objeto de entrada do renderer;
- apenas uma instância é armazenada no `PageRepository`.

## PageSection

`id`, `type` e `data` formam o contrato mínimo do pipeline. O problema central é `data: unknown`: a associação entre tipo e payload não existe no domínio. Uma seção `hero` com array de FAQs satisfaz `PageSection` em compile time e falha semanticamente em runtime.

Também não há contrato para visibilidade, variação visual, composição aninhada, metadados, schema/versionamento ou validação.

## PageSectionType

O padrão `as const` preserva literais e evita enum emitido em JavaScript. Os quatro valores estão corretamente limitados no tipo. Entretanto, a lista é fechada, não associa cada literal ao payload e exige alteração do core para extensão. Não há tipo `services`, `about`, `contact`, rich text, gallery ou composição genérica.

## Service

`Service` possui metadados úteis (`slug`, `title`, `description`), mas incorpora `seo` e `sections`. Isso une:

- catálogo do negócio;
- conteúdo editorial;
- composição de página;
- apresentação.

Como consequência, o domínio Amigo do Lar passa a ser uma fonte de páginas por si mesmo, em paralelo a `PageRepository`.

## City

`City` é uma estrutura simples e suficiente para catálogo estático inicial. Atualmente é órfã: não há repository funcional, validação de URL ou resolução do nome/estado. O conteúdo renderizado não muda entre cidades.

## ServiceArea

Modela corretamente a relação mínima por slugs, mas não possui identidade nem metadados regionais. Referências inválidas são possíveis. De fato, existem relações para `hidraulica` e `pintura`, mas esses serviços não existem em `servicesData`; portanto essas URLs falham antes da verificação de área.

## Seo

O contrato cobre campos básicos e sociais, mas todos são strings livres, `robots` não é restrito e faltam alternativas estruturadas para metadata. O risco maior não é o formato: nenhum campo é aplicado ao documento, então o SEO existe apenas como dado inerte.

## Repositories

- `PageRepository`: estático, síncrono e acoplado a `homePage`. `getAll()` devolve o próprio array mutável; `getHome()` ignora busca/configuração e retorna diretamente a constante.
- `ServiceRepository`: estático e acoplado a `servicesData`. Duplica a função exportada e não usada `getServiceBySlug`.
- `ServiceAreaRepository`: estático, acoplado ao array e sem verificação referencial.
- `CityRepository`: arquivo vazio.

São data access helpers, não abstrações substituíveis de repository. Não há contratos de interface, erros tipados, async, caching, persistência ou composição entre fontes.

## PageFactory

`PageFactory.fromService` é uma cópia direta de quatro campos. Não usa cidade, não gera SEO localizado, não valida seções e compartilha a mesma referência de `sections`. A intenção arquitetural é adequada, mas a implementação atual é um mapper desconectado, não uma factory central do runtime.

# 8. Rendering Pipeline Analysis

## DynamicPageFactory

O nome não corresponde à responsabilidade. O componente interpreta uma rota específica, busca entidades e escolhe mensagens de erro. Não instancia `Page`, não usa `PageFactory` e não é genérico para páginas institucionais, landing pages ou fontes externas.

Pontos positivos:

- valida parâmetros ausentes;
- diferencia serviço inexistente de área indisponível;
- mantém busca fora do componente visual da seção.

Limitações:

- depende diretamente de React Router e repositories concretos;
- ordem fixa de URL cidade/serviço;
- nenhuma consulta a `City`;
- nenhuma página 404 consistente;
- nenhuma possibilidade assíncrona;
- nenhuma resolução geral por URL/fonte;
- nenhuma entrega de `Page` ao pipeline.

## PageRenderer

É um iterador simples e funcional. Preserva a ordem e delega corretamente. Porém o nome promete mais do que entrega: recebe `sections`, não `page`. Assim, não processa SEO, layout, título, erros, loading ou metadados.

## SectionRenderer

Faz o lookup corretamente e possui fallback silencioso `null`. Como `PageSectionType` e as chaves atuais do registry são fechados e completos, esse fallback tende a esconder problemas de integração em vez de comunicá-los. Não há boundary de erro, logging ou fallback configurável.

## PageSectionRegistry

O mapeamento central remove switches do renderer e é a parte arquitetural mais valiosa do protótipo. Ainda assim:

- é singleton estático;
- importa componentes concretos;
- não possui interface pública de registro;
- não é injetável;
- não associa tipo a payload;
- não oferece lazy loading;
- não valida duplicidade ou cobertura;
- não permite registries diferentes por aplicação.

## Componentes de seção

`HeroSection`, `BenefitsSection`, `FaqSection` e `CtaSection` renderizam os dados de exemplo e estão conectados ao registry. Todos recebem um `PageSection` amplo e fazem cast internamente. Não há validação runtime.

Além do acoplamento visual:

- Hero descarta imagem, botão secundário e destinos;
- Benefits descarta ícone e highlight;
- CTA sempre abre nova aba, mesmo que o link não exija isso;
- títulos de Benefits e FAQ são fixos fora do payload;
- todos assumem payload válido e podem lançar erro ou renderizar `undefined`.

# 9. Type Safety Problems

1. `PageSection.data: unknown` perde a relação discriminada entre `type` e payload.
2. Os quatro componentes usam casts (`as Hero`, `as Benefit[]`, `as Faq[]`, `as Cta`) sem type guard ou schema runtime.
3. O registry não declara explicitamente um contrato como `satisfies`/mapped type que relacione cada tipo a props e payload.
4. `PageRenderer` aceita qualquer `PageSection[]`, não uma `Page` validada.
5. `ServicePageModel` depende de inferência de array e não expõe tipo para `required`/`order`, unicidade, completude ou sequência.
6. `useParams()` produz parâmetros possivelmente indefinidos; a checagem local é correta, mas não há contrato de rota central.
7. `ServicePageProps.citySlug` é obrigatório e depois ignorado, evidência de contrato insuficientemente integrado.
8. `getAll()` nos repositories expõe arrays mutáveis, permitindo alteração externa da fonte em memória.
9. `Seo.robots`, links, icons e imagens são strings sem restrições ou validação.
10. Não há validação runtime para conteúdo vindo futuramente de API/CMS; TypeScript não protege dados externos.
11. `section.id` não tem garantia de unicidade.
12. Relações por slugs são strings independentes; não há branded types nem integridade referencial.

O projeto usa TypeScript moderno, `verbatimModuleSyntax`, `noUnusedLocals` e `noUnusedParameters`, mas não ativa `strict` explicitamente. Embora opções estritas possam ser herdadas de defaults futuros ou parcialmente aplicadas, o contrato deve declarar sua política de forma inequívoca. O ESLint também não usa regras type-aware.

# 10. Routing Problems

Rotas atuais:

| Rota | Resolução | Relação com a Engine |
|---|---|---|
| `/` | `Home` → `PageRepository.getHome()` | Usa `Page`, mas renderiza array vazio |
| `/:citySlug/:serviceSlug` | `DynamicPageFactory` → repositories de serviço/área | Usa o pipeline de seções, mas contorna `Page`, `PageFactory` e `PageRepository` |

Problemas:

- a resolução não começa por URL → `PageRepository`, como na arquitetura desejada;
- cada categoria futura exigiria nova lógica de rota;
- `PageRepository.getBySlug()` não participa do roteamento;
- a ordem cidade/serviço está embutida em `App.tsx`;
- `BrowserRouter` exige fallback para `index.html` no servidor de produção, não documentado/configurado;
- não há `*`/404;
- mensagens de falha são elementos locais, sem página ou layout;
- nomes de cidade não são validados em `citiesData`;
- combinações de área inconsistentes estão cadastradas;
- cidade não altera conteúdo ou SEO;
- rotas específicas legadas existem como arquivos, mas não estão declaradas;
- não há suporte a slugs aninhados, páginas institucionais ou landing pages pelo repository;
- nenhuma estratégia de SSR/SSG foi definida, relevante para páginas comerciais e SEO.

# 11. Build and Quality Status

Os comandos foram executados sem correção posterior.

## `npm run lint`

Resultado: **falhou**, exit code 1.

```text
src/domain/data/pages/homePage.ts
  1:10  error  'PageSectionType' is defined but never used

1 problem (1 error, 0 warnings)
```

## `npm run build`

Resultado: **falhou**, exit code 2, durante `tsc -b`. O Vite build não chegou a executar.

```text
src/domain/data/pages/homePage.ts(1,1):
  TS6133: 'PageSectionType' is declared but its value is never read.

src/pages/servicos/Eletrica.tsx(1,1):
src/pages/servicos/Hidraulica.tsx(1,1):
src/pages/servicos/Instalacoes.tsx(1,1):
src/pages/servicos/Manutencao.tsx(1,1):
src/pages/servicos/Marcenaria.tsx(1,1):
src/pages/servicos/Pintura.tsx(1,1):
  TS6133: 'React' is declared but its value is never read.
```

## Qualidade geral

- Não há framework ou arquivos de teste.
- Não há script `test`.
- Não há CI visível no inventário.
- O lint não é type-aware.
- O README é o texto padrão do template Vite.
- `package.json` ainda se chama `dad`, está em `0.0.0` e é `private`.
- O uso de faixas com `^` reduz a reprodutibilidade semântica pretendida por uma futura biblioteca, embora o lockfile registre resoluções atuais.

# 12. Architectural Risks

## Critical

- **Build quebrado:** não é possível produzir o bundle de produção no estado auditado.
- **Ausência de contrato seguro entre tipo e payload:** conteúdo inválido compila e casts não verificados podem quebrar renderização.
- **Não existe boundary reutilizável:** core, aplicação, conteúdo do cliente, rota e componentes estão no mesmo grafo de dependências.

## High

- **Fluxos divergentes:** Home usa `PageRepository`; serviço contorna `Page`, factory e repository de páginas.
- **Engine acoplada a Amigo do Lar:** conteúdo, roteamento, repositories e componentes concretos estão incorporados.
- **SEO inerte:** páginas com finalidade comercial armazenam metadata, mas não a aplicam.
- **Registry fechado e não injetável:** consumidores externos precisariam editar o core.
- **Home vazia:** a rota principal não demonstra a Engine nem o conteúdo comercial.
- **Sem testes:** alterações no pipeline não têm proteção automatizada.
- **Integridade de dados quebrada:** relações apontam para serviços inexistentes.

## Medium

- `DynamicPageFactory` tem nome e responsabilidade divergentes.
- repositories estáticos retornam estruturas mutáveis e não possuem interfaces.
- cidade é resolvida apenas como string e descartada na apresentação.
- tipos e modelos descritivos não validam conteúdo.
- assets referenciados em dados não existem.
- fallback desconhecido de seção é silencioso.
- não há 404, error boundary, loading ou suporte async.
- componentes de seção ignoram campos declarados.
- catálogos duplicados existem em `servicesData` e `ServicosPremium`.
- CSS/template e arquivos legados aumentam ambiguidade arquitetural.
- `BrowserRouter` não possui estratégia de hosting documentada.

## Low

- inconsistência de formatação entre arquivos e uso misto de aspas/semicolons;
- comentários extensos e código comentado obscurecem o estado executável;
- chaves de listas baseadas em título/pergunta podem colidir;
- nome do pacote, versão e README não refletem o projeto;
- imports e assets de template permanecem no repositório.

# 13. Recommended Migration Sequence

## 1. Transformar a Home em Page

Definir payloads tipados para as seções necessárias da Home e ativar uma composição mínima em `homePage`. Navegação e widgets globais devem ser decididos como layout configurável ou seções, sem introduzir marca no core. O primeiro critério de aceite deve ser `/` renderizar conteúdo real exclusivamente a partir de uma `Page`.

## 2. Centralizar páginas no PageRepository

Fazer do repository a porta única para páginas resolvidas. Separar interface de repository da implementação em memória. Definir resolução por rota/slug e política de `home`. Dados de serviço podem continuar como fonte, mas devem ser adaptados para `Page` antes de entrar no repository ou por um serviço de resolução claramente posicionado.

## 3. Fazer PageRenderer renderizar Home e serviços

Alterar o contrato conceitual para `PageRenderer(page)`, incluindo composição de seções e aplicação de SEO. Usar `PageFactory.fromService` no resolver de serviços, ampliada para receber contexto de cidade quando necessário. Tanto Home quanto serviço devem convergir para:

```text
fonte/URL → PageRepository ou adapter → Page → PageRenderer
```

## 4. Eliminar fluxos antigos

Depois de equivalência visual e funcional comprovada, remover código comentado, páginas específicas não roteadas, catálogos duplicados e componentes sem consumidor. Migrar `Navbar`, WhatsApp e layout antes de remover os únicos elementos ainda visíveis na Home. A remoção deve ocorrer apenas após testes e inventário de assets.

## 5. Separar a Engine do domínio Amigo do Lar

Criar boundaries claros:

- Engine: contratos genéricos, renderer, registry configurável e erros.
- Adapter React: implementação de renderização.
- Aplicação Amigo do Lar: router, repositories concretos, seção visual, conteúdo e branding.
- Exemplo: dados demonstrativos isolados.

O core não deve importar `components/service`, repositories comerciais nem React Router. A aplicação deve fornecer registry e fontes.

## 6. Preparar reutilização externa

Definir exports públicos, configuração de build de biblioteca, peer dependencies para React, documentação, exemplo mínimo, versionamento, testes unitários/integrados e política de compatibilidade de schemas. Validar conteúdo externo em runtime. Só depois publicar pacote experimental.

# 14. Minimal Public Release

Para uma v0.1.0 honesta e utilizável, o menor conjunto aceitável é:

1. Fazer lint e build passarem.
2. Extrair um módulo de Engine sem imports do Amigo do Lar ou React Router.
3. Expor `Page`, uma união discriminada/genérica de seções, `PageRenderer`, `SectionRenderer` e criação/injeção de registry.
4. Fazer `PageRenderer` receber uma `Page`, não apenas `sections`.
5. Permitir que o consumidor registre componentes e seus payloads sem editar o core.
6. Adicionar validação ou uma fronteira explícita para dados externos.
7. Criar pelo menos testes de:
   - ordem de seções;
   - lookup no registry;
   - tipo desconhecido/fallback;
   - payload por tipo;
   - renderização de duas páginas diferentes.
8. Fornecer um exemplo Amigo do Lar separado que demonstre Home e serviço usando o mesmo pipeline.
9. Configurar build de biblioteca, exports, types, `peerDependencies`, nome real, licença e versão `0.1.0`.
10. Escrever README com instalação, API, exemplo, limitações e declaração explícita de caráter experimental.

Não é necessário, para v0.1.0, suportar CMS, API remota, SSR, cidades, portal de documentação ou todas as seções legadas. É necessário que o núcleo publicado seja pequeno, estável o suficiente para uso real e livre de regras de um cliente específico.

# 15. File Classification

A classificação indica a função no estado atual, não o destino definitivo. “Candidate for Removal” significa sem papel justificável no runtime ou na documentação atual e exige confirmação antes de qualquer remoção.

## Raiz e configuração

| Arquivo | Classificação | Observação |
|---|---|---|
| `AGENTS.md` | Documentation | Regras de contribuição do repositório |
| `package.json` | Infrastructure | Scripts e dependências; metadata ainda é de protótipo |
| `package-lock.json` | Infrastructure | Lockfile npm |
| `vite.config.ts` | Infrastructure | React e Tailwind via Vite |
| `tsconfig.json` | Infrastructure | Project references |
| `tsconfig.app.json` | Infrastructure | Compilação TypeScript da aplicação |
| `tsconfig.node.json` | Infrastructure | Compilação da configuração Vite |
| `eslint.config.js` | Infrastructure | Regras recomendadas sem type-aware lint |
| `index.html` | Infrastructure | Shell HTML do Vite |
| `README.md` | Candidate for Removal | README padrão deve ser substituído, não usado como documentação da Engine |

## Entrada e estilos

| Arquivo | Classificação | Observação |
|---|---|---|
| `src/main.tsx` | Infrastructure | Bootstrap React |
| `src/App.tsx` | Application Adapter | Router específico da aplicação |
| `src/index.css` | Infrastructure | Tailwind e estilos globais; contém resíduo comentado |
| `src/App.css` | Candidate for Removal | CSS do template, importado mas sem consumidores identificados |

## Core e renderização

| Arquivo | Classificação | Observação |
|---|---|---|
| `src/core/registry/pageSectionRegistry.ts` | Core Engine | Conceito central, mas implementação importa visuais concretos |
| `src/components/PageRenderer/index.tsx` | Core Engine | Iterador de seções; contrato ainda estreito |
| `src/components/SectionRenderer/index.tsx` | Core Engine | Resolve seção no registry |
| `src/components/DynamicPageFactory.tsx` | Application Adapter | Resolver de rota serviço/cidade, não factory genérica |

## Domínio e factories

| Arquivo | Classificação | Observação |
|---|---|---|
| `src/domain/entities/Page.ts` | Core Engine | Contrato de página |
| `src/domain/entities/PageSection.ts` | Core Engine | Contrato de seção, com payload inseguro |
| `src/domain/entities/PageSectionType.ts` | Core Engine | Tipos fechados de seção |
| `src/domain/entities/Seo.ts` | Core Engine | Metadata de página, ainda não aplicada |
| `src/domain/entities/Hero.ts` | Domain Example | Payload concreto do exemplo |
| `src/domain/entities/Benefit.ts` | Domain Example | Payload concreto do exemplo |
| `src/domain/entities/Faq.ts` | Domain Example | Payload concreto do exemplo |
| `src/domain/entities/Cta.ts` | Domain Example | Payload concreto do exemplo |
| `src/domain/entities/Service.ts` | Domain Example | Domínio comercial com composição visual |
| `src/domain/entities/City.ts` | Domain Example | Domínio comercial |
| `src/domain/entities/ServiceArea.ts` | Domain Example | Relação comercial |
| `src/domain/factories/PageFactory.ts` | Application Adapter | Mapper Service → Page desconectado |
| `src/domain/models/ServicePageModel.ts` | Domain Example | Modelo específico e não consumido |

## Repositories e dados

| Arquivo | Classificação | Observação |
|---|---|---|
| `src/domain/repositories/PageRepository.ts` | Application Adapter | Repository concreto em memória |
| `src/domain/repositories/ServiceRepository.ts` | Application Adapter | Repository concreto do Amigo do Lar |
| `src/domain/repositories/ServiceAreaRepository.ts` | Application Adapter | Repository concreto de disponibilidade |
| `src/domain/repositories/CityRepository.ts` | Candidate for Removal | Arquivo vazio; alternativamente deve ser implementado em etapa futura |
| `src/domain/data/pages/homePage.ts` | Domain Example | Página branded, atualmente sem seções |
| `src/domain/data/servicesData.ts` | Domain Example | Serviço e composição branded |
| `src/domain/data/citiesData.ts` | Domain Example | Catálogo desconectado |
| `src/domain/data/serviceAreasData.ts` | Domain Example | Relações parcialmente inconsistentes |

## Componentes de seção

| Arquivo | Classificação | Observação |
|---|---|---|
| `src/components/service/HeroSection/index.tsx` | Domain Example | Renderer visual concreto |
| `src/components/service/BenefitsSection/index.tsx` | Domain Example | Contém texto fixo Amigo do Lar |
| `src/components/service/FaqSection/index.tsx` | Domain Example | Renderer visual concreto |
| `src/components/service/CtaSection/index.tsx` | Domain Example | Renderer visual concreto |
| `src/components/service/ServicesSection/index.tsx` | Application Adapter | Consulta repository diretamente; fora do registry |
| `src/components/service/ServiceGrid/index.tsx` | Domain Example | Visual de catálogo |
| `src/components/service/ServiceCard/index.tsx` | Domain Example | Visual de entidade Service |

## Páginas

| Arquivo | Classificação | Observação |
|---|---|---|
| `src/pages/Home.tsx` | Application Adapter | Route screen híbrida; Engine + componentes globais |
| `src/pages/ServicePage/index.tsx` | Application Adapter | Adapter de Service para array de seções |
| `src/pages/ServicePage/type.ts` | Application Adapter | Props específicas, com `citySlug` não usado |
| `src/pages/servicos/Eletrica.tsx` | Candidate for Removal | Placeholder legado não roteado |
| `src/pages/servicos/Hidraulica.tsx` | Candidate for Removal | Placeholder legado não roteado |
| `src/pages/servicos/Instalacoes.tsx` | Candidate for Removal | Placeholder legado não roteado |
| `src/pages/servicos/Manutencao.tsx` | Candidate for Removal | Placeholder legado não roteado |
| `src/pages/servicos/Marcenaria.tsx` | Candidate for Removal | Placeholder legado não roteado |
| `src/pages/servicos/Pintura.tsx` | Candidate for Removal | Placeholder legado não roteado |

## Componentes antigos

| Arquivo | Classificação | Observação |
|---|---|---|
| `src/components/Navbar.tsx` | Legacy | Ainda usado fora da Engine |
| `src/components/WhatsAppButton.tsx` | Legacy | Ainda usado; telefone e mensagem fixos |
| `src/components/Hero.tsx` | Legacy | Home comercial antiga, desconectada |
| `src/components/Feature.tsx` | Legacy | Galeria comercial antiga, desconectada |
| `src/components/ServicosPremium.tsx` | Legacy | Catálogo paralelo hard-coded |
| `src/components/About.tsx` | Legacy | Institucional e regiões hard-coded |
| `src/components/Contact.tsx` | Legacy | Formulário/WhatsApp hard-coded |

## Assets públicos e importados

| Arquivos | Classificação | Observação |
|---|---|---|
| `src/assets/head0.png`, `head1.png`, `head7.png`, `head8.png`, `hero.png` | Asset | Imagens comerciais/legadas |
| `src/assets/img1.jpg` a `img7.jpg` | Asset | Imagens usadas por componentes legados |
| `src/assets/logo000.png` | Asset | Logo usado por Navbar |
| `src/assets/react.svg`, `src/assets/vite.svg` | Candidate for Removal | Resíduos do template |
| `public/favicon.svg` | Asset | Asset público genérico/template |
| `public/golden.svg`, `public/icons.svg` | Candidate for Removal | Sem referência encontrada |

## Documentação

| Arquivo | Classificação | Observação |
|---|---|---|
| `docs/investigations/page-engine-v1-analysis.md` | Documentation | Análise técnica anterior |
| `docs/investigations/page-engine-current-state-audit.md` | Documentation | Este relatório |

# 16. Final Verdict

## A Engine já existe?

**Sim, como protótipo arquitetural.** O pipeline `PageSection → SectionRenderer → registry → componente` existe e executa.

## Ela já está funcional?

**Parcialmente.** Seções do serviço `eletricista` podem ser renderizadas em rotas válidas. A Home não tem conteúdo de Engine e o build de produção falha.

## Ela já é reutilizável?

**Não.** Registry, roteamento, repositories, tipos concretos, conteúdo e componentes ainda estão acoplados à aplicação Amigo do Lar, sem API de extensão ou pacote separado.

## Ela pode ser publicada?

**Não no estado atual.** O build e o lint falham, o pacote é privado e `0.0.0`, não há exports de biblioteca, testes, documentação pública nem separação de responsabilidades suficiente. Publicá-la agora comunicaria uma maturidade que o código ainda não possui.

## Qual deve ser o próximo único passo?

**Fazer a Home tornar-se a primeira `Page` completa e realmente renderizada pelo pipeline, com payloads de seção tipados por discriminated union.**

Esse passo deve ser único porque valida simultaneamente a abstração `Page`, o contrato de seção e o renderer sem antecipar empacotamento externo. Depois que `/` for integralmente data-driven e type-safe, a mesma entrada pode receber páginas de serviço e então sustentar a separação do core.
