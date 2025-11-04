import clsx from 'clsx'
import { CheckIcon } from 'lucide-react'
import React from 'react'

import type { ComponentProps, FC } from 'react'
interface Props extends ComponentProps<'div'> {
  steps: string[]
  currentStep?: number
}

const Stepper: FC<Props> = ({
  steps,
  className,
  currentStep = 0,
  ...props
}) => {
  return (
    <div className={clsx('mx-auto w-full max-w-4xl p-8', className)} {...props}>
      <div className='flex items-center justify-between'>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <React.Fragment key={step}>
              {/* Step Circle */}
              <div className='flex flex-col items-center'>
                <div
                  className={`flex size-10 items-center justify-center rounded-full transition-all duration-300 ease-in-out ${
                    // eslint-disable-next-line no-nested-ternary
                    isCompleted
                      ? 'bg-teal-600 text-white'
                      : isCurrent
                        ? 'bg-teal-600 text-white ring-4 ring-teal-200'
                        : 'bg-gray-200 text-gray-400'
                  } `}
                >
                  {isCompleted ? (
                    <CheckIcon className='size-7' strokeWidth={3} />
                  ) : (
                    <span className='text-lg font-semibold'>{index + 1}</span>
                  )}
                </div>
                <p
                  className={`mt-3 max-w-[120px] text-center text-sm font-medium ${
                    isCompleted || isCurrent
                      ? 'ligt:text-gray-900'
                      : 'text-gray-400'
                  } `}
                >
                  {step}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className='relative mx-4 h-1 flex-1'
                  style={{ maxWidth: '150px' }}
                >
                  <div className='absolute inset-0 rounded bg-gray-200' />
                  <div
                    className={`absolute inset-0 rounded bg-teal-600 transition-all duration-500 ${index < currentStep ? 'w-full' : 'w-0'} `}
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
