/* eslint-disable @next/next/no-img-element */
'use client'

import { Button, Card, CardBody, Input, Tab, Tabs, Form } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import type { ErrorCode } from '@/lib/errors/codes'
import type { ActionResult } from '@/lib/errors/types'

import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

import { createUser } from '@/app/[locale]/(auth)/login/action'
import {
  userLoginSchema,
  userRegisterSchema,
  type UserLoginInput,
  type UserRegisterInput,
} from '@/app/[locale]/(auth)/login/schema'
import { Country } from '@/components/navbar/country'
import { ThemeSwitch } from '@/components/theme-switch'
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

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!categories || categories.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === categories.length - 1 ? 0 : prevIndex + 1,
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [categories])

  return (
    <div className='flex h-dvh w-dvw'>
      <div
        className='hidden size-full flex-col items-center justify-center gap-5 p-5 text-center sm:flex sm:w-[50%]'
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url(${categories?.[currentIndex]?.image || ''})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#000',
        }}
      >
        <img src='/images/logo.png' className='size-32' />
        <span className='text-secondary text-2xl lg:w-3/4 xl:w-1/2'>
          {translateSite('title')}
        </span>
        <div className='flex flex-wrap'>
          <Country />
          <ThemeSwitch />
        </div>
      </div>

      <div className='flex w-full items-center justify-center bg-[#f1f1f1] sm:w-[50%] dark:bg-[#131314]'>
        <Card
          className='w-[450px] bg-[#f1f1f1] p-5 dark:bg-[#131314]'
          radius='sm'
          shadow='none'
        >
          <div className='mb-5 flex justify-start'>
            <Button
              variant='light'
              onClick={() => {
                router.push('/')
              }}
            >
              <ArrowLeftIcon />
            </Button>
          </div>

          <Tabs fullWidth defaultSelectedKey='login' variant='solid'>
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

            <div className='grid w-full gap-2 sm:grid-cols-2'>
              <Card
                className='border-divider cursor-pointer border'
                shadow='none'
                fullWidth
              >
                <CardBody
                  className='flex-row items-center gap-2 p-2'
                  onClick={() => signIn('google')}
                >
                  <img
                    alt='google'
                    className='shrink-0 rounded-full'
                    height={30}
                    src='/images/social/google.png'
                    width={30}
                  />
                  <span>Google</span>
                </CardBody>
              </Card>

              <Card
                className='border-divider cursor-pointer border'
                shadow='none'
                fullWidth
              >
                <CardBody
                  className='flex-row items-center gap-2 p-2'
                  onClick={() => signIn('facebook')}
                >
                  <img
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
      </div>
    </div>
  )
}
