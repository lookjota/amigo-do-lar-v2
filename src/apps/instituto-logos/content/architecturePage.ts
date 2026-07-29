import type { Page } from '../../../domain/pages/Page'

export const architecturePage: Page = {
  id: 'instituto-logos-architecture',
  slug: '/architecture',
  metadata: {
    title: 'Arquitetura — Logos Page Engine',
    description:
      'Princípios arquiteturais que orientam a evolução da Logos Page Engine.',
    author: 'Instituto Logos',
    locale: 'pt-BR',
    canonicalUrl:
      'https://lookjota.github.io/logos-page-engine/architecture',
    robots: {
      index: true,
      follow: true,
    },
    updatedAt: '2026-07-29',
  },
  sections: [
    {
      id: 'architecture',
      type: 'hero',
      data: {
        eyebrow: 'Logos Page Engine',
        title: 'Uma arquitetura orientada a domínio.',
        description:
          'Páginas são dados estruturados. A Engine resolve, compõe e renderiza esses dados sem acoplar o domínio ao React ou ao navegador.',
        motto: 'Domain first. Stable contracts. Continuous evolution.',
        actions: [
          {
            label: 'Ver princípios',
            href: '#architecture-principles',
          },
        ],
      },
    },
    {
      id: 'architecture-principles',
      type: 'vision',
      data: {
        title: 'Princípios que preservam a evolução',
        text:
          'A interface pode mudar sem redefinir o significado de uma página. O domínio descreve o conteúdo e suas relações; renderizadores transformam esses contratos em experiência visual.',
        principles: [
          'Domínio independente de framework',
          'Composição declarativa',
          'Contratos estáveis',
          'Responsabilidades explícitas',
          'Extensão incremental',
        ],
      },
    },
    {
      id: 'architecture-footer',
      type: 'footer',
      data: {
        brand: 'Instituto Logos',
        motto: 'Quaerere. Intellegere. Servire.',
        text:
          'Pesquisa aberta, engenharia responsável e conhecimento compartilhado.',
      },
    },
  ],
}
