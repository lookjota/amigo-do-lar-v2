/**
 * Page
 *
 * Representa uma página renderizável
 * da aplicação.
 *
 * Observe que uma página NÃO é
 * necessariamente um serviço.
 *
 * No futuro poderemos ter:
 *
 * - Página Inicial
 * - Página Institucional
 * - Landing Page
 * - Página de Serviço
 * - Página de Cidade
 */
import type { Seo } from "./Seo";
import type { PageSection } from "./PageSection";

export interface Page {

    /**
     * Identificador único.
     */
    slug: string;

    /**
     * Título da página.
     */
    title: string;

    /**
     * Informações de SEO.
     */
    seo: Seo;

    /**
     * Estrutura visual completa.
     */
    sections: PageSection[];

}