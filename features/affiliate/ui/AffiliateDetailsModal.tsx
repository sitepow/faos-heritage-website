'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Alert,
} from '@heroui/react'
import { AffiliateStatus, PayoutMethod } from '@prisma/client'
import { CheckIcon, ShieldCheckIcon, XIcon } from 'lucide-react'

import { SectionLabel } from '@/components/ui/SectionHeader'
import { IMAGE_FALLBACK } from '@/constants'
import { useAffiliateMutation } from '@/features/affiliate/mutation'
import { useAffiliateStore } from '@/features/affiliate/store'

const AffiliateDetailsModal = () => {
  const { selectedAffiliate, isDetailOpen, closeDetail } = useAffiliateStore()
  const { updateStatus, isUpdating } = useAffiliateMutation()

  if (!selectedAffiliate) {
    return null
  }

  const handleUpdateStatus = async (status: AffiliateStatus) => {
    await updateStatus({ id: selectedAffiliate.id, status })
    return closeDetail()
  }

  return (
    <Modal
      hideCloseButton
      isOpen={isDetailOpen}
      scrollBehavior='inside'
      size='3xl'
      onClose={closeDetail}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          รายละเอียดผู้สมัคร Affiliate
          <span className='text-small text-default-500 font-normal'>
            {selectedAffiliate.user?.name ?? 'ไม่ระบุชื่อ'} (
            {selectedAffiliate.user?.email ?? '-'})
          </span>
        </ModalHeader>
        <ModalBody className='gap-6'>
          <Alert
            description={
              <div className='text-tiny mt-1 flex flex-col gap-1'>
                <p>
                  • <strong>ความถูกต้อง:</strong>{' '}
                  ตรวจสอบข้อมูลการรับเงินและรูปถ่ายเอกสารให้ตรงกันเพื่อป้องกันปัญหาการโอนเงิน
                </p>
                <p>
                  • <strong>ระบบอัตโนมัติ:</strong> หลังการอนุมัติ
                  ระบบจะเปิดใช้งานเมนู Affiliate ให้ฝั่งผู้ใช้งานทันที
                </p>
                <p>
                  • <strong>เงื่อนไขรายได้:</strong>{' '}
                  พาร์ทเนอร์จะได้รับค่าคอมมิชชันเฉพาะออเดอร์ที่สถานะเป็น{' '}
                  <span className='underline'>"จัดส่งสำเร็จ (DELIVERED)"</span>{' '}
                  เท่านั้น
                </p>
              </div>
            }
            icon={<ShieldCheckIcon />}
            title='ตรวจสอบข้อมูลผู้สมัครก่อนทำการอนุมัติ'
          />

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <SectionLabel>สำเนาบัตรประชาชน / Passport</SectionLabel>
              <Image
                alt='ID Card'
                className='mt-2 h-48 w-full rounded-xl object-cover shadow-sm'
                src={selectedAffiliate.idCardImage ?? IMAGE_FALLBACK.EMPTY}
              />
            </div>
            {/* แสดงรูปสมุดบัญชีเฉพาะเมื่อเลือก THAI_BANK เท่านั้น */}
            {selectedAffiliate.payoutMethod === PayoutMethod.THAI_BANK && (
              <div>
                <SectionLabel>สำเนาสมุดบัญชี</SectionLabel>
                <Image
                  alt='Bank Account'
                  className='mt-2 h-48 w-full rounded-xl object-cover shadow-sm'
                  src={
                    selectedAffiliate.bankAccountImage ?? IMAGE_FALLBACK.EMPTY
                  }
                />
              </div>
            )}
          </div>

          <div className='space-y-3'>
            <SectionLabel>ข้อมูลช่องทางการรับเงินและการติดต่อ</SectionLabel>
            <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
              {/* ส่วนที่ 1: แสดงตาม Payout Method */}
              {selectedAffiliate.payoutMethod === PayoutMethod.THAI_BANK && (
                <>
                  <p className='text-small'>
                    ธนาคาร:{' '}
                    <span className='underline'>
                      {selectedAffiliate.bankName ?? '-'}
                    </span>
                  </p>
                  <p className='text-small'>
                    ชื่อบัญชีธนาคาร:{' '}
                    <span className='underline'>
                      {selectedAffiliate.bankAccountName ?? '-'}
                    </span>
                  </p>
                  <p className='text-small'>
                    เลขที่บัญชี:{' '}
                    <span className='underline'>
                      {selectedAffiliate.bankAccountNo ?? '-'}
                    </span>
                  </p>
                </>
              )}

              {selectedAffiliate.payoutMethod ===
                PayoutMethod.DIGITAL_WALLET && (
                <>
                  <p className='text-small'>
                    Network:{' '}
                    <span className='underline'>
                      {selectedAffiliate.walletNetwork ?? '-'}
                    </span>
                  </p>
                  <p className='text-small'>
                    Wallet Address:{' '}
                    <span className='break-all underline'>
                      {selectedAffiliate.walletAddress ?? '-'}
                    </span>
                  </p>
                </>
              )}

              {selectedAffiliate.payoutMethod === PayoutMethod.PAYPAL && (
                <p className='text-small'>
                  PayPal Email:{' '}
                  <span className='underline'>
                    {selectedAffiliate.payoutEmail ?? '-'}
                  </span>
                </p>
              )}

              {/* ส่วนที่ 2: ข้อมูลติดต่อ (แสดงเสมอ) */}
              <p className='text-small'>
                เบอร์ติดต่อ:{' '}
                <span className='underline'>
                  {selectedAffiliate.phoneNumber ?? '-'}
                </span>
              </p>
            </div>
          </div>

          <div className='space-y-2'>
            <SectionLabel>ช่องทางโซเชียลมีเดีย</SectionLabel>
            <div className='bg-default-100 text-small min-h-[60px] rounded-lg p-3 whitespace-pre-wrap'>
              {selectedAffiliate.socialMedia ?? 'ไม่ได้ระบุข้อมูล'}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant='flat' onPress={closeDetail}>
            ปิด
          </Button>
          {selectedAffiliate.status === AffiliateStatus.PENDING && (
            <>
              <Button
                color='danger'
                isDisabled={isUpdating}
                startContent={<XIcon size={18} />}
                onPress={() => {
                  return handleUpdateStatus(AffiliateStatus.REJECTED)
                }}
              >
                ปฏิเสธการสมัคร
              </Button>
              <Button
                className='text-secondary'
                color='primary'
                isDisabled={isUpdating}
                startContent={<CheckIcon size={18} />}
                onPress={() => {
                  return handleUpdateStatus(AffiliateStatus.APPROVED)
                }}
              >
                อนุมัติพาร์ทเนอร์
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { AffiliateDetailsModal }
