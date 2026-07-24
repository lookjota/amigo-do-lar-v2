import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Braces,
  Circle,
  Code2,
  Compass,
  FileText,
  Network,
} from 'lucide-react'
import type { SectionComponent } from '../../../engine/PageSectionRegistry'

function ExternalAttributes({ external }: { external?: boolean }) {
  if (!external) {
    return null
  }

  return <span className="sr-only"> (abre em nova aba)</span>
}

export const NavigationSection: SectionComponent<'navigation'> = ({
  section,
}) => (
  <header id={section.id} className="site-header">
    <div className="shell navigation">
      <a className="brand" href="#inicio" aria-label="Instituto Logos, início">
        <span className="brand-mark" aria-hidden="true">
          L
        </span>
        <span>{section.data.brand}</span>
      </a>

      <nav className="navigation-links" aria-label="Navegação principal">
        {section.data.links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <a
        className="github-link"
        href={section.data.additionalLink.href}
        target={section.data.additionalLink.external ? '_blank' : undefined}
        rel={section.data.additionalLink.external ? 'noreferrer' : undefined}
      >
        <Code2 size={16} aria-hidden="true" />
        {section.data.additionalLink.label}
        <ExternalAttributes
          external={section.data.additionalLink.external}
        />
      </a>
    </div>
  </header>
)

export const HeroSection: SectionComponent<'hero'> = ({ section }) => (
  <main id={section.id} className="hero-section">
    <div className="hero-grid" aria-hidden="true" />
    <div className="shell hero-content">
      <div className="eyebrow">
        <span />
        {section.data.eyebrow}
      </div>
      <h1>{section.data.title}</h1>
      <p className="hero-description">{section.data.description}</p>
      <div className="hero-actions">
        {section.data.actions.map((action, index) => (
          <a
            key={action.href}
            className={index === 0 ? 'button button-primary' : 'text-link'}
            href={action.href}
          >
            {action.label}
            <ArrowDownRight size={17} aria-hidden="true" />
          </a>
        ))}
      </div>
      <p className="motto">{section.data.motto}</p>
    </div>
  </main>
)

const areaIcons = [Braces, Compass, Network]

export const ResearchAreasSection: SectionComponent<'researchAreas'> = ({
  section,
}) => (
  <section id={section.id} className="content-section">
    <div className="shell">
      <div className="section-heading">
        <p>01 / Investigação</p>
        <h2>{section.data.title}</h2>
      </div>
      <div className="area-grid">
        {section.data.items.map((item, index) => {
          const Icon = areaIcons[index] ?? Circle
          return (
            <article className="area-card" key={item.name}>
              <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              <span className="card-index">0{index + 1}</span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </article>
          )
        })}
      </div>
    </div>
  </section>
)

export const ProjectsSection: SectionComponent<'projects'> = ({ section }) => (
  <section id={section.id} className="content-section projects-section">
    <div className="shell">
      <div className="section-heading">
        <p>02 / Construção</p>
        <h2>{section.data.title}</h2>
      </div>
      <div className="project-list">
        {section.data.items.map((project, index) => (
          <article className="project-row" key={project.name}>
            <span className="project-number">0{index + 1}</span>
            <div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
            <span className={`status status-${project.status.toLowerCase()}`}>
              {project.status}
            </span>
          </article>
        ))}
      </div>
    </div>
  </section>
)

export const DocumentsSection: SectionComponent<'documents'> = ({
  section,
}) => (
  <section id={section.id} className="content-section">
    <div className="shell">
      <div className="section-heading">
        <p>03 / Fundamentos</p>
        <h2>{section.data.title}</h2>
      </div>
      <div className="documents-grid">
        {section.data.items.map((document) => (
          <article className="document-card" key={document.code}>
            <FileText size={20} strokeWidth={1.5} aria-hidden="true" />
            <div className="document-code">{document.code}</div>
            <h3>{document.title}</h3>
            <p>{document.version}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
)

export const VisionSection: SectionComponent<'vision'> = ({ section }) => (
  <section id={section.id} className="content-section vision-section">
    <div className="shell vision-layout">
      <div className="section-heading">
        <p>04 / Visão</p>
        <h2>{section.data.title}</h2>
      </div>
      <div className="vision-copy">
        <p>{section.data.text}</p>
        <ol className="principles">
          {section.data.principles.map((principle, index) => (
            <li key={principle}>
              <span>0{index + 1}</span>
              {principle}
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
)

export const CtaSection: SectionComponent<'cta'> = ({ section }) => (
  <section id={section.id} className="cta-section">
    <div className="shell cta-panel">
      <div className="cta-icon" aria-hidden="true">
        <BookOpen size={28} strokeWidth={1.4} />
      </div>
      <div>
        <h2>{section.data.title}</h2>
        <p>{section.data.description}</p>
      </div>
      <a
        className="button button-primary"
        href={section.data.action.href}
        target={section.data.action.external ? '_blank' : undefined}
        rel={section.data.action.external ? 'noreferrer' : undefined}
      >
        {section.data.action.label}
        <ArrowUpRight size={17} aria-hidden="true" />
        <ExternalAttributes external={section.data.action.external} />
      </a>
    </div>
  </section>
)

export const FooterSection: SectionComponent<'footer'> = ({ section }) => (
  <footer id={section.id} className="footer">
    <div className="shell footer-layout">
      <div>
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            L
          </span>
          <span>{section.data.brand}</span>
        </div>
        <p>{section.data.text}</p>
      </div>
      <p className="motto">{section.data.motto}</p>
    </div>
  </footer>
)
