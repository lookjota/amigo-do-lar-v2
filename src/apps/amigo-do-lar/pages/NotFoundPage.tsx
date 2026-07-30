import { PageRenderer } from '../../../engine/PageRenderer'
import { notFoundPage } from '../content/pageFactory'

export function NotFoundPage() {
  return <PageRenderer page={notFoundPage} />
}
