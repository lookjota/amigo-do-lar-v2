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
  <section id={section.id} className="amigo-section">
    <Container>
      <SectionMedia media={section.data.media} />
      <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
      {section.data.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </Container>
  </section>
)

export const SolutionSection: SectionComponent<'solution'> = ({ section }) => (
  <section id={section.id} className="amigo-section">
    <Container>
      <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
      {section.data.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.data.action && <ContentLink {...section.data.action} />}
    </Container>
  </section>
)

export const HouseListSection: SectionComponent<'house-list'> = ({ section }) => (
  <section id={section.id} className="amigo-section amigo-house-list">
    <Container>
      <div className="amigo-reading-layout">
        <div>
          <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} description={section.data.description} />
          {section.data.action && <ContentLink {...section.data.action} className="amigo-button amigo-button-primary" event={section.data.action.external ? 'whatsapp_click' : undefined} />}
        </div>
        <Reveal>
          <div className="amigo-house-list-examples">
            <p>{section.data.exampleLabel}</p>
            <ul>{section.data.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </Reveal>
      </div>
    </Container>
  </section>
)

export const ServiceStandardSection: SectionComponent<'service-standard'> = ({ section }) => (
  <section id={section.id} className="amigo-section amigo-standard">
    <Container>
      <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} description={section.data.description} />
      <div className="amigo-standard-grid">
        {section.data.stages.map((stage, index) => (
          <Reveal key={stage.title} delay={index * 45}>
            <article>
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
  <section id={section.id} className="amigo-section">
    <Container>
      <SectionMedia media={section.data.media} />
      <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
      {section.data.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
