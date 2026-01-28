'use client'

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Button,
  useDisclosure,
} from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useBannerUIStore } from '../banner.store'
import { BannerForm } from './BannerForm'
import { BannerItem } from './_components/BannerItem'

import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { deleteBanners, getBanners } from '@/features/banner/banner.action'
import { bannerQueryKeys } from '@/features/banner/banner.query-key'

const BannerManagerModal = () => {
  const t = useTranslations('Dashboard.BannerManager')
  const tc = useTranslations('Common')

  const queryClient = useQueryClient()
  const deleteModal = useDisclosure()

  const {
    selectedBannerId,
    isManagerOpen,
    closeManager,
    openForm,
    reset,
    selectBanner,
  } = useBannerUIStore()

  const { data: banners = [], isLoading } = useQuery({
    queryKey: bannerQueryKeys.list.all,
    queryFn: getBanners,
    enabled: isManagerOpen,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBanners,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: bannerQueryKeys.list.all,
      })

      deleteModal.onClose()
      closeManager()
      reset()
    },
  })

  const handleClose = () => {
    closeManager()
    reset()
  }

  const handleCreate = () => {
    closeManager()
    openForm()
  }

  const handleEdit = (id: string) => {
    selectBanner(id)
    closeManager()
    openForm()
  }

  const handleDeleteRequest = (id: string) => {
    selectBanner(id)
    deleteModal.onOpen()
    closeManager()
  }

  const handleDeleteConfirm = () => {
    if (!selectedBannerId) {
      return
    }
    deleteMutation.mutate(selectedBannerId)
  }

  return (
    <>
      <BannerForm />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        isPending={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onOpenChange={deleteModal.onOpenChange}
      />

      <Modal
        hideCloseButton
        isDismissable={false}
        isOpen={isManagerOpen}
        scrollBehavior='inside'
        size='xl'
        onOpenChange={(open) => !open && handleClose()}
      >
        <ModalContent>
          <ModalHeader>{t('title')}</ModalHeader>

          <ModalBody>
            {isLoading && <Spinner label={tc('loading')} />}

            {!isLoading && banners.length === 0 && (
              <p className='text-default-500 text-center'>{t('noBanners')}</p>
            )}

            {!isLoading && banners.length > 0 && (
              <div className='grid gap-4 sm:grid-cols-2'>
                {banners.map((banner) => (
                  <BannerItem
                    key={banner.id}
                    banner={banner}
                    onDelete={() => handleDeleteRequest(banner.id)}
                    onEdit={() => handleEdit(banner.id)}
                  />
                ))}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant='faded' onPress={handleClose}>
              {tc('close')}
            </Button>

            <Button
              className='text-secondary'
              color='primary'
              startContent={<PlusIcon />}
              onPress={handleCreate}
            >
              {t('addBanner')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { BannerManagerModal }
