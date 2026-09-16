interface StepItemProps {
  index: number
  text: string
}

const StepItem = ({ text }: StepItemProps) => {
  return (
    <div className='flex gap-4'>
      <span className='text-primary pt-0.5'>-</span>
      <p>{text.replace(/^\d+\.\s*/, '')}</p>
    </div>
  )
}

export { StepItem }
