import { Link } from 'react-router-dom'
import { BrowserMetadataRenderer } from '../../../engine/BrowserMetadataRenderer'
import { Container } from '../components/Container'
import { createWhatsAppUrl } from '../config/site'
import { serviceRequestSuccessPage } from '../content/serviceRequestPages'

export function ServiceRequestSuccessPage() {
  return (
    <><BrowserMetadataRenderer metadata={serviceRequestSuccessPage.metadata} /><main id="conteudo-principal"><section className="amigo-section amigo-section-soft"><Container><div className="amigo-success-panel"><p className="amigo-eyebrow">Solicitação enviada</p><h1>Recebemos sua solicitação.</h1><p>As informações serão avaliadas e entraremos em contato para alinhar os próximos passos. O envio não confirma a execução do serviço.</p><div className="amigo-actions"><Link className="amigo-button amigo-button-primary" to="/">Voltar ao início</Link><Link className="amigo-button amigo-button-secondary" to="/servicos">Conhecer os serviços</Link><a href={createWhatsAppUrl('Olá! Acabei de enviar uma solicitação pelo site.')} target="_blank" rel="noopener noreferrer">Falar pelo WhatsApp</a></div></div></Container></section></main></>
  )
}
