import { CheckIcon } from 'lucide-react'
import React from 'react'

import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

interface Props extends ComponentProps<'div'> {
  steps: string[]
  currentStep?: number
}

const Stepper: FC<Props> = ({ steps, className, currentStep = 0, ...props }) => {
  return (
    <div className={cn('mx-auto w-full max-w-3xl', className)} {...props}>
      <div className='flex flex-col items-center justify-between md:flex-row'>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <React.Fragment key={step}>
              <div className='flex flex-col items-center'>
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full transition-all duration-300 ease-in-out',
                    isCompleted && 'bg-teal-600 text-white',
                    isCurrent && 'bg-teal-600 text-white ring-4 ring-teal-200',
                    !isCompleted && !isCurrent && 'bg-divider text-gray-400',
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className='size-7' strokeWidth={3} />
                  ) : (
                    <span className='text-lg font-semibold'>{index + 1}</span>
                  )}
                </div>
                <p
                  className={cn(
                    'mt-3 max-w-[120px] text-center text-sm font-medium',
                    !isCompleted && !isCurrent && 'text-gray-400',
                  )}
                >
                  {step}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className='relative mx-4 hidden h-1 max-w-[150px] flex-1 md:block'>
                  <div className='absolute inset-0 rounded bg-divider' />
                  <div
                    className={cn(
                      'absolute inset-0 rounded bg-teal-600 transition-all duration-500',
                      index < currentStep ? 'w-full' : 'w-0',
                    )}
                  />
                </div>
              )}

              {index < steps.length - 1 && (
                <div className='relative my-4 block h-8 w-1 md:hidden'>
                  <div className='absolute inset-0 rounded bg-divider' />
                  <div
                    className={cn(
                      'absolute inset-0 rounded bg-teal-600 transition-all duration-500',
                      index < currentStep ? 'h-full' : 'h-0',
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export { Stepper }
