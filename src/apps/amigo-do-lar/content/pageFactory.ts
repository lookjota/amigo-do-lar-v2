import type { JsonLdObject } from '../../../domain/metadata/PageMetadata'
import type { Page } from '../../../domain/pages/Page'
import type {
  FaqItem,
  ImageMediaAsset,
  PlaceholderMediaAsset,
  PageSection,
} from '../../../domain/pages/PageSection'
import { absoluteUrl, createWhatsAppUrl, siteConfig } from '../config/site'
import { getContextualWhatsAppUrl } from '../config/whatsapp'
import { houseListSection, serviceStandardSection } from './internalSections'
import type { ServiceAreaDefinition } from '../data/serviceAreas'
import {
  findServiceArea,
  publishedServiceAreas,
  serviceAreas,
} from '../data/serviceAreas'
import type { ServiceDefinition } from '../data/services'
import { services } from '../data/services'

interface PageInput {
  id: string
  slug: string
  title: string
  description: string
  sections: PageSection[]
  schemas?: JsonLdObject[]
  index?: boolean
}

const currentHeroMedia: ImageMediaAsset = {
  kind: 'image',
  src: '/joao.png',
  alt: 'Profissional do Amigo do Lar',
  width: 1448,
  height: 1086,
  aspectRatio: '4:3',
  productionStatus: 'temporary-fallback',
}

const commonFaq: FaqItem[] = [
  {
    question: 'Como solicitar atendimento?',
    answer:
      'Envie pelo WhatsApp uma descrição da necessidade e, quando possível, fotos do local ou do item que precisa de atenção.',
  },
  {
    question: 'O serviço é combinado antes da execução?',
    answer:
      'Sim. As informações são avaliadas e o escopo é alinhado antes da execução, incluindo a necessidade de materiais.',
  },
  {
    question: 'Quais regiões são atendidas?',
    answer:
      'O atendimento começa por regiões de Brasília e proximidades listadas na página de áreas atendidas, sempre sujeito à confirmação de disponibilidade.',
  },
]

const processSection: PageSection = {
  id: 'como-funciona',
  type: 'process-steps',
  data: {
    eyebrow: 'Como funciona',
    title: 'Um atendimento simples, claro e organizado.',
    items: [
      {
        title: 'Descreva a necessidade',
        description:
          'Envie informações e fotos que ajudem a compreender o serviço.',
      },
      {
        title: 'Avaliamos as informações',
        description:
          'Verificamos o escopo, as condições conhecidas e o que precisa ser esclarecido.',
      },
      {
        title: 'Combinamos o serviço',
        description:
          'Alinhamos a demanda, materiais e condições antes da execução.',
      },
      {
        title: 'Realizamos a execução',
        description:
          'O trabalho é conduzido com organização e cuidado com o imóvel.',
      },
    ],
  },
}

function whatsappAction(context: string) {
  return {
    label: 'Falar pelo WhatsApp',
    href: createWhatsAppUrl(
      `Olá! Gostaria de solicitar atendimento para ${context}.`,
    ),
    external: true,
  }
}

function ctaSection(context: string, serviceSlug?: string): PageSection {
  return {
    id: 'solicitar-atendimento',
    type: 'call-to-action',
    data: {
      eyebrow: 'Próximo passo',
      title: 'Conte o que precisa de atenção no seu lar.',
      description:
        'Envie uma descrição e fotos pelo WhatsApp para iniciarmos a avaliação do atendimento.',
      primaryAction: {
        ...whatsappAction(context),
        label: 'Pedir orçamento pelo WhatsApp',
      },
      secondaryAction: {
        label: 'Preencher solicitação',
        href: `/solicitar-atendimento${serviceSlug ? `?servico=${serviceSlug}` : ''}`,
      },
    },
  }
}

function breadcrumbSchema(
  items: { name: string; path: string }[],
): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

function webPageSchema(
  name: string,
  description: string,
  slug: string,
): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: absoluteUrl(slug),
    inLanguage: siteConfig.locale,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.siteName,
      url: absoluteUrl('/'),
    },
  }
}

function faqSchema(items: FaqItem[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

function createPage(input: PageInput): Page {
  return {
    id: input.id,
    slug: input.slug,
    metadata: {
      title: input.title,
      description: input.description,
      author: siteConfig.business.name,
      locale: siteConfig.locale,
      canonicalUrl: absoluteUrl(input.slug),
      siteName: siteConfig.siteName,
      robots: {
        index: input.index ?? true,
        follow: input.index ?? true,
      },
      updatedAt: '2026-07-29',
      structuredData: [
        webPageSchema(input.title, input.description, input.slug),
        ...(input.schemas ?? []),
      ],
    },
    sections: input.sections,
  }
}

const serviceLinks = services.map((service) => ({
  label: service.name,
  href: `/servicos/${service.slug}`,
  description: service.shortDescription,
}))

const areaLinks = publishedServiceAreas.map((area) => ({
  label: area.name,
  href: `/areas-atendidas/${area.slug}`,
  description: area.profile,
}))

export const homePage = createPage({
  id: 'amigo-do-lar-home',
  slug: '/',
  title: 'Amigo do Lar — Serviços residenciais em Brasília',
  description:
    'Serviços e pequenos reparos residenciais em Brasília, com comunicação clara, organização e cuidado com o imóvel.',
  schemas: [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.business.name,
      description: siteConfig.business.description,
      url: absoluteUrl('/'),
      areaServed: serviceAreas.map((area) => area.name),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.siteName,
      url: absoluteUrl('/'),
      inLanguage: siteConfig.locale,
    },
    faqSchema(commonFaq),
  ],
  sections: [
    {
      id: 'inicio',
      type: 'hero',
      data: {
        variant: 'home',
        media: currentHeroMedia,
        eyebrow: 'SERVIÇOS RESIDENCIAIS EM BRASÍLIA',
        title: 'Sua casa cuidada com padrão profissional.',
        description:
          'Reparos, instalações e manutenção residencial com orçamento claro, profissionais bem apresentados e cuidado do início ao fim.',
        motto: 'Envie fotos e uma breve descrição do que precisa resolver.',
        actions: [
          {
            label: 'Pedir orçamento pelo WhatsApp',
            href: createWhatsAppUrl(
              'Vim pelo site do Amigo do Lar e gostaria de pedir um orçamento.',
            ),
            external: true,
          },
          { label: 'Ver serviços', href: '/servicos' },
        ],
      },
    },
    {
      id: 'confianca',
      type: 'trust-features',
      data: {
        variant: 'strip',
        eyebrow: 'Confiança na prática',
        title: 'Condições do atendimento',
        items: [
          { title: 'Orçamento claro', description: '' },
          { title: 'Pix, dinheiro ou cartão', description: '' },
          { title: 'Mesmo dia conforme disponibilidade', description: '' },
          { title: 'Garantia conforme o serviço', description: '' },
        ],
      },
    },
    {
      id: 'problema',
      type: 'problem',
      data: {
        eyebrow: 'A CASA NÃO PARA',
        title: 'Manutenção da casa não deveria virar outra tarefa para administrar.',
        paragraphs: [
          'Pequenas pendências se acumulam pela casa. Resolver cada uma delas pode significar coordenar diferentes profissionais e atendimentos.',
        ],
        media: { kind: 'placeholder', label: '[ASSET EDITORIAL — PEQUENAS PENDÊNCIAS RESIDENCIAIS]', aspectRatio: '4:3' },
      },
    },
    {
      id: 'solucao',
      type: 'solution',
      data: {
        eyebrow: 'AMIGO DO LAR',
        title: 'Um contato para cuidar das pequenas demandas da sua casa.',
        paragraphs: ['Conte o que precisa resolver. Avaliamos a necessidade, organizamos o atendimento e conduzimos o serviço do orçamento à conclusão.'],
        action: { label: 'Enviar minha necessidade', href: createWhatsAppUrl('Vim pelo site do Amigo do Lar e quero enviar minha necessidade.'), external: true },
      },
    },
    {
      id: 'servicos',
      type: 'services-grid',
      data: {
        variant: 'editorial',
        action: { label: 'Ver todos', href: '/servicos' },
        eyebrow: 'Serviços',
        title: 'Soluções para as demandas do dia a dia.',
        description:
          'Conheça os serviços principais e consulte o escopo adequado para cada necessidade.',
        items: serviceLinks,
      },
    },
    {
      id: 'lista-da-casa',
      type: 'house-list',
      data: {
        eyebrow: 'LISTA DA CASA',
        title: 'Tem várias coisas para resolver? Mande a Lista da Casa.',
        description: 'Reunimos as demandas, avaliamos em conjunto e organizamos um único atendimento.',
        exampleLabel: 'Exemplo de uma Lista da Casa',
        items: ['instalar suporte da TV', 'trocar torneira', 'ajustar porta', 'instalar cortina', 'fixar prateleiras'],
        action: { label: 'Enviar minha Lista da Casa', href: createWhatsAppUrl('Quero enviar minha Lista da Casa.'), external: true },
      },
    },
    {
      id: 'como-funciona',
      type: 'service-standard',
      data: {
        eyebrow: 'PADRÃO AMIGO DO LAR',
        title: 'O serviço começa antes de chegar à sua casa.',
        description: 'Um padrão para deixar cada etapa mais clara e previsível.',
        stages: [
          { title: 'ANTES', steps: ['Entender', 'Avaliar', 'Orçar', 'Agendar'], media: { kind: 'placeholder', label: '[ASSET PROCESSO — ANTES]', aspectRatio: '4:3' } },
          { title: 'DURANTE', steps: ['Confirmar', 'Proteger', 'Executar', 'Comunicar'], media: { kind: 'placeholder', label: '[ASSET PROCESSO — DURANTE]', aspectRatio: '4:3' } },
          { title: 'DEPOIS', steps: ['Testar', 'Conferir', 'Organizar', 'Limpar'], media: { kind: 'placeholder', label: '[ASSET PROCESSO — DEPOIS]', aspectRatio: '4:3' } },
        ],
      },
    },
    {
      id: 'sobre',
      type: 'founders',
      data: {
        eyebrow: 'QUEM ESTÁ ENTRANDO NA SUA CASA',
        title: 'Uma operação familiar. Um padrão profissional.',
        paragraphs: [
          'O Amigo do Lar nasce para facilitar a manutenção da casa sem transformar uma demanda simples em uma experiência confusa.',
          'A proposta é compreender a necessidade, combinar um escopo responsável e conduzir a execução com respeito pelo imóvel e por quem vive nele.',
        ],
        media: { kind: 'placeholder', label: '[ASSET REAL — JOÃO + PAI UNIFORMIZADOS]', aspectRatio: '5:4' },
      },
    },
    {
      id: 'areas-atendidas',
      type: 'areas-grid',
      data: {
        variant: 'editorial',
        action: { label: 'Ver áreas atendidas', href: '/areas-atendidas' },
        eyebrow: 'Áreas atendidas',
        title: 'Atendimento em Brasília e regiões próximas.',
        description:
          'Consulte as regiões com páginas publicadas. Outras áreas listadas podem ser confirmadas pelo WhatsApp.',
        items: areaLinks,
      },
    },
    {
      id: 'perguntas-frequentes',
      type: 'faq',
      data: {
        variant: 'home',
        eyebrow: 'Perguntas frequentes',
        title: 'Informações para solicitar seu atendimento.',
        items: commonFaq,
      },
    },
    {
      id: 'solicitar-atendimento',
      type: 'call-to-action',
      data: {
        variant: 'home',
        eyebrow: 'PRÓXIMO PASSO',
        title: 'O que está esperando para ser resolvido na sua casa?',
        description: 'Envie fotos e conte o que precisa. A partir daí organizamos o próximo passo.',
        primaryAction: { label: 'Pedir orçamento pelo WhatsApp', href: createWhatsAppUrl('Vim pelo site do Amigo do Lar e gostaria de pedir um orçamento.'), external: true },
        secondaryAction: { label: 'Preencher solicitação', href: '/solicitar-atendimento' },
      },
    },
  ],
})

function editorialMedia(subject: string): PlaceholderMediaAsset {
  return { kind: 'placeholder', label: `[ASSET REAL — ${subject}]`, aspectRatio: '4:3' }
}

function routeWhatsAppAction(pathname: string) {
  return { label: 'Pedir orçamento pelo WhatsApp', href: getContextualWhatsAppUrl(pathname), external: true }
}

function routeCtaSection(pathname: string, serviceSlug?: string): PageSection {
  const section = ctaSection('', serviceSlug)
  if (section.type !== 'call-to-action') return section
  return { ...section, data: { ...section.data, primaryAction: routeWhatsAppAction(pathname) } }
}

export const servicesPage = createPage({
  id: 'amigo-do-lar-services',
  slug: '/servicos',
  title: 'Serviços residenciais em Brasília — Amigo do Lar',
  description:
    'Conheça os serviços de elétrica, hidráulica, montagem, fechaduras, pintura e pequenos reparos do Amigo do Lar.',
  schemas: [
    breadcrumbSchema([
      { name: 'Início', path: '/' },
      { name: 'Serviços', path: '/servicos' },
    ]),
  ],
  sections: [
    {
      id: 'inicio',
      type: 'hero',
      data: {
        variant: 'internal',
        media: editorialMedia('PROCESSO / PROTEÇÃO'),
        eyebrow: 'Serviços residenciais',
        title: 'A solução certa começa com uma necessidade bem compreendida.',
        description:
          'Explore os serviços disponíveis e veja como cada atendimento é avaliado, combinado e executado.',
        motto: 'Escopo claro e execução cuidadosa.',
        actions: [routeWhatsAppAction('/servicos')],
      },
    },
    {
      id: 'lista-de-servicos',
      type: 'services-grid',
      data: {
        eyebrow: 'O que fazemos',
        title: 'Serviços para cuidar dos detalhes da sua casa.',
        items: serviceLinks,
        variant: 'editorial',
      },
    },
    houseListSection,
    serviceStandardSection,
    routeCtaSection('/servicos'),
  ],
})

function createServicePage(service: ServiceDefinition): Page {
  const slug = `/servicos/${service.slug}`
  const faqItems = [...service.faq, commonFaq[0]]
  const related = services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3)
    .map((item) => ({
      label: item.name,
      href: `/servicos/${item.slug}`,
      description: item.shortDescription,
    }))

  return createPage({
    id: `amigo-do-lar-service-${service.slug}`,
    slug,
    title: `${service.name} residencial em Brasília — Amigo do Lar`,
    description: service.shortDescription,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `${service.name} residencial`,
        description: service.shortDescription,
        provider: {
          '@type': 'Organization',
          name: siteConfig.business.name,
          url: absoluteUrl('/'),
        },
        areaServed: serviceAreas.map((area) => area.name),
        url: absoluteUrl(slug),
      },
      breadcrumbSchema([
        { name: 'Início', path: '/' },
        { name: 'Serviços', path: '/servicos' },
        { name: service.name, path: slug },
      ]),
      faqSchema(faqItems),
    ],
    sections: [
      {
        id: 'inicio',
        type: 'hero',
        data: {
          variant: 'service',
          media: editorialMedia(`${service.name.toUpperCase()} / EXECUÇÃO`),
          eyebrow: 'Serviço residencial',
          title: `${service.name} residencial com avaliação e cuidado.`,
          description: service.introduction,
          motto: 'Atendimento sujeito à avaliação do caso.',
          actions: [
            {
              ...routeWhatsAppAction(slug),
              label: 'Pedir orçamento pelo WhatsApp',
            },
            { label: 'Preencher solicitação', href: `/solicitar-atendimento?servico=${service.slug}` },
          ],
        },
      },
      {
        id: 'detalhes-do-servico',
        type: 'service-details',
        data: {
          eyebrow: 'Escopo do atendimento',
          title: `Como o serviço de ${service.name.toLowerCase()} pode ajudar.`,
          introduction:
            'Os exemplos abaixo orientam a conversa inicial. A possibilidade de execução depende das condições verificadas.',
          groups: [
            { title: 'Necessidades avaliadas', items: service.problems },
            { title: 'Exemplos de demandas', items: service.examples },
          ],
          notice: service.limitations,
        },
      },
      processSection,
      serviceStandardSection,
      {
        id: 'areas-atendidas',
        type: 'areas-grid',
        data: {
          eyebrow: 'Onde atendemos',
          title: `${service.name} em regiões de Brasília.`,
          description:
            'Consulte as áreas publicadas e confirme a disponibilidade para seu endereço.',
          items: areaLinks.slice(0, 6),
          variant: 'editorial',
        },
      },
      {
        id: 'perguntas-frequentes',
        type: 'faq',
        data: {
          eyebrow: 'Dúvidas sobre o serviço',
          title: `Perguntas frequentes sobre ${service.name.toLowerCase()}.`,
          items: faqItems,
        },
      },
      {
        id: 'servicos-relacionados',
        type: 'related-links',
        data: {
          eyebrow: 'Outras soluções',
          title: 'Serviços residenciais relacionados.',
          items: related,
        },
      },
      routeCtaSection(slug, service.slug),
    ],
  })
}

export const servicePages = services.map(createServicePage)

export const areasPage = createPage({
  id: 'amigo-do-lar-areas',
  slug: '/areas-atendidas',
  title: 'Áreas atendidas em Brasília — Amigo do Lar',
  description:
    'Consulte as regiões atendidas pelo Amigo do Lar em Brasília e solicite a confirmação de disponibilidade.',
  schemas: [
    breadcrumbSchema([
      { name: 'Início', path: '/' },
      { name: 'Áreas atendidas', path: '/areas-atendidas' },
    ]),
  ],
  sections: [
    {
      id: 'inicio',
      type: 'hero',
      data: {
        variant: 'internal',
        media: editorialMedia('PROCESSO / PROTEÇÃO'),
        eyebrow: 'Atendimento local',
        title: 'Serviços residenciais em Brasília e regiões próximas.',
        description:
          'Veja as regiões com informações publicadas e confirme pelo WhatsApp o atendimento no seu endereço.',
        motto: 'Disponibilidade confirmada caso a caso.',
        actions: [routeWhatsAppAction('/areas-atendidas')],
      },
    },
    {
      id: 'regioes',
      type: 'areas-grid',
      data: {
        eyebrow: 'Regiões publicadas',
        title: 'Encontre informações sobre sua região.',
        items: areaLinks,
        variant: 'editorial',
      },
    },
    {
      id: 'outras-regioes',
      type: 'about',
      data: {
        eyebrow: 'Cobertura inicial',
        title: 'Outras regiões com atendimento sob consulta.',
        paragraphs: [
          `Também recebemos solicitações de ${serviceAreas
            .filter((area) => !area.published)
            .map((area) => area.name)
            .join(', ')}.`,
          'A inclusão nesta lista não representa disponibilidade automática. Envie o endereço aproximado e a necessidade para confirmação.',
        ],
      },
    },
    routeCtaSection('/areas-atendidas'),
  ],
})

function createAreaPage(area: ServiceAreaDefinition): Page {
  const slug = `/areas-atendidas/${area.slug}`
  const nearbyAreas = area.nearby
    .map(findServiceArea)
    .filter((item): item is ServiceAreaDefinition => Boolean(item))
  const localFaq: FaqItem[] = [
    {
      question: `Como confirmar atendimento em ${area.name}?`,
      answer:
        'Envie a localização aproximada e a descrição do serviço pelo WhatsApp. A disponibilidade é confirmada durante o contato.',
    },
    {
      question: `Quais serviços estão disponíveis em ${area.name}?`,
      answer:
        'As demandas de elétrica, hidráulica, montagem, portas, pintura e pequenos reparos são avaliadas conforme o escopo e as condições apresentadas.',
    },
  ]

  return createPage({
    id: `amigo-do-lar-area-${area.slug}`,
    slug,
    title: `Serviços residenciais em ${area.name} — Amigo do Lar`,
    description: `Atendimento para pequenos reparos e serviços residenciais em ${area.name}, com avaliação, clareza e cuidado.`,
    schemas: [
      breadcrumbSchema([
        { name: 'Início', path: '/' },
        { name: 'Áreas atendidas', path: '/areas-atendidas' },
        { name: area.name, path: slug },
      ]),
      faqSchema(localFaq),
    ],
    sections: [
      {
        id: 'inicio',
        type: 'hero',
        data: {
          variant: 'location',
          media: editorialMedia('PROCESSO / CUIDADO COM O IMÓVEL'),
          eyebrow: 'Atendimento na sua região',
          title: `Serviços residenciais em ${area.name}.`,
          description:
            'Atendimento organizado para pequenas manutenções e reparos, sempre com confirmação de disponibilidade e avaliação da demanda.',
          motto: 'Serviço combinado de acordo com cada necessidade.',
          actions: [routeWhatsAppAction(slug)],
        },
      },
      {
        id: 'atendimento-local',
        type: 'local-area-introduction',
        data: {
          eyebrow: `Amigo do Lar em ${area.name}`,
          title: 'Atendimento pensado para a rotina do imóvel.',
          paragraphs: [
            area.profile,
            `${area.commonNeeds} Cada solicitação é analisada individualmente, sem pressupor o estado do imóvel ou a complexidade do serviço.`,
          ],
        },
      },
      {
        id: 'servicos-disponiveis',
        type: 'services-grid',
        data: {
          eyebrow: 'Serviços disponíveis',
          title: `Demandas residenciais avaliadas em ${area.name}.`,
          items: serviceLinks,
        variant: 'editorial',
        },
      },
      processSection,
      {
        id: 'perguntas-locais',
        type: 'faq',
        data: {
          eyebrow: 'Atendimento local',
          title: `Perguntas sobre atendimento em ${area.name}.`,
          items: localFaq,
        },
      },
      {
        id: 'regioes-proximas',
        type: 'related-links',
        data: {
          eyebrow: 'Regiões relacionadas',
          title: 'Consulte também áreas próximas.',
          items: nearbyAreas.map((item) => ({
            label: item.name,
            href: `/areas-atendidas/${item.slug}`,
            description: item.profile,
          })),
        },
      },
      routeCtaSection(slug),
    ],
  })
}

export const areaPages = publishedServiceAreas.map(createAreaPage)

export const aboutPage = createPage({
  id: 'amigo-do-lar-about',
  slug: '/sobre',
  title: 'Sobre o Amigo do Lar — Serviços residenciais',
  description:
    'Conheça a proposta do Amigo do Lar para serviços residenciais organizados, claros e cuidadosos.',
  schemas: [
    breadcrumbSchema([
      { name: 'Início', path: '/' },
      { name: 'Sobre', path: '/sobre' },
    ]),
  ],
  sections: [
    {
      id: 'inicio',
      type: 'hero',
      data: {
        variant: 'internal',
        media: editorialMedia('FUNDADORES / JOÃO + PAI / UNIFORME / AMBIENTE RESIDENCIAL'),
        eyebrow: 'Sobre',
        title: 'Uma operação familiar. Um padrão profissional.',
        description:
          'João e seu pai estão à frente de uma operação familiar, com comunicação clara, organização e cuidado com a sua casa.',
        motto: 'Respeito pelo imóvel e pela necessidade apresentada.',
        actions: [whatsappAction('conhecer o atendimento')],
      },
    },
    {
      id: 'nossa-proposta',
      type: 'about',
      data: {
        eyebrow: 'Quem está entrando na sua casa',
        title: 'Um serviço próximo, sem exageros e com responsabilidade.',
        paragraphs: [
          'A casa reúne detalhes que precisam funcionar bem. Quando algo exige atenção, o cliente precisa entender o que será feito e sentir que seu espaço será respeitado.',
          'Por isso, o atendimento parte de uma boa descrição, passa pela avaliação do escopo e chega à execução somente depois dos alinhamentos necessários.',
        ],
      },
    },
    {
      id: 'principios',
      type: 'benefits',
      data: {
        eyebrow: 'Princípios',
        title: 'O que orienta cada atendimento.',
        items: [
          {
            title: 'Clareza',
            description:
              'Comunicar o que foi compreendido e o que ainda precisa ser avaliado.',
          },
          {
            title: 'Organização',
            description:
              'Preparar o serviço e conduzir as etapas de forma objetiva.',
          },
          {
            title: 'Cuidado',
            description:
              'Considerar o imóvel, as pessoas e os limites de cada demanda.',
          },
        ],
      },
    },
    serviceStandardSection,
    routeCtaSection('/sobre'),
  ],
})

export const houseListPage = createPage({
  id: 'amigo-do-lar-house-list',
  slug: '/lista-da-casa',
  title: 'Lista da Casa — Pequenas pendências em um contato | Amigo do Lar',
  description: 'Reúna pequenas pendências da casa, envie sua lista e fotos pelo WhatsApp e solicite uma avaliação. Orçamento antes da execução, mediante aprovação.',
  schemas: [breadcrumbSchema([
    { name: 'Início', path: '/' },
    { name: 'Lista da Casa', path: '/lista-da-casa' },
  ])],
  sections: [
    {
      id: 'inicio', type: 'hero',
      data: {
        variant: 'internal',
        media: editorialMedia('LISTA DA CASA / AMBIENTE RESIDENCIAL'),
        eyebrow: 'Lista da Casa',
        title: 'Várias pequenas pendências. Um primeiro contato.',
        description: 'Reúna o que precisa de atenção na sua casa e envie uma lista para avaliação. Organizamos a conversa sobre as demandas, o escopo e os próximos passos.',
        motto: 'Orçamento antes da execução. Serviço mediante aprovação.',
        actions: [routeWhatsAppAction('/lista-da-casa')],
      },
    },
    {
      id: 'para-quem', type: 'about',
      data: {
        eyebrow: 'Para quem serve', title: 'Para quem tem mais de uma coisa para resolver.',
        paragraphs: [
          'Uma porta precisando de ajuste, um acessório para instalar, um móvel para montar. A Lista da Casa ajuda a reunir pequenas demandas residenciais em uma solicitação organizada.',
          'Cada item é avaliado conforme as condições do imóvel e o escopo do serviço. Os exemplos são possibilidades de atendimento, não registros de trabalhos realizados.',
        ],
      },
    },
    { ...houseListSection, data: { ...houseListSection.data, action: routeWhatsAppAction('/lista-da-casa') } },
    {
      id: 'como-funciona', type: 'process-steps',
      data: {
        eyebrow: 'Como enviar sua lista', title: 'Da lista ao serviço, com tudo combinado.',
        items: [
          { title: 'Liste as pendências', description: 'Descreva cada item, informe sua região e, se possível, envie fotos pelo WhatsApp.' },
          { title: 'Avaliamos as demandas', description: 'Conversamos sobre as condições, os limites e o que precisa ser verificado em cada item.' },
          { title: 'Receba o orçamento', description: 'Escopo, orçamento e materiais são combinados antes da execução. A compra de materiais depende da necessidade e do que for acordado.' },
          { title: 'Aprove para seguir', description: 'A execução acontece mediante aprovação e combinação da disponibilidade, com organização e cuidado com o imóvel.' },
        ],
      },
    },
    serviceStandardSection,
    {
      id: 'informacoes-praticas', type: 'about',
      data: {
        eyebrow: 'Antes de solicitar', title: 'Cada lista tem seu próprio escopo.',
        paragraphs: [
          'A avaliação define quais demandas podem ser atendidas e as condições de execução. Risco, complexidade ou necessidade de especialização podem limitar o atendimento.',
          'Materiais e responsabilidade pela compra são combinados conforme a necessidade. A garantia é conforme o serviço.',
        ],
      },
    },
    { id: 'links-uteis', type: 'related-links', data: {
      eyebrow: 'Planeje seu atendimento', title: 'Consulte serviços e regiões.',
      items: [{ label: 'Todos os serviços', href: '/servicos' }, { label: 'Áreas atendidas', href: '/areas-atendidas' }],
    } },
    routeCtaSection('/lista-da-casa'),
  ],
})

export const contactPage = createPage({
  id: 'amigo-do-lar-contact',
  slug: '/contato',
  title: 'Contato e atendimento — Amigo do Lar',
  description:
    'Entre em contato com o Amigo do Lar pelo WhatsApp e descreva sua necessidade residencial.',
  schemas: [
    breadcrumbSchema([
      { name: 'Início', path: '/' },
      { name: 'Contato', path: '/contato' },
    ]),
  ],
  sections: [
    {
      id: 'inicio',
      type: 'hero',
      data: {
        variant: 'internal',
        media: editorialMedia('PROCESSO / PROTEÇÃO'),
        eyebrow: 'Contato',
        title: 'Vamos entender o que seu lar precisa.',
        description:
          'Envie uma descrição objetiva e, se possível, fotos. Essas informações ajudam a iniciar a avaliação.',
        motto: 'Solicite pelo site ou continue pelo WhatsApp quando preferir.',
        actions: [whatsappAction('um atendimento residencial')],
      },
    },
    {
      id: 'solicitar-orcamento',
      type: 'quote-request',
      data: {
        eyebrow: 'Solicitação de orçamento',
        title: 'Conte o que seu lar precisa.',
        description:
          'Preencha as informações essenciais para iniciarmos a avaliação. O envio não confirma automaticamente a execução do serviço.',
      },
    },
    {
      id: 'fale-conosco',
      type: 'contact',
      data: {
        eyebrow: 'WhatsApp',
        title: 'Prepare as informações principais.',
        description:
          'Informe a região, descreva a necessidade e envie fotos do ponto ou item. Não compartilhe documentos ou dados sensíveis.',
        action: whatsappAction('um atendimento residencial'),
      },
    },
    processSection,
  ],
})

export const faqPage = createPage({
  id: 'amigo-do-lar-faq',
  slug: '/perguntas-frequentes',
  title: 'Perguntas frequentes — Amigo do Lar',
  description:
    'Respostas sobre atendimento, avaliação, materiais, serviços e regiões atendidas pelo Amigo do Lar.',
  schemas: [
    breadcrumbSchema([
      { name: 'Início', path: '/' },
      { name: 'Perguntas frequentes', path: '/perguntas-frequentes' },
    ]),
    faqSchema([
      ...commonFaq,
      {
        question: 'Como funcionam os materiais?',
        answer:
          'A necessidade de materiais é avaliada conforme o serviço. A responsabilidade pela compra é combinada antes da execução.',
      },
      {
        question: 'Toda solicitação pode ser executada?',
        answer:
          'Não. Risco, complexidade, condições do local ou necessidade de especialização podem limitar o atendimento.',
      },
    ]),
  ],
  sections: [
    {
      id: 'inicio',
      type: 'hero',
      data: {
        variant: 'internal',
        media: editorialMedia('PROCESSO / PROTEÇÃO'),
        eyebrow: 'Perguntas frequentes',
        title: 'Informação clara antes de solicitar um serviço.',
        description:
          'Consulte as respostas principais sobre o funcionamento do atendimento.',
        motto: 'Ainda tem dúvidas? Fale diretamente pelo WhatsApp.',
        actions: [whatsappAction('tirar uma dúvida')],
      },
    },
    {
      id: 'respostas',
      type: 'faq',
      data: {
        eyebrow: 'Dúvidas comuns',
        title: 'O que você precisa saber.',
        items: [
          ...commonFaq,
          {
            question: 'Como funcionam os materiais?',
            answer:
              'A necessidade de materiais é avaliada conforme o serviço. A responsabilidade pela compra é combinada antes da execução.',
          },
          {
            question: 'Toda solicitação pode ser executada?',
            answer:
              'Não. Risco, complexidade, condições do local ou necessidade de especialização podem limitar o atendimento.',
          },
        ],
      },
    },
    ctaSection('tirar uma dúvida'),
  ],
})

function createLegalPage(
  type: 'privacy' | 'terms',
  title: string,
  description: string,
  sections: {
    title: string
    paragraphs: string[]
  }[],
): Page {
  const slug =
    type === 'privacy' ? '/politica-de-privacidade' : '/termos-de-uso'

  return createPage({
    id: `amigo-do-lar-${type}`,
    slug,
    title: `${title} — Amigo do Lar`,
    description,
    schemas: [
      breadcrumbSchema([
        { name: 'Início', path: '/' },
        { name: title, path: slug },
      ]),
    ],
    sections: [
      {
        id: 'inicio',
        type: 'hero',
        data: {
          variant: 'internal',
          media: editorialMedia('PROCESSO / PROTEÇÃO'),
          eyebrow: 'Informações legais',
          title,
          description,
          motto: 'Transparência sobre o uso deste site.',
          actions: [],
        },
      },
      {
        id: 'conteudo-legal',
        type: 'legal-content',
        data: {
          eyebrow: 'Documento',
          title: 'Informações aplicáveis',
          updatedAt: '29 de julho de 2026',
          sections,
        },
      },
    ],
  })
}

export const privacyPage = createLegalPage(
  'privacy',
  'Política de privacidade',
  'Saiba como as informações enviadas ao Amigo do Lar são tratadas.',
  [
    {
      title: 'Informações fornecidas',
      paragraphs: [
        'O formulário de solicitação coleta nome, telefone, e-mail opcional, serviço, região, descrição e preferência de contato para registrar e responder ao pedido de orçamento.',
        'Ao continuar pelo WhatsApp, você compartilha informações diretamente pela plataforma escolhida.',
        'Envie somente os dados necessários para avaliar a solicitação. Evite documentos, senhas, informações financeiras ou outros dados sensíveis.',
      ],
    },
    {
      title: 'Uso das informações',
      paragraphs: [
        'As informações recebidas podem ser utilizadas para compreender a necessidade, responder ao contato e organizar o possível atendimento.',
      ],
    },
    {
      title: 'Medição opcional',
      paragraphs: [
        'Ferramentas de medição poderão ser ativadas por configuração técnica. Quando utilizadas, devem respeitar a legislação e as escolhas aplicáveis ao visitante.',
      ],
    },
  ],
)

export const termsPage = createLegalPage(
  'terms',
  'Termos de uso',
  'Condições gerais para uso do site e consulta aos serviços do Amigo do Lar.',
  [
    {
      title: 'Conteúdo informativo',
      paragraphs: [
        'As páginas apresentam serviços sujeitos à avaliação. A publicação de um exemplo não representa confirmação automática de execução.',
      ],
    },
    {
      title: 'Solicitações de atendimento',
      paragraphs: [
        'Escopo, materiais, disponibilidade e demais condições são combinados diretamente antes de qualquer execução.',
      ],
    },
    {
      title: 'Uso responsável',
      paragraphs: [
        'Em situações com risco imediato, interrompa o uso do item afetado e procure o serviço público ou profissional especializado adequado.',
      ],
    },
  ],
)

export const notFoundPage = createPage({
  id: 'amigo-do-lar-not-found',
  slug: '/404',
  title: 'Página não encontrada — Amigo do Lar',
  description:
    'O endereço informado não corresponde a uma página publicada pelo Amigo do Lar.',
  index: false,
  sections: [
    {
      id: 'pagina-nao-encontrada',
      type: 'not-found',
      data: {
        code: 'Erro 404',
        title: 'Esta página não foi encontrada.',
        description:
          'O endereço pode ter mudado ou não existir. Volte ao início para continuar navegando.',
        action: {
          label: 'Voltar ao início',
          href: '/',
        },
      },
    },
  ],
})

export const pages: Page[] = [
  homePage,
  servicesPage,
  ...servicePages,
  areasPage,
  ...areaPages,
  aboutPage,
  houseListPage,
  contactPage,
  faqPage,
  privacyPage,
  termsPage,
]
