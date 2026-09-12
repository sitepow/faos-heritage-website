'use client'

import { motion } from 'framer-motion'
import {
  type ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import { cn } from '@/utils'

export interface AnimatedGridPatternProps extends ComponentPropsWithoutRef<'svg'> {
  duration?: number
  height?: number
  maxOpacity?: number
  numSquares?: number
  strokeDasharray?: string | number
  width?: number
  x?: number
  y?: number
}

export function AnimatedGridPattern({
  className,
  duration = 4,
  height = 40,
  maxOpacity = 0.4,
  numSquares = 40,
  strokeDasharray = 0,
  width = 40,
  x = -1,
  y = -1,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId()
  const containerRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 })

  const getPos = useCallback(() => {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ]
  }, [dimensions.height, dimensions.width, height, width])

  const generateSquares = useCallback(
    (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        pos: getPos(),
      }))
    },
    [getPos],
  )

  const [squares, setSquares] = useState(() => generateSquares(numSquares))

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares))
    }
  }, [dimensions, numSquares, generateSquares])

  useEffect(() => {
    const currentContainer = containerRef.current
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          height: entry.contentRect.height,
          width: entry.contentRect.width,
        })
      }
    })

    if (currentContainer) {
      resizeObserver.observe(currentContainer)
    }

    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer)
      }
    }
  }, [])

  return (
    <svg
      ref={containerRef}
      aria-hidden='true'
      className={cn(
        'pointer-events-none absolute inset-0 size-full fill-gray-400/20 stroke-gray-400/20',
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          height={height}
          id={id}
          patternUnits='userSpaceOnUse'
          width={width}
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill='none'
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect fill={`url(#${id})`} height='100%' width='100%' />
      <svg className='overflow-visible' x={x} y={y}>
        {squares.map(({ pos: [sqX, sqY], id: sqId }, index) => (
          <motion.rect
            key={`${sqX}-${sqY}-${sqId}`}
            animate={{ opacity: maxOpacity }}
            exit={{ opacity: 0 }}
            fill='currentColor'
            height={height - 1}
            initial={{ opacity: 0 }}
            strokeWidth='0'
            transition={{
              delay: index * 0.15,
              duration,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            width={width - 1}
            x={sqX * width + 1}
            y={sqY * height + 1}
          />
        ))}
      </svg>
    </svg>
  )
}
