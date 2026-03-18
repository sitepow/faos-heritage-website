/* eslint-disable no-unused-vars */
import { Input, Button, Form } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import type { UserRegisterInput } from '@/features/user/schema'

const RegisterForm = ({
  isPending,
  onSubmit,
}: {
  isPending: boolean
  onSubmit: (data: UserRegisterInput) => void
}) => {
  const t = useTranslations('auth')
  const tf = useTranslations('fields')
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useFormContext<UserRegisterInput>()

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label={tf('fullName')}
        variant='bordered'
        {...register('name')}
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name}
      />
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
      <Input
        label={t('fields.confirmPassword')}
        type='password'
        variant='bordered'
        {...register('confirmPassword')}
        errorMessage={errors.confirmPassword?.message}
        isInvalid={!!errors.confirmPassword}
      />
      <Button
        fullWidth
        className='text-secondary'
        color='primary'
        isDisabled={isPending}
        isLoading={isPending}
        type='submit'
      >
        {t('tabs.register')}
      </Button>
    </Form>
  )
}

export { RegisterForm }
