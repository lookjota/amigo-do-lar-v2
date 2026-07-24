
/**
 * Representa uma cidade onde a empresa presta serviços.
 *
 * Esta entidade faz parte do domínio.
 * Ela não conhece React.
 * Ela não conhece HTML.
 * Ela não conhece banco de dados.
 *
 * Ela apenas responde:
 *
 * "O que é uma cidade dentro do sistema?"
 */

export interface City {
  slug: string;
  name: string;
  state: string;
  description: string;
}