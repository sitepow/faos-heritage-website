/* eslint-disable no-nested-ternary */
'use client'

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  DateRangePicker,
  Spinner,
  Alert,
} from '@heroui/react'
import { BanknoteIcon, CreditCardIcon } from 'lucide-react'
import { useState } from 'react'

import type { DateValue } from '@heroui/react'
import type { RangeValue } from '@react-types/shared'

import { useWithdrawableAmount } from '../payout.hook'
import { usePayoutMutation } from '../payout.mutation'

import {
  ImageDropzone,
  type ImageWithPreview,
} from '@/app/(dashboard)/_components/ImageDropzone'
import { SectionLabel } from '@/components/ui/SectionHeader'
import { useAffiliateById } from '@/features/affiliate/affiliate.hook'
import { useResolveImageUpload } from '@/hooks/useResolveImageUpload'
import { formatNumber } from '@/utils'

interface Props {
  affiliateId: string
  pendingAmount: number
  selectedIds?: string[]
}

const PayoutForm = ({ affiliateId, pendingAmount, selectedIds }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [notes, setNotes] = useState('')
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null)

  const { data: bankInfo, isLoading: isLoadingBank } =
    useAffiliateById(affiliateId)

  const { data: displayAmount = pendingAmount, isLoading: isCalculating } =
    useWithdrawableAmount({
      affiliateId,
      startDate: !selectedIds ? dateRange?.start?.toString() : undefined,
      endDate: !selectedIds ? dateRange?.end?.toString() : undefined,
      selectedIds,
    })

  const [slipPreview, setSlipPreview] = useState<ImageWithPreview[]>([])
  const { resolveImagePath: resolveSlip, isUploading: isUploadingSlip } =
    useResolveImageUpload({
      oldImage: null,
      previewFiles: slipPreview,
    })

  const { create, isCreating } = usePayoutMutation()

  const onSlipChange = (files: ImageWithPreview[]) => {
    return setSlipPreview(files)
  }

  const handleConfirmPayout = async () => {
    const slipPath = await resolveSlip()

    const payload = {
      affiliateId,
      amount: displayAmount,
      payoutProofImage: slipPath || '',
      notes,
      startDate: !selectedIds ? dateRange?.start?.toString() : undefined,
      endDate: !selectedIds ? dateRange?.end?.toString() : undefined,
      selectedIds,
    }

    await create(payload, {
      onSuccess: () => {
        onClose()
        setSlipPreview([])
        setNotes('')
        setDateRange(null)
      },
    })
  }

  const isPending =
    isCreating || isUploadingSlip || isCalculating || isLoadingBank

  return (
    <>
      <Button
        className='text-secondary'
        color='primary'
        size='sm'
        startContent={<BanknoteIcon size={16} />}
        onPress={onOpen}
      >
        {selectedIds
          ? `จ่ายเงินตามที่เลือก (${selectedIds.length})`
          : 'จ่ายเงินตัดยอด'}
      </Button>

      <Modal hideCloseButton isOpen={isOpen} size='xl' onClose={onClose}>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            ดำเนินการจ่ายค่าคอมมิชชัน
          </ModalHeader>
          <ModalBody className='gap-4'>
            <div className='border-default-100 bg-primary-50 rounded-xl border p-4'>
              <div className='mb-3 flex items-center gap-2'>
                <CreditCardIcon size={18} />
                <span className='text-sm font-bold'>ข้อมูลบัญชีรับเงิน</span>
              </div>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
                <p className='text-small'>
                  ธนาคาร:{' '}
                  <span className='underline'>{bankInfo?.bankName ?? '-'}</span>
                </p>

                <p className='text-small'>
                  ชื่อบัญชี:{' '}
                  <span className='underline'>
                    {bankInfo?.bankAccountName ?? '-'}
                  </span>
                </p>

                <p className='text-small'>
                  เลขที่บัญชี:{' '}
                  <span className='underline'>
                    {bankInfo?.bankAccountNo ?? '-'}
                  </span>
                </p>

                <p className='text-small'>
                  เบอร์ติดต่อ:{' '}
                  <span className='underline'>
                    {bankInfo?.phoneNumber ?? '-'}
                  </span>
                </p>
              </div>
            </div>

            {!selectedIds && (
              <DateRangePicker
                className='w-full'
                label='เลือกช่วงเวลาที่ต้องการเคลียร์ยอด'
                value={dateRange}
                variant='bordered'
                onChange={setDateRange}
              />
            )}

            {displayAmount === 0 &&
              !selectedIds &&
              dateRange &&
              !isCalculating && (
                <Alert color='danger' variant='bordered'>
                  ไม่พบยอดเงินที่พร้อมถอนในช่วงวันที่เลือก
                </Alert>
              )}

            <div className='border-default-200 bg-default-100 rounded-xl border p-4'>
              <div className='flex items-center justify-between'>
                <p className='text-tiny text-default-500 font-medium'>
                  {selectedIds
                    ? `ยอดเงินรวมจากที่เลือก ${selectedIds.length} รายการ`
                    : dateRange
                      ? 'ยอดเงินในช่วงเวลาที่เลือก'
                      : 'ยอดเงินรวมที่ต้องการจ่าย'}
                </p>
                {isCalculating && <Spinner size='sm' />}
              </div>
              <div className='flex items-baseline gap-1'>
                <span className='text-primary text-2xl font-bold'>
                  {formatNumber(displayAmount)}
                </span>
                <span className='text-small text-primary font-bold'>฿</span>
              </div>
            </div>

            <div className='space-y-2'>
              <SectionLabel>หลักฐานการโอนเงิน (Slip)</SectionLabel>
              <ImageDropzone onFilesChange={onSlipChange} />
            </div>

            <Textarea
              label='บันทึกเพิ่มเติม'
              placeholder='ระบุบันทึกการโอนเงินที่นี่'
              value={notes}
              variant='bordered'
              onValueChange={setNotes}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant='flat' onPress={onClose}>
              ยกเลิก
            </Button>
            <Button
              className='text-secondary'
              color='primary'
              isDisabled={
                slipPreview.length === 0 ||
                (!selectedIds && !dateRange) ||
                displayAmount <= 0 ||
                isPending
              }
              isLoading={isPending}
              onPress={handleConfirmPayout}
            >
              ยืนยันการโอนเงิน
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { PayoutForm }
