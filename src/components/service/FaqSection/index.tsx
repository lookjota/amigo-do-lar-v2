// Importamos apenas o tipo da entidade FAQ.
// Observe que o componente conhece somente o que precisa.
// Ele não conhece Service, Repository nem Router.
import type { Faq } from "../../../domain/entities/Faq";
import type { PageSection } from "../../../domain/entities/PageSection";

/**
 * Define quais informações
 * este componente aceita receber.
 *
 * Apenas uma lista de perguntas.
 */
interface FaqSectionProps {
  section: PageSection;
}

/**
 * FaqSection
 *
 * Responsabilidade:
 * Exibir exclusivamente
 * as perguntas frequentes
 * relacionadas ao serviço.
 */
export default function FaqSection({
  section,
}: FaqSectionProps) {

  const faq = section.data as Faq[];
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">

        {/* Título da seção */}
        <h2 className="text-3xl font-bold mb-10">
          Perguntas Frequentes
        </h2>

        {/* Lista de perguntas */}
        <div className="space-y-6">

          {faq.map((item) => (

            <article
              key={item.question}
              className="border rounded-xl p-6 bg-white shadow-sm"
            >
              {/* Pergunta */}
              <h3 className="font-semibold text-lg">
                {item.question}
              </h3>

              {/* Resposta */}
              <p className="mt-3 text-slate-600">
                {item.answer}
              </p>

            </article>

          ))}

        </div>

      </div>
    </section>
  );
}