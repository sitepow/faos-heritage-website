'use client'

import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  ModalFooter,
  Chip,
} from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EditIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
  deleteShippingCountry,
  getShippingCountries,
} from '../../action/shipping/contry'
import { useProductStore } from '../../store'
import { ShippingForm } from '../form/shipping'

import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { CountryFlag } from '@/components/ui/CountryFlagAvatar'
import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'

export const ShippingCountryManager = () => {
  const t = useTranslations('Dashboard.ShippingCountryManager')
  const tCountry = useTranslations('Country')
  const queryClient = useQueryClient()

  const {
    shippingCountryId,
    isShippingCountryManagerOpen,
    onOpenShippingCountryChange,
    onOpenShippingCountryManagerChange,
    setState,
  } = useProductStore()

  const QUERY_KEY = {
    SHIPPING_COUNTRIES: ['dashboard', 'shipping-country', 'modal'],
  }

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const { data: shippingCountries, isLoading: isLoadingShippingCountries } =
    useQuery({
      queryKey: QUERY_KEY.SHIPPING_COUNTRIES,
      queryFn: () => getShippingCountries(),
      enabled: isShippingCountryManagerOpen,
    })

  const onRefetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.SHIPPING_COUNTRIES,
      }),
    ])
  }

  const {
    mutate: mutateDeteleShippingCountry,
    isPending: isPendingDeteleShippingCountry,
  } = useMutation({
    mutationFn: deleteShippingCountry,
    onSuccess: () => {
      onRefetch()
      onOpenDeleteChange()
      setState({ shippingCountryId: null })
    },
  })

  const onClose = async () => {
    onOpenShippingCountryManagerChange()
  }

  return (
    <>
      <ConfirmModal
        isOpen={isDeleteOpen}
        isPending={isPendingDeteleShippingCountry}
        onConfirm={() => {
          mutateDeteleShippingCountry(shippingCountryId!)
        }}
        onOpenChange={onOpenDeleteChange}
      />

      <ShippingForm />

      <Modal
        hideCloseButton
        isDismissable={false}
        isOpen={isShippingCountryManagerOpen}
        size='xl'
        scrollBehavior='inside'
        onOpenChange={onOpenShippingCountryManagerChange}
      >
        <ModalContent>
          <ModalHeader>{t('title')}</ModalHeader>

          {isLoadingShippingCountries && (
            <ModalBody>
              <Spinner label={t('loading')} />
            </ModalBody>
          )}

          {!isLoadingShippingCountries && shippingCountries?.length === 0 && (
            <ModalBody>
              <p className='text-default-500 text-center'>{t('noData')}</p>
            </ModalBody>
          )}

          {shippingCountries?.length !== 0 && (
            <ModalBody>
              <div className='grid grid-cols-1 gap-3'>
                {shippingCountries?.map((shippingCountry) => (
                  <Card
                    key={shippingCountry.id}
                    className={cn(
                      'border-l-4',
                      shippingCountry.isActive && 'border-primary',
                    )}
                  >
                    <CardBody className='flex-row items-center justify-between'>
                      <div className='line-clamp-1 flex flex-col'>
                        <div className='flex items-center gap-2'>
                          <CountryFlag
                            countryCode={shippingCountry.countryCode}
                          />
                          <span className='line-clamp-2'>
                            {tCountry(shippingCountry.countryCode)}
                          </span>
                        </div>

                        <div className='mt-2.5 flex gap-2 text-sm'>
                          <Chip variant='bordered'>
                            <span
                              className={cn(
                                'text-default-500',
                                !shippingCountry.baseRate && 'text-red-500',
                              )}
                            >
                              {shippingCountry.baseRate
                                ? `${t('baseRate')}: ${formatCurrency(shippingCountry?.baseRate ?? 0)}`
                                : `-`}
                            </span>
                          </Chip>

                          <Chip variant='bordered'>
                            <span
                              className={cn(
                                'text-default-500',
                                !shippingCountry.pricePerKg && 'text-red-500',
                              )}
                            >
                              {shippingCountry.baseRate
                                ? `${t('pricePerKg')}: ${formatCurrency(shippingCountry?.pricePerKg ?? 0)}`
                                : `-`}
                            </span>
                          </Chip>
                        </div>
                      </div>

                      <Dropdown placement='bottom-end'>
                        <DropdownTrigger>
                          <Button isIconOnly size='sm' variant='light'>
                            <EllipsisVerticalIcon className='text-default-500 size-5' />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label='Manage shipping'
                          className='min-w-[180px]'
                        >
                          <DropdownItem
                            key='edit'
                            startContent={<EditIcon className='size-4' />}
                            onClick={() => {
                              setState({
                                shippingCountryId: shippingCountry.id,
                              })
                              onOpenShippingCountryManagerChange()
                              onOpenShippingCountryChange()
                            }}
                          >
                            {t('editInfo')}
                          </DropdownItem>
                          <DropdownItem
                            key='delete'
                            className='text-danger'
                            color='danger'
                            startContent={<TrashIcon className='size-4' />}
                            onClick={() => {
                              setState({
                                shippingCountryId: shippingCountry.id,
                              })
                              onOpenDeleteChange()
                            }}
                          >
                            {t('removeShipping')}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </ModalBody>
          )}

          <ModalFooter>
            <Button variant='faded' onPress={onClose}>
              {t('cancel')}
            </Button>
            <Button
              className='text-secondary'
              color='primary'
              startContent={<PlusIcon />}
              onPress={() => {
                onOpenShippingCountryChange()
                onOpenShippingCountryManagerChange()
              }}
            >
              {t('addShipping')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
