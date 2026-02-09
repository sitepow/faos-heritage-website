interface Props {
  label: string
  value?: string | null
}

const InfoItem = ({ label, value }: Props) => (
  <div className='flex items-center gap-2'>
    <span className='text-default-500'>{label}:</span>
    <span className='font-medium'>{value ?? '-'}</span>
  </div>
)

export { InfoItem }
