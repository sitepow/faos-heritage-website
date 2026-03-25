'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Spinner,
  Chip,
} from '@heroui/react'
import {
  StoreIcon,
  ReceiptIcon,
  CalendarIcon,
  PackagePlusIcon,
  TagIcon,
} from 'lucide-react'
import { useMemo } from 'react'

import type { getContractDetails } from '@/features/contract/action'

import { ProductImage } from '@/components/ui/Product/ProductImage'
import { useContractDetails } from '@/features/contract/hook'
import { formatCurrency } from '@/utils'
import { formatDate } from '@/utils/date'

type ContractWithPayload = NonNullable<
  Awaited<ReturnType<typeof getContractDetails>>
>
type ContractItemPayload = ContractWithPayload['items'][number]

interface Props {
  isOpen: boolean
  onClose: () => void
  contractId: string | null
}

const ContractDetailModal = ({ isOpen, onClose, contractId }: Props) => {
  const { data: contract, isLoading } = useContractDetails(contractId as string)

  const totals = useMemo(() => {
    if (!contract?.items) {
      return null
    }

    const items = contract.items as ContractItemPayload[]
    const hasTransfer = items.some((item) => item.quantity > 0)

    if (!hasTransfer) {
      return { isAdjustmentOnly: true }
    }

    const retailTotal = items.reduce((acc, item) => {
      return (
        acc +
        Number(item.variant?.price ?? item.product?.price ?? 0) * item.quantity
      )
    }, 0)

    const agreedTotal = Number(contract.totalAmount || 0)

    return {
      retailTotal,
      agreedTotal,
      potentialProfit: retailTotal - agreedTotal,
      isAdjustmentOnly: false,
    }
  }, [contract])

  return (
    <Modal
      hideCloseButton
      className='max-h-[95vh]'
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior='inside'
      size='5xl'
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className='border-default-100 flex flex-wrap items-center justify-between gap-2 border-b px-6 py-4'>
          <span className='font-bold uppercase'>รายละเอียดสัญญา</span>
        </ModalHeader>

        <ModalBody className='overflow-y-auto p-0'>
          <div className='flex h-full flex-col lg:flex-row lg:overflow-hidden'>
            <div className='border-default-100 flex-1 p-4 lg:overflow-y-auto lg:border-r lg:p-6'>
              {isLoading ? (
                <div className='flex h-full items-center justify-center py-20'>
                  <Spinner label='กำลังโหลดรายละเอียดสัญญา...' />
                </div>
              ) : (
                <div className='flex flex-col gap-6'>
                  <h3 className='text-default-700 flex items-center gap-2 text-sm font-bold'>
                    <ReceiptIcon className='text-default-400' size={18} />
                    รายการสินค้าในสัญญา
                  </h3>

                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    {(contract?.items as ContractItemPayload[])?.map((item) => {
                      const retailPrice = Number(
                        item.variant?.price ?? item.product?.price ?? 0,
                      )
                      const imageUrl =
                        item.product?.images?.find((img) => img.isPrimary)
                          ?.url ??
                        item.product?.images?.[0]?.url ??
                        ''

                      const isAdjustment = item.quantity === 0

                      return (
                        <div
                          key={item.id}
                          className='hover:bg-default-50 border-default-100 flex flex-col gap-3 rounded-md border p-3 transition-colors'
                        >
                          <div className='flex gap-3'>
                            <div className='bg-default-100 flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md'>
                              <ProductImage fill image={imageUrl} />
                            </div>
                            <div className='flex-1 overflow-hidden'>
                              <p className='text-sm font-bold'>
                                {item.productName}
                              </p>

                              <Chip
                                className='mt-2.5 h-5 shrink-0 text-[10px] font-bold uppercase'
                                color={isAdjustment ? 'primary' : 'success'}
                                size='sm'
                                startContent={
                                  isAdjustment ? (
                                    <TagIcon size={12} />
                                  ) : (
                                    <PackagePlusIcon size={12} />
                                  )
                                }
                                variant='flat'
                              >
                                {isAdjustment ? 'ปรับราคา' : 'โอนสต็อก'}
                              </Chip>

                              <div className='mt-1 flex flex-col'>
                                <span className='text-default-400 text-[10px] line-through'>
                                  {formatCurrency(retailPrice)}
                                </span>
                                <div className='flex items-baseline gap-1'>
                                  <span className='text-primary text-sm font-bold'>
                                    {formatCurrency(Number(item.agreedPrice))}
                                  </span>
                                  <span className='text-default-500 text-[10px]'>
                                    {isAdjustment
                                      ? '/ ต่อหน่วย'
                                      : `x ${item.quantity} รายการ`}
                                  </span>
                                </div>
                                {!isAdjustment && (
                                  <span className='text-default-700 mt-1 text-xs font-bold'>
                                    รวมส่งรอบนี้:{' '}
                                    {formatCurrency(
                                      Number(item.agreedPrice) * item.quantity,
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className='bg-default-50/50 flex w-full flex-col gap-4 p-4 lg:w-[380px] lg:overflow-y-auto lg:p-6 xl:w-[420px]'>
              <h3 className='flex items-center gap-2 text-lg font-bold'>
                <StoreIcon size={20} />
                ข้อมูลคู่สัญญา
              </h3>

              <Divider className='bg-default-200' />

              <div className='flex flex-col gap-3'>
                <h3 className='text-default-700 flex items-center gap-2 text-sm font-bold'>
                  <StoreIcon size={16} />
                  สาขาหน้าร้าน
                </h3>
                <div className='border-default-100 bg-default-50 flex flex-col gap-1 rounded-lg border p-3'>
                  <span className='text-sm font-bold'>
                    {contract?.storefront?.name}
                  </span>
                </div>
              </div>

              <Divider className='bg-default-200' />

              <div className='flex flex-col gap-3'>
                <h3 className='text-default-700 flex items-center gap-2 text-sm font-bold'>
                  <CalendarIcon size={16} />
                  ระยะเวลาที่มีผล
                </h3>
                <div className='border-default-100 bg-default-50 flex flex-col gap-2 rounded-lg border p-3 text-xs'>
                  <div className='flex justify-between'>
                    <span className='text-default-500'>วันที่เริ่มสัญญา:</span>
                    <span className='font-semibold'>
                      {formatDate(contract?.startDate, 'th', 'date')}
                    </span>
                  </div>
                  <div className='border-default-100 flex justify-between gap-1 border-t pt-2'>
                    <span className='text-default-500'>วันที่สิ้นสุด:</span>
                    <span className='text-primary font-semibold'>
                      {contract?.endDate
                        ? formatDate(contract?.endDate, 'th', 'date')
                        : 'ไม่มีกำหนด (จนกว่าสินค้าจะหมด)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className='bg-primary/5 border-primary/10 mt-auto flex flex-col gap-2 rounded-lg border p-4'>
                {totals?.isAdjustmentOnly ? (
                  <div className='flex flex-col items-center gap-1 py-1'>
                    <div className='text-primary flex items-center gap-2 font-bold uppercase'>
                      <TagIcon size={16} />
                      <span>รายการปรับปรุงราคาขาย</span>
                    </div>
                    <p className='text-default-500 text-[10px]'>
                      สัญญานี้มีผลเพื่อปรับปรุงราคาต้นทุนสินค้าเดิมในร้าน
                      ไม่มีการโอนสต็อกเพิ่ม
                    </p>
                  </div>
                ) : (
                  <>
                    <div className='text-default-600 flex items-center justify-between text-sm'>
                      <span>มูลค่าปลีกรวม (รายการโอน):</span>
                      <span className='text-default-400 line-through'>
                        {formatCurrency(totals?.retailTotal || 0)}
                      </span>
                    </div>
                    <div className='text-success flex items-center justify-between text-sm font-bold'>
                      <span>ส่วนต่างกำไร (Margin):</span>
                      <span>
                        {formatCurrency(totals?.potentialProfit || 0)}
                      </span>
                    </div>
                    <Divider className='my-1 opacity-50' />
                    <div className='flex items-center justify-between text-lg font-bold'>
                      <span>ยอดสุทธิสัญญา:</span>
                      <span className='text-primary text-xl font-black'>
                        {formatCurrency(totals?.agreedTotal || 0)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className='border-default-100 border-t p-4'>
          <Button
            fullWidth
            className='font-bold'
            size='lg'
            variant='flat'
            onPress={onClose}
          >
            ปิดหน้านี้
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ContractDetailModal }
