/* eslint-disable react/no-unstable-nested-components */
'use client'

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Tab,
  Tabs,
  Form,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import type { ErrorCode } from '@/lib/errors/codes'
import type { ActionResult } from '@/lib/errors/types'

import { createUser } from '@/app/[locale]/(auth)/login/action'
import {
  userLoginSchema,
  userRegisterSchema,
  type UserLoginInput,
  type UserRegisterInput,
} from '@/app/[locale]/(auth)/login/schema'
import { useQueryParams } from '@/hooks/useQueryParams'

export default function Login() {
  const translateAuth = useTranslations('Auth')
  const translateSite = useTranslations('Site')
  const router = useRouter()
  const { getQueryParam } = useQueryParams()
  const callbackUrl = getQueryParam('callbackUrl') || '/'

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
  } = useForm<UserLoginInput>({
    resolver: zodResolver(userLoginSchema),
  })

  const {
    register: register,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister },
  } = useForm<UserRegisterInput>({
    resolver: zodResolver(userRegisterSchema),
  })

  const { mutate: mutationRegister, isPending: isPendingRegister } =
    useMutation({
      mutationFn: createUser,
      onSuccess: async (result, form) => {
        if (!result.success) {
          return
        }

        await signIn('credentials', {
          email: form.email,
          password: form.password,
          redirect: false,
        })

        router.push(callbackUrl)
      },
    })

  const { mutate: mutationLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: async (form: UserLoginInput): Promise<ActionResult<void>> => {
      const res = await signIn('credentials', {
        ...form,
        redirect: false,
      })

      if (res?.error) {
        return {
          success: false,
          code: res.error as ErrorCode,
        }
      }

      return { success: true, data: undefined }
    },

    onSuccess: (result) => {
      if (result.success) {
        router.push(callbackUrl)
      }
    },
  })

  const isPending = isPendingRegister || isPendingLogin

  const submitLogin = (data: UserLoginInput) => {
    mutationLogin(data)
  }

  const submitRegister = (data: UserRegisterInput) => {
    mutationRegister(data)
  }

  return (
    <Card className='p-5 sm:w-[400px]'>
      <CardHeader className='flex w-full flex-col items-center gap-1'>
        <span className='text-lg font-bold'>
          {translateAuth('headerTitle')}
        </span>
        <span className='text-default-500'>
          {translateAuth.rich('headerDesc', {
            siteName: translateSite('name'),
            link: (chunks) => (
              <Link href={'/'}>
                <span className='text-primary cursor-pointer underline'>
                  {chunks}
                </span>
              </Link>
            ),
          })}
        </span>
      </CardHeader>

      <Tabs fullWidth defaultSelectedKey='login' variant='bordered'>
        <Tab key='login' title={translateAuth('loginTab')}>
          <Form onSubmit={handleSubmitLogin(submitLogin)}>
            <Input
              label={translateAuth('emailLabel')}
              type='email'
              variant='bordered'
              {...registerLogin('email')}
              errorMessage={errorsLogin.email?.message}
              isInvalid={!!errorsLogin.email}
            />
            <Input
              label={translateAuth('passwordLabel')}
              type='password'
              variant='bordered'
              {...registerLogin('password')}
              errorMessage={errorsLogin.password?.message}
              isInvalid={!!errorsLogin.password}
            />
            <Button
              fullWidth
              color='primary'
              className='text-secondary'
              isDisabled={isPending}
              isLoading={isPending}
              type='submit'
            >
              {translateAuth('loginBtn')}
            </Button>
          </Form>
        </Tab>

        <Tab key='register' title={translateAuth('registerTab')}>
          <Form onSubmit={handleSubmitRegister(submitRegister)}>
            <Input
              label={translateAuth('nameLabel')}
              variant='bordered'
              {...register('name')}
              errorMessage={errorsRegister.name?.message}
              isInvalid={!!errorsRegister.name}
            />

            <Input
              label={translateAuth('emailLabel')}
              {...register('email')}
              errorMessage={errorsRegister.email?.message}
              isInvalid={!!errorsRegister.email}
              type='email'
              variant='bordered'
            />

            <Input
              label={translateAuth('passwordLabel')}
              variant='bordered'
              {...register('password')}
              errorMessage={errorsRegister.password?.message}
              isInvalid={!!errorsRegister.password}
              type='password'
            />

            <Input
              label={translateAuth('confirmPasswordLabel')}
              variant='bordered'
              {...register('confirmPassword')}
              errorMessage={errorsRegister.confirmPassword?.message}
              isInvalid={!!errorsRegister.confirmPassword}
              type='password'
            />

            <Button
              fullWidth
              color='primary'
              className='text-secondary'
              isDisabled={isPending}
              isLoading={isPending}
              type='submit'
            >
              {translateAuth('registerBtn')}
            </Button>
          </Form>
        </Tab>
      </Tabs>

      <CardBody className='items-center justify-center gap-4'>
        <div className='relative flex w-full items-center'>
          <div className='border-divider flex-grow border-t' />
          <span className='px-4 whitespace-nowrap text-gray-500'>
            {translateAuth('socialDivider')}
          </span>
          <div className='border-divider flex-grow border-t' />
        </div>

        <div className='flex w-full flex-wrap justify-center gap-2'>
          <Card className='cursor-pointer' fullWidth>
            <CardBody
              className='flex-row items-center gap-2 p-2'
              onClick={() => signIn('google')}
            >
              <Image
                alt='google'
                className='shrink-0 rounded-full'
                height={30}
                src='/images/social/google.png'
                width={30}
              />
              <span>Google</span>
            </CardBody>
          </Card>

          <Card className='cursor-pointer' fullWidth>
            <CardBody
              className='flex-row items-center gap-2 p-2'
              onClick={() => signIn('facebook')}
            >
              <Image
                alt='facebook'
                className='shrink-0 rounded-full'
                height={30}
                src='/images/social/facebook.png'
                width={30}
              />
              <span>Facebook</span>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  )
}
