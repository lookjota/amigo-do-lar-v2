import { useEffect } from 'react'

export function AdminPageMetadata({ title }: { title: string }) {
  useEffect(() => {
    const previousTitle = document.title
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const createdRobots = !robots
    const previousRobots = robots?.content

    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.append(robots)
    }

    document.title = title
    robots.content = 'noindex, nofollow'

    return () => {
      document.title = previousTitle
      if (createdRobots) robots?.remove()
      else if (robots && previousRobots !== undefined) {
        robots.content = previousRobots
      }
    }
  }, [title])

  return null
}
