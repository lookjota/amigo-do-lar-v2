import type { City } from "../entities/City";

/**
 * Catálogo de cidades atendidas.
 *
 * Esta é nossa "base de dados" temporária.
 */
export const citiesData: City[] = [
  {
    slug: "brasilia",
    name: "Brasília",
    state: "DF",
    description:
      "Atendimento residencial em Brasília."
  },

  {
    slug: "aguas-claras",
    name: "Águas Claras",
    state: "DF",
    description:
      "Atendimento residencial em Águas Claras."
  },

  {
    slug: "taguatinga",
    name: "Taguatinga",
    state: "DF",
    description:
      "Atendimento residencial em Taguatinga."
  },

  {
    slug: "guara",
    name: "Guará",
    state: "DF",
    description:
      "Atendimento residencial no Guará."
  },

  {
    slug: "ceilandia",
    name: "Ceilândia",
    state: "DF",
    description:
      "Atendimento residencial em Ceilândia."
  }
];