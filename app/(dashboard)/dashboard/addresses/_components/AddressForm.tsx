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
  Textarea,
  Avatar,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'

import { SectionLabel } from '@/components/ui/SectionHeader'
import { useAddress } from '@/features/address/address.hook'
import { useAddressMutation } from '@/features/address/address.mutation'
import {
  addressSchema,
  type AddressInput,
} from '@/features/address/address.schema'
import { useAddressStore } from '@/features/address/address.store'
import { useUsers } from '@/features/user/user.hook'
import localeTh from '@/messages/th/ui/common.json'

const DEFAULT_VALUES: AddressInput = {
  userId: '',
  name: '',
  phone: '',
  address: '',
  district: '',
  subDistrict: '',
  province: '',
  postalCode: '',
  country: '',
  countryCode: '',
  isDefault: false,
}

const AddressForm = () => {
  const countries = localeTh.global.country
  const { addressId, isAddressOpen, onOpenAddressChange, setState } =
    useAddressStore()

  const { data: address, isLoading } = useAddress(addressId)

  const { data: usersData, isLoading: isLoadingUsers } = useUsers(1, 100)

  const { create, update, isCreating, isUpdating } = useAddressMutation()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema) as Resolver<AddressInput>,
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isAddressOpen) {
      if (addressId && address) {
        reset(address as AddressInput)
      } else {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isAddressOpen, addressId, address, reset])

  const handleClose = () => {
    onOpenAddressChange(false)
    setState({ addressId: null })
    reset(DEFAULT_VALUES)
  }

  const onSubmit = async (data: AddressInput) => {
    addressId ? await update(data) : await create(data)
    handleClose()
  }

  const isPending = isCreating || isUpdating

  return (
    <Modal
      hideCloseButton
      isDismissable={!isPending}
      isOpen={isAddressOpen}
      scrollBehavior='inside'
      size='2xl'
      onOpenChange={handleClose}
    >
      <ModalContent>
        <ModalHeader className='text-left text-xl font-bold'>
          {addressId ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ให้ลูกค้า'}
        </ModalHeader>
        <ModalBody className='text-left'>
          {isLoading && addressId ? (
            <div className='flex h-40 items-center justify-center'>
              <Spinner label='กำลังโหลดข้อมูลที่อยู่...' />
            </div>
          ) : (
            <form
              className='space-y-6'
              id='address-form'
              onSubmit={handleSubmit(onSubmit)}
            >
              <SectionLabel>เจ้าของบัญชี (Customer)</SectionLabel>
              <Controller
                control={control}
                name='userId'
                render={({ field: { value, onChange } }) => (
                  <Select
                    errorMessage={errors.userId?.message}
                    isDisabled={!!addressId}
                    isInvalid={!!errors.userId}
                    isLoading={isLoadingUsers}
                    label='เลือกสมาชิกที่ต้องการผูกที่อยู่'
                    selectedKeys={value ? [value] : []}
                    variant='bordered'
                    onSelectionChange={(keys) =>
                      onChange(Array.from(keys)[0] as string)
                    }
                  >
                    {(usersData?.items || []).map((user) => (
                      <SelectItem
                        key={user.id}
                        startContent={
                          <Avatar
                            className='h-6 w-6'
                            size='sm'
                            src={user.image || ''}
                          />
                        }
                        textValue={user.name || user.email}
                      >
                        <div className='flex flex-col'>
                          <span className='text-small font-medium'>
                            {user.name || 'ไม่ระบุชื่อ'}
                          </span>
                          <span className='text-tiny text-default-400'>
                            {user.email}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              <SectionLabel>สถานะและการแสดงผล</SectionLabel>
              <div className='border-default-100 flex items-center justify-between rounded-lg border p-4'>
                <div className='flex flex-col'>
                  <span className='text-small font-bold'>
                    ตั้งเป็นที่อยู่หลัก
                  </span>
                  <span className='text-tiny text-default-400'>
                    ที่อยู่นี้จะถูกเลือกใช้งานเป็นลำดับแรกเมื่อลูกค้าสั่งซื้อสินค้า
                  </span>
                </div>
                <Controller
                  control={control}
                  name='isDefault'
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      color='primary'
                      isSelected={!!value}
                      onValueChange={onChange}
                    />
                  )}
                />
              </div>

              <SectionLabel>ข้อมูลผู้รับ</SectionLabel>
              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  control={control}
                  name='name'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name}
                      label='ชื่อ-นามสกุล'
                      variant='bordered'
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='phone'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.phone?.message}
                      isInvalid={!!errors.phone}
                      label='เบอร์โทรศัพท์'
                      variant='bordered'
                    />
                  )}
                />
              </div>

              <SectionLabel>ที่อยู่สำหรับการจัดส่ง</SectionLabel>
              <Controller
                control={control}
                name='address'
                render={({ field }) => (
                  <Textarea
                    {...field}
                    errorMessage={errors.address?.message}
                    isInvalid={!!errors.address}
                    label='บ้านเลขที่, ถนน, ซอย/หมู่บ้าน'
                    variant='bordered'
                  />
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  control={control}
                  name='countryCode'
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label='ประเทศ'
                      selectedKeys={value ? [value] : []}
                      variant='bordered'
                      onSelectionChange={(keys) => {
                        const code = Array.from(keys)[0] as string
                        onChange(code)
                        if (code)
                          setValue(
                            'country',
                            countries[code as keyof typeof countries] || '',
                            { shouldDirty: true },
                          )
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
                <Controller
                  control={control}
                  name='province'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.province?.message}
                      isInvalid={!!errors.province}
                      label='จังหวัด'
                      variant='bordered'
                    />
                  )}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  control={control}
                  name='district'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.district?.message}
                      isInvalid={!!errors.district}
                      label='อำเภอ/เขต'
                      variant='bordered'
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='subDistrict'
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='ตำบล/แขวง'
                      value={field.value || ''}
                      variant='bordered'
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='postalCode'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.postalCode?.message}
                      isInvalid={!!errors.postalCode}
                      label='รหัสไปรษณีย์'
                      variant='bordered'
                    />
                  )}
                />
              </div>
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={isPending} variant='flat' onPress={handleClose}>
            ยกเลิก
          </Button>
          <Button
            className='text-secondary font-bold'
            color='primary'
            form='address-form'
            isDisabled={!isDirty || isPending}
            isLoading={isPending}
            type='submit'
          >
            {addressId ? 'บันทึกแก้ไข' : 'สร้างที่อยู่ใหม่'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { AddressForm }
