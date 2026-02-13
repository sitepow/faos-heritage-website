import { Switch } from '@heroui/react'
import { Controller } from 'react-hook-form'

import type { SwitchProps } from '@heroui/react'
import type { Control, FieldValues, Path } from 'react-hook-form'

interface FormSwitchProps<T extends FieldValues> extends Omit<
  SwitchProps,
  'name'
> {
  name: Path<T>
  control: Control<T>
}

const FormSwitch = <T extends FieldValues>({
  name,
  control,
  children,
  ...props
}: FormSwitchProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { value, onChange, ...field } }) => (
      <Switch {...field} {...props} isSelected={value} onValueChange={onChange}>
        {children}
      </Switch>
    )}
  />
)

export { FormSwitch }
