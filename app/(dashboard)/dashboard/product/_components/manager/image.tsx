'use client'

import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  ModalFooter,
} from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EditIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react'
import Image from 'next/image'

import { deleteImage, getImages } from '../../action/image'
import { useProductStore } from '../../store'
import { ImageForm } from '../form/image'

import { ConfirmModal } from '@/components/modal/confirm'
import { cn } from '@/utils/style'

export const ImageManager = () => {
  const queryClient = useQueryClient()
  const {
    isImageManagerOpen,
    onOpenImageManagerChange,
    onOpenImageChange,
    productId,
    setState,
    imageId,
  } = useProductStore()

  const QUERY_KEY = {
    PRODUCT: ['dashboard', 'products', 'pagination'],
    IMAGES: ['dashboard', 'images', 'modal', productId],
    HOMEPAGE: ['products', 'homepage'],
    CAROUSEL: ['carousel', 'products'],
  }

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const { data: images, isLoading: isLoadingImages } = useQuery({
    queryKey: QUERY_KEY.IMAGES,
    queryFn: () => getImages(productId!),
    enabled: !!productId && isImageManagerOpen,
  })

  const onRefetchAfterDelete = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.IMAGES,
      }),

      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.HOMEPAGE,
      }),

      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.CAROUSEL,
      }),

      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.PRODUCT,
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
      <ConfirmModal
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
              <p className='text-default-500 text-center'>
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
                        className={cn(
                          'border-divider h-40 w-full border object-cover',
                          image?.isPrimary &&
                            'border-primary border-r-divider border-y-divider border-l-4',
                        )}
                        height={200}
                        src={image.url}
                        width={200}
                      />
                      <p>{image?.id}</p>
                    </div>

                    <Dropdown placement='bottom-end'>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          className='shrink-0'
                          size='sm'
                          variant='light'
                        >
                          <EllipsisVerticalIcon className='text-default-500 size-5' />
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
                            onOpenImageManagerChange()
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
            <Button variant='faded' onPress={onClose}>
              Cancel
            </Button>
            <Button
              className='text-secondary'
              color='primary'
              startContent={<PlusIcon />}
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
