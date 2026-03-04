'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  Button,
  Spinner,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { TagInput } from '../tag.schema'
import type { Resolver } from 'react-hook-form'

import { useTag } from '../tag.hook'
import { useTagMutation } from '../tag.mutation'
import { tagSchema } from '../tag.schema'
import { useTagUIStore } from '../tag.store'

const DEFAULT_VALUES: TagInput = {
  name: '',
  slug: '',
}

const TagForm = () => {
  const { selectedTagId, isFormOpen, closeForm } = useTagUIStore()
  const { create, update, isCreating, isUpdating } = useTagMutation()

  const { data: tag, isLoading: isLoadingTag } = useTag(selectedTagId || '')

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TagInput>({
    resolver: zodResolver(tagSchema) as Resolver<TagInput>,
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedTagId && tag) {
        reset(tag as TagInput)
      } else if (!selectedTagId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isFormOpen, selectedTagId, tag, reset])

  const onSubmit = async (data: TagInput) => {
    if (selectedTagId) {
      await update({ ...data, id: selectedTagId })
    } else {
      await create(data)
    }
    closeForm()
  }

  const isPending = isLoadingTag || isCreating || isUpdating

  return (
    <Modal
      hideCloseButton
      isOpen={isFormOpen}
      size='md'
      onOpenChange={closeForm}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className='text-xl font-bold'>
            {selectedTagId ? 'แก้ไขแท็ก' : 'เพิ่มแท็กใหม่'}
          </ModalHeader>
          <ModalBody>
            {isLoadingTag && selectedTagId ? (
              <div className='flex justify-center p-8'>
                <Spinner label='กำลังโหลดข้อมูล...' />
              </div>
            ) : (
              <div className='space-y-4'>
                <Controller
                  control={control}
                  name='name'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name}
                      label='ชื่อแท็ก'
                      placeholder='เช่น โปรโมชั่น, สินค้าใหม่'
                      variant='bordered'
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='slug'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.slug?.message}
                      isInvalid={!!errors.slug}
                      label='URL Slug'
                      placeholder='เช่น promotion'
                      variant='bordered'
                    />
                  )}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant='flat' onPress={closeForm}>
              ยกเลิก
            </Button>
            <Button
              className='text-secondary font-bold'
              color='primary'
              isDisabled={!isDirty}
              isLoading={isPending}
              type='submit'
            >
              {selectedTagId ? 'บันทึกการแก้ไข' : 'สร้างแท็ก'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export { TagForm }
