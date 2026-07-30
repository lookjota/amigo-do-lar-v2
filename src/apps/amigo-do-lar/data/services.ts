export interface ServiceDefinition {
  slug: string
  name: string
  shortDescription: string
  introduction: string
  problems: string[]
  examples: string[]
  limitations: string
  faq: {
    question: string
    answer: string
  }[]
}

export const services: ServiceDefinition[] = [
  {
    slug: 'eletrica',
    name: 'Elétrica',
    shortDescription:
      'Avaliação e pequenos serviços elétricos residenciais, com atenção ao escopo e à segurança.',
    introduction:
      'Atendimento para identificar e resolver demandas elétricas residenciais de menor complexidade, sempre após avaliação das informações apresentadas.',
    problems: [
      'Tomadas, interruptores ou pontos de iluminação com falhas',
      'Necessidade de instalar ou substituir componentes residenciais',
      'Dúvidas sobre uma ocorrência elétrica localizada',
    ],
    examples: [
      'Troca de tomadas e interruptores',
      'Instalação de luminárias e ventiladores compatíveis',
      'Verificação inicial de falhas em pontos elétricos',
    ],
    limitations:
      'Casos que envolvam risco, alterações amplas, padrão de entrada ou instalações fora do escopo serão interrompidos e encaminhados a profissional especializado.',
    faq: [
      {
        question: 'É possível avaliar uma falha elétrica pelo WhatsApp?',
        answer:
          'Fotos e uma descrição ajudam na triagem, mas a confirmação do problema pode depender de avaliação no imóvel.',
      },
      {
        question: 'O material elétrico está incluído?',
        answer:
          'A necessidade de materiais é informada durante a combinação do serviço, antes da execução.',
      },
    ],
  },
  {
    slug: 'hidraulica',
    name: 'Hidráulica',
    shortDescription:
      'Pequenos reparos hidráulicos e identificação inicial de vazamentos aparentes.',
    introduction:
      'Atendimento residencial para demandas hidráulicas localizadas, com definição clara do que pode ser executado após a avaliação do caso.',
    problems: [
      'Torneiras, sifões ou registros com falhas aparentes',
      'Vazamentos visíveis em conexões acessíveis',
      'Componentes hidráulicos residenciais que precisam de substituição',
    ],
    examples: [
      'Troca de torneiras e sifões',
      'Ajustes em descargas e conexões aparentes',
      'Identificação inicial da origem de um vazamento visível',
    ],
    limitations:
      'Infiltrações ocultas, redes complexas ou intervenções estruturais podem exigir diagnóstico e execução por profissional especializado.',
    faq: [
      {
        question: 'Vocês atendem vazamentos?',
        answer:
          'Atendemos ocorrências aparentes e acessíveis após avaliação. Vazamentos ocultos podem exigir equipamentos ou especialistas específicos.',
      },
      {
        question: 'Posso enviar fotos antes do atendimento?',
        answer:
          'Sim. Imagens do ponto afetado ajudam a compreender a necessidade e preparar a avaliação.',
      },
    ],
  },
  {
    slug: 'montagem-de-moveis',
    name: 'Montagem de móveis',
    shortDescription:
      'Montagem e ajustes de móveis residenciais conforme manual e condições das peças.',
    introduction:
      'Montagem cuidadosa de móveis novos ou desmontados, considerando instruções do fabricante, ferragens disponíveis e espaço de instalação.',
    problems: [
      'Móveis novos ainda desmontados',
      'Peças que precisam ser remontadas após mudança',
      'Portas, gavetas ou ferragens que demandam regulagem',
    ],
    examples: [
      'Armários, estantes e cômodas',
      'Mesas, cadeiras e móveis auxiliares',
      'Regulagem simples de dobradiças e corrediças',
    ],
    limitations:
      'Peças danificadas, ferragens ausentes ou móveis que exijam modificação estrutural precisam ser avaliados antes da execução.',
    faq: [
      {
        question: 'É necessário ter o manual de montagem?',
        answer:
          'O manual facilita o trabalho. Quando não estiver disponível, fotos e identificação do modelo ajudam na avaliação.',
      },
      {
        question: 'Vocês desmontam móveis para mudança?',
        answer:
          'A desmontagem pode ser avaliada conforme o tipo, estado e sistema construtivo do móvel.',
      },
    ],
  },
  {
    slug: 'fechaduras-e-portas',
    name: 'Fechaduras e portas',
    shortDescription:
      'Ajustes e substituições em fechaduras, maçanetas e portas residenciais.',
    introduction:
      'Atendimento para problemas de uso em portas e seus componentes, com avaliação do encaixe, das ferragens e das condições existentes.',
    problems: [
      'Portas raspando ou com dificuldade de fechamento',
      'Maçanetas e fechaduras com funcionamento irregular',
      'Ferragens soltas ou desgastadas',
    ],
    examples: [
      'Troca de fechaduras e maçanetas compatíveis',
      'Ajuste de dobradiças e alinhamento',
      'Correções simples em batentes e ferragens',
    ],
    limitations:
      'Aberturas emergenciais, sistemas especiais de segurança ou danos estruturais serão avaliados antes de qualquer compromisso de execução.',
    faq: [
      {
        question: 'Toda fechadura pode ser substituída?',
        answer:
          'A compatibilidade depende das medidas e do recorte existente na porta. Fotos ajudam na verificação inicial.',
      },
      {
        question: 'Vocês ajustam portas que estão raspando?',
        answer:
          'Sim, quando a causa permite um ajuste localizado. Empenamentos ou problemas estruturais podem exigir outra solução.',
      },
    ],
  },
  {
    slug: 'pintura',
    name: 'Pintura',
    shortDescription:
      'Pinturas localizadas e retoques residenciais com preparação compatível.',
    introduction:
      'Serviço voltado a pequenas áreas, retoques e renovação de ambientes, com avaliação prévia da superfície e do acabamento desejado.',
    problems: [
      'Paredes com marcas ou desgaste localizado',
      'Necessidade de renovar um cômodo ou pequena área',
      'Retoques após instalações e reparos',
    ],
    examples: [
      'Pintura de paredes internas',
      'Retoques e correções localizadas',
      'Preparação simples de superfícies em bom estado',
    ],
    limitations:
      'Umidade ativa, infiltrações, superfícies muito deterioradas ou trabalhos em altura exigem avaliação e podem ficar fora do escopo.',
    faq: [
      {
        question: 'A tinta está incluída no serviço?',
        answer:
          'A quantidade e o tipo de material são combinados após avaliar a área, a superfície e o acabamento esperado.',
      },
      {
        question: 'Vocês fazem apenas retoques?',
        answer:
          'Sim, desde que seja possível compatibilizar cor e acabamento de forma adequada.',
      },
    ],
  },
  {
    slug: 'pequenos-reparos',
    name: 'Pequenos reparos residenciais',
    shortDescription:
      'Soluções para ajustes, instalações e manutenções pontuais do dia a dia.',
    introduction:
      'Atendimento versátil para reunir pequenas demandas residenciais e organizar sua execução de acordo com o escopo combinado.',
    problems: [
      'Itens soltos, desalinhados ou que deixaram de funcionar corretamente',
      'Objetos e acessórios que precisam de instalação',
      'Uma lista de pequenos ajustes acumulados no imóvel',
    ],
    examples: [
      'Instalação de prateleiras, suportes e acessórios',
      'Fixações e regulagens simples',
      'Ajustes pontuais em diferentes ambientes',
    ],
    limitations:
      'Cada item é avaliado quanto à superfície, ao risco e às ferramentas necessárias. Serviços estruturais ou especializados podem ser recusados ou encaminhados.',
    faq: [
      {
        question: 'Posso reunir vários reparos no mesmo atendimento?',
        answer:
          'Sim. Envie uma lista com fotos para que o conjunto seja avaliado e organizado antes da execução.',
      },
      {
        question: 'Vocês instalam itens em qualquer parede?',
        answer:
          'A instalação depende do tipo de parede, peso do item e existência de tubulações ou fiação na área.',
      },
    ],
  },
]

export function findService(slug: string): ServiceDefinition | undefined {
  return services.find((service) => service.slug === slug)
}
