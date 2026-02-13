import { Select, SelectItem } from '@heroui/react'
import { Controller } from 'react-hook-form'

import type { SelectProps } from '@heroui/react'
import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

interface Props<T extends FieldValues> extends Omit<
  SelectProps,
  'name' | 'children'
> {
  name: Path<T>
  control: Control<T>
  options: { label: string; value: string; startContent?: ReactNode }[]
}

const FormSelect = <T extends FieldValues>({
  name,
  control,
  options,
  ...props
}: Props<T>) => (
  <Controller
    control={control}
    name={name}
    render={({
      field: { value, onChange, ...field },
      fieldState: { error },
    }) => (
      <Select
        {...field}
        {...props}
        errorMessage={error?.message}
        isInvalid={!!error}
        selectedKeys={value ? [value] : []}
        variant='bordered'
        onSelectionChange={(keys) => {
          const selectedValue = Array.from(keys)[0] as string
          onChange(selectedValue)
          props.onSelectionChange?.(keys)
        }}
      >
        {options.map((opt) => (
          <SelectItem key={opt.value} startContent={opt.startContent}>
            {opt.label}
          </SelectItem>
        ))}
      </Select>
    )}
  />
)

export { FormSelect }
