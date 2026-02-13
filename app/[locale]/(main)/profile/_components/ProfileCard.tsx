'use client'

import { Card, CardBody, CardFooter, Button } from '@heroui/react'
import { useTranslations } from 'next-intl'

import { ProfileHeader } from './ProfileHeader'

import { FormInput } from '@/components/ui/FormInput'
import { ImageDropzone } from '@/components/ui/ImageDropzone'
import { useProfileForm } from '@/features/user/useProfileForm'
import { useAuth } from '@/hooks/useAuth'

const ProfileCard = () => {
  const t = useTranslations('profile')
  const tFields = useTranslations('fields')
  const tActions = useTranslations('actions')
  const { userId } = useAuth()
  const { form, onSubmit, handleFilesChange, handleReset, isLoading, isDirty } =
    useProfileForm(userId)

  return (
    <Card
      fullWidth
      className='border-default-100 border'
      radius='sm'
      shadow='none'
    >
      <ProfileHeader>
        <b>{t('tabs.edit')}</b>
      </ProfileHeader>

      <CardBody className='gap-6'>
        <div className='mx-auto w-full max-w-2xl'>
          <ImageDropzone onFilesChange={handleFilesChange} />
        </div>

        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <FormInput
              isDisabled
              control={form.control}
              label={tFields('imageUrl')}
              name='image'
            />
            <FormInput
              control={form.control}
              label={tFields('fullName')}
              name='name'
            />
            <FormInput
              isDisabled
              control={form.control}
              label={tFields('email')}
              name='email'
              type='email'
            />
          </div>
        </div>
      </CardBody>

      <CardFooter className='justify-end gap-2'>
        <Button isDisabled={isLoading} variant='faded' onPress={handleReset}>
          {tActions('cancel')}
        </Button>
        <Button
          className='text-secondary'
          color='primary'
          isDisabled={isLoading || !isDirty}
          isLoading={isLoading}
          onPress={() => {
            onSubmit()
          }}
        >
          {tActions('save')}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { ProfileCard }
