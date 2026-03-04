'use client'

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  DateRangePicker,
} from '@heroui/react'
import { BanknoteIcon, ImageIcon } from 'lucide-react'
import { useState } from 'react'

import type { DateValue } from '@heroui/react'
import type { RangeValue } from '@react-types/shared'

import { usePayoutMutation } from '../payout.mutation'

import { formatNumber } from '@/utils'

interface PayoutFormProps {
  affiliateId: string
  pendingAmount: number
}

const PayoutForm = ({ affiliateId, pendingAmount }: PayoutFormProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [payoutProofImage, setPayoutProofImage] = useState('')
  const [notes, setNotes] = useState('')
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null)

  const { create, isCreating } = usePayoutMutation()

  const handleConfirmPayout = async () => {
    const payload = {
      affiliateId,
      amount: pendingAmount,
      payoutProofImage,
      notes,
      startDate: dateRange?.start ? dateRange.start.toString() : undefined,
      endDate: dateRange?.end ? dateRange.end.toString() : undefined,
    }

    await create(payload, {
      onSuccess: () => {
        onClose()
        setPayoutProofImage('')
        setNotes('')
        setDateRange(null)
      },
    })
  }

  return (
    <>
      <Button
        color='primary'
        size='sm'
        startContent={<BanknoteIcon size={16} />}
        variant='shadow'
        onPress={onOpen}
      >
        จ่ายเงิน
      </Button>

      <Modal isOpen={isOpen} size='xl' onClose={onClose}>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            ดำเนินการจ่ายค่าคอมมิชชัน
          </ModalHeader>
          <ModalBody className='gap-4'>
            <DateRangePicker
              className='w-full'
              label='เลือกช่วงเวลาที่ต้องการเคลียร์ยอด'
              value={dateRange}
              variant='bordered'
              onChange={setDateRange}
            />

            <div className='bg-default-100 border-default-200 rounded-xl border p-4'>
              <p className='text-tiny text-default-500 font-medium'>
                ยอดเงินที่แอดมินระบุ
              </p>
              <div className='flex items-baseline gap-1'>
                <span className='text-primary text-2xl font-bold'>
                  {formatNumber(pendingAmount)}
                </span>
                <span className='text-small text-primary font-bold'>฿</span>
              </div>
            </div>

            <Input
              label='หลักฐานการโอน (URL รูปสลิป)'
              placeholder='https://image-hosting.com/slip-01.jpg'
              startContent={
                <ImageIcon className='text-default-400' size={18} />
              }
              value={payoutProofImage}
              variant='bordered'
              onValueChange={setPayoutProofImage}
            />

            <Textarea
              label='บันทึกเพิ่มเติม'
              placeholder='โอนผ่านกสิกรไทย / ยอดของรอบเดือนกุมภาพันธ์'
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
              color='primary'
              isDisabled={!payoutProofImage || !dateRange}
              isLoading={isCreating}
              onPress={handleConfirmPayout}
            >
              ยืนยันการโอนเงินและปิดยอด
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { PayoutForm }
