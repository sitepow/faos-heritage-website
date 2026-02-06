/* eslint-disable no-unused-vars */
import { Input, Button, Form } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import type { UserLoginInput } from '@/features/user/user.schema'

const LoginForm = ({
  isPending,
  onSubmit,
}: {
  isPending: boolean
  onSubmit: (data: UserLoginInput) => void
}) => {
  const t = useTranslations('auth')
  const tf = useTranslations('fields')
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useFormContext<UserLoginInput>()

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label={tf('email')}
        variant='bordered'
        {...register('email')}
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
      />
      <Input
        label={t('fields.password')}
        type='password'
        variant='bordered'
        {...register('password')}
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
      />
      <Button
        fullWidth
        color='primary'
        isDisabled={isPending}
        isLoading={isPending}
        type='submit'
      >
        {t('tabs.login')}
      </Button>
    </Form>
  )
}

export { LoginForm }
