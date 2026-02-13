'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react'
import { useTranslations } from 'next-intl'

import { useAddressForm } from '../useAddressForm'

import { FormInput } from '@/components/ui/FormInput'
import { FormSelect } from '@/components/ui/FormSelect'
import { FormSwitch } from '@/components/ui/FormSwitch'
import { COUNTRIES } from '@/constants'
import { useAuth } from '@/hooks/useAuth'

const AddressForm = () => {
  const t = useTranslations('fields')
  const tActions = useTranslations('actions')
  const tAddress = useTranslations('address')

  const { userId } = useAuth()

  const { form, onSubmit, onClose, isPending, isAddressOpen, addressId } =
    useAddressForm(userId)

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isAddressOpen}
      scrollBehavior='inside'
      size='xl'
      onClose={onClose}
    >
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader>
            {addressId ? tActions('edit') : tActions('new')}
          </ModalHeader>

          <ModalBody>
            {!isPending && (
              <div className='flex flex-col gap-6'>
                <FormSwitch control={form.control} name='isDefault'>
                  {tAddress('default')}
                </FormSwitch>

                <div className='space-y-4'>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <FormInput
                      control={form.control}
                      label={t('fullName')}
                      name='name'
                    />
                    <FormInput
                      control={form.control}
                      label={t('phone')}
                      name='phone'
                    />
                    <FormInput
                      className='sm:col-span-2'
                      control={form.control}
                      label={t('address')}
                      name='address'
                    />
                    <FormInput
                      control={form.control}
                      label={t('subDistrict')}
                      name='subDistrict'
                    />
                    <FormInput
                      control={form.control}
                      label={t('district')}
                      name='district'
                    />
                    <FormInput
                      control={form.control}
                      label={t('province')}
                      name='province'
                    />
                    <FormInput
                      control={form.control}
                      label={t('postalCode')}
                      name='postalCode'
                    />

                    <FormSelect
                      control={form.control}
                      label={t('country')}
                      name='countryCode'
                      options={COUNTRIES.map((c) => ({
                        label: c.name,
                        value: c.code,
                      }))}
                      onSelectionChange={(keys) => {
                        const code = Array.from(keys)[0] as string
                        const country = COUNTRIES.find((c) => c.code === code)
                        form.setValue('country', country?.name ?? '', {
                          shouldDirty: true,
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button isDisabled={isPending} variant='faded' onPress={onClose}>
              {tActions('cancel')}
            </Button>
            <Button
              className='text-secondary'
              color='primary'
              isDisabled={isPending || !form.formState.isDirty}
              isLoading={isPending}
              type='submit'
            >
              {tActions('save')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export { AddressForm }
