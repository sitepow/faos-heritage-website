'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Spinner,
  Divider,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Currency } from '@prisma/client'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { useEffect } from 'react'
import {
  Controller,
  useForm,
  useFieldArray,
  type Resolver,
} from 'react-hook-form'

import { useShippingCountry } from '../hook'
import { useShippingMutation } from '../mutation'
import { shippingCountrySchema, type ShippingCountryInput } from '../schema'
import { useShippingUIStore } from '../store'

import { SectionLabel } from '@/components/ui/SectionHeader'
import localeTh from '@/messages/th/ui/common.json'

const DEFAULT_VALUES: ShippingCountryInput = {
  countryCode: '',
  countryName: '',
  baseRate: 0,
  pricePerKg: 0,
  freeShippingThreshold: null,
  weightTiers: [],
  currency: Currency.THB,
  isActive: true,
}

const ShippingForm = () => {
  const countries = localeTh.global.country
  const { selectedCountryId, isFormOpen, closeForm } = useShippingUIStore()
  const { data: country, isLoading } = useShippingCountry(selectedCountryId)
  const { create, update, isCreating, isUpdating } = useShippingMutation()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ShippingCountryInput>({
    resolver: zodResolver(
      shippingCountrySchema,
    ) as Resolver<ShippingCountryInput>,
    defaultValues: DEFAULT_VALUES,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'weightTiers',
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedCountryId && country) {
        reset(country as ShippingCountryInput)
      } else {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isFormOpen, selectedCountryId, country, reset])

  const onSubmit = async (values: ShippingCountryInput) => {
    selectedCountryId
      ? await update({ ...values, id: selectedCountryId })
      : await create(values)
    closeForm()
  }

  const isPending = isCreating || isUpdating

  return (
    <Modal
      hideCloseButton
      isDismissable={!isPending}
      isOpen={isFormOpen}
      scrollBehavior='inside'
      size='3xl'
      onOpenChange={closeForm}
    >
      <ModalContent>
        <ModalHeader className='text-left text-xl font-bold'>
          {selectedCountryId
            ? 'แก้ไขข้อมูลการจัดส่ง'
            : 'เพิ่มประเทศการจัดส่งใหม่'}
        </ModalHeader>
        <ModalBody className='text-left'>
          {isLoading && selectedCountryId ? (
            <div className='flex h-40 items-center justify-center'>
              <Spinner label='กำลังโหลดข้อมูล...' />
            </div>
          ) : (
            <form
              className='space-y-6'
              id='shipping-form'
              onSubmit={handleSubmit(onSubmit)}
            >
              <SectionLabel>สถานะและการแสดงผล</SectionLabel>
              <div className='flex flex-wrap gap-6'>
                <Controller
                  control={control}
                  name='isActive'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Switch
                      {...field}
                      isSelected={!!value}
                      onValueChange={onChange}
                    >
                      เปิดใช้งานประเทศนี้ (Active)
                    </Switch>
                  )}
                />
              </div>

              <SectionLabel>ข้อมูลประเทศ</SectionLabel>
              <Controller
                control={control}
                name='countryCode'
                render={({ field: { value, onChange, ...field } }) => (
                  <Select
                    {...field}
                    errorMessage={errors.countryCode?.message}
                    isInvalid={!!errors.countryCode}
                    label='เลือกประเทศ'
                    placeholder='ค้นหาหรือเลือกประเทศ'
                    selectedKeys={value ? [value] : []}
                    variant='bordered'
                    onSelectionChange={(keys) => {
                      const selectedCode = Array.from(keys)[0] as string
                      onChange(selectedCode)
                      if (
                        selectedCode &&
                        countries[selectedCode as keyof typeof countries]
                      ) {
                        setValue(
                          'countryName',
                          countries[selectedCode as keyof typeof countries],
                          { shouldDirty: true },
                        )
                      }
                    }}
                  >
                    {Object.entries(countries).map(([code, name]) => (
                      <SelectItem key={code} textValue={name}>
                        {name} ({code})
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              <SectionLabel>
                ยอดซื้อขั้นต่ำเพื่อส่งฟรี (Free Shipping Threshold)
              </SectionLabel>
              <Controller
                control={control}
                name='freeShippingThreshold'
                render={({ field: { value, onChange, ...field } }) => (
                  <Input
                    {...field}
                    label='ซื้อครบ (ยอดเงิน)'
                    placeholder='เว้นว่างไว้หากไม่มีโปรโมชั่นส่งฟรี'
                    type='number'
                    value={value?.toString() ?? ''}
                    variant='bordered'
                    onValueChange={(v) => onChange(v ? Number(v) : null)}
                  />
                )}
              />

              <div className='flex items-center justify-between'>
                <SectionLabel>กำหนดช่วงน้ำหนัก (Weight Tiers)</SectionLabel>
                <Button
                  color='primary'
                  size='sm'
                  startContent={<PlusIcon size={16} />}
                  variant='flat'
                  onPress={() =>
                    append({ minWeight: 0, maxWeight: 0, rate: 0 })
                  }
                >
                  เพิ่มช่วงน้ำหนัก
                </Button>
              </div>

              {fields.length > 0 ? (
                <div className='space-y-3'>
                  {fields.map((field, index) => (
                    <div key={field.id} className='flex items-end gap-3'>
                      <div className='grid flex-1 grid-cols-3 gap-2'>
                        <Controller
                          control={control}
                          name={`weightTiers.${index}.minWeight`}
                          render={({ field: { value, onChange } }) => (
                            <Input
                              label='เริ่ม (kg)'
                              size='sm'
                              type='number'
                              value={value?.toString() ?? '0'}
                              variant='bordered'
                              onValueChange={(v) => onChange(Number(v))}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name={`weightTiers.${index}.maxWeight`}
                          render={({ field: { value, onChange } }) => (
                            <Input
                              label='ถึง (kg)'
                              size='sm'
                              type='number'
                              value={value?.toString() ?? '0'}
                              variant='bordered'
                              onValueChange={(v) => onChange(Number(v))}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name={`weightTiers.${index}.rate`}
                          render={({ field: { value, onChange } }) => (
                            <Input
                              label='ราคาเหมา'
                              size='sm'
                              type='number'
                              value={value?.toString() ?? '0'}
                              variant='bordered'
                              onValueChange={(v) => onChange(Number(v))}
                            />
                          )}
                        />
                      </div>
                      <Button
                        isIconOnly
                        color='danger'
                        size='sm'
                        variant='light'
                        onPress={() => remove(index)}
                      >
                        <TrashIcon size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-default-400 bg-default-50 text-small rounded-lg py-4 text-center'>
                  ยังไม่มีการกำหนดช่วงน้ำหนัก
                  (จะใช้เรทพื้นฐานด้านล่างในการคำนวณ)
                </p>
              )}

              <Divider />

              <SectionLabel>
                เรทพื้นฐาน (กรณีไม่เข้าเงื่อนไขช่วงน้ำหนัก)
              </SectionLabel>
              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  control={control}
                  name='baseRate'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Input
                      {...field}
                      errorMessage={errors.baseRate?.message}
                      isInvalid={!!errors.baseRate}
                      label='ค่าส่งเริ่มต้น'
                      type='number'
                      value={value?.toString() ?? '0'}
                      variant='bordered'
                      onValueChange={(v) => onChange(Number(v))}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='pricePerKg'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Input
                      {...field}
                      errorMessage={errors.pricePerKg?.message}
                      isInvalid={!!errors.pricePerKg}
                      label='ราคาต่อกิโลกรัม'
                      type='number'
                      value={value?.toString() ?? '0'}
                      variant='bordered'
                      onValueChange={(v) => onChange(Number(v))}
                    />
                  )}
                />
              </div>
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={isPending} variant='flat' onPress={closeForm}>
            ยกเลิก
          </Button>
          <Button
            className='text-secondary font-bold'
            color='primary'
            form='shipping-form'
            isDisabled={!isDirty || isPending}
            isLoading={isPending}
            type='submit'
          >
            {selectedCountryId ? 'บันทึกการแก้ไข' : 'เพิ่มข้อมูล'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ShippingForm }
