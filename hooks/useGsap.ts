'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const useGsapReveal = (options?: {
  selector?: string
  y?: number
  duration?: number
  stagger?: number
  delay?: number
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    selector = '.gsap-reveal',
    y = 30,
    duration = 0.8,
    stagger = 0.15,
    delay = 0,
  } = options || {}

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll(selector)
      if (elements && elements.length > 0) {
        gsap.fromTo(
          elements,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [selector, y, duration, stagger, delay])

  return containerRef
}

export { gsap, ScrollTrigger }
