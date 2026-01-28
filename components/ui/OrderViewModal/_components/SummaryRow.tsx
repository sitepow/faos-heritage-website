/* eslint-disable no-undef */
const SummaryRow = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <dl className='flex justify-between text-xs font-medium text-zinc-500'>
    <dt>{label}</dt>
    <dd>{value}</dd>
  </dl>
)

export { SummaryRow }
