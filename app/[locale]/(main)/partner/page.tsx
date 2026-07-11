'use client'

import { ApplicationStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'

import { PricingCard } from './_components/PricingCard'
import { usePackageStore } from './store'

import { SectionHeader } from '@/components/ui/SectionHeader'
import { PLANS } from '@/constants/plan'
import { useMyApplication } from '@/features/partner-application/hook'

const Partner = () => {
  const router = useRouter()
  const selectPackage = usePackageStore((state) => state.selectPackage)
  const { data: application } = useMyApplication()

  const handlePlanAction = (planTitle: string) => {
    const status = application?.status

    switch (status) {
      case ApplicationStatus.PENDING:
      case ApplicationStatus.APPROVED:
        router.push('/partner/dashboard')
        break

      case ApplicationStatus.REJECTED:
        selectPackage(planTitle)
        router.push('/partner/apply')
        break

      default:
        selectPackage(planTitle)
        router.push('/partner/apply')
        break
    }
  }

  const getButtonLabel = (status?: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return 'Pending Approval'
      case ApplicationStatus.APPROVED:
        return 'Already Partnered'
      case ApplicationStatus.REJECTED:
        return 'Re-apply Now'
      default:
        return 'Get Started'
    }
  }

  return (
    <div className='space-y-10'>
      <SectionHeader
        description='ร่วมจำหน่ายสินค้าฟาวนส์ตามขนาดร้านของคุณ'
        title='ร่วมลงทุนธุรกิจอาหารเพื่อสุขภาพกับเรา Food wellness  '
      />

      <div className='mx-auto grid grid-cols-1 gap-8 md:grid-cols-3'>
        {PLANS.map((plan) => {
          const label = getButtonLabel(application?.status)

          return (
            <PricingCard
              key={plan.title}
              {...plan}
              buttonText={label}
              onClick={() => handlePlanAction(plan.title)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Partner
