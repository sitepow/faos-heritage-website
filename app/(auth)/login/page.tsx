'use client'

import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
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

const Login = () => {
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

  const goToIndex = () => {
    router.push('/')
  }

  return (
    <Card className='p-5 md:w-[450px]'>
      <CardHeader className='flex w-full flex-col items-center gap-1'>
        <span className='text-lg font-bold'>เข้าสู่ระบบ หรือ สมัครสมาชิก</span>
        <span className='text-default-500'>เพื่อเข้าใช้งานเว็บไซต์</span>
      </CardHeader>

      <Tabs defaultSelectedKey='login'>
        <Tab key='login' title='เข้าสู่ระบบ'>
          <Form onSubmit={formLogin.handleSubmit(submitLogin)}>
            <CardBody className='gap-5'>
              <Input
                label='อีเมล'
                type='email'
                {...formLogin.register('email')}
                errorMessage={formLogin.formState.errors.email?.message}
                isInvalid={!!formLogin.formState.errors.email}
              />

              <Input
                label='รหัสผ่าน'
                type='password'
                {...formLogin.register('password')}
                errorMessage={formLogin.formState.errors.password?.message}
                isInvalid={!!formLogin.formState.errors.password}
              />
            </CardBody>

            <CardFooter className='justify-end gap-2'>
              <Button variant='faded' onClick={goToIndex}>
                กลับหน้าหลัก
              </Button>

              <Button
                isDisabled={isPending}
                isLoading={isPending}
                type='submit'
                variant='faded'
              >
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
                errorMessage={formRegister.formState.errors.name?.message}
                isInvalid={!!formRegister.formState.errors.name}
              />

              <Input
                label='อีเมล'
                {...formRegister.register('email')}
                errorMessage={formRegister.formState.errors.email?.message}
                isInvalid={!!formRegister.formState.errors.email}
                type='email'
              />

              <Input
                label='รหัสผ่าน'
                {...formRegister.register('password')}
                errorMessage={formRegister.formState.errors.password?.message}
                isInvalid={!!formRegister.formState.errors.password}
                type='password'
              />

              <Input
                label='ยืนยันรหัสผ่าน'
                {...formRegister.register('confirmPassword')}
                errorMessage={
                  formRegister.formState.errors.confirmPassword?.message
                }
                isInvalid={!!formRegister.formState.errors.confirmPassword}
                type='password'
              />
            </CardBody>

            <CardFooter className='justify-end gap-2'>
              <Button variant='faded' onClick={goToIndex}>
                กลับหน้าหลัก
              </Button>

              <Button
                isDisabled={isPending}
                isLoading={isPending}
                type='submit'
                variant='faded'
              >
                สมัครสมาชิก
              </Button>
            </CardFooter>
          </Form>
        </Tab>
      </Tabs>

      <CardBody className='items-center justify-center gap-4'>
        <div className='relative flex w-full items-center'>
          <div className='flex-grow border-t border-divider' />
          <span className='px-4 text-gray-500'>หรือเข้าสู่ระบบด้วย</span>
          <div className='flex-grow border-t border-divider' />
        </div>

        <div className='flex gap-4'>
          <Image
            alt='google'
            className='cursor-pointer rounded-full'
            height={35}
            src='/google.png'
            width={35}
            onClick={() => signIn('google')}
          />
          <Image
            alt='facebook'
            className='cursor-pointer rounded-full'
            height={35}
            src='/facebook.png'
            width={35}
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

export default Login
