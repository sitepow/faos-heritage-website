'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EditIcon,
  PlusIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
  getProductLocalizations,
  deleteProductLocalization,
} from '../../action/product-localization'
import { useProductStore } from '../../store'
import { ProductLocalizationForm } from '../form/product-localization'

import { CountryFlag } from '@/components/country-flag'

export const ProductLocalizationManager = () => {
  const t = useTranslations('Country')
  const queryClient = useQueryClient()

  const {
    productId,
    isProductLocalizationManagerOpen,
    onOpenProductLocalizationManagerChange,
    onOpenProductLocalizationChange,
    setState,
  } = useProductStore()

  const QUERY_KEY = ['product-localizations', productId]

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getProductLocalizations(productId!),
    enabled: isProductLocalizationManagerOpen,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProductLocalization,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      setState({ productLocalizationId: null })
    },
  })

  return (
    <>
      <ProductLocalizationForm />

      <Modal
        isOpen={isProductLocalizationManagerOpen}
        onOpenChange={onOpenProductLocalizationManagerChange}
        size='xl'
        scrollBehavior='inside'
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader>ชื่อสินค้าแต่ละประเทศ</ModalHeader>

          <ModalBody>
            {isLoading && <Spinner />}

            {!isLoading && data?.length === 0 && (
              <p className='text-default-500 text-center'>ไม่พบข้อมูลที่แสดง</p>
            )}

            <div className='grid gap-3'>
              {data?.map((item) => (
                <Card key={item.id}>
                  <CardBody>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <CountryFlag countryCode={item?.languageCode} />
                        <div className='flex flex-col'>
                          <p className='line-clamp-1 font-medium'>
                            {t(item.languageCode.toUpperCase())}
                          </p>
                          <span className='text-default-500 text-sm'>
                            ({item?.name})
                          </span>
                        </div>
                      </div>

                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly variant='light'>
                            <EllipsisVerticalIcon />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem
                            key='edit'
                            startContent={<EditIcon className='size-4' />}
                            onClick={() => {
                              setState({
                                productLocalizationId: item.id,
                              })
                              onOpenProductLocalizationManagerChange()
                              onOpenProductLocalizationChange()
                            }}
                          >
                            แก้ไขข้อมูล
                          </DropdownItem>
                          <DropdownItem
                            key='delete'
                            color='danger'
                            className='text-danger'
                            startContent={<TrashIcon className='size-4' />}
                            onClick={() => mutate(item.id)}
                            isDisabled={isPending}
                          >
                            ลบข้อมูล
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant='faded'
              onPress={() => {
                onOpenProductLocalizationManagerChange()
              }}
            >
              ปิดหน้าต่าง
            </Button>
            <Button
              color='primary'
              className='text-secondary'
              startContent={<PlusIcon />}
              onPress={() => {
                setState({ productLocalizationId: null })
                onOpenProductLocalizationManagerChange()
                onOpenProductLocalizationChange()
              }}
            >
              เพิ่มข้อมูลใหม่
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
