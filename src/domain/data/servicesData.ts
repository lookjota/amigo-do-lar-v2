import { PageSectionType } from "../entities/PageSectionType";
import type { Service } from "../entities/Service";

export const servicesData: Service[] = [
  {
  slug: "eletricista",

  title: "Eletricista Residencial",

  seo: {
    title: "Eletricista em Brasília | Amigo do Lar",
    description:
      "Instalações elétricas, troca de tomadas...",
    keywords: [
      "eletricista",
      "eletricista em brasília",
      "marido de aluguel",
    ],
  },

  description:
    "Realizamos serviços elétricos residenciais.",

  sections: [
    {
      id: "hero",
      type: PageSectionType.HERO,
      data: {
        title: "Serviços Elétricos com Segurança",
        subtitle:
          "Atendimento rápido...",
        image: "/images/services/eletricista/hero.webp",
        primaryButton: "Solicitar orçamento",
      },
    },

    {
      id: "benefits",
      type: PageSectionType.BENEFITS,
      data: [
        {
          title: "Atendimento Rápido",
          description: "Agilidade...",
          icon: "Clock",
        },
      ],
    },

    {
      id: "faq",
      type: PageSectionType.FAQ,
      data: [
        {
          question: "Trocam chuveiro?",
          answer: "Sim.",
        },
      ],
    },

    {
      id: "cta",
      type: PageSectionType.CTA,
      data: {
        title: "Precisa de um eletricista?",
        description: "Solicite um orçamento.",
        buttonText: "WhatsApp",
        buttonLink: "https://wa.me/...",
      },
    },
  ],
}
];

export function getServiceBySlug(slug: string): Service | undefined {
  return servicesData.find(service => service.slug === slug);
}