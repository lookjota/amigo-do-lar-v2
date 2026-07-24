import type { Benefit } from "../../../domain/entities/Benefit";
import type { PageSection } from "../../../domain/entities/PageSection";

interface BenefitsSectionProps {
    section: PageSection;

}
/**
 * BenefitsSection
 *
 * Responsável exclusivamente
 * por apresentar os benefícios
 * do serviço.
 */
export default function BenefitsSection({
    section
}: BenefitsSectionProps){
    const benefits = section.data as Benefit[];
    return(
        <section className="py-20">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold mb-10">
                    Por que escolher o Amigo do Lar?
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {
                        benefits.map((benefit)=> (
                            <article
                                key={benefit.title}
                                className="border rounded-2xl p-6 shadow-sm"
                            >
                                <h3 className="font-semibold">
                                    {benefit.title}
                                </h3>
                                <p className="mt-3 text-slate-600">
                                    {benefit.description}
                                </p>
                            </article>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}