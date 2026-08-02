import type { JsonLdObject } from '../../../domain/metadata/PageMetadata'
import type { Page } from '../../../domain/pages/Page'
import type {
  FaqItem,
  PageSection,
} from '../../../domain/pages/PageSection'
import { absoluteUrl, createWhatsAppUrl, siteConfig } from '../config/site'
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

function ctaSection(context: string): PageSection {
  return {
    id: 'solicitar-atendimento',
    type: 'call-to-action',
    data: {
      eyebrow: 'Próximo passo',
      title: 'Conte o que precisa de atenção no seu lar.',
      description:
        'Envie uma descrição e fotos pelo WhatsApp para iniciarmos a avaliação do atendimento.',
      primaryAction: whatsappAction(context),
      secondaryAction: {
        label: 'Consultar áreas atendidas',
        href: '/areas-atendidas',
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
        eyebrow: 'Serviços residenciais em Brasília',
        title: 'Seu lar merece um serviço à altura da sua confiança.',
        description:
          'Pequenos reparos e serviços residenciais conduzidos com clareza, organização e cuidado em cada etapa.',
        motto: 'Atendimento conforme a necessidade apresentada.',
        actions: [
          whatsappAction('um serviço residencial'),
          { label: 'Ver serviços', href: '/servicos' },
        ],
      },
    },
    {
      id: 'confianca',
      type: 'trust-features',
      data: {
        eyebrow: 'Confiança na prática',
        title: 'O cuidado começa antes da execução.',
        items: [
          {
            title: 'Atendimento organizado',
            description:
              'Informações e próximos passos apresentados de forma objetiva.',
          },
          {
            title: 'Cuidado com o imóvel',
            description:
              'A execução considera o ambiente, as superfícies e a organização do local.',
          },
          {
            title: 'Comunicação clara',
            description:
              'Dúvidas, materiais e limitações são alinhados durante o atendimento.',
          },
          {
            title: 'Escopo responsável',
            description:
              'O serviço é definido conforme a necessidade e as condições avaliadas.',
          },
        ],
      },
    },
    {
      id: 'servicos',
      type: 'services-grid',
      data: {
        eyebrow: 'Serviços',
        title: 'Soluções para as demandas do dia a dia.',
        description:
          'Conheça os serviços principais e consulte o escopo adequado para cada necessidade.',
        items: serviceLinks,
      },
    },
    processSection,
    {
      id: 'areas-atendidas',
      type: 'areas-grid',
      data: {
        eyebrow: 'Áreas atendidas',
        title: 'Atendimento em Brasília e regiões próximas.',
        description:
          'Consulte as regiões com páginas publicadas. Outras áreas listadas podem ser confirmadas pelo WhatsApp.',
        items: areaLinks,
      },
    },
    {
      id: 'sobre',
      type: 'about',
      data: {
        eyebrow: 'Sobre o Amigo do Lar',
        title: 'Serviço residencial com presença, clareza e cuidado.',
        paragraphs: [
          'O Amigo do Lar nasce para facilitar a manutenção da casa sem transformar uma demanda simples em uma experiência confusa.',
          'A proposta é compreender a necessidade, combinar um escopo responsável e conduzir a execução com respeito pelo imóvel e por quem vive nele.',
        ],
      },
    },
    {
      id: 'perguntas-frequentes',
      type: 'faq',
      data: {
        eyebrow: 'Perguntas frequentes',
        title: 'Informações para solicitar seu atendimento.',
        items: commonFaq,
      },
    },
    ctaSection('um serviço residencial'),
  ],
})

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
        eyebrow: 'Serviços residenciais',
        title: 'A solução certa começa com uma necessidade bem compreendida.',
        description:
          'Explore os serviços disponíveis e veja como cada atendimento é avaliado, combinado e executado.',
        motto: 'Escopo claro e execução cuidadosa.',
        actions: [whatsappAction('serviços residenciais')],
      },
    },
    {
      id: 'lista-de-servicos',
      type: 'services-grid',
      data: {
        eyebrow: 'O que fazemos',
        title: 'Serviços para cuidar dos detalhes da sua casa.',
        items: serviceLinks,
      },
    },
    processSection,
    ctaSection('serviços residenciais'),
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
          eyebrow: 'Serviço residencial',
          title: `${service.name} residencial com avaliação e cuidado.`,
          description: service.introduction,
          motto: 'Atendimento sujeito à avaliação do caso.',
          actions: [
            whatsappAction(`serviço de ${service.name.toLowerCase()}`),
            { label: 'Como funciona', href: '#como-funciona' },
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
      {
        id: 'areas-atendidas',
        type: 'areas-grid',
        data: {
          eyebrow: 'Onde atendemos',
          title: `${service.name} em regiões de Brasília.`,
          description:
            'Consulte as áreas publicadas e confirme a disponibilidade para seu endereço.',
          items: areaLinks.slice(0, 6),
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
      ctaSection(`serviço de ${service.name.toLowerCase()}`),
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
        eyebrow: 'Atendimento local',
        title: 'Serviços residenciais em Brasília e regiões próximas.',
        description:
          'Veja as regiões com informações publicadas e confirme pelo WhatsApp o atendimento no seu endereço.',
        motto: 'Disponibilidade confirmada caso a caso.',
        actions: [whatsappAction('consultar atendimento na minha região')],
      },
    },
    {
      id: 'regioes',
      type: 'areas-grid',
      data: {
        eyebrow: 'Regiões publicadas',
        title: 'Encontre informações sobre sua região.',
        items: areaLinks,
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
    ctaSection('consultar atendimento na minha região'),
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
          eyebrow: 'Atendimento na sua região',
          title: `Serviços residenciais em ${area.name}.`,
          description:
            'Atendimento organizado para pequenas manutenções e reparos, sempre com confirmação de disponibilidade e avaliação da demanda.',
          motto: 'Serviço combinado de acordo com cada necessidade.',
          actions: [whatsappAction(`atendimento em ${area.name}`)],
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
      ctaSection(`atendimento em ${area.name}`),
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
        eyebrow: 'Sobre',
        title: 'Confiança se constrói na forma de atender.',
        description:
          'O Amigo do Lar une comunicação clara, organização e cuidado para tornar a manutenção residencial mais simples.',
        motto: 'Respeito pelo imóvel e pela necessidade apresentada.',
        actions: [whatsappAction('conhecer o atendimento')],
      },
    },
    {
      id: 'nossa-proposta',
      type: 'about',
      data: {
        eyebrow: 'Nossa proposta',
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
    ctaSection('um serviço residencial'),
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
  contactPage,
  faqPage,
  privacyPage,
  termsPage,
]
