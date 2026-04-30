/* eslint-disable react/no-array-index-key */
'use client'

import {
  Card,
  CardBody,
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
  Divider,
  Checkbox,
  CheckboxGroup,
  Chip,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ShieldCheck,
  Leaf,
  AlertCircle,
  Send,
  Award,
  CheckCircle2,
  Fingerprint,
} from 'lucide-react'
import { useForm } from 'react-hook-form'

import { usePackageStore } from '../store'

import { usePartnerMutation } from '@/features/partner-application/mutation'
import {
  partnerApplicationSchema,
  type PartnerApplicationInput,
} from '@/features/partner-application/schema'

const PartnerApply = () => {
  const { selectedPackage } = usePackageStore()
  const { submitApplication, isSubmitting } = usePartnerMutation()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PartnerApplicationInput>({
    resolver: zodResolver(partnerApplicationSchema),
    defaultValues: {
      businessName: '',
      businessType: '',
      category: '',
      description: '',
      productSamples: '',
      reasonToJoin: `Interested in ${selectedPackage || 'Starter'} plan`,
      status: 'PENDING',
    } as PartnerApplicationInput,
  })

  const onSubmit = async (data: PartnerApplicationInput) => {
    await submitApplication(data)
  }

  const businessTypes = [
    { label: 'Brand Owner / Manufacturer', value: 'BRAND_OWNER' },
    { label: 'Authorized Distributor', value: 'DISTRIBUTOR' },
    { label: 'Handcrafted / Small Batch Producer', value: 'ARTISAN' },
  ]

  return (
    <div className='mx-auto max-w-5xl px-4'>
      <div className='mb-12 text-center'>
        <Chip className='mb-4' color='primary' variant='flat'>
          FAOS Curated Partnership
        </Chip>
        <h1 className='mb-4 text-4xl font-bold'>Elevate Your Health Brand</h1>
        <p className='text-default-500 mx-auto max-w-2xl'>
          FAOS operates as a curated health platform. We work with a limited
          number of partners to maintain quality and trust for our wellness
          community.
        </p>
      </div>

      <Card className='border-default-200 border shadow-xl'>
        <CardBody className='p-0'>
          <div className='flex flex-col md:flex-row'>
            <div className='bg-default-50 border-default-200 border-r p-8 md:w-1/3'>
              <h3 className='mb-6 flex items-center gap-2 text-lg font-bold'>
                <Award className='text-primary' /> Why Partner with Us?
              </h3>
              <ul className='space-y-4'>
                {[
                  'Access to Health-Conscious Audience',
                  'Verified Quality Positioning',
                  'Premium Content Support',
                  'Strategic Sales Partnership',
                ].map((item, i) => (
                  <li
                    key={i}
                    className='text-small text-default-600 flex gap-2'
                  >
                    <CheckCircle2 className='text-success mt-0.5' size={16} />{' '}
                    {item}
                  </li>
                ))}
              </ul>

              <div className='border-primary/20 mt-12 rounded-xl border bg-white p-4'>
                <p className='text-tiny text-primary font-bold tracking-wider uppercase'>
                  Annual Membership
                </p>
                <p className='text-small text-default-500 mt-1'>
                  Starting from 15,000 THB/Year. This ensures long-term
                  commitment and platform quality.
                </p>
              </div>
            </div>

            <form
              className='space-y-8 p-8 md:w-2/3'
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className='space-y-4'>
                <h4 className='text-primary flex items-center gap-2 font-bold'>
                  <Fingerprint size={18} />
                  1. Business Identity
                </h4>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Input
                    {...register('businessName')}
                    isRequired
                    errorMessage={errors.businessName?.message}
                    isInvalid={!!errors.businessName}
                    label='Brand Name'
                    labelPlacement='outside'
                    placeholder='Your Brand'
                    variant='bordered'
                  />
                  <Select
                    isRequired
                    errorMessage={errors.businessType?.message}
                    isInvalid={!!errors.businessType}
                    label='Business Type'
                    labelPlacement='outside'
                    placeholder='Select type'
                    variant='bordered'
                    onSelectionChange={(keys) =>
                      setValue('businessType', Array.from(keys)[0] as string)
                    }
                  >
                    {businessTypes.map((type) => (
                      <SelectItem key={type.value}>{type.label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    {...register('category')}
                    isRequired
                    className='col-span-2'
                    errorMessage={errors.category?.message}
                    isInvalid={!!errors.category}
                    label='Core Product Category'
                    labelPlacement='outside'
                    placeholder='e.g. Organic Supplements, Eco-friendly Skincare'
                    variant='bordered'
                  />
                </div>
              </div>

              <h4 className='text-primary flex items-center gap-2 font-bold'>
                <Leaf size={18} /> 2. Quality & Ingredients
              </h4>
              <Textarea
                {...register('description')}
                isRequired
                errorMessage={errors.description?.message}
                isInvalid={!!errors.description}
                label='Product Ingredients & Sourcing'
                labelPlacement='outside'
                placeholder='Tell us about the key ingredients and your sourcing standards. Transparency is key to FAOS.'
                variant='bordered'
              />

              <Textarea
                {...register('productSamples')}
                isRequired
                errorMessage={errors.productSamples?.message}
                isInvalid={!!errors.productSamples}
                label='Product Samples (Link or Description)'
                labelPlacement='outside'
                placeholder='e.g. https://your-catalog.com or Briefly describe samples'
                variant='bordered'
              />

              <div className='bg-warning-50 border-warning-200 flex items-start gap-2 rounded-lg border p-3'>
                <AlertCircle className='text-warning mt-0.5' size={18} />
                <p className='text-tiny text-warning-700'>
                  All products must comply with local laws and FDA regulations.
                  Prohibited substances or false health claims will lead to
                  immediate rejection.
                </p>
              </div>

              <div className='space-y-4'>
                <h4 className='text-primary flex items-center gap-2 font-bold'>
                  <ShieldCheck size={18} /> 3. FAOS Standard Compliance
                </h4>
                <p className='text-small text-default-500 mb-2'>
                  Please confirm that your brand meets our quality pillars:
                </p>

                <CheckboxGroup isRequired>
                  <Checkbox classNames={{ base: 'text-white' }} value='legal'>
                    <span className='text-small font-medium'>
                      Legal Compliance
                    </span>
                    <p className='text-tiny text-default-400'>
                      All products are legally registered and have necessary
                      certifications (e.g., FDA, Halal, Organic).
                    </p>
                  </Checkbox>
                  <Checkbox
                    classNames={{ base: 'text-white' }}
                    value='lab-tested'
                  >
                    <span className='text-small font-medium'>
                      Ingredient Integrity
                    </span>
                    <p className='text-tiny text-default-400'>
                      Products contain no harmful chemicals, banned substances,
                      or toxic fillers.
                    </p>
                  </Checkbox>
                  <Checkbox classNames={{ base: 'text-white' }} value='ethics'>
                    <span className='text-small font-medium'>
                      Ethical Production
                    </span>
                    <p className='text-tiny text-default-400'>
                      Our manufacturing process follows ethical standards and
                      sustainable practices.
                    </p>
                  </Checkbox>
                  <Checkbox classNames={{ base: 'text-white' }} value='fee'>
                    <span className='text-small font-medium'>
                      Membership Commitment
                    </span>
                    <p className='text-tiny text-default-400'>
                      I understand that FAOS is a curated platform and requires
                      an annual partner membership fee.
                    </p>
                  </Checkbox>
                </CheckboxGroup>
              </div>

              <Divider />

              <div className='flex flex-col gap-3'>
                <Button
                  className='text-secondary font-bold'
                  color='primary'
                  isLoading={isSubmitting}
                  size='lg'
                  startContent={!isSubmitting && <Send size={18} />}
                  type='submit'
                >
                  Submit Application for Review
                </Button>
                <p className='text-tiny text-default-400 text-center'>
                  Our curators will review your application and contact you
                  within 5 business days for further documents.
                </p>
              </div>
            </form>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default PartnerApply
