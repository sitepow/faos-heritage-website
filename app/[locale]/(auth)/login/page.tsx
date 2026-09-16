'use client'

import { Card, Tab, Tabs, Button } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { FormProvider, useForm } from 'react-hook-form'

import { AuthSidebar } from './_components/AuthSidebar'
import { LoginForm } from './_components/LoginForm'
import { RegisterForm } from './_components/RegisterForm'
import { SocialButtons } from './_components/SocialButtons'

import {
  userLoginSchema,
  userRegisterSchema,
  type UserLoginInput,
  type UserRegisterInput,
} from '@/features/user/schema'
import { useAuthForm } from '@/hooks/useAuthForm'
import { useUrlQuery } from '@/hooks/useUrlQuery'

const LoginPage = () => {
  const router = useRouter()
  const t = useTranslations('auth')
  const callbackUrl = useUrlQuery().getQueryParam('callbackUrl') || '/'

  const { loginMutation, registerMutation, isPending } =
    useAuthForm(callbackUrl)

  const loginMethods = useForm<UserLoginInput>({
    resolver: zodResolver(userLoginSchema),
  })

  const registerMethods = useForm<UserRegisterInput>({
    resolver: zodResolver(userRegisterSchema),
  })

  return (
    <div className='flex sm:h-dvh sm:w-dvw'>
      <AuthSidebar />

      <div className='bg-background flex w-full items-center justify-center sm:w-[50%]'>
        <Card className='bg-background w-[450px] p-5' radius='sm' shadow='none'>
          <div className='mb-5 flex justify-start'>
            <Button isIconOnly variant='light' onPress={() => router.push('/')}>
              <ArrowLeftIcon />
            </Button>
          </div>

          <Tabs fullWidth aria-label='Auth options' variant='bordered'>
            <Tab key='login' title={t('tabs.login')}>
              <div className='pt-4'>
                <FormProvider {...loginMethods}>
                  <LoginForm
                    isPending={isPending}
                    onSubmit={(data) => loginMutation.mutate(data)}
                  />
                </FormProvider>
              </div>
            </Tab>

            <Tab key='register' title={t('tabs.register')}>
              <div className='pt-4'>
                <FormProvider {...registerMethods}>
                  <RegisterForm
                    isPending={isPending}
                    onSubmit={(data) => registerMutation.mutate(data)}
                  />
                </FormProvider>
              </div>
            </Tab>
          </Tabs>

          <SocialButtons callbackUrl={callbackUrl} dividerText={t('divider')} />
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
