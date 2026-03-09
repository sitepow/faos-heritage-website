'use client'

import { Alert } from '@heroui/react'
import { WalletIcon } from 'lucide-react'

import { AffiliateTable } from './_components/AffiliateTable'

import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useAffiliates } from '@/features/affiliate/affiliate.hook'
import { AffiliateDetailsModal } from '@/features/affiliate/ui/AffiliateDetailsModal'
import {
  useAffiliateSummary,
  usePendingPayouts,
} from '@/features/affiliate-payout/payout.hook'
import { useIsMounted } from '@/hooks/useIsMounted'

const AffiliateAdminPage = () => {
  const isMounted = useIsMounted()

  const { data: affiliates, isLoading: isAffiliateLoading } = useAffiliates()

  const {
    pendingAmount: totalPendingAmount,
    withdrawableAmount: totalWithdrawableAmount,
    paidAmount: totalPaidAmount,
    isLoading: isSummaryLoading,
  } = useAffiliateSummary()

  const { data: pendingPayouts, isLoading: isPayoutLoading } =
    usePendingPayouts()

  const isLoading = isAffiliateLoading || isPayoutLoading || isSummaryLoading

  if (!isMounted) {
    return null
  }

  return (
    <Container className='flex flex-col gap-8'>
      <Alert
        description={
          <div className='text-default-600 mt-1 flex flex-col gap-2 text-sm'>
            <p>
              • <strong>การจัดการพาร์ทเนอร์:</strong> ตรวจสอบและกดยืนยันการสมัคร
              (Approve) ของพาร์ทเนอร์ใหม่ได้จากตารางด้านล่าง
              เพื่อเปิดใช้งานระบบลิงก์ช่วยขาย
            </p>
            <p>
              • <strong>การจ่ายเงิน:</strong> ระบบสรุปยอดค้างจ่ายให้อัตโนมัติ
              คุณสามารถเลือกจ่ายแบบ <span className='underline'>รายรายการ</span>{' '}
              หรือ <span className='underline'>สรุปยอดตามช่วงเวลา</span>{' '}
              ที่กำหนด โดยไม่จำเป็นต้องคำนวณยอดเอง
            </p>
            <p>
              • <strong>หลักฐานการโอน:</strong> ทุกครั้งที่กดบันทึกการจ่ายเงิน
              ระบบจะมีช่องให้ <span className='underline'>แนบสลิปโอนเงิน</span>{' '}
              เพื่อใช้เป็นหลักฐานยืนยันกับพาร์ทเนอร์และเก็บไว้ในประวัติการจ่ายเงินของระบบ
            </p>
          </div>
        }
        icon={<WalletIcon />}
        title='ระบบจัดการพาร์ทเนอร์และยอดจ่ายเงิน'
      />

      <section className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        <StatCard label='จำนวนพาร์ทเนอร์' value={affiliates?.length || 0} />
        <StatCard
          isCurrency
          label='ยอดรอคอนเฟิร์ม (THB)'
          value={totalPendingAmount}
        />
        <StatCard
          isCurrency
          label='ยอดค้างจ่าย/พร้อมถอน (THB)'
          value={totalWithdrawableAmount}
        />
        <StatCard
          isCurrency
          label='ยอดที่จ่ายแล้วทั้งหมด (THB)'
          value={totalPaidAmount}
        />
      </section>

      <section className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold'>รายชื่อพาร์ทเนอร์</h2>
        </div>
        <AffiliateTable
          affiliates={affiliates || []}
          isLoading={isLoading}
          pendingPayouts={pendingPayouts}
        />
      </section>

      <AffiliateDetailsModal />
    </Container>
  )
}

export default AffiliateAdminPage
