import { BrowserMetadataRenderer } from '../../../engine/BrowserMetadataRenderer'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Container } from '../components/Container'
import { ServiceRequestForm } from '../components/ServiceRequestForm'
import { serviceRequestPage } from '../content/serviceRequestPages'

export function ServiceRequestPage() {
  return (
    <>
      <BrowserMetadataRenderer metadata={serviceRequestPage.metadata} />
      <main id="conteudo-principal">
        <Breadcrumbs items={[{ id: 'home', label: 'Início', path: '/', order: 1 }, { id: 'request', label: 'Solicitar atendimento', path: '/solicitar-atendimento', parentId: 'home', order: 1 }]} />
        <section className="amigo-section amigo-section-soft">
          <Container><div className="amigo-quote-request-layout"><div><p className="amigo-eyebrow">Solicitação de atendimento</p><h1>Conte o que seu lar precisa.</h1><p className="amigo-quote-request-introduction">Preencha os dados para avaliarmos sua necessidade. O envio não confirma automaticamente a execução do serviço.</p></div><ServiceRequestForm /></div></Container>
        </section>
      </main>
    </>
  )
}
