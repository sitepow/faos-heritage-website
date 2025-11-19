'use client'

import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/react'
import { TrashIcon } from 'lucide-react'
import { useState } from 'react'

import type { ProductVariant } from '@prisma/client'

import { VariantForm } from '../form/variant'

import { formatNumber } from '@/utils/number'

interface Props {
  isOpen: boolean
  onOpenChange: () => void
}

const VariantManager = ({ isOpen, onOpenChange }: Props) => {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const {
    isOpen: isFormOpen,
    onOpen,
    onOpenChange: onFormChange,
  } = useDisclosure()

  return (
    <>
      <Modal
        hideCloseButton
        isOpen={isOpen}
        scrollBehavior='outside'
        size='2xl'
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex items-center justify-between'>
                จัดการตัวเลือกสินค้า
                <Button onPress={onOpen}>เพิ่มตัวเลือก</Button>
              </ModalHeader>
              <ModalBody>
                {variants.length === 0 ? (
                  <p className='text-center text-default-500'>
                    ยังไม่มีตัวเลือกสินค้า
                  </p>
                ) : (
                  <div className='grid grid-cols-1 gap-3'>
                    {variants.map((variant) => (
                      <Card key={variant.id}>
                        <CardBody className='flex-row justify-between'>
                          <div className='flex flex-col'>
                            <p className='font-medium'>{variant.name}</p>
                            <p className='text-default-500'>
                              ราคา {formatNumber(Number(variant.price))} บาท |
                              สต็อก {formatNumber(variant.stockQuantity)}
                            </p>
                          </div>

                          <Button
                            color='danger'
                            startContent={<TrashIcon className='size-4' />}
                            variant='light'
                          >
                            ลบ
                          </Button>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <VariantForm isOpen={isFormOpen} onOpenChange={onFormChange} />
    </>
  )
}

export { VariantManager }
