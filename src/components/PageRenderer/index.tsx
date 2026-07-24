
import type { PageSection } from "../../domain/entities/PageSection";
import SectionRenderer from "../SectionRenderer";

/**
 * Propriedades recebidas pelo PageRenderer.
 */
interface PageRendererProps {
  sections: PageSection[];

}

/**
 * PageRenderer
 *
 * Responsabilidade:
 *
 * Orquestrar a renderização de uma página.
 *
 * Ele recebe uma coleção de PageSection
 * e delega a renderização de cada seção
 * ao SectionRenderer.
 *
 * Não conhece componentes específicos,
 * não conhece Hero,
 * FAQ,
 * CTA,
 * nem qualquer outro tipo de seção.
 *
 * Sua responsabilidade é exclusivamente
 * coordenar a renderização da página.
 */
export default function PageRenderer({
    sections,
}: PageRendererProps) {
    return (
        <>
            {sections.map(section => (

                <SectionRenderer

                    key={section.id}

                    section={section}

                />

            ))}
        </>
    );
}