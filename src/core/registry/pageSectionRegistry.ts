// Importamos todos os componentes responsáveis
// por renderizar uma seção específica da página.

import HeroSection from "../../components/service/HeroSection";
import BenefitsSection from "../../components/service/BenefitsSection";
import FaqSection from "../../components/service/FaqSection";
import CtaSection from "../../components/service/CtaSection";

// Importamos o tipo que identifica
// cada seção existente.
import { PageSectionType } from "../../domain/entities/PageSectionType";

/**
 * PageSectionRegistry
 *
 * Este objeto funciona como um catálogo.
 *
 * Sua única responsabilidade é responder:
 *
 * "Qual componente representa determinado tipo de seção?"
 *
 * Observe que ele NÃO renderiza nada.
 * NÃO cria componentes.
 * NÃO conhece Services.
 * NÃO conhece Repositories.
 *
 * Ele apenas mantém um mapeamento.
 */
export const pageSectionRegistry = {

    /**
     * Quando uma seção for do tipo HERO,
     * utilizaremos HeroSection.
     */
    [PageSectionType.HERO]: HeroSection,

    /**
     * BENEFITS
     */
    [PageSectionType.BENEFITS]: BenefitsSection,

    /**
     * FAQ
     */
    [PageSectionType.FAQ]: FaqSection,

    /**
     * CTA
     */
    [PageSectionType.CTA]: CtaSection,

};