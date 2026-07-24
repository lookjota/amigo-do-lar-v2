import type { Seo } from "./Seo";
import type { PageSection } from "./PageSection";

/**
 * Service
 *
 * Representa um serviço da empresa.
 *
 * Observe que este objeto possui dois grupos
 * de informações:
 *
 * 1) Metadados do domínio.
 *
 * 2) Estrutura visual da página.
 */
export interface Service {

  /**
   * Identificador único utilizado na URL.
   *
   * Exemplo:
   *
   * /eletricista
   */
  slug: string;

  /**
   * Nome do serviço.
   */
  title: string;

  /**
   * Informações utilizadas pelo SEO.
   */
  seo: Seo;

  /**
   * Pequena descrição do serviço.
   *
   * Essa informação pertence ao domínio,
   * não à renderização.
   */
  description: string;

  /**
   * Estrutura visual completa da página.
   */
  sections: PageSection[];

}