'use client'

import { Spinner } from '@heroui/react'
import { ApplicationStatus } from '@prisma/client'

import { ActiveView } from './_components/ActiveView'
import { PendingView } from './_components/PendingView'

import { useMyApplication } from '@/features/partner-application/hook'

const PartnerDashboard = () => {
  const { data: application, isLoading } = useMyApplication()

  if (isLoading) {
    return (
      <div className='flex h-[70vh] items-center justify-center'>
        <Spinner label='Loading Dashboard...' size='lg' />
      </div>
    )
  }

  if (application?.status === ApplicationStatus.APPROVED) {
    return <ActiveView />
  }

  if (application?.status === ApplicationStatus.PENDING) {
    return <PendingView />
  }

  return (
    <div className='flex h-[70vh] items-center justify-center'>
      <p>Please complete your application.</p>
    </div>
  )
}

export default PartnerDashboard
