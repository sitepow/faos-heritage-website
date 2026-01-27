'use client'

import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  ModalFooter,
  Avatar,
} from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EditIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { deleteCategory, getCategories } from '../../action/category'
import { useProductStore } from '../../store'
import { CategoryForm } from '../form/category'

import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { NO_IMAGE } from '@/constants/seo'
import { cn } from '@/utils/style'

export const CategoryManager = () => {
  const t = useTranslations('Dashboard.CategoryManager')
  const queryClient = useQueryClient()

  const {
    categoryId,
    isCategoryManagerOpen,
    onOpenCategoryChange,
    onOpenCategoryManagerChange,
    setState,
  } = useProductStore()

  const QUERY_KEY = {
    CATEGORIES: ['dashboard', 'categories', 'modal'],
  }

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: QUERY_KEY.CATEGORIES,
    queryFn: () => getCategories(),
    enabled: isCategoryManagerOpen,
  })

  const { mutate: mutateDeteleCategory, isPending: isPendingDeteleCategory } =
    useMutation({
      mutationFn: deleteCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY.CATEGORIES,
        })
        onOpenDeleteChange()
        setState({ categoryId: null })
      },
    })

  const onClose = () => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEY.CATEGORIES,
    })
    setState({ productId: null, variantId: null })
    onOpenCategoryManagerChange()
  }

  return (
    <>
      <ConfirmModal
        isOpen={isDeleteOpen}
        isPending={isPendingDeteleCategory}
        onConfirm={() => {
          mutateDeteleCategory(categoryId!)
        }}
        onOpenChange={onOpenDeleteChange}
      />
      <CategoryForm />

      <Modal
        hideCloseButton
        isDismissable={false}
        isOpen={isCategoryManagerOpen}
        scrollBehavior='inside'
        size='xl'
        onOpenChange={onOpenCategoryManagerChange}
      >
        <ModalContent>
          <ModalHeader>{t('title')}</ModalHeader>

          {isLoadingCategories && (
            <ModalBody>
              <Spinner label={t('loading')} />
            </ModalBody>
          )}

          {!isLoadingCategories && categories?.length === 0 && (
            <ModalBody>
              <p className='text-default-500 text-center'>{t('noData')}</p>
            </ModalBody>
          )}

          {categories?.length !== 0 && (
            <ModalBody>
              <div className='grid grid-cols-1 gap-3'>
                {categories?.map((category) => (
                  <Card
                    key={category.id}
                    className={cn(
                      'border-l-4',
                      category.isActive && 'border-primary',
                    )}
                  >
                    <CardBody className='flex-row items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Avatar src={category?.image ?? NO_IMAGE} />
                        <span className='line-clamp-1'>{category.name}</span>
                      </div>

                      <Dropdown placement='bottom-end'>
                        <DropdownTrigger>
                          <Button isIconOnly size='sm' variant='light'>
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
                              setState({ categoryId: category.id })
                              onOpenCategoryManagerChange()
                              onOpenCategoryChange()
                            }}
                          >
                            {t('editInfo')}
                          </DropdownItem>
                          <DropdownItem
                            key='delete'
                            className='text-danger'
                            color='danger'
                            startContent={<TrashIcon className='size-4' />}
                            onClick={() => {
                              setState({ categoryId: category.id })
                              onOpenDeleteChange()
                            }}
                          >
                            {t('removeCategory')}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </ModalBody>
          )}

          <ModalFooter>
            <Button variant='faded' onPress={onClose}>
              {t('cancel')}
            </Button>
            <Button
              className='text-secondary'
              color='primary'
              startContent={<PlusIcon />}
              onPress={() => {
                onOpenCategoryChange()
                onOpenCategoryManagerChange()
              }}
            >
              {t('addCategory')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
