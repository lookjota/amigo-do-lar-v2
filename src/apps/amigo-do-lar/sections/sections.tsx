import {
  ArrowDownRight,
  Check,
  ClipboardCheck,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react'
import type { SectionComponent } from '../../../engine/PageSectionRegistry'
import { AreaCard } from '../components/AreaCard'
import { Container } from '../components/Container'
import { ContentLink } from '../components/ContentLink'
import { SectionHeading } from '../components/SectionHeading'
import { ServiceCard } from '../components/ServiceCard'
import { QuoteRequestForm } from '../features/quote-request'
import { useServices } from '../api/useServices'
import { mergeServicesCatalog } from '../data/servicesCatalog'

export const HeroSection: SectionComponent<'hero'> = ({ section }) => (
  <main id="conteudo-principal" className="amigo-hero">
    <Container>
      <div className="amigo-hero-copy">
        <p className="amigo-eyebrow">{section.data.eyebrow}</p>
        <h1>{section.data.title}</h1>
        <p>{section.data.description}</p>
        <div className="amigo-actions">
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
                action.external && index === 0
                  ? 'request_service_click'
                  : undefined
              }
            />
          ))}
        </div>
        <p className="amigo-hero-note">
          <ShieldCheck size={18} aria-hidden="true" />
          {section.data.motto}
        </p>
      </div>
      <div className="amigo-hero-panel" aria-hidden="true">
        <span>Serviço bem combinado.</span>
        <strong>Cuidado em cada detalhe.</strong>
        <ArrowDownRight />
      </div>
    </Container>
  </main>
)

export const TrustFeaturesSection: SectionComponent<'trust-features'> = ({
  section,
}) => (
  <section id={section.id} className="amigo-section amigo-section-soft">
    <Container>
      <SectionHeading
        eyebrow={section.data.eyebrow}
        title={section.data.title}
      />
      <div className="amigo-feature-grid">
        {section.data.items.map((item) => (
          <article key={item.title} className="amigo-feature">
            <Check size={20} aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </Container>
  </section>
)

export const ServicesGridSection: SectionComponent<'services-grid'> = ({
  section,
}) => {
  const servicesState = useServices()
  const items = servicesState.status === 'success' && servicesState.data
    ? mergeServicesCatalog(section.data.items, servicesState.data)
    : section.data.items

  return (
    <section id={section.id} className="amigo-section">
      <Container>
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          description={section.data.description}
        />
        <div className="amigo-card-grid">
          {items.map((item) => (
            <ServiceCard
              key={item.href}
              title={item.label}
              description={item.description}
              href={item.href}
            />
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
        {section.data.groups.map((group) => (
          <article key={group.title}>
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
    </Container>
  </section>
)

export const AreasGridSection: SectionComponent<'areas-grid'> = ({
  section,
}) => (
  <section id={section.id} className="amigo-section amigo-section-soft">
    <Container>
      <SectionHeading
        eyebrow={section.data.eyebrow}
        title={section.data.title}
        description={section.data.description}
      />
      <div className="amigo-area-grid">
        {section.data.items.map((item) => (
          <AreaCard
            key={item.href}
            title={item.label}
            description={item.description}
            href={item.href}
          />
        ))}
      </div>
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
        {section.data.items.map((item) => (
          <article key={item.title} className="amigo-feature">
            <ClipboardCheck size={20} aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
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
  <section id={section.id} className="amigo-section amigo-section-soft">
    <Container>
      <SectionHeading
        eyebrow={section.data.eyebrow}
        title={section.data.title}
      />
      <div className="amigo-faq">
        {section.data.items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
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
      <QuoteRequestForm {...section.data} />
    </Container>
  </section>
)

export const CallToActionSection: SectionComponent<'call-to-action'> = ({
  section,
}) => (
  <section id={section.id} className="amigo-section amigo-cta">
    <Container>
      <p className="amigo-eyebrow">{section.data.eyebrow}</p>
      <h2>{section.data.title}</h2>
      <p>{section.data.description}</p>
      <div className="amigo-actions">
        <ContentLink
          {...section.data.primaryAction}
          className="amigo-button amigo-button-primary"
          event={
            section.data.primaryAction.external
              ? 'request_service_click'
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
    </Container>
  </section>
)

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
