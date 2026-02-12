import { Input } from '@heroui/react'
import { Controller } from 'react-hook-form'

import type { InputProps } from '@heroui/react'
import type { Control, FieldValues, Path } from 'react-hook-form'

interface Props<T extends FieldValues> extends Omit<InputProps, 'name'> {
  name: Path<T>
  control: Control<T>
}

const FormInput = <T extends FieldValues>({
  name,
  control,
  ...props
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Input
          {...field}
          {...props}
          errorMessage={error?.message}
          isInvalid={!!error}
          value={field.value ?? ''}
          variant='bordered'
        />
      )}
    />
  )
}

export { FormInput }
