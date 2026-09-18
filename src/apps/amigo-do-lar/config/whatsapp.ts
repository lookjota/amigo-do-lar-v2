import { createWhatsAppUrl } from './site'

function humanizeSlug(slug: string): string {
  const labels: Record<string, string> = {
    eletrica: 'Elétrica',
    hidraulica: 'Hidráulica',
    'montagem-de-moveis': 'Montagem de Móveis',
    'fechaduras-e-portas': 'Fechaduras e Portas',
    'pequenos-reparos': 'Pequenos Reparos',
  }
  return labels[slug]
    ?? slug.replaceAll('-', ' ').replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase())
}

export function getWhatsAppMessage(pathname: string): string {
  if (pathname === '/') {
    return 'Vim pelo site do Amigo do Lar e gostaria de pedir um orçamento.'
  }

  if (pathname.startsWith('/servicos/')) {
    const service = humanizeSlug(pathname.split('/')[2] ?? '')
    return `Vim pela página de ${service} e preciso de ajuda com...`
  }

  if (pathname.startsWith('/areas-atendidas/')) {
    const region = humanizeSlug(pathname.split('/')[2] ?? '')
    return `Vim pela página de ${region} e gostaria de confirmar atendimento na região.`
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
