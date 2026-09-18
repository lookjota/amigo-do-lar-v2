import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Reveal } from './Reveal'

describe('Reveal reutilizável', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('revela uma única vez ao atingir aproximadamente 15% e não desaparece', () => {
    let observerCallback: IntersectionObserverCallback = () => undefined
    const observe = vi.fn()
    const unobserve = vi.fn()
    class ObserverMock {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback
      }
      observe = observe
      unobserve = unobserve
    }
    vi.stubGlobal('IntersectionObserver', ObserverMock)
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false } as MediaQueryList)))
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top: 2000 } as DOMRect)

    const { container } = render(<Reveal>Conteúdo</Reveal>)
    const element = container.firstElementChild!
    expect(element).toHaveClass('amigo-reveal-ready')
    expect(element).not.toHaveClass('is-visible')

    act(() => observerCallback([{ target: element, isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver))
    expect(element).toHaveClass('is-visible')
    expect(unobserve).toHaveBeenCalledWith(element)

    act(() => observerCallback([{ target: element, isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver))
    expect(element).toHaveClass('is-visible')
  })

  it('mantém conteúdo imediatamente visível com reduced motion', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true } as MediaQueryList)))
    const { container } = render(<Reveal>Conteúdo</Reveal>)
    expect(container.firstElementChild).toHaveClass('is-visible')
    expect(container.firstElementChild).not.toHaveClass('amigo-reveal-ready')
  })
})
