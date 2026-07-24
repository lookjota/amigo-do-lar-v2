import { PageSectionType } from "../../entities/PageSectionType";
import type { Page } from "../../entities/Page";

export const homePage: Page = {

  slug: "home",

  title: "Amigo do Lar",

  seo: {
    title: "Amigo do Lar | Marido de Aluguel em Brasília",
    description:
      "Serviços de marido de aluguel, elétrica, hidráulica, montagem e manutenção residencial em Brasília.",
    keywords: [
      "marido de aluguel",
      "eletricista",
      "hidráulica",
      "montagem de móveis",
      "Brasília",
    ],
  },

  sections: [

        // Hero

        // Services

        // About

        // Contact


    // {
    //   id: "home-hero",
    //   type: PageSectionType.HERO,
    //   data: {
    //     title: "Seu amigo do lar para serviços feitos com confiança",
    //     subtitle:
    //       "Marido de Aluguel em Brasília para reparos e manutenção residencial.",
    //     image: "/images/home/hero.webp",
    //     primaryButton: "Ver serviços",
    //     secondaryButton: "Solicitar orçamento",
    //   },
    // },

    // {
    //   id: "home-services",
    //   type: PageSectionType.BENEFITS,
    //   data: [
    //     {
    //       title: "Elétrica",
    //       description: "Instalações e reparos elétricos residenciais.",
    //       icon: "Zap",
    //     },
    //     {
    //       title: "Hidráulica",
    //       description: "Troca de torneiras, sifões e reparos hidráulicos.",
    //       icon: "Droplets",
    //     },
    //   ],
    // },

    // {
    //   id: "home-cta",
    //   type: PageSectionType.CTA,
    //   data: {
    //     title: "Solicite um orçamento rápido",
    //     description:
    //       "Atendimento ágil via WhatsApp para serviços residenciais em Brasília.",
    //     buttonText: "Falar no WhatsApp",
    //     buttonLink: "https://wa.me/5561995646646",
    //   },
    // },

  ],

};