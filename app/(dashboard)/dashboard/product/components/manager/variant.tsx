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
  Chip,
} from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EditIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react'

import { deleteVariant, getVariants } from '../../action/variant'
import { useProductStore } from '../../store'
import { VariantForm } from '../form/variant'

import { ConfirmModal } from '@/components/modal/confirm'
import { formatCurrency, formatNumber } from '@/utils/number'
import { cn } from '@/utils/style'

export const VariantManager = () => {
  const queryClient = useQueryClient()
  const {
    productId,
    variantId,
    isVariantManagerOpen,
    onOpenVariantChange,
    onOpenVariantManagerChange,
    setState,
  } = useProductStore()

  const QUERY_KEY = {
    PRODUCT: ['dashboard', 'products', 'pagination'],
    VARIANTS: ['dashboard', 'variants', 'modal', productId],
  }

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const { data: variants, isLoading: isLoadingVariants } = useQuery({
    queryKey: QUERY_KEY.VARIANTS,
    queryFn: () => getVariants(productId!),
    enabled: !!productId && isVariantManagerOpen,
  })

  const onRefetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.VARIANTS,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.PRODUCT,
      }),
    ])
  }

  const { mutate: mutateDeteleVariant, isPending: isPendingDeteleVariant } =
    useMutation({
      mutationFn: deleteVariant,
      onSuccess: () => {
        onRefetch()
        onOpenDeleteChange()
        setState({ variantId: null })
      },
    })

  const onClose = async () => {
    setState({ productId: null, variantId: null })
    onOpenVariantManagerChange()
  }

  return (
    <>
      <ConfirmModal
        isOpen={isDeleteOpen}
        isPending={isPendingDeteleVariant}
        onConfirm={() => {
          mutateDeteleVariant(variantId!)
        }}
        onOpenChange={onOpenDeleteChange}
      />
      <VariantForm />

      <Modal
        hideCloseButton
        isDismissable={false}
        isOpen={isVariantManagerOpen}
        size='xl'
        onOpenChange={onOpenVariantManagerChange}
      >
        <ModalContent>
          <ModalHeader>Manage product options</ModalHeader>
          {isLoadingVariants && (
            <ModalBody>
              <Spinner label='Loading...' />
            </ModalBody>
          )}

          {variants?.length === 0 && (
            <ModalBody>
              <p className='text-default-500 text-center'>
                There are no product options yet.
              </p>
            </ModalBody>
          )}

          {variants?.length !== 0 && (
            <ModalBody>
              <div className='grid grid-cols-1 gap-3'>
                {variants?.map((variant) => (
                  <Card
                    key={variant.id}
                    className={cn(
                      'border-l-4',
                      variant.isActive && 'border-primary',
                    )}
                  >
                    <CardBody className='flex-row items-center justify-between'>
                      <div className='line-clamp-1 flex flex-col'>
                        <span className='line-clamp-2'>
                          {variant.name} (Option ID: {variant.id})
                        </span>
                        <div className='mt-2.5 flex gap-2 text-sm'>
                          {!!variant.sku && (
                            <Chip>
                              <span className='text-default-500'>
                                sku: {variant.sku}
                              </span>
                            </Chip>
                          )}

                          <Chip>
                            <span
                              className={cn(
                                'text-default-500',
                                !variant.price && 'text-red-500',
                              )}
                            >
                              {variant.price
                                ? `Price: ${formatCurrency(variant?.price ?? 0)}`
                                : `(Please specify the price)`}
                            </span>
                          </Chip>

                          <Chip>
                            <span
                              className={cn(
                                'text-default-500',
                                !variant.stockQuantity && 'text-red-500',
                              )}
                            >
                              {variant.stockQuantity
                                ? `Stock: ${formatNumber(variant.stockQuantity)}`
                                : '(Please specify stock availability)'}
                            </span>
                          </Chip>
                        </div>
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
                              setState({ variantId: variant.id })
                              onOpenVariantManagerChange()
                              onOpenVariantChange()
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
                              setState({ variantId: variant.id })
                              onOpenDeleteChange()
                            }}
                          >
                            Remove option
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
                onOpenVariantChange()
                onOpenVariantManagerChange()
              }}
            >
              Add options
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
