import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PropsWithChildren,
} from 'react'

interface RevealProps extends PropsWithChildren {
  delay?: number
  className?: string
}

const subscribers = new Map<Element, () => void>()
let observer: IntersectionObserver | undefined

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          subscribers.get(entry.target)?.()
          subscribers.delete(entry.target)
          observer?.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
  }

  return observer
}

export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const element = elementRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!element || reducedMotion || !('IntersectionObserver' in window)) return

    const bounds = element.getBoundingClientRect()
    setVisible(false)
    setReady(true)

    if (bounds.top < window.innerHeight * 0.92) {
      const frame = window.requestAnimationFrame(() => setVisible(true))
      return () => window.cancelAnimationFrame(frame)
    }

    subscribers.set(element, () => setVisible(true))
    getObserver().observe(element)

    return () => {
      subscribers.delete(element)
      observer?.unobserve(element)
    }
  }, [])

  return (
    <div
      ref={elementRef}
      className={`amigo-reveal ${ready ? 'amigo-reveal-ready' : ''} ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--amigo-reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
