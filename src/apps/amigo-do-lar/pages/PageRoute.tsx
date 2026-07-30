import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { buildBreadcrumbs } from '../../../domain/navigation/navigationResolver'
import { PageRenderer } from '../../../engine/PageRenderer'
import { trackEvent } from '../analytics/analytics'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { navigationItems } from '../config/navigation'
import { AmigoDoLarPageRepository } from '../repositories/AmigoDoLarPageRepository'

const pageRepository = new AmigoDoLarPageRepository()

export function PageRoute({ pageSlug }: { pageSlug: string }) {
  const location = useLocation()
  const page = pageRepository.getBySlug(pageSlug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })

    if (pageSlug.startsWith('/servicos/')) {
      trackEvent('service_page_view', { page_path: pageSlug })
    }

    if (pageSlug.startsWith('/areas-atendidas/')) {
      trackEvent('local_page_view', { page_path: pageSlug })
    }
  }, [pageSlug])

  if (!page) return null

  return (
    <>
      <Breadcrumbs
        items={buildBreadcrumbs(navigationItems, location.pathname)}
      />
      <PageRenderer page={page} />
    </>
  )
}
