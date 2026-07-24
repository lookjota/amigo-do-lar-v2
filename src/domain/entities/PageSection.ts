import type { PageSectionType } from "./PageSectionType";

/**
 * Representa qualquer bloco da página.
 *
 * O Render Engine não sabe
 * o conteúdo do bloco.
 *
 * Apenas sabe:
 *
 * - qual o tipo
 * - quais dados entregar
 */
export interface PageSection {

    /**
     * Identificador único.
     */
    id:string;

    /**
     * Tipo da seção.
     */
    type:PageSectionType;

    /**
     * Dados específicos.
     *
     * Cada componente saberá
     * interpretar esses dados.
     */
    data:unknown;

}