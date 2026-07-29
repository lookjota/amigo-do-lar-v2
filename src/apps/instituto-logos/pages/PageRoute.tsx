import { useLocation } from 'react-router-dom'
import { buildBreadcrumbs } from '../../../domain/navigation/navigationResolver'
import { PageRenderer } from '../../../engine/PageRenderer'
import { navigationItems } from '../config/navigation'
import { InstitutoLogosPageRepository } from '../repositories/InstitutoLogosPageRepository'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { NotFoundPage } from './NotFoundPage'

const pageRepository = new InstitutoLogosPageRepository()

interface PageRouteProps {
  pageSlug: string
}

export function PageRoute({ pageSlug }: PageRouteProps) {
  const location = useLocation()
  const page = pageRepository.getBySlug(pageSlug)

  if (!page) {
    return <NotFoundPage />
  }

  const breadcrumbs = buildBreadcrumbs(navigationItems, location.pathname)

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <PageRenderer page={page} />
    </>
  )
}
