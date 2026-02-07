interface StepItemProps {
  index: number
  text: string
}

const StepItem = ({ index, text }: StepItemProps) => {
  return (
    <div className='flex gap-4'>
      <span className='text-primary pt-0.5 font-mono'>
        {(index + 1).toString().padStart(2, '0')}
      </span>
      <p>{text.replace(/^\d+\.\s*/, '')}</p>
    </div>
  )
}

export { StepItem }
