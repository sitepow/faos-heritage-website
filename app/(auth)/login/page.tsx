'use client'

import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { Tab, Tabs } from '@heroui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { siteConfig } from '@/config/site'
import { useMutation } from '@tanstack/react-query'
import { createUser } from './actions/user'
import {
  userLoginSchema,
  userRegisterSchema,
  type UserLoginInput,
  type UserRegisterInput,
} from './schema/user'

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const formLogin = useForm<UserLoginInput>({
    resolver: zodResolver(userLoginSchema),
  })

  const formRegister = useForm<UserRegisterInput>({
    resolver: zodResolver(userRegisterSchema),
  })

  const { mutate: registerMutation, isPending: isPendingRegister } = useMutation({
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
    <Card className='p-5 md:w-[450px]'>
      <CardHeader className='flex w-full flex-col items-center gap-1'>
        <span className='text-lg font-bold'>เข้าสู่ระบบ หรือ สมัครสมาชิก</span>
        <span className='text-default-500'>เพื่อเข้าใช้งานเว็บไซต์ {siteConfig.name}</span>
      </CardHeader>

      <Tabs defaultSelectedKey='login'>
        <Tab key='login' title='เข้าสู่ระบบ'>
          <Form onSubmit={formLogin.handleSubmit(submitLogin)}>
            <CardBody className='gap-5'>
              <Input
                label='อีเมล'
                type='email'
                {...formLogin.register('email')}
                isInvalid={!!formLogin.formState.errors.email}
                errorMessage={formLogin.formState.errors.email?.message}
              />

              <Input
                label='รหัสผ่าน'
                type='password'
                {...formLogin.register('password')}
                isInvalid={!!formLogin.formState.errors.password}
                errorMessage={formLogin.formState.errors.password?.message}
              />
            </CardBody>

            <CardFooter className='justify-end gap-2'>
              <Button isDisabled={isPending} onPress={() => router.push('/')} variant='faded'>
                กลับหน้าแรก
              </Button>
              <Button isDisabled={isPending} type='submit' variant='faded'>
                เข้าสู่ระบบ
              </Button>
            </CardFooter>
          </Form>
        </Tab>

        <Tab key='register' title='สมัครสมาชิก'>
          <Form onSubmit={formRegister.handleSubmit(submitRegister)}>
            <CardBody className='gap-5'>
              <Input
                label='ชื่อ'
                {...formRegister.register('name')}
                isInvalid={!!formRegister.formState.errors.name}
                errorMessage={formRegister.formState.errors.name?.message}
              />

              <Input
                label='อีเมล'
                {...formRegister.register('email')}
                type='email'
                isInvalid={!!formRegister.formState.errors.email}
                errorMessage={formRegister.formState.errors.email?.message}
              />

              <Input
                label='รหัสผ่าน'
                {...formRegister.register('password')}
                type='password'
                isInvalid={!!formRegister.formState.errors.password}
                errorMessage={formRegister.formState.errors.password?.message}
              />

              <Input
                label='ยืนยันรหัสผ่าน'
                {...formRegister.register('confirmPassword')}
                type='password'
                isInvalid={!!formRegister.formState.errors.confirmPassword}
                errorMessage={formRegister.formState.errors.confirmPassword?.message}
              />
            </CardBody>

            <CardFooter className='justify-end gap-2'>
              <Button isDisabled={isPending} onPress={() => router.push('/')} variant='faded'>
                กลับหน้าแรก
              </Button>
              <Button type='submit' variant='faded' isDisabled={isPending}>
                สมัครสมาชิก
              </Button>
            </CardFooter>
          </Form>
        </Tab>
      </Tabs>

      <CardBody className='items-center justify-center gap-4'>
        <span className='border-b border-divider'>หรือเข้าสู่ระบบด้วย</span>

        <div className='flex gap-4'>
          <Image
            src='/google.png'
            width={50}
            height={50}
            alt='google'
            className='cursor-pointer rounded-full'
            onClick={() => signIn('google')}
          />
          <Image
            src='/facebook.png'
            width={50}
            height={50}
            alt='facebook'
            className='cursor-pointer rounded-full'
            onClick={() => signIn('facebook')}
          />
        </div>
      </CardBody>

      <CardFooter className='flex-col gap-2.5'>
        <span className='text-center text-xs text-default-500'>
          เมื่อสมัครสมาชิก ถือว่าคุณยอมรับ{' '}
          <span className='font-bold underline'>ข้อกำหนดและเงื่อนไข</span> และ{' '}
          <span className='font-bold underline'>นโยบายความเป็นส่วนตัว</span>
        </span>
      </CardFooter>
    </Card>
  )
}
