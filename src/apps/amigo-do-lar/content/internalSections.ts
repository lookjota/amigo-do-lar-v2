import type { PageSection } from '../../../domain/pages/PageSection'

export const houseListSection = {
  id: 'lista-da-casa',
  type: 'house-list',
  data: {
    eyebrow: 'Lista da Casa',
    title: 'Mais de uma pendência? Comece por uma lista.',
    description: 'Reúna as pequenas demandas da casa e solicite uma avaliação organizada em um único contato.',
    exampleLabel: 'Exemplos de demandas que podem ser avaliadas',
    items: ['Ajuste de portas e dobradiças', 'Instalação de acessórios', 'Montagem de móveis', 'Pequenos reparos hidráulicos e elétricos'],
    action: { label: 'Conhecer a Lista da Casa', href: '/lista-da-casa' },
  },
} satisfies PageSection

export const serviceStandardSection = {
  id: 'padrao-amigo-do-lar',
  type: 'service-standard',
  data: {
    eyebrow: 'Padrão Amigo do Lar',
    title: 'Cuidado em cada etapa do atendimento.',
    description: 'Comunicação clara, apresentação e respeito pelo imóvel orientam a forma de trabalhar.',
    stages: [
      { title: 'Antes', steps: ['Entender a necessidade e avaliar o escopo', 'Combinar orçamento, materiais e condições antes da execução'] },
      { title: 'Durante', steps: ['Apresentação e atendimento organizado', 'Cuidado com o ambiente e as superfícies', 'Comunicação sobre dúvidas e limitações'] },
      { title: 'Ao concluir', steps: ['Organização do local de trabalho', 'Alinhamento sobre o serviço executado', 'Garantia conforme o serviço'] },
    ],
  },
} satisfies PageSection
