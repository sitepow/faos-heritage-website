'use client'

import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
  Divider,
} from '@heroui/react'
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileText,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export const PendingView = () => {
  const router = useRouter()

  return (
    <div className='flex min-h-[70vh] items-center justify-center'>
      <Card
        isBlurred
        className='bg-background/60 dark:bg-default-100/50 max-w-[440px] border-none p-2 shadow-2xl backdrop-blur-lg'
      >
        <CardHeader className='flex flex-col items-center justify-center gap-2 pt-10 pb-4'>
          <div className='relative mb-6'>
            <div className='bg-warning/30 absolute inset-0 animate-pulse rounded-full blur-2xl' />
            <div className='bg-warning-50 dark:bg-warning-900/20 text-warning relative flex h-24 w-24 items-center justify-center rounded-full shadow-inner'>
              <Clock size={48} strokeWidth={1.5} />
            </div>
            <div className='bg-background absolute -right-1 -bottom-1 rounded-full p-1.5 shadow-md'>
              <ShieldCheck className='text-primary' size={28} />
            </div>
          </div>

          <h1 className='text-2xl font-bold tracking-tight'>
            Application Pending
          </h1>
          <Chip
            className='px-4 capitalize'
            color='warning'
            size='md'
            variant='flat'
          >
            Review in Progress
          </Chip>
        </CardHeader>

        <CardBody className='px-8 py-2 text-center'>
          <p className='text-default-500 text-sm leading-relaxed'>
            Thank you for applying to the <strong>FAOS Partner Program</strong>.
            Our team is currently verifying your business details and
            documentation.
          </p>

          <div className='mt-10 space-y-6 px-2 text-left'>
            <div className='flex items-start gap-4'>
              <div className='flex flex-col items-center'>
                <CheckCircle2 className='text-success' size={20} />
                <div className='bg-success/30 mt-1 h-10 w-0.5' />
              </div>
              <div>
                <p className='text-sm font-semibold'>Application Submitted</p>
                <p className='text-default-400 text-xs font-normal'>
                  We have received your request.
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='flex flex-col items-center'>
                <div className='border-warning h-5 w-5 animate-spin rounded-full border-2 border-t-transparent' />
                <div className='bg-default-200 mt-1 h-10 w-0.5' />
              </div>
              <div>
                <p className='text-warning text-sm font-semibold'>
                  Verification Process
                </p>
                <p className='text-default-400 text-xs font-normal'>
                  Reviewing your clinical/business profile.
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4 opacity-40'>
              <div className='border-default-300 h-5 w-5 rounded-full border-2' />
              <div>
                <p className='text-sm font-semibold'>Final Activation</p>
                <p className='text-default-400 text-xs font-normal'>
                  Access your partner dashboard.
                </p>
              </div>
            </div>
          </div>
        </CardBody>

        <Divider className='mx-4 my-6 w-auto' />

        <CardFooter className='flex flex-col gap-3 px-8 pb-10'>
          <div className='text-default-400 mb-2 flex items-center gap-2'>
            <FileText size={14} />
            <span className='text-[11px] font-medium tracking-wider uppercase'>
              Estimated wait: 1-3 business days
            </span>
          </div>

          <Button
            fullWidth
            className='shadow-primary/20 text-secondary font-medium shadow-lg'
            color='primary'
            startContent={<Mail size={18} />}
            variant='solid'
            onPress={() => (window.location.href = 'mailto:partners@faos.asia')}
          >
            Contact Partner Support
          </Button>

          <Button
            fullWidth
            className='text-default-500'
            color='default'
            startContent={<ChevronLeft size={18} />}
            variant='light'
            onPress={() => router.push('/')}
          >
            Back to Homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
