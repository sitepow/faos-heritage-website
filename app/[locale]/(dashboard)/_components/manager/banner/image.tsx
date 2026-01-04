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

import { deleteImageBanner, getImageBanners } from './action'
import { ImageBannerForm } from './form'
import { useImageBannerStore } from './store'

import { ConfirmModal } from '@/components/modal/confirm'
import { cn } from '@/utils/style'

export const ImageBannerManager = () => {
  const queryClient = useQueryClient()

  const {
    imageBannerId,
    isImageBannerManagerOpen,
    onOpenImageBannertChange,
    onOpenImageBannertManagerChange,
    setState,
  } = useImageBannerStore()

  const QUERY_KEY = {
    BANNERS: ['dashboard', 'banners'],
  }

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const { data: banners, isLoading } = useQuery({
    queryKey: QUERY_KEY.BANNERS,
    queryFn: getImageBanners,
    enabled: isImageBannerManagerOpen,
  })

  const { mutate: deleteBanner, isPending: isDeleting } = useMutation({
    mutationFn: deleteImageBanner,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.BANNERS,
      })
      onOpenDeleteChange()
      onOpenImageBannertManagerChange()
      setState({ imageBannerId: null })
    },
  })

  const onClose = () => {
    setState({ imageBannerId: null })
    onOpenImageBannertManagerChange(false)
  }

  return (
    <>
      <ImageBannerForm />

      <ConfirmModal
        isOpen={isDeleteOpen}
        isPending={isDeleting}
        onConfirm={() => deleteBanner(imageBannerId!)}
        onOpenChange={onOpenDeleteChange}
      />

      <Modal
        hideCloseButton
        isDismissable={false}
        isOpen={isImageBannerManagerOpen}
        scrollBehavior='inside'
        size='xl'
        onOpenChange={onOpenImageBannertManagerChange}
      >
        <ModalContent>
          <ModalHeader>Manage banners</ModalHeader>

          {isLoading && (
            <ModalBody>
              <Spinner label='Loading...' />
            </ModalBody>
          )}

          {!isLoading && banners?.length === 0 && (
            <ModalBody>
              <p className='text-default-500 text-center'>
                There are no banners yet
              </p>
            </ModalBody>
          )}

          {!isLoading && banners?.length !== 0 && (
            <ModalBody>
              <div className='grid gap-4 sm:grid-cols-2'>
                {banners?.map((banner) => (
                  <div
                    key={banner.id}
                    className='flex items-center justify-between'
                  >
                    <div className='flex w-full flex-col gap-1'>
                      <Image
                        alt={banner?.alt ?? ''}
                        className={cn(
                          'border-divider h-40 w-full border object-cover',
                          banner?.isActive &&
                            'border-primary border-r-divider border-y-divider border-l-4',
                        )}
                        height={200}
                        src={banner.url}
                        width={200}
                      />
                      <p>{banner?.id}</p>
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
                            setState({ imageBannerId: banner.id })
                            onOpenImageBannertManagerChange()
                            onOpenImageBannertChange()
                          }}
                        >
                          Edit banner
                        </DropdownItem>
                        <DropdownItem
                          key='delete'
                          className='text-danger'
                          color='danger'
                          startContent={<TrashIcon className='size-4' />}
                          onClick={() => {
                            setState({ imageBannerId: banner.id })
                            onOpenDeleteChange()
                            onOpenImageBannertManagerChange()
                          }}
                        >
                          Remove banner
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
              Close
            </Button>
            <Button
              color='primary'
              className='text-secondary'
              startContent={<PlusIcon />}
              onPress={() => {
                onOpenImageBannertManagerChange(false)
                onOpenImageBannertChange(true)
              }}
            >
              Add banner
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
