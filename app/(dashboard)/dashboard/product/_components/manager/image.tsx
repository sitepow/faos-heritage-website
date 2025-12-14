'use client'

import { Button } from '@heroui/button'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/modal'
import { Spinner } from '@heroui/spinner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EditIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react'
import Image from 'next/image'

import { deleteImage, getImages } from '../../actions/image'
import { useProductStore } from '../../store'
import { ImageForm } from '../form/image'

import { ModalConfirm } from '@/components/modal/confirm'

const ImageManager = () => {
  const queryClient = useQueryClient()
  const {
    isImageManagerOpen,
    onOpenImageManagerChange,
    onOpenImageChange,
    productId,
    setState,
    imageId,
  } = useProductStore()

  const QUERY = {
    IMAGES: ['dashboard', 'images', 'modal', productId],
  }

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const { data: images, isLoading: isLoadingImages } = useQuery({
    queryKey: QUERY.IMAGES,
    queryFn: () => getImages(productId!),
    enabled: !!productId && isImageManagerOpen,
  })

  const { mutate: mutateDeteleImage, isPending: isPendingDeteleImage } =
    useMutation({
      mutationFn: deleteImage,
      onSuccess: async () => {
        queryClient.invalidateQueries({
          queryKey: QUERY.IMAGES,
        })
        onOpenDeleteChange()
        setState({ imageId: null })
      },
    })

  return (
    <>
      <ImageForm />
      <ModalConfirm
        isOpen={isDeleteOpen}
        isPending={isPendingDeteleImage}
        onConfirm={() => {
          mutateDeteleImage(imageId!)
        }}
        onOpenChange={onOpenDeleteChange}
      />

      <Modal
        hideCloseButton
        isDismissable={false}
        isOpen={isImageManagerOpen}
        scrollBehavior='inside'
        onOpenChange={onOpenImageManagerChange}
      >
        <ModalContent>
          <ModalHeader>จัดการรูปภาพสินค้า</ModalHeader>
          {isLoadingImages && (
            <ModalBody>
              <Spinner label='กำลังโหลด...' />
            </ModalBody>
          )}

          {images?.length === 0 && (
            <ModalBody>
              <p className='text-center text-default-500'>
                ยังไม่มีรูปภาพสินค้า
              </p>
            </ModalBody>
          )}

          {images?.length !== 0 && (
            <ModalBody>
              <div className='grid gap-4'>
                {images?.map((image) => (
                  <div
                    key={image.id}
                    className='flex items-center justify-between'
                  >
                    <div className='flex w-full flex-col gap-1'>
                      <Image
                        alt={image?.alt ?? ''}
                        className='h-40 w-full border border-divider object-cover'
                        height={200}
                        src={image.url}
                        width={200}
                      />
                      <span className='line-clamp-1 text-sm'>{image.url}</span>
                    </div>

                    <Dropdown placement='bottom-end'>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          className='shrink-0'
                          size='sm'
                          variant='light'
                        >
                          <EllipsisVerticalIcon className='size-5 text-default-500' />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label='จัดการสินค้า'
                        className='min-w-[180px]'
                      >
                        <DropdownItem
                          key='edit'
                          startContent={<EditIcon className='size-4' />}
                          onClick={() => {
                            setState({ imageId: image.id })
                            onOpenImageManagerChange()
                            onOpenImageChange()
                          }}
                        >
                          แก้ไขข้อมูล
                        </DropdownItem>
                        <DropdownItem
                          key='delete'
                          className='text-danger'
                          color='danger'
                          startContent={<TrashIcon className='size-4' />}
                          onClick={() => {
                            setState({ imageId: image.id })
                            onOpenDeleteChange()
                          }}
                        >
                          ลบตัวเลือก
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                ))}
              </div>
            </ModalBody>
          )}
          <ModalFooter>
            <Button
              variant='faded'
              onPress={() => {
                onOpenImageManagerChange()
              }}
            >
              ยกเลิก
            </Button>
            <Button
              startContent={<PlusIcon className='text-default-500' />}
              variant='faded'
              onPress={() => {
                onOpenImageManagerChange()
                onOpenImageChange()
              }}
            >
              เพิ่มรูปภาพ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { ImageManager }
