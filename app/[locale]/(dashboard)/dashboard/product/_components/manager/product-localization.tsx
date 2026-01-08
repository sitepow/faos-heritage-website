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

import {
  getProductLocalizations,
  deleteProductLocalization,
} from '../../action/product-localization'
import { useProductStore } from '../../store'
import { ProductLocalizationForm } from '../form/product-localization'

export const ProductLocalizationManager = () => {
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
                      <p className='line-clamp-1 font-medium'>
                        {item.languageCode.toUpperCase()} – {item.name}
                      </p>

                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly variant='light'>
                            <EllipsisVerticalIcon />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem
                            key='edit'
                            startContent={<EditIcon />}
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
                            startContent={<TrashIcon />}
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
