import { cn } from '@/utils/style'

interface StepConnectorProps {
  isActive: boolean
}

const StepConnector = ({ isActive }: StepConnectorProps) => {
  return (
    <>
      <div className='relative mx-4 hidden h-0.5 flex-1 md:block'>
        <div className='bg-divider absolute inset-0 rounded' />
        <div
          className={cn(
            'bg-primary absolute inset-0 rounded transition-all duration-300',
            isActive ? 'w-full' : 'w-0',
          )}
        />
      </div>

      <div className='relative my-4 block h-8 w-0.5 md:hidden'>
        <div className='bg-divider absolute inset-0 rounded' />
        <div
          className={cn(
            'bg-primary absolute inset-0 rounded transition-all duration-300',
            isActive ? 'h-full' : 'h-0',
          )}
        />
      </div>
    </>
  )
}

export { StepConnector }
