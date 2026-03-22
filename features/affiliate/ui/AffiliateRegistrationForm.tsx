'use client'

import {
  Button,
  Input,
  Card,
  CardBody,
  Select,
  SelectItem,
  RadioGroup,
  Radio,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { PhoneIcon, Share2Icon, WalletIcon, MailIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import type { ImageWithPreview } from '@/components/ui/ImageDropzone'

import { useAffiliateMutation } from '../mutation'
import {
  getAffiliateProfileSchema,
  type AffiliateProfileInput,
} from '../schema'

import { ImageDropzone } from '@/components/ui/ImageDropzone'
import { SectionLabel } from '@/components/ui/SectionHeader'
import { useAuth } from '@/hooks/useAuth'
import { useResolveImageUpload } from '@/hooks/useResolveImageUpload'

const THAI_BANKS = [
  { label: 'ธนาคารกสิกรไทย (Kasikorn Bank)', value: 'K-Bank' },
  { label: 'ธนาคารไทยพาณิชย์ (Siam Commercial Bank)', value: 'SCB' },
  { label: 'ธนาคารกรุงเทพ (Bangkok Bank)', value: 'Bangkok Bank' },
  { label: 'ธนาคารกรุงไทย (Krungthai Bank)', value: 'Krungthai Bank' },
  { label: 'ธนาคารกรุงศรีอยุธยา (Bank of Ayudhya)', value: 'Krungsri' },
  { label: 'ธนาคารทหารไทยธนชาต (TMBThanachart Bank)', value: 'ttb' },
  { label: 'ธนาคารออมสิน (Government Savings Bank)', value: 'GSB' },
  {
    label:
      'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (Bank for Agriculture and Agricultural Cooperatives)',
    value: 'BAAC',
  },
] as const

const CRYPTO_NETWORKS = [
  { label: 'USDT (TRC20)', value: 'TRC20', hint: 'Address starts with "T..."' },
  {
    label: 'USDT (ERC20)',
    value: 'ERC20',
    hint: 'Address starts with "0x..."',
  },
  {
    label: 'USDT (BEP20)',
    value: 'BEP20',
    hint: 'Address starts with "0x..."',
  },
] as const

const AffiliateRegistrationForm = () => {
  const t = useTranslations('affiliate_register')
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
    watch,
    formState: { errors },
  } = useForm<AffiliateProfileInput>({
    resolver: zodResolver(getAffiliateProfileSchema(t)),
    defaultValues: { payoutMethod: 'THAI_BANK' },
  })

  const selectedPayoutMethod = watch('payoutMethod')
  const selectedNetwork = watch('walletNetwork')

  const { register: submitRegister, isRegistering } = useAffiliateMutation()
  const [idCardPreview, setIdCardPreview] = useState<ImageWithPreview[]>([])
  const { resolveImagePath: resolveIdCard, isUploading: isUploadingId } =
    useResolveImageUpload({ oldImage: null, previewFiles: idCardPreview })
  const [bankPreview, setBankPreview] = useState<ImageWithPreview[]>([])
  const { resolveImagePath: resolveBank, isUploading: isUploadingBank } =
    useResolveImageUpload({ oldImage: null, previewFiles: bankPreview })

  const onIdCardChange = (files: ImageWithPreview[]) => {
    setIdCardPreview(files)
    if (files.length > 0) {
      setValue('idCardImage', 'IMAGE_CHANGED')
    }
    return {}
  }

  const onBankChange = (files: ImageWithPreview[]) => {
    setBankPreview(files)
    if (files.length > 0) {
      setValue('bankAccountImage', 'IMAGE_CHANGED')
    }
    return {}
  }

  const onSubmit = async (data: AffiliateProfileInput) => {
    const idCardPath = await resolveIdCard()
    const bankPath =
      data.payoutMethod === 'THAI_BANK' ? await resolveBank() : null
    return submitRegister({
      ...data,
      idCardImage: idCardPath || '',
      bankAccountImage: bankPath || '',
    })
  }

  const isPending = isRegistering || isUploadingId || isUploadingBank

  return (
    <Card className='bg-background mx-auto w-full max-w-3xl' shadow='none'>
      <CardBody className='gap-8'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold'>{t('form.title')}</h1>
          <p className='text-foreground/70'>{t('form.description')}</p>
        </div>

        <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <SectionLabel>{t('form.sections.contact')}</SectionLabel>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                {...register('phoneNumber')}
                errorMessage={errors.phoneNumber?.message}
                isInvalid={!!errors.phoneNumber}
                label={t('form.fields.phone.label')}
                placeholder={t('form.fields.phone.placeholder')}
                startContent={
                  <PhoneIcon className='text-stone-400' size={18} />
                }
                variant='bordered'
              />
              <Input
                {...register('socialMedia')}
                errorMessage={errors.socialMedia?.message}
                isInvalid={!!errors.socialMedia}
                label={t('form.fields.social.label')}
                placeholder={t('form.fields.social.placeholder')}
                startContent={
                  <Share2Icon className='text-stone-400' size={18} />
                }
                variant='bordered'
              />
            </div>
          </div>

          <div className='border-divider bg-content1/50 flex flex-col gap-6 rounded-xl border p-6'>
            <Controller
              control={control}
              name='payoutMethod'
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  errorMessage={errors.payoutMethod?.message}
                  label={
                    <span className='text-foreground text-base font-bold'>
                      {t('form.fields.payoutMethod.label')}
                    </span>
                  }
                  value={value}
                  onValueChange={onChange}
                >
                  <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <Radio value='THAI_BANK'>
                      {t('form.fields.payoutMethod.thaiBank')}
                    </Radio>
                    <Radio value='DIGITAL_WALLET'>
                      {t('form.fields.payoutMethod.digitalWallet')}
                    </Radio>
                    <Radio value='PAYPAL'>
                      {t('form.fields.payoutMethod.paypal')}
                    </Radio>
                  </div>
                </RadioGroup>
              )}
            />

            <div className='pt-2'>
              {selectedPayoutMethod === 'THAI_BANK' && (
                <div className='animate-in fade-in slide-in-from-top-1 grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Controller
                    control={control}
                    name='bankName'
                    render={({ field: { onChange, value } }) => (
                      <Select
                        errorMessage={errors.bankName?.message}
                        isInvalid={!!errors.bankName}
                        label={t('form.fields.bank.name')}
                        placeholder={t('form.fields.bank.select')}
                        selectedKeys={value ? [value] : []}
                        variant='bordered'
                        onSelectionChange={(keys) => {
                          return onChange(Array.from(keys)[0])
                        }}
                      >
                        {THAI_BANKS.map((bank) => (
                          <SelectItem key={bank.value}>{bank.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Input
                    {...register('bankAccountName')}
                    errorMessage={errors.bankAccountName?.message}
                    isInvalid={!!errors.bankAccountName}
                    label={t('form.fields.bank.accountName')}
                    variant='bordered'
                  />
                  <Input
                    {...register('bankAccountNo')}
                    className='md:col-span-2'
                    errorMessage={errors.bankAccountNo?.message}
                    isInvalid={!!errors.bankAccountNo}
                    label={t('form.fields.bank.accountNo')}
                    variant='bordered'
                  />
                  <div className='space-y-4 md:col-span-2'>
                    <SectionLabel>
                      {t('form.fields.bank.uploadBook')}
                    </SectionLabel>
                    <ImageDropzone onFilesChange={onBankChange} />
                  </div>
                </div>
              )}

              {selectedPayoutMethod === 'DIGITAL_WALLET' && (
                <div className='animate-in fade-in slide-in-from-top-1 grid grid-cols-1 gap-4'>
                  <Controller
                    control={control}
                    name='walletNetwork'
                    render={({ field: { onChange, value } }) => (
                      <Select
                        errorMessage={errors.walletNetwork?.message}
                        isInvalid={!!errors.walletNetwork}
                        label={t('form.fields.crypto.network')}
                        placeholder={t('form.fields.crypto.select')}
                        selectedKeys={value ? [value] : []}
                        variant='bordered'
                        onSelectionChange={(keys) => {
                          return onChange(Array.from(keys)[0])
                        }}
                      >
                        {CRYPTO_NETWORKS.map((net) => (
                          <SelectItem key={net.value} description={net.hint}>
                            {net.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Input
                    {...register('walletAddress')}
                    errorMessage={errors.walletAddress?.message}
                    isInvalid={!!errors.walletAddress}
                    label={t('form.fields.crypto.address')}
                    placeholder={
                      selectedNetwork === 'TRC20'
                        ? t('form.fields.crypto.placeholderT')
                        : t('form.fields.crypto.placeholder0x')
                    }
                    startContent={<WalletIcon size={18} />}
                    variant='bordered'
                  />
                </div>
              )}

              {selectedPayoutMethod === 'PAYPAL' && (
                <Input
                  {...register('payoutEmail')}
                  errorMessage={errors.payoutEmail?.message}
                  isInvalid={!!errors.payoutEmail}
                  label={t('form.fields.paypal.email')}
                  placeholder={t('form.fields.paypal.placeholder')}
                  startContent={<MailIcon size={18} />}
                  variant='bordered'
                />
              )}
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <SectionLabel>{t('form.sections.identity')}</SectionLabel>
            <ImageDropzone onFilesChange={onIdCardChange} />
          </div>

          <Button
            className='text-secondary h-14 w-full text-lg font-bold'
            color='primary'
            isDisabled={isPending}
            isLoading={isPending}
            type='submit'
          >
            {isPending ? t('form.button.pending') : t('form.button.submit')}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}

export { AffiliateRegistrationForm }
