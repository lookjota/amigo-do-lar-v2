export interface ServiceAreaDefinition {
  slug: string
  name: string
  profile: string
  commonNeeds: string
  nearby: string[]
  published: boolean
}

export const serviceAreas: ServiceAreaDefinition[] = [
  {
    slug: 'taguatinga',
    name: 'Taguatinga',
    profile:
      'Atendimento em apartamentos, casas e imóveis residenciais com diferentes fases de manutenção.',
    commonNeeds:
      'Pequenos ajustes acumulados, instalações, manutenção de componentes e preparação de ambientes para uso ou mudança.',
    nearby: ['aguas-claras', 'guara'],
    published: true,
  },
  {
    slug: 'aguas-claras',
    name: 'Águas Claras',
    profile:
      'Atendimento orientado principalmente a apartamentos, mudanças, instalações e manutenção cotidiana.',
    commonNeeds:
      'Montagem de móveis, instalação de acessórios, ajustes hidráulicos e elétricos localizados.',
    nearby: ['taguatinga', 'guara'],
    published: true,
  },
  {
    slug: 'guara',
    name: 'Guará',
    profile:
      'Atendimento em casas e apartamentos, respeitando as condições de acesso e organização de cada condomínio.',
    commonNeeds:
      'Reparos em portas, instalações residenciais, pintura localizada e manutenção de itens de uso frequente.',
    nearby: ['aguas-claras', 'sudoeste'],
    published: true,
  },
  {
    slug: 'asa-sul',
    name: 'Asa Sul',
    profile:
      'Atendimento em apartamentos e casas que podem reunir componentes de diferentes épocas e padrões construtivos.',
    commonNeeds:
      'Ajustes cuidadosos, substituição de componentes compatíveis e pequenos serviços de manutenção.',
    nearby: ['asa-norte', 'sudoeste'],
    published: true,
  },
  {
    slug: 'asa-norte',
    name: 'Asa Norte',
    profile:
      'Atendimento residencial em apartamentos e casas, com atenção ao planejamento e às regras de acesso.',
    commonNeeds:
      'Instalações, regulagens, pequenos reparos e manutenção de pontos hidráulicos ou elétricos acessíveis.',
    nearby: ['asa-sul', 'noroeste'],
    published: true,
  },
  {
    slug: 'sudoeste',
    name: 'Sudoeste',
    profile:
      'Atendimento em condomínios residenciais, com comunicação prévia sobre escopo, materiais e acesso.',
    commonNeeds:
      'Montagens, fixações, pintura localizada e ajustes de portas, móveis e acessórios.',
    nearby: ['noroeste', 'asa-sul'],
    published: true,
  },
  {
    slug: 'noroeste',
    name: 'Noroeste',
    profile:
      'Atendimento em apartamentos, incluindo demandas de instalação, montagem e acabamento residencial.',
    commonNeeds:
      'Instalação de acessórios, ajustes em móveis e portas e pequenos reparos após ocupação ou mudança.',
    nearby: ['sudoeste', 'asa-norte'],
    published: true,
  },
  {
    slug: 'lago-sul',
    name: 'Lago Sul',
    profile:
      'Atendimento em imóveis residenciais que exigem organização prévia das diferentes demandas e áreas de trabalho.',
    commonNeeds:
      'Manutenções pontuais, ajustes de componentes, montagem e pequenos serviços internos.',
    nearby: ['lago-norte', 'asa-sul'],
    published: true,
  },
  {
    slug: 'lago-norte',
    name: 'Lago Norte',
    profile:
      'Atendimento em casas e apartamentos, com avaliação antecipada dos itens e das condições de execução.',
    commonNeeds:
      'Pequenos reparos, instalações, ajustes hidráulicos aparentes e manutenção de portas e acessórios.',
    nearby: ['lago-sul', 'asa-norte'],
    published: true,
  },
  {
    slug: 'cruzeiro',
    name: 'Cruzeiro',
    profile: 'Atendimento residencial sujeito à confirmação de disponibilidade.',
    commonNeeds: 'Pequenas instalações, regulagens e reparos cotidianos.',
    nearby: ['sudoeste'],
    published: false,
  },
  {
    slug: 'octogonal',
    name: 'Octogonal',
    profile: 'Atendimento residencial sujeito à confirmação de disponibilidade.',
    commonNeeds: 'Montagens, instalações e pequenos reparos.',
    nearby: ['sudoeste'],
    published: false,
  },
  {
    slug: 'riacho-fundo-i',
    name: 'Riacho Fundo I',
    profile: 'Atendimento residencial sujeito à confirmação de disponibilidade.',
    commonNeeds: 'Manutenções e ajustes residenciais.',
    nearby: ['nucleo-bandeirante'],
    published: false,
  },
  {
    slug: 'nucleo-bandeirante',
    name: 'Núcleo Bandeirante',
    profile: 'Atendimento residencial sujeito à confirmação de disponibilidade.',
    commonNeeds: 'Pequenos reparos e instalações.',
    nearby: ['candangolandia'],
    published: false,
  },
  {
    slug: 'candangolandia',
    name: 'Candangolândia',
    profile: 'Atendimento residencial sujeito à confirmação de disponibilidade.',
    commonNeeds: 'Ajustes e manutenção residencial.',
    nearby: ['nucleo-bandeirante'],
    published: false,
  },
]

export const publishedServiceAreas = serviceAreas.filter(
  (area) => area.published,
)

export function findServiceArea(
  slug: string,
): ServiceAreaDefinition | undefined {
  return serviceAreas.find((area) => area.slug === slug)
}
