import { Check } from 'lucide-react'
import type { MediaAsset } from '../../../domain/pages/PageSection'
import type { SectionComponent } from '../../../engine/PageSectionRegistry'
import { Reveal } from '../components/Reveal'
import { Container } from '../components/Container'
import { ContentLink } from '../components/ContentLink'
import { SectionHeading } from '../components/SectionHeading'

function SectionMedia({ media }: { media?: MediaAsset }) {
  if (!media) return null

  if (media.kind === 'placeholder') {
    return (
      <div className="amigo-production-placeholder" role="img" aria-label={media.label}>
        {media.label}
      </div>
    )
  }

  return (
    <img
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      loading="lazy"
    />
  )
}

export const ProblemSection: SectionComponent<'problem'> = ({ section }) => (
  <section id={section.id} className="amigo-section amigo-problem">
    <Container>
      <div className="amigo-editorial-grid">
        <Reveal><SectionMedia media={section.data.media} /></Reveal>
        <Reveal delay={80}>
          <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
          <div className="amigo-editorial-copy">
            {section.data.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </Reveal>
      </div>
    </Container>
  </section>
)

export const SolutionSection: SectionComponent<'solution'> = ({ section }) => (
  <section id={section.id} className="amigo-section amigo-solution">
    <Container>
      <Reveal>
        <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
        <div className="amigo-editorial-copy">
          {section.data.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        {section.data.action && <ContentLink {...section.data.action} className="amigo-text-link" event="whatsapp_click" />}
      </Reveal>
    </Container>
  </section>
)

export const HouseListSection: SectionComponent<'house-list'> = ({ section }) => (
  <section id={section.id} className="amigo-section amigo-house-list">
    <Container>
      <div className="amigo-editorial-grid">
        <Reveal>
          <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} description={section.data.description} />
          {section.data.action && <ContentLink {...section.data.action} className="amigo-button amigo-button-light" event="whatsapp_click" />}
        </Reveal>
        <Reveal delay={80}>
          <div className="amigo-house-checklist">
            <p>{section.data.exampleLabel}</p>
            <ul>{section.data.items.map((item) => <li key={item}><Check size={20} aria-hidden="true" />{item}</li>)}</ul>
          </div>
        </Reveal>
      </div>
    </Container>
  </section>
)

export const ServiceStandardSection: SectionComponent<'service-standard'> = ({ section }) => (
  <section id={section.id} className="amigo-section amigo-standard">
    <Container>
      <Reveal><SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} description={section.data.description} /></Reveal>
      <div className="amigo-standard-grid">
        {section.data.stages.map((stage, index) => (
          <Reveal key={stage.title} delay={index * 80}>
            <article>
              <span className="amigo-stage-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{stage.title}</h3>
              <SectionMedia media={stage.media} />
              {stage.description && <p>{stage.description}</p>}
              <ul>{stage.steps.map((step) => <li key={step}>{step}</li>)}</ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Container>
  </section>
)

export const FoundersSection: SectionComponent<'founders'> = ({ section }) => (
  <section id={section.id} className="amigo-section amigo-founders">
    <Container>
      <div className="amigo-editorial-grid">
        <Reveal><SectionMedia media={section.data.media} /></Reveal>
        <Reveal delay={80}>
          <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
          <div className="amigo-editorial-copy">
            {section.data.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </Reveal>
      </div>
    </Container>
  </section>
)

export const ProofGallerySection: SectionComponent<'proof-gallery'> = ({ section }) => {
  const items = section.data.items?.filter((item) => item.media.kind === 'image')
  if (!items?.length) return null

  return (
    <section id={section.id} className="amigo-section">
      <Container>
        <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
        <div>
          {items.map((item) => (
            <figure key={`${item.media.src}-${item.service}`}>
              <SectionMedia media={item.media} />
              <figcaption>
                {item.service}{item.region ? ` — ${item.region}` : ''}
                {item.description && <small>{item.description}</small>}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}

export const ReviewsSection: SectionComponent<'reviews'> = ({ section }) => {
  const items = section.data.items
  if (!items?.length) return null

  return (
    <section id={section.id} className="amigo-section">
      <Container>
        <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
        <div>
          {items.map((item) => (
            <figure key={`${item.attribution}-${item.quote}`}>
              {item.rating !== undefined && (
                <p aria-label={`Avaliação: ${item.rating} de 5`}>
                  {'★'.repeat(Math.max(0, Math.min(5, Math.round(item.rating))))}
                </p>
              )}
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                {item.attribution}
                {item.service ? ` — ${item.service}` : ''}
                {item.region ? `, ${item.region}` : ''}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}
