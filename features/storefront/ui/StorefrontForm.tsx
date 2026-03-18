/* eslint-disable no-unused-vars */
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  Textarea,
  Spinner,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { Resolver } from 'react-hook-form'

import { useStorefronts } from '../hook'
import { useStorefrontMutation } from '../mutation'
import { storefrontSchema, type StorefrontInput } from '../schema'
import { useStorefrontStore } from '../store'

import { SectionLabel } from '@/components/ui/SectionHeader'

const DEFAULT_VALUES: StorefrontInput = {
  name: '',
  description: '',
  phone: '',
  address: '',
  googleMapUrl: '',
  isActive: true,
  isMain: false,
}

const StorefrontForm = () => {
  const { selectedId, isFormOpen, closeForm } = useStorefrontStore()
  const { createStorefront, updateStorefront, isCreating, isUpdating } =
    useStorefrontMutation()

  const { data: storefronts, isLoading } = useStorefronts()

  const storefront = storefronts?.find((s) => {
    return s.id === selectedId
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<StorefrontInput>({
    resolver: zodResolver(storefrontSchema) as Resolver<StorefrontInput>,
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedId && storefront) {
        reset(storefront as StorefrontInput)
      } else {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isFormOpen, selectedId, storefront, reset])

  const onSubmit = async (values: StorefrontInput) => {
    const { id, ...data } = values

    if (selectedId) {
      return await updateStorefront({
        id: selectedId,
        data,
      })
    }

    return await createStorefront(values)
  }

  const isPending = isCreating || isUpdating

  return (
    <Modal
      hideCloseButton
      isDismissable={!isPending}
      isOpen={isFormOpen}
      scrollBehavior='inside'
      size='2xl'
      onOpenChange={() => {
        return closeForm()
      }}
    >
      <ModalContent>
        <ModalHeader className='text-left font-bold'>
          {selectedId ? 'แก้ไขข้อมูลสาขา' : 'เพิ่มสาขาใหม่'}
        </ModalHeader>
        <ModalBody>
          {isLoading && selectedId ? (
            <div className='flex h-40 items-center justify-center'>
              <Spinner label='กำลังโหลดข้อมูลสาขา...' />
            </div>
          ) : (
            <div className='space-y-4 text-left'>
              <SectionLabel>สถานะการแสดงผล</SectionLabel>
              <div className='flex flex-wrap gap-5'>
                <Controller
                  control={control}
                  name='isActive'
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <Switch
                        {...field}
                        isSelected={value}
                        onValueChange={onChange}
                      >
                        เปิดให้บริการสาขานี้ (Active)
                      </Switch>
                    )
                  }}
                />

                <Controller
                  control={control}
                  name='isMain'
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <Switch
                        {...field}
                        isSelected={value}
                        onValueChange={onChange}
                      >
                        เปิดให้สาขานี้ใช้สต็อกจากคลังหลัก
                      </Switch>
                    )
                  }}
                />
              </div>

              <SectionLabel>ข้อมูลทั่วไป</SectionLabel>
              <Controller
                control={control}
                name='name'
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name}
                      label='ชื่อสาขา'
                      variant='bordered'
                    />
                  )
                }}
              />

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <Controller
                  control={control}
                  name='phone'
                  render={({ field: { value, ...field } }) => {
                    return (
                      <Input
                        {...field}
                        errorMessage={errors.phone?.message}
                        isInvalid={!!errors.phone}
                        label='เบอร์โทรศัพท์'
                        value={value ?? ''}
                        variant='bordered'
                      />
                    )
                  }}
                />
                <Controller
                  control={control}
                  name='googleMapUrl'
                  render={({ field: { value, ...field } }) => {
                    return (
                      <Input
                        {...field}
                        label='Google Map URL'
                        value={value ?? ''}
                        variant='bordered'
                      />
                    )
                  }}
                />
              </div>

              <Controller
                control={control}
                name='address'
                render={({ field }) => {
                  return (
                    <Textarea
                      {...field}
                      errorMessage={errors.address?.message}
                      isInvalid={!!errors.address}
                      label='ที่อยู่โดยละเอียด'
                      variant='bordered'
                    />
                  )
                }}
              />

              <Controller
                control={control}
                name='description'
                render={({ field: { value, ...field } }) => {
                  return (
                    <Textarea
                      {...field}
                      label='รายละเอียดเพิ่มเติม (ไม่บังคับ)'
                      placeholder='เช่น จุดสังเกต หรือเวลาเปิด-ปิดพิเศษ'
                      value={value ?? ''}
                      variant='bordered'
                    />
                  )
                }}
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={isPending}
            variant='flat'
            onPress={() => {
              return closeForm()
            }}
          >
            ยกเลิก
          </Button>
          <Button
            className='text-secondary font-bold'
            color='primary'
            isDisabled={!isDirty || isPending}
            isLoading={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {selectedId ? 'บันทึกการแก้ไข' : 'เพิ่มข้อมูล'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { StorefrontForm }
