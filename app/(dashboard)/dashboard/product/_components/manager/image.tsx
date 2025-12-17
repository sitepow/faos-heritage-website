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
    PRODUCT: ['dashboard', 'products', 'pagination'],
    IMAGES: ['dashboard', 'images', 'modal', productId],
    HOMEPAGE: ['products', 'homepage'],
    CAROUSEL: ['carousel', 'products'],
  }

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const { data: images, isLoading: isLoadingImages } = useQuery({
    queryKey: QUERY.IMAGES,
    queryFn: () => getImages(productId!),
    enabled: !!productId && isImageManagerOpen,
  })

  const onRefetchAfterDelete = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY.IMAGES,
      }),

      queryClient.invalidateQueries({
        queryKey: QUERY.HOMEPAGE,
      }),

      queryClient.invalidateQueries({
        queryKey: QUERY.CAROUSEL,
      }),

      queryClient.invalidateQueries({
        queryKey: QUERY.PRODUCT,
      }),
    ])
  }

  const { mutate: mutateDeteleImage, isPending: isPendingDeteleImage } =
    useMutation({
      mutationFn: deleteImage,
      onSuccess: async () => {
        await onRefetchAfterDelete()
        onOpenDeleteChange()
        setState({ imageId: null })
      },
    })

  const onClose = () => {
    setState({ productId: null })
    onOpenImageManagerChange()
  }

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
        size='xl'
        onOpenChange={onOpenImageManagerChange}
      >
        <ModalContent>
          <ModalHeader>Manage product images</ModalHeader>
          {isLoadingImages && (
            <ModalBody>
              <Spinner label='Loading...' />
            </ModalBody>
          )}

          {images?.length === 0 && (
            <ModalBody>
              <p className='text-center text-default-500'>
                There are no product images yet
              </p>
            </ModalBody>
          )}

          {images?.length !== 0 && (
            <ModalBody>
              <div className='grid gap-4 sm:grid-cols-2'>
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
                        aria-label='Manage products'
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
                          Edit information
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
                          Remove image
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
              className='bg-white text-primary dark:bg-divider'
              color='primary'
              variant='bordered'
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              className='bg-white text-primary dark:bg-divider'
              color='primary'
              startContent={<PlusIcon className='text-primary' />}
              variant='bordered'
              onPress={() => {
                onOpenImageManagerChange()
                onOpenImageChange()
              }}
            >
              Add image
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { ImageManager }
