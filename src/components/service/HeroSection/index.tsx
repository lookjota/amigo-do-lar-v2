import type { Hero } from "../../../domain/entities/Hero";
import type { PageSection } from "../../../domain/entities/PageSection";

/**
 * HeroSection
 *
 * Responsabilidade:
 * Renderizar exclusivamente
 * o Hero da página.
 */
interface HeroSectionProps {
  section: PageSection;
}

export default function HeroSection({
  section,
}: HeroSectionProps) {

  const hero = section.data as Hero;
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-5xl font-bold">
          {hero.title}
        </h1>

        <p className="mt-6 text-lg text-slate-600">
          {hero.subtitle}
        </p>

        <button
          className="mt-8 px-8 py-4 rounded-xl bg-sky-600 text-white"
        >
          {hero.primaryButton}
        </button>

      </div>
    </section>
  );
}