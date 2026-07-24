/**
 * Informações utilizadas pelos mecanismos
 * de busca (Google, Bing etc.).
 */
export interface Seo {

  /**
   * Título exibido no navegador
   * e nos resultados do Google.
   */
  title: string;

    description: string;

    keywords: string[];

    canonical?: string;

    robots?: string;

    ogTitle?: string;

    ogDescription?: string;

    ogImage?: string;

}