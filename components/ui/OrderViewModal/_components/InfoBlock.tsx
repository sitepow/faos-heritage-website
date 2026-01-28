/* eslint-disable no-undef */
import { Label } from './Label'

const InfoBlock = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div className='flex flex-col gap-2'>
    <Label>{label}</Label>
    <p className='text-sm font-medium text-zinc-600 dark:text-zinc-400'>
      {children}
    </p>
  </div>
)

export { InfoBlock }
