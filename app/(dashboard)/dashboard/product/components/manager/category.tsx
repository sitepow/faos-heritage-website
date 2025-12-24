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
} from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EditIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react'
import Image from 'next/image'

import { deleteCategory, getCategories } from '../../action'
import { useProductStore } from '../../store'
import { CategoryForm } from '../form'

import { ConfirmModal } from '@/components/modal/confirm'
import { NO_IMAGE } from '@/utils/constants'
import { cn } from '@/utils/style'

export const CategoryManager = () => {
  const queryClient = useQueryClient()
  const {
    categoryId,
    isCategoryManagerOpen,
    onOpenCategoryChange,
    onOpenCategoryManagerChange,
    setState,
  } = useProductStore()

  const QUERY = {
    CATEGORIES: ['dashboard', 'categories', 'modal'],
  }

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: QUERY.CATEGORIES,
    queryFn: () => getCategories(),
    enabled: isCategoryManagerOpen,
  })

  const { mutate: mutateDeteleCategory, isPending: isPendingDeteleCategory } =
    useMutation({
      mutationFn: deleteCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY.CATEGORIES,
        })
        onOpenDeleteChange()
        setState({ categoryId: null })
      },
    })

  const onClose = () => {
    queryClient.invalidateQueries({
      queryKey: QUERY.CATEGORIES,
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
        onOpenChange={onOpenCategoryManagerChange}
      >
        <ModalContent>
          <ModalHeader>Manage product categories</ModalHeader>
          {isLoadingCategories && (
            <ModalBody>
              <Spinner label='Loading...' />
            </ModalBody>
          )}

          {categories?.length === 0 && (
            <ModalBody>
              <p className='text-default-500 text-center'>
                There are no product categories yet
              </p>
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
                        <Image
                          alt={category.name}
                          className='aspect-square rounded-full object-cover'
                          height={38}
                          src={category?.image ?? NO_IMAGE}
                          width={38}
                        />
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
                            Edit information
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
                            Remove category
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
              Cancel
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
              Add a category
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
