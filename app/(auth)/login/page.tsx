'use client'

import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { Tab, Tabs } from '@heroui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { createUser } from './actions/user'
import {
  userLoginSchema,
  userRegisterSchema,
  type UserLoginInput,
  type UserRegisterInput,
} from './schema/user'

import { siteConfig } from '@/config/site'

const Index = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const formLogin = useForm<UserLoginInput>({
    resolver: zodResolver(userLoginSchema),
  })

  const formRegister = useForm<UserRegisterInput>({
    resolver: zodResolver(userRegisterSchema),
  })

  const { mutate: registerMutation, isPending: isPendingRegister } =
    useMutation({
      mutationFn: createUser,
      onSuccess: async (_, form) => {
        await signIn('credentials', {
          email: form.email,
          password: form.password,
          redirect: false,
        })

        router.push(callbackUrl)
      },
    })

  const { mutate: loginMutation, isPending: isPendingLogin } = useMutation({
    mutationFn: async (form: UserLoginInput) => {
      const res = await signIn('credentials', {
        ...form,
        redirect: false,
      })

      if (res?.error) {
        throw new Error(res?.error)
      }

      return
    },
    onSuccess: () => {
      router.push(callbackUrl)
    },
  })

  const isPending = isPendingRegister || isPendingLogin

  const submitLogin = (data: UserLoginInput) => {
    loginMutation(data)
  }

  const submitRegister = (data: UserRegisterInput) => {
    registerMutation(data)
  }

  return (
    <Card className='size-full p-5 sm:w-[400px]'>
      <CardHeader className='flex w-full flex-col items-center gap-1'>
        <span className='text-lg font-bold'>เข้าสู่ระบบ หรือ สมัครสมาชิก</span>
        <span className='text-default-500'>
          เพื่อเข้าใช้งานเว็บไซต์{' '}
          <span className='text-primary-website'>{siteConfig?.name}</span>
        </span>
      </CardHeader>

      <Tabs fullWidth defaultSelectedKey='login'>
        <Tab key='login' title='เข้าสู่ระบบ'>
          <Form onSubmit={formLogin.handleSubmit(submitLogin)}>
            <Input
              label='อีเมล'
              type='email'
              variant='bordered'
              {...formLogin.register('email')}
              errorMessage={formLogin.formState.errors.email?.message}
              isInvalid={!!formLogin.formState.errors.email}
            />
            <Input
              label='รหัสผ่าน'
              type='password'
              variant='bordered'
              {...formLogin.register('password')}
              errorMessage={formLogin.formState.errors.password?.message}
              isInvalid={!!formLogin.formState.errors.password}
            />
            <Button
              fullWidth
              isDisabled={isPending}
              isLoading={isPending}
              type='submit'
              variant='faded'
            >
              เข้าสู่ระบบ
            </Button>
          </Form>
        </Tab>

        <Tab key='register' title='สมัครสมาชิก'>
          <Form onSubmit={formRegister.handleSubmit(submitRegister)}>
            <Input
              label='ชื่อ'
              variant='bordered'
              {...formRegister.register('name')}
              errorMessage={formRegister.formState.errors.name?.message}
              isInvalid={!!formRegister.formState.errors.name}
            />

            <Input
              label='อีเมล'
              {...formRegister.register('email')}
              errorMessage={formRegister.formState.errors.email?.message}
              isInvalid={!!formRegister.formState.errors.email}
              type='email'
              variant='bordered'
            />

            <Input
              label='รหัสผ่าน'
              variant='bordered'
              {...formRegister.register('password')}
              errorMessage={formRegister.formState.errors.password?.message}
              isInvalid={!!formRegister.formState.errors.password}
              type='password'
            />

            <Input
              label='ยืนยันรหัสผ่าน'
              variant='bordered'
              {...formRegister.register('confirmPassword')}
              errorMessage={
                formRegister.formState.errors.confirmPassword?.message
              }
              isInvalid={!!formRegister.formState.errors.confirmPassword}
              type='password'
            />

            <Button
              fullWidth
              isDisabled={isPending}
              isLoading={isPending}
              type='submit'
              variant='faded'
            >
              สมัครสมาชิก
            </Button>
          </Form>
        </Tab>
      </Tabs>

      <CardBody className='items-center justify-center gap-4'>
        <div className='relative flex w-full items-center'>
          <div className='flex-grow border-t border-divider' />
          <span className='px-4 text-gray-500'>หรือ</span>
          <div className='flex-grow border-t border-divider' />
        </div>

        <div className='flex w-full flex-wrap justify-center gap-2'>
          <Card className='w-fit cursor-pointer'>
            <CardBody className='p-2' onClick={() => signIn('google')}>
              <Image
                alt='google'
                className='rounded-full'
                height={30}
                src='/google.png'
                width={30}
              />
            </CardBody>
          </Card>

          <Card className='w-fit cursor-pointer'>
            <CardBody className='p-2' onClick={() => signIn('facebook')}>
              <Image
                alt='facebook'
                className='rounded-full'
                height={30}
                src='/facebook.png'
                width={30}
              />
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  )
}

export default Index
