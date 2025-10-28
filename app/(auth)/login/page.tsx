'use client'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

interface UserInputs {
  email: string
  password: string
}

const Login = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: UserInputs) => {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl,
    })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Card className='w-[450px] p-5'>
        <CardHeader className='flex w-full flex-col items-center gap-1'>
          <span className='text-lg font-bold'>
            เข้าสู่ระบบ หรือ สมัครสมาชิก
          </span>
          <span className='text-default-500'>
            เข้าสู่ DemoStore ด้วย Passport Local
          </span>
        </CardHeader>

        <CardBody className='gap-5'>
          <Input
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            label='อีเมล'
            type='email'
            {...register('email', {
              required: 'กรุณากรอกอีเมล',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'รูปแบบอีเมลไม่ถูกต้อง',
              },
            })}
          />

          <Input
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            label='รหัสผ่าน'
            type='password'
            {...register('password', {
              required: 'กรุณากรอกรหัสผ่าน',
              minLength: {
                value: 6,
                message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
              },
            })}
          />
        </CardBody>

        <CardBody className='items-center justify-center gap-4'>
          <span>หรือจะเข้าสู่ระบบด้วย</span>

          <div className='flex gap-4'>
            <Image
              alt='google-login'
              className='cursor-pointer rounded-full'
              height={50}
              src='/google.png'
              width={50}
              onClick={async () => {
                await signIn('google')
              }}
            />

            <Image
              alt='google-login'
              className='cursor-pointer rounded-full'
              height={50}
              src='/facebook.png'
              width={50}
              onClick={async () => {
                await signIn('facebook')
              }}
            />
          </div>
        </CardBody>

        <CardFooter className='flex-col gap-2.5'>
          <span className='text-default-500 text-center text-xs'>
            หากคุณสมัครสมาชิก จะถือว่าคุณได้ยินยอม{' '}
            <span className='font-bold underline'>ข้อกำหนดและเงื่อนไข</span>{' '}
            พร้อมทั้ง{' '}
            <span className='font-bold underline'>นโยบายความเป็นส่วนตัว</span>
            และยืนยันแล้วว่าคุณมีอายุ 10 ปีขึ้นไป
          </span>

          <Button fullWidth type='submit'>
            ดำเนินการต่อ
          </Button>
        </CardFooter>
      </Card>
    </Form>
  )
}

export default Login
