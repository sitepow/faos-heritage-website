'use client'

import {
  Button,
  Input,
  Card,
  CardBody,
  Select,
  SelectItem,
  Alert,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  LandmarkIcon,
  PhoneIcon,
  Share2Icon,
  InfoIcon,
  ShieldCheckIcon,
  UserIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { useAffiliateMutation } from '../affiliate.mutation'
import {
  affiliateProfileSchema,
  type AffiliateProfileInput,
} from '../affiliate.schema'

import {
  ImageDropzone,
  type ImageWithPreview,
} from '@/app/(dashboard)/_components/ImageDropzone'
import { SectionLabel } from '@/components/ui/SectionHeader'
import { useAuth } from '@/hooks/useAuth'
import { useResolveImageUpload } from '@/hooks/useResolveImageUpload'

const THAI_BANKS = [
  { label: 'ธนาคารกสิกรไทย', value: 'K-Bank' },
  { label: 'ธนาคารไทยพาณิชย์', value: 'SCB' },
  { label: 'ธนาคารกรุงเทพ', value: 'Bangkok Bank' },
  { label: 'ธนาคารกรุงไทย', value: 'Krungthai Bank' },
  { label: 'ธนาคารกรุงศรีอยุธยา', value: 'Krungsri' },
  { label: 'ธนาคารทหารไทยธนชาต', value: 'ttb' },
  { label: 'ธนาคารออมสิน', value: 'GSB' },
  { label: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร', value: 'BAAC' },
] as const

const AffiliateRegistrationForm = () => {
  const router = useRouter()
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      return router.push('/login')
    }
  }, [isAuthenticated, isAuthLoading, router])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<AffiliateProfileInput>({
    resolver: zodResolver(affiliateProfileSchema),
  })

  const { register: submitRegister, isRegistering } = useAffiliateMutation()

  const [idCardPreview, setIdCardPreview] = useState<ImageWithPreview[]>([])
  const { resolveImagePath: resolveIdCard, isUploading: isUploadingId } =
    useResolveImageUpload({
      oldImage: null,
      previewFiles: idCardPreview,
    })

  const [bankPreview, setBankPreview] = useState<ImageWithPreview[]>([])
  const { resolveImagePath: resolveBank, isUploading: isUploadingBank } =
    useResolveImageUpload({
      oldImage: null,
      previewFiles: bankPreview,
    })

  const onIdCardChange = (files: ImageWithPreview[]) => {
    setIdCardPreview(files)
    if (files.length > 0) {
      setValue('idCardImage', 'IMAGE_CHANGED', { shouldDirty: true })
    }
  }

  const onBankChange = (files: ImageWithPreview[]) => {
    setBankPreview(files)
    if (files.length > 0) {
      setValue('bankAccountImage', 'IMAGE_CHANGED', { shouldDirty: true })
    }
  }

  const onSubmit = async (data: AffiliateProfileInput) => {
    const idCardPath = await resolveIdCard()
    const bankPath = await resolveBank()

    const payload = {
      ...data,
      idCardImage: idCardPath || '',
      bankAccountImage: bankPath || '',
    }

    return submitRegister(payload)
  }

  const isPending = isRegistering || isUploadingId || isUploadingBank

  return (
    <Card className='bg-background mx-auto w-full max-w-3xl' shadow='none'>
      <CardBody className='gap-8'>
        <Alert
          icon={<InfoIcon size={20} />}
          title='เฉพาะผู้สมัครสัญชาติไทยเท่านั้น'
        >
          ขออภัย
          ขณะนี้ระบบพาร์ทเนอร์เปิดรับลงทะเบียนเฉพาะบุคคลสัญชาติไทยที่มีบัญชีธนาคารภายในประเทศไทยเท่านั้น
        </Alert>

        <Alert
          icon={<ShieldCheckIcon size={20} />}
          title='การส่งเอกสารอย่างปลอดภัย'
        >
          เพื่อความปลอดภัย โปรดขีดคร่อมสำเนาเอกสารและระบุข้อความ
          <span className='mx-1 underline'>
            "ใช้สำหรับสมัคร Affiliate ในเว็บไซต์ faos.asia เท่านั้น"
          </span>
          ลงบนรูปภาพก่อนทำการอัปโหลด
        </Alert>

        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold'>สมัครร่วมเป็นพาร์ทเนอร์</h1>
          <p className='text-foreground/70'>
            กรุณากรอกข้อมูลให้ครบถ้วนเพื่อประกอบการพิจารณาอนุมัติ
          </p>
        </div>

        <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <SectionLabel>ข้อมูลการติดต่อและโซเชียลมีเดีย</SectionLabel>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                {...register('phoneNumber')}
                errorMessage={errors.phoneNumber?.message}
                isInvalid={!!errors.phoneNumber}
                label='เบอร์โทรศัพท์'
                placeholder='081-234-5678'
                startContent={
                  <PhoneIcon className='text-stone-400' size={18} />
                }
                variant='bordered'
              />
              <Input
                {...register('socialMedia')}
                errorMessage={errors.socialMedia?.message}
                isInvalid={!!errors.socialMedia}
                label='ช่องทางโซเชียลมีเดีย (URL หรือ ID)'
                placeholder='FB: MyPage / Line: @id'
                startContent={
                  <Share2Icon className='text-stone-400' size={18} />
                }
                variant='bordered'
              />
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <SectionLabel>
              ข้อมูลบัญชีธนาคาร (สำหรับรับค่าคอมมิชชัน)
            </SectionLabel>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Controller
                control={control}
                name='bankName'
                render={({ field: { onChange, value } }) => (
                  <Select
                    errorMessage={errors.bankName?.message}
                    isInvalid={!!errors.bankName}
                    label='ชื่อธนาคาร'
                    placeholder='เลือกธนาคาร'
                    selectedKeys={value ? [value] : []}
                    startContent={
                      <LandmarkIcon className='text-stone-400' size={18} />
                    }
                    variant='bordered'
                    onSelectionChange={(keys) => {
                      return onChange(Array.from(keys)[0])
                    }}
                  >
                    {THAI_BANKS.map((bank) => (
                      <SelectItem key={bank.value} textValue={bank.label}>
                        {bank.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Input
                {...register('bankAccountName')}
                errorMessage={errors.bankAccountName?.message}
                isInvalid={!!errors?.bankAccountName}
                label='ชื่อบัญชีธนาคาร'
                placeholder='ชื่อ-นามสกุล (ภาษาไทย)'
                startContent={<UserIcon className='text-stone-400' size={18} />}
                variant='bordered'
              />
              <Input
                {...register('bankAccountNo')}
                errorMessage={errors.bankAccountNo?.message}
                isInvalid={!!errors.bankAccountNo}
                label='เลขที่บัญชี'
                placeholder='123-4-56789-0'
                variant='bordered'
              />
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <div className='space-y-4'>
              <SectionLabel>สำเนาบัตรประชาชน</SectionLabel>
              <ImageDropzone onFilesChange={onIdCardChange} />
              {errors.idCardImage && (
                <p className='text-tiny text-danger'>
                  {errors.idCardImage.message}
                </p>
              )}
            </div>

            <div className='space-y-4'>
              <SectionLabel>สำเนาหน้าสมุดบัญชี</SectionLabel>
              <ImageDropzone onFilesChange={onBankChange} />
              {errors.bankAccountImage && (
                <p className='text-tiny text-danger'>
                  {errors.bankAccountImage.message}
                </p>
              )}
            </div>
          </div>

          <div className='flex gap-3 pt-4'>
            <Button
              className='text-secondary h-14 flex-1 text-lg font-bold'
              color='primary'
              isDisabled={isPending}
              isLoading={isPending}
              type='submit'
            >
              สมัครพาร์ทเนอร์
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}

export { AffiliateRegistrationForm }
