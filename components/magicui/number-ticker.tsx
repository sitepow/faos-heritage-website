'use client'

import { useInView, useMotionValue, useSpring } from 'framer-motion'
import { type ComponentPropsWithoutRef, useEffect, useRef } from 'react'

import { cn } from '@/utils'

interface NumberTickerProps extends ComponentPropsWithoutRef<'span'> {
  value: number
  direction?: 'up' | 'down'
  delay?: number
  decimalPlaces?: number
}

export const NumberTicker = ({
  value,
  direction = 'up',
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === 'down' ? value : 0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === 'down' ? 0 : value)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [motionValue, isInView, delay, value, direction])

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)))
        }
      }),
    [springValue, decimalPlaces],
  )

  return (
    <span
      ref={ref}
      className={cn(
        'text-foreground inline-block tracking-wider tabular-nums',
        className,
      )}
      {...props}
    >
      0
    </span>
  )
}
