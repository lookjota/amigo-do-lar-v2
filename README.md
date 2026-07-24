# Logos Page Engine

Logos Page Engine é um núcleo experimental para compor e renderizar páginas a
partir de entidades tipadas. O projeto investiga uma arquitetura simples em que
conteúdo estruturado é transformado em interface por um pipeline explícito, sem
acoplar o domínio da aplicação ao mecanismo de renderização.

O software está em estágio experimental (`0.1.0`). A API, os contratos e a
organização interna ainda podem mudar.

## Instituto Logos

O Instituto Logos é a primeira aplicação pública construída sobre a engine. A
rota `/` apresenta sua página inicial institucional, com conteúdo sobre áreas de
investigação, projetos, documentos fundamentais e visão.

Neste MVP, todo o conteúdo da Home é definido em uma única entidade `Page`. A
aplicação fornece os componentes visuais, o conteúdo, o repository concreto e a
configuração do registry; a engine permanece independente desses elementos.

## Arquitetura atual

O fluxo de renderização é:

```text
PageRepository
  → Page
  → PageRenderer
  → SectionRenderer
  → PageSectionRegistry
  → componentes visuais
```

- `Page` reúne SEO e uma lista ordenada de seções.
- `PageSection` é uma união discriminada; cada `type` determina seu payload.
- `PageRenderer` aplica os metadados da página e percorre suas seções.
- `SectionRenderer` resolve cada seção no registry.
- `PageSectionRegistry` associa tipos de seção a componentes compatíveis.
- `InstitutoLogosPageRepository` fornece a página pública atual.

## Instalação

Requer Node.js compatível com Vite 8 e npm.

```bash
npm install
```

## Execução

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação. Para gerar e
inspecionar o bundle de produção:

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento com HMR.
- `npm run lint`: verifica os arquivos TypeScript e React com ESLint.
- `npm run build`: executa o TypeScript e gera o bundle em `dist/`.
- `npm run preview`: serve localmente o bundle gerado.

## Estrutura principal

```text
src/
├── engine/
│   ├── page.ts
│   ├── PageRepository.ts
│   ├── PageRenderer.tsx
│   ├── SectionRenderer.tsx
│   └── PageSectionRegistry.ts
└── apps/
    └── instituto-logos/
        ├── components/
        ├── content/
        ├── pages/
        ├── registry/
        └── repositories/
```

As investigações arquiteturais existentes são mantidas em
`docs/investigations/`.

## Limitações

- Há somente a Home do Instituto Logos e uma página de conteúdo não encontrado.
- O conteúdo está definido em TypeScript e exige novo build para publicação.
- Não há backend, CMS, autenticação, busca ou leitura de Markdown.
- Os cards de documentos ainda não possuem páginas individuais.
- Não existe suíte de testes automatizados; lint e build são as verificações
  disponíveis.

## Próximos passos

- amadurecer os contratos da engine a partir de novos casos reais;
- criar testes para o pipeline e para os metadados da página;
- avaliar composição e extensão de tipos de seção sem perder segurança de tipos;
- melhorar acessibilidade e validação visual em diferentes navegadores;
- definir uma estratégia de publicação para documentos quando o domínio estiver
  suficientemente compreendido.

Este pacote é privado e não deve ser publicado no npm.
