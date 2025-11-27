import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
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

import { deleteVariant, getVariants } from '../../action/variant'
import { useProductStore } from '../../store'
import { VariantForm } from '../form/variant'

import { ModalDelete } from '@/components/modal/delete'
import { formatCurrency, formatNumber } from '@/utils/number'
import { cn } from '@/utils/style'

const VariantManager = () => {
  const queryClient = useQueryClient()
  const {
    productId,
    variantId,
    isVariantManagerOpen,
    onOpenVariantChange,
    onOpenVariantManagerChange,
    setState,
  } = useProductStore()
  const QUERY_KEY = ['dashboard', 'modal', 'variants', productId]

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const { data: variants, isLoading: isLoadingVariants } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getVariants(productId!),
    enabled: !!productId && isVariantManagerOpen,
  })

  const { mutate: mutateDeteleVariant, isPending: isPendingDeteleVariant } =
    useMutation({
      mutationFn: deleteVariant,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY,
        })
        onOpenDeleteChange()
        setState({ variantId: null })
      },
    })

  return (
    <>
      <ModalDelete
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
        size='2xl'
        onOpenChange={onOpenVariantManagerChange}
      >
        <ModalContent>
          <ModalHeader>จัดการตัวเลือกสินค้า</ModalHeader>
          {isLoadingVariants && (
            <ModalBody>
              <Spinner label='กำลังโหลด...' />
            </ModalBody>
          )}

          {variants?.length === 0 && (
            <ModalBody>
              <p className='text-center text-default-500'>
                ยังไม่มีตัวเลือกสินค้า
              </p>
            </ModalBody>
          )}

          {variants?.length !== 0 && (
            <ModalBody>
              <div className='grid grid-cols-1 gap-3'>
                {variants?.map((variant) => (
                  <Card key={variant.id}>
                    <CardBody className='flex-row items-center justify-between'>
                      <div className='line-clamp-1 flex flex-col'>
                        <span className='line-clamp-1'>{variant.name}</span>
                        <div className='flex gap-2 text-sm'>
                          {!!variant.sku && (
                            <span className='text-default-500'>
                              sku: {variant.sku}
                            </span>
                          )}

                          <span
                            className={cn(
                              'text-default-500',
                              !variant.price && 'text-red-500',
                            )}
                          >
                            {variant.price
                              ? `ราคา: ${formatCurrency(variant.price)}`
                              : `(โปรดระบุราคา)`}
                          </span>

                          <span
                            className={cn(
                              'text-default-500',
                              !variant.stockQuantity && 'text-red-500',
                            )}
                          >
                            {variant.stockQuantity
                              ? `สต็อค: ${formatNumber(variant.stockQuantity)}`
                              : '(โปรดระบุสต็อค)'}
                          </span>

                          <span
                            className={cn(
                              variant.isActive
                                ? 'text-green-500'
                                : 'text-red-500',
                            )}
                          >
                            {variant.isActive ? '(เปิดใช้งาน)' : '(ปิดใช้งาน)'}
                          </span>
                        </div>
                      </div>

                      <Dropdown placement='bottom-end'>
                        <DropdownTrigger>
                          <Button isIconOnly size='sm' variant='light'>
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
                              setState({ variantId: variant.id })
                              onOpenVariantManagerChange()
                              onOpenVariantChange()
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
                              setState({ variantId: variant.id })
                              onOpenDeleteChange()
                            }}
                          >
                            ลบตัวเลือก
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
            <Button
              variant='faded'
              onPress={() => {
                onOpenVariantManagerChange()
                setState({ productId: null, variantId: null })
                queryClient.invalidateQueries({
                  queryKey: QUERY_KEY,
                })
              }}
            >
              ยกเลิก
            </Button>
            <Button
              startContent={<PlusIcon className='text-default-500' />}
              variant='faded'
              onPress={() => {
                onOpenVariantChange()
                onOpenVariantManagerChange()
              }}
            >
              เพิ่มตัวเลือก
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { VariantManager }
