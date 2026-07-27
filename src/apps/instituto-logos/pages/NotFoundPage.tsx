import { ArrowLeft } from 'lucide-react'
import type { PageMetadata } from '../../../domain/metadata/PageMetadata'
import { BrowserMetadataRenderer } from '../../../engine/BrowserMetadataRenderer'

const notFoundMetadata: PageMetadata = {
  title: 'Conteúdo não encontrado — Instituto Logos',
  description:
    'O endereço informado não corresponde a um conteúdo publicado pelo Instituto Logos.',
  author: 'Instituto Logos',
  locale: 'pt-BR',
  robots: {
    index: false,
    follow: false,
  },
}

export function NotFoundPage() {
  return (
    <>
      <BrowserMetadataRenderer metadata={notFoundMetadata} />
      <main className="not-found">
        <div>
          <span className="not-found-code">404</span>
          <p className="eyebrow">Instituto Logos</p>
          <h1>Conteúdo não encontrado.</h1>
          <p>
            O endereço informado não corresponde a um conteúdo publicado nesta
            etapa do projeto.
          </p>
          <a className="button button-primary" href="/">
            <ArrowLeft size={17} aria-hidden="true" />
            Voltar ao início
          </a>
        </div>
      </main>
    </>
  )
}
