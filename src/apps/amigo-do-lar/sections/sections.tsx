import { Fragment } from 'react'
import {
  BadgeCheck,
  Check,
  ClipboardCheck,
  Clock3,
  CreditCard,
  MessageCircle,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react'
import type { SectionComponent } from '../../../engine/PageSectionRegistry'
import { AreaCard } from '../components/AreaCard'
import { Container } from '../components/Container'
import { ContentLink } from '../components/ContentLink'
import { SectionHeading } from '../components/SectionHeading'
import { ServiceCard } from '../components/ServiceCard'
import { Reveal } from '../components/Reveal'
import { useServices } from '../api/useServices'
import { createWhatsAppUrl } from '../config/site'
import { mergeServicesCatalog } from '../data/servicesCatalog'

export const HeroSection: SectionComponent<'hero'> = ({ section }) => (
  <main
    id="conteudo-principal"
    className="amigo-hero"
    data-hero-variant={section.data.variant ?? 'internal'}
    data-media-status={
      section.data.media?.kind === 'image'
        ? section.data.media.productionStatus
        : undefined
    }
  >
    <Container>
      <div className="amigo-hero-copy">
        <p className="amigo-eyebrow amigo-hero-eyebrow">{section.data.eyebrow}</p>
        <h1 className="amigo-display-heading">{section.data.title}</h1>
        <p className="amigo-hero-description">{section.data.description}</p>
        <div className="amigo-actions amigo-hero-actions">
          {section.data.actions.map((action, index) => (
            <ContentLink
              key={action.href}
              {...action}
              className={
                index === 0
                  ? 'amigo-button amigo-button-primary'
                  : 'amigo-button amigo-button-secondary'
              }
              event={
                action.external && index === 0 ? 'whatsapp_click' : undefined
              }
            />
          ))}
        </div>
        <p className="amigo-hero-note">
          {section.data.motto}
        </p>
      </div>
      {section.data.media && (
        <div className="amigo-hero-media">
          {section.data.media.kind === 'image' ? (
            <img
              src={section.data.media.src}
              alt={section.data.media.alt}
              width={section.data.media.width}
              height={section.data.media.height}
              fetchPriority="high"
            />
          ) : (
            <div role="img" aria-label={section.data.media.label}>
              {section.data.media.label}
            </div>
          )}
        </div>
      )}
    </Container>
  </main>
)

export const TrustFeaturesSection: SectionComponent<'trust-features'> = ({
  section,
}) => {
  const icons = [ReceiptText, CreditCard, Clock3, BadgeCheck]
  const strip = section.data.variant === 'strip'

  if (strip) {
    return (
      <section id={section.id} className="amigo-trust-strip" aria-label={section.data.title}>
        <Container>
          <ul>
            {section.data.items.map((item, index) => {
              const Icon = [ReceiptText, CreditCard, Clock3, ShieldCheck][index] ?? Check
              return <li key={item.title}><Icon size={21} strokeWidth={1.75} aria-hidden="true" />{item.title}</li>
            })}
          </ul>
        </Container>
      </section>
    )
  }

  return (
  <section id={section.id} className="amigo-section amigo-section-soft">
    <Container>
      <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
      <div className="amigo-feature-grid">
        {section.data.items.map((item, index) => {
          const Icon = icons[index] ?? Check
          return (
          <Reveal key={item.title} delay={index * 45}>
            <article className="amigo-feature">
              <Icon size={21} aria-hidden="true" />
              <h3>{item.title}</h3>
              {item.description && <p>{item.description}</p>}
            </article>
          </Reveal>
        )})}
      </div>
    </Container>
  </section>
  )
}

export const ServicesGridSection: SectionComponent<'services-grid'> = ({
  section,
}) => {
  const servicesState = useServices()
  const items = servicesState.status === 'success' && servicesState.data
    ? mergeServicesCatalog(section.data.items, servicesState.data)
    : section.data.items

  return (
    <section id={section.id} className={`amigo-section amigo-services-section ${section.data.variant === 'editorial' ? 'is-editorial' : ''}`}>
      <Container>
        <div className="amigo-section-heading-row">
          <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} description={section.data.description} />
          {section.data.action && <ContentLink {...section.data.action} className="amigo-text-link" />}
        </div>
        <div className="amigo-card-grid">
          {items.map((item, index) => (
            <Reveal key={item.href} delay={(index % 3) * 55}>
              <ServiceCard
                title={item.label}
                description={item.description}
                href={item.href}
                media={item.media ?? (section.data.variant === 'editorial' ? { kind: 'placeholder', label: `[ASSET REAL FUTURO — ${item.label.toUpperCase()}]`, aspectRatio: '16:10' } : undefined)}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

export const ServiceDetailsSection: SectionComponent<'service-details'> = ({
  section,
}) => (
  <section id={section.id} className="amigo-section amigo-section-soft">
    <Container>
      <SectionHeading
        eyebrow={section.data.eyebrow}
        title={section.data.title}
        description={section.data.introduction}
      />
      <div className="amigo-detail-grid">
        {section.data.groups.map((group, index) => (
          <Reveal key={group.title} delay={index * 55}>
            <article>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>
                    <Check size={17} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
      {section.data.notice && (
        <p className="amigo-notice">
          <ShieldCheck size={19} aria-hidden="true" />
          {section.data.notice}
        </p>
      )}
    </Container>
  </section>
)

export const ProcessStepsSection: SectionComponent<'process-steps'> = ({
  section,
}) => (
  <section id={section.id} className="amigo-section">
    <Container>
      <SectionHeading
        eyebrow={section.data.eyebrow}
        title={section.data.title}
      />
      <Reveal>
        <ol className="amigo-process">
          {section.data.items.map((item, index) => (
            <li key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </Container>
  </section>
)

export const AreasGridSection: SectionComponent<'areas-grid'> = ({
  section,
}) => (
  <section id={section.id} className={`amigo-section amigo-section-soft amigo-areas-section ${section.data.variant === 'editorial' ? 'is-editorial' : ''}`}>
    <Container>
      <SectionHeading
        eyebrow={section.data.eyebrow}
        title={section.data.title}
        description={section.data.description}
      />
      {section.data.variant === 'editorial' ? (
        <Reveal>
          <ul className="amigo-area-links">
            {section.data.items.map((item) => <li key={item.href}><ContentLink {...item} className="amigo-text-link" /></li>)}
          </ul>
        </Reveal>
      ) : <div className="amigo-area-grid">
        {section.data.items.map((item, index) => (
          <Reveal key={item.href} delay={(index % 3) * 55}>
            <AreaCard
              title={item.label}
              description={item.description}
              href={item.href}
            />
          </Reveal>
        ))}
      </div>}
      {section.data.action && <ContentLink {...section.data.action} className="amigo-text-link" />}
    </Container>
  </section>
)

export const LocalAreaIntroductionSection: SectionComponent<
  'local-area-introduction'
> = ({ section }) => (
  <section id={section.id} className="amigo-section">
    <Container>
      <div className="amigo-reading-layout">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
        />
        <div className="amigo-prose">
          {section.data.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Container>
  </section>
)

export const BenefitsSection: SectionComponent<'benefits'> = ({ section }) => (
  <section id={section.id} className="amigo-section amigo-section-soft">
    <Container>
      <SectionHeading
        eyebrow={section.data.eyebrow}
        title={section.data.title}
      />
      <div className="amigo-feature-grid">
        {section.data.items.map((item, index) => (
          <Reveal key={item.title} delay={index * 55}>
            <article className="amigo-feature">
              <ClipboardCheck size={20} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Container>
  </section>
)

export const AboutSection: SectionComponent<'about'> = ({ section }) => (
  <section id={section.id} className="amigo-section">
    <Container>
      <div className="amigo-reading-layout">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
        />
        <div className="amigo-prose">
          {section.data.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Container>
  </section>
)

export const FaqSection: SectionComponent<'faq'> = ({ section }) => (
  <section id={section.id} className={`amigo-section amigo-section-soft amigo-faq-section ${section.data.variant === 'home' ? 'is-home' : ''}`}>
    <Container>
      <div className="amigo-faq-layout">
        <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
        <div className="amigo-faq">
        {section.data.items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
        </div>
      </div>
    </Container>
  </section>
)

export const ContactSection: SectionComponent<'contact'> = ({ section }) => (
  <section id={section.id} className="amigo-section">
    <Container>
      <div className="amigo-contact-panel">
        <MessageCircle size={28} aria-hidden="true" />
        <div>
          <p className="amigo-eyebrow">{section.data.eyebrow}</p>
          <h2>{section.data.title}</h2>
          <p>{section.data.description}</p>
        </div>
        <ContentLink
          {...section.data.action}
          className="amigo-button amigo-button-primary"
          event="whatsapp_click"
        />
      </div>
    </Container>
  </section>
)

export const QuoteRequestSection: SectionComponent<'quote-request'> = ({
  section,
}) => (
  <section id={section.id} className="amigo-section amigo-section-soft">
    <Container>
      <SectionHeading
        eyebrow={section.data.eyebrow}
        title={section.data.title}
        description={section.data.description}
      />
      <div className="amigo-actions">
        <ContentLink
          label="Preencher solicitação"
          href="/solicitar-atendimento"
          className="amigo-button amigo-button-primary"
        />
        <ContentLink
          label="Falar pelo WhatsApp"
          href={createWhatsAppUrl(
            'Olá! Gostaria de solicitar atendimento residencial.',
          )}
          external
          className="amigo-button amigo-button-secondary"
        />
      </div>
    </Container>
  </section>
)

export const CallToActionSection: SectionComponent<'call-to-action'> = ({
  section,
}) => {
  const Motion = section.data.variant === 'home' ? Reveal : Fragment

  return (
    <section id={section.id} className="amigo-section amigo-cta">
      <Container>
        <Motion>
          <p className="amigo-eyebrow">{section.data.eyebrow}</p>
          <h2>{section.data.title}</h2>
          <p>{section.data.description}</p>
          <div className="amigo-actions">
            <ContentLink
              {...section.data.primaryAction}
              className="amigo-button amigo-button-primary"
              event={
                section.data.primaryAction.external
                  ? 'whatsapp_click'
                  : undefined
              }
            />
            {section.data.secondaryAction && (
              <ContentLink
                {...section.data.secondaryAction}
                className="amigo-button amigo-button-secondary"
              />
            )}
          </div>
        </Motion>
      </Container>
    </section>
  )
}

export const RelatedLinksSection: SectionComponent<'related-links'> = ({
  section,
}) => (
  <section id={section.id} className="amigo-section">
    <Container>
      <SectionHeading
        eyebrow={section.data.eyebrow}
        title={section.data.title}
      />
      <div className="amigo-related-links">
        {section.data.items.map((item) => (
          <ContentLink
            key={item.href}
            {...item}
            className="amigo-related-link"
          />
        ))}
      </div>
    </Container>
  </section>
)

export const LegalContentSection: SectionComponent<'legal-content'> = ({
  section,
}) => (
  <section id={section.id} className="amigo-section">
    <Container>
      <SectionHeading
        eyebrow={section.data.eyebrow}
        title={section.data.title}
        description={`Atualizado em ${section.data.updatedAt}.`}
      />
      <div className="amigo-legal">
        {section.data.sections.map((item) => (
          <section key={item.title}>
            <h3>{item.title}</h3>
            {item.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </Container>
  </section>
)

export const NotFoundSection: SectionComponent<'not-found'> = ({ section }) => (
  <main id="conteudo-principal" className="amigo-not-found">
    <Container>
      <p className="amigo-eyebrow">{section.data.code}</p>
      <h1>{section.data.title}</h1>
      <p>{section.data.description}</p>
      <ContentLink
        {...section.data.action}
        className="amigo-button amigo-button-primary"
      />
    </Container>
  </main>
)
