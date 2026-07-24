import type { Page } from '../../../engine/page'

export const homePage: Page = {
  slug: '/',
  title: 'Instituto Logos',
  seo: {
    title: 'Instituto Logos — Pesquisa e Engenharia do Conhecimento',
    description:
      'Iniciativa aberta de pesquisa, arquitetura de software e organização do conhecimento.',
  },
  sections: [
    {
      id: 'inicio',
      type: 'navigation',
      data: {
        brand: 'Instituto Logos',
        links: [
          { label: 'Início', href: '#inicio' },
          { label: 'Áreas', href: '#areas' },
          { label: 'Projetos', href: '#projetos' },
          { label: 'Documentos', href: '#documentos' },
          { label: 'Visão', href: '#visao' },
        ],
        additionalLink: {
          label: 'GitHub',
          href: 'https://github.com/lookjota',
          external: true,
        },
      },
    },
    {
      id: 'hero',
      type: 'hero',
      data: {
        eyebrow: 'Instituto de Pesquisa e Engenharia do Conhecimento',
        title:
          'Compreender profundamente. Construir conscientemente. Servir por meio do conhecimento.',
        description:
          'O Instituto Logos é uma iniciativa aberta de pesquisa, arquitetura de software e organização do conhecimento dedicada à construção de sistemas que ampliem a capacidade humana de compreender, criar e servir.',
        motto: 'Quaerere. Intellegere. Servire.',
        actions: [
          { label: 'Explorar projetos', href: '#projetos' },
          { label: 'Conhecer os documentos', href: '#documentos' },
        ],
      },
    },
    {
      id: 'areas',
      type: 'researchAreas',
      data: {
        title: 'Áreas de investigação',
        items: [
          {
            name: 'Logos Lab',
            description:
              'Engenharia de software, arquiteturas, engines e sistemas computacionais.',
          },
          {
            name: 'Anthropos Lab',
            description:
              'Consciência humana, autodomínio, identidade e desenvolvimento integral.',
          },
          {
            name: 'Knowledge Architecture',
            description:
              'Modelagem, conexão, preservação e publicação do conhecimento.',
          },
        ],
      },
    },
    {
      id: 'projetos',
      type: 'projects',
      data: {
        title: 'Projetos em desenvolvimento',
        items: [
          {
            name: 'Logos Page Engine',
            status: 'Experimental',
            description:
              'Engine orientada a domínio para composição e renderização de experiências digitais a partir de páginas e seções estruturadas.',
          },
          {
            name: 'Orion Platform',
            status: 'Research',
            description:
              'Arquitetura conceitual e computacional para uma família de engines interoperáveis.',
          },
          {
            name: 'Conversation Engine',
            status: 'Planned',
            description:
              'Infraestrutura para conversações, automações e atendimento assistido.',
          },
          {
            name: 'Knowledge Engine',
            status: 'Research',
            description:
              'Sistema para organização, relacionamento e recuperação de conhecimento estruturado.',
          },
        ],
      },
    },
    {
      id: 'documentos',
      type: 'documents',
      data: {
        title: 'Documentos fundamentais',
        items: [
          {
            title: 'Volume 00 — Orion Foundations',
            code: 'LCP',
            version: 'Em construção',
          },
          {
            title: 'Orion Platform Specification',
            code: 'OPS',
            version: 'v1.0.0',
          },
          {
            title: 'Orion Platform Meta Model',
            code: 'OPMM',
            version: 'v1.0.0',
          },
          {
            title: 'Orion Platform Formal Language Architecture',
            code: 'OPFL',
            version: 'v1.0.0',
          },
        ],
      },
    },
    {
      id: 'visao',
      type: 'vision',
      data: {
        title: 'Conhecimento como infraestrutura viva',
        text:
          'O Instituto Logos pesquisa formas de transformar ideias, documentos, modelos e arquiteturas em sistemas vivos, versionados, verificáveis e acessíveis. Cada projeto deve produzir conhecimento reutilizável e cada descoberta deve fortalecer as próximas investigações.',
        principles: [
          'Arquitetura suficiente',
          'Implementação imediata',
          'Evolução contínua',
          'Conhecimento aberto',
          'Tecnologia a serviço das pessoas',
        ],
      },
    },
    {
      id: 'acompanhe',
      type: 'cta',
      data: {
        title: 'Acompanhe a construção desde a fundação',
        description:
          'O Instituto Logos está sendo desenvolvido publicamente. Código, decisões arquiteturais, investigações e documentos serão publicados conforme o projeto evoluir.',
        action: {
          label: 'Ver no GitHub',
          href: 'https://github.com/lookjota',
          external: true,
        },
      },
    },
    {
      id: 'rodape',
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
