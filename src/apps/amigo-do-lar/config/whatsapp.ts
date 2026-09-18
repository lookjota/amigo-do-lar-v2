import { createWhatsAppUrl } from './site'
import { findService } from '../data/services'
import { findServiceArea } from '../data/serviceAreas'

export function getWhatsAppMessage(pathname: string): string {
  if (pathname === '/') {
    return 'Vim pelo site do Amigo do Lar e gostaria de pedir um orçamento.'
  }

  if (pathname.startsWith('/servicos/')) {
    const service = findService(pathname.split('/')[2] ?? '')?.name
    if (!service) return getWhatsAppMessage('/')
    return `Vim pela página de ${service} e preciso de ajuda com...`
  }

  if (pathname.startsWith('/areas-atendidas/')) {
    const region = findServiceArea(pathname.split('/')[2] ?? '')?.name
    if (!region) return getWhatsAppMessage('/')
    return `Vim pela página de ${region} e gostaria de confirmar atendimento na região.`
  }

  if (pathname === '/lista-da-casa') {
    return 'Olá! Vim pela página Lista da Casa do Amigo do Lar e gostaria de enviar minhas pendências para avaliação.'
  }

  if (pathname === '/servicos') {
    return 'Vim pela página de Serviços e gostaria de pedir um orçamento.'
  }

  if (pathname === '/areas-atendidas') {
    return 'Vim pela página de Áreas Atendidas e gostaria de confirmar disponibilidade.'
  }

  return 'Vim pelo site do Amigo do Lar e gostaria de pedir um orçamento.'
}

export function getContextualWhatsAppUrl(pathname: string): string {
  return createWhatsAppUrl(getWhatsAppMessage(pathname))
}
