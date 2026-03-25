'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Spinner,
  Chip,
} from '@heroui/react'
import { ContractStatus } from '@prisma/client'
import {
  StoreIcon,
  EraserIcon,
  PenToolIcon,
  InfoIcon,
  TagIcon,
  PackagePlusIcon,
} from 'lucide-react'
import { useMemo, useRef, useEffect, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { toast } from 'react-toastify'

import type { RefObject } from 'react'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { ProductImage } from '@/components/ui/Product/ProductImage'
import { BRAND_SIGNATURE } from '@/constants'
import { useContractDetails } from '@/features/contract/hook'
import { useContractMutation } from '@/features/contract/mutation'
import { formatCurrency } from '@/utils'
import { formatDate } from '@/utils/date'

interface Props {
  isOpen: boolean
  onClose: () => void
  contractId: string | null
}

const ContractApproveModal = ({ isOpen, onClose, contractId }: Props) => {
  const brandSigRef = useRef<SignatureCanvas>(null)
  const storeSigRef = useRef<SignatureCanvas>(null)

  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
  const [pendingStatus, setPendingStatus] = useState<ContractStatus | null>(
    null,
  )

  const { data: contract, isLoading } = useContractDetails(contractId as string)
  const { updateStatus, isUpdatingStatus } = useContractMutation()

  useEffect(() => {
    if (isOpen) {
      const resize = (ref: RefObject<SignatureCanvas | null>) => {
        const signatureCanvas = ref.current
        if (signatureCanvas) {
          const canvas = signatureCanvas.getCanvas()
          if (canvas) {
            const ratio = Math.max(window.devicePixelRatio || 1, 1)
            canvas.width = canvas.offsetWidth * ratio
            canvas.height = canvas.offsetHeight * ratio
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.scale(ratio, ratio)
            }
            signatureCanvas.clear()
          }
        }
      }

      const timer = setTimeout(() => {
        resize(brandSigRef)
        resize(storeSigRef)
      }, 150)

      return () => {
        return clearTimeout(timer)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && !isLoading && brandSigRef.current) {
      const timer = setTimeout(() => {
        const signatureCanvas = brandSigRef.current
        if (signatureCanvas) {
          const canvas = signatureCanvas.getCanvas()
          const ctx = canvas.getContext('2d')

          if (ctx) {
            signatureCanvas.clear()

            ctx.save()
            ctx.font = 'bold 20px Arial'
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            ctx.translate(canvas.width / 2, canvas.height / 2)
            ctx.rotate((-15 * Math.PI) / 180)

            const text =
              'ใช้สำหรับเว็บไซต์ WWW.FAOS.ASIA เท่านั้น ห้ามคัดลอก หรือดัดแปลงเด็ดขาด'
            const maxWidth = canvas.width * 0.8
            const lineHeight = 25

            const words = text.split(' ')
            let line = ''
            const lines = []

            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + ' '
              const metrics = ctx.measureText(testLine)
              const testWidth = metrics.width
              if (testWidth > maxWidth && n > 0) {
                lines.push(line)
                line = words[n] + ' '
              } else {
                line = testLine
              }
            }
            lines.push(line)

            const totalHeight = lines.length * lineHeight
            let startY = -(totalHeight / 2) + lineHeight / 2

            lines.forEach((l) => {
              ctx.fillText(l.trim(), 0, startY)
              startY += lineHeight
            })

            ctx.restore()

            signatureCanvas.fromDataURL(BRAND_SIGNATURE)
          }
        }
      }, 300)

      return () => {
        return clearTimeout(timer)
      }
    }
  }, [isOpen, isLoading])

  const handleUpdateStatus = async (): Promise<void> => {
    if (!contractId || !pendingStatus) {
      return
    }

    const storeSignature = storeSigRef.current?.isEmpty()
      ? undefined
      : storeSigRef.current?.getTrimmedCanvas().toDataURL('image/png')

    if (pendingStatus === ContractStatus.ACTIVE && !storeSignature) {
      toast.warn('กรุณาลงนามให้เรียบร้อยก่อนยืนยัน')
      setIsConfirmOpen(false)
      return
    }

    try {
      const result = await updateStatus({
        id: contractId,
        status: pendingStatus,
        storeSignature,
      })

      if (result.success) {
        toast.success(
          pendingStatus === ContractStatus.ACTIVE
            ? 'ดำเนินการสำเร็จ'
            : 'ปฏิเสธสัญญาแล้ว',
        )
        setIsConfirmOpen(false)
        return onClose()
      }
    } catch {
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
  }

  const askConfirmation = (status: ContractStatus): void => {
    setPendingStatus(status)
    return setIsConfirmOpen(true)
  }

  const totals = useMemo(() => {
    if (!contract?.items) {
      return {
        retailTotal: 0,
        agreedTotal: 0,
        potentialProfit: 0,
      }
    }

    const retailTotal = contract.items.reduce((acc: number, item) => {
      const basePrice = Number(item.variant?.price ?? item.product?.price ?? 0)
      return acc + basePrice * (item.quantity || 1)
    }, 0)

    const agreedTotal = Number(contract.totalAmount || 0)

    return {
      retailTotal: Number(retailTotal.toFixed(2)),
      agreedTotal: Number(agreedTotal.toFixed(2)),
      potentialProfit: Number((retailTotal - agreedTotal).toFixed(2)),
    }
  }, [contract])

  return (
    <>
      <Modal
        className='max-h-[95vh]'
        isDismissable={false}
        isOpen={isOpen}
        scrollBehavior='inside'
        size='5xl'
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader className='border-default-100 flex flex-wrap items-center justify-between gap-2 border-b px-6 py-4'>
            <span className='font-bold'>ตรวจสอบและลงนามสัญญา (Contract)</span>
          </ModalHeader>

          <ModalBody className='overflow-y-auto p-0'>
            <div className='flex h-full flex-col lg:flex-row lg:overflow-hidden'>
              <div className='border-default-100 flex-1 p-4 lg:overflow-y-auto lg:border-r lg:p-6'>
                {isLoading ? (
                  <div className='flex h-full items-center justify-center py-20'>
                    <Spinner label='กำลังโหลดข้อมูลสัญญา...' />
                  </div>
                ) : (
                  <div className='flex flex-col gap-8'>
                    <section className='bg-default-50 border-default-100 flex flex-col gap-4 rounded-xl border p-5'>
                      <div className='flex items-center gap-2'>
                        <h3 className='text-base font-bold'>
                          ข้อตกลงและเงื่อนไขการค้า
                        </h3>
                      </div>
                      <div className='text-default-600 flex flex-col gap-3 text-sm leading-relaxed'>
                        <p>
                          <strong>1. วัตถุประสงค์:</strong> ผู้เสนอ
                          (เจ้าของแบรนด์)
                          ตกลงจัดส่งสินค้าในราคาส่งตามรายการที่ระบุ
                          เพื่อให้ผู้รับเสนอ (ร้านค้า)
                          นำไปจำหน่ายต่อในราคาปลีกที่กำหนด
                        </p>
                        <p>
                          <strong>2. ส่วนต่างกำไร:</strong>{' '}
                          ร้านค้าจะได้รับกำไรจากส่วนต่างระหว่างราคาส่งและราคาปลีก
                          (Margin)
                          โดยประมาณการกำไรสุทธิจะปรากฏในสรุปยอดด้านขวาของสัญญานี้
                        </p>
                        <p>
                          <strong>3. การรักษาราคาจำหน่าย:</strong>{' '}
                          ร้านค้าตกลงจำหน่ายสินค้าในราคาไม่ต่ำกว่าราคาปลีกที่เจ้าของแบรนด์กำหนด
                          เพื่อรักษามาตรฐานและโครงสร้างราคาสินค้า
                        </p>
                        <p>
                          <strong>4. การส่งมอบและการรับประกัน:</strong>{' '}
                          เจ้าของแบรนด์รับรองคุณภาพสินค้าตามมาตรฐาน
                          และยินดีเปลี่ยนคืนสินค้าในกรณีที่เกิดความเสียหายจากการผลิตหรือการขนส่งต้นทาง
                        </p>
                        <div className='bg-primary/5 border-primary/20 text-primary-600 flex items-start gap-2 rounded-lg border p-3'>
                          <InfoIcon className='shrink-0' size={14} />
                          <p>
                            การลงนามในสัญญานี้
                            ถือว่าทั้งสองฝ่ายยอมรับเงื่อนไขและราคาที่ระบุไว้ข้างต้น
                            และมีผลผูกพันตามระยะเวลาที่กำหนดในระบบ
                          </p>
                        </div>
                      </div>
                    </section>

                    <section className='flex flex-col gap-3'>
                      <div className='flex items-center gap-2'>
                        <PenToolIcon className='text-default-400' size={18} />
                        <h3 className='text-sm font-bold'>
                          ลงชื่อ: เจ้าของแบรนด์ (ผู้เสนอ)
                        </h3>
                      </div>
                      <div className='border-default-200 relative h-48 overflow-hidden rounded-md border bg-white'>
                        <SignatureCanvas
                          ref={brandSigRef}
                          canvasProps={{
                            className:
                              'sigCanvas w-full h-full block pointer-events-none',
                          }}
                        />
                      </div>
                    </section>

                    <Divider className='bg-default-100' />

                    <section className='flex flex-col gap-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <StoreIcon className='text-default-400' size={18} />
                          <h3 className='text-sm font-bold'>
                            ลงชื่อ: ร้านค้าสาขา (ผู้รับเสนอ)
                          </h3>
                        </div>
                        <Button
                          isIconOnly
                          color='danger'
                          size='sm'
                          variant='light'
                          onPress={() => storeSigRef.current?.clear()}
                        >
                          <EraserIcon size={14} />
                        </Button>
                      </div>
                      <div className='border-default-200 relative h-48 overflow-hidden rounded-md border bg-white'>
                        <SignatureCanvas
                          ref={storeSigRef}
                          canvasProps={{
                            className:
                              'sigCanvas w-full h-full cursor-crosshair block',
                          }}
                          maxWidth={3}
                          minWidth={1.5}
                          penColor='black'
                        />
                      </div>
                    </section>
                  </div>
                )}
              </div>

              <div className='bg-default-50/50 flex w-full flex-col gap-4 p-4 lg:w-[380px] lg:overflow-y-auto lg:p-6 xl:w-[420px]'>
                <h3 className='flex items-center gap-2 text-lg font-bold'>
                  รายการตรวจสอบสินค้า
                </h3>
                <Divider className='bg-default-200' />

                <div className='flex flex-col gap-3'>
                  <div className='border-default-100 bg-default-50 flex flex-col gap-1 rounded-lg border p-3'>
                    <span className='text-sm font-bold'>
                      {contract?.storefront?.name}
                    </span>
                    <span className='text-default-500 text-xs'>
                      วันที่เสนอ:{' '}
                      {formatDate(contract?.createdAt, 'th', 'date')}
                    </span>
                  </div>
                </div>

                <Divider className='bg-default-200' />

                <div className='flex min-h-[300px] flex-col gap-3 overflow-y-auto'>
                  {contract?.items?.map((item) => {
                    const retailPrice = Number(
                      item.variant?.price ?? item.product?.price ?? 0,
                    )
                    const imageUrl =
                      item.product?.images?.find((img) => img.isPrimary)?.url ??
                      item.product?.images?.[0]?.url ??
                      ''
                    const isAdjustment = item.quantity === 0

                    return (
                      <div
                        key={item.id}
                        className='border-default-100 bg-default-50 flex flex-col gap-2 rounded-lg border p-3'
                      >
                        <div className='flex items-start gap-3'>
                          <div className='bg-default-100 size-12 shrink-0 overflow-hidden rounded-md'>
                            <ProductImage fill image={imageUrl} />
                          </div>
                          <div className='flex-1 overflow-hidden'>
                            <div className='flex items-start justify-between gap-1'>
                              <p className='text-sm font-bold'>
                                {item.productName}
                              </p>
                              <Chip
                                className='h-5 shrink-0 text-[10px] font-bold uppercase'
                                color={isAdjustment ? 'primary' : 'success'}
                                size='sm'
                                startContent={
                                  isAdjustment ? (
                                    <TagIcon size={12} />
                                  ) : (
                                    <PackagePlusIcon size={12} />
                                  )
                                }
                                variant='flat'
                              >
                                {isAdjustment ? 'ปรับราคา' : 'โอนสต็อก'}
                              </Chip>
                            </div>
                            <div className='mt-1 flex items-center gap-2'>
                              <span className='text-default-400 text-[10px] line-through'>
                                {formatCurrency(retailPrice)}
                              </span>
                              <span className='text-primary text-[10px] font-semibold'>
                                {formatCurrency(Number(item.agreedPrice))}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='border-default-100 flex items-center justify-between border-t pt-1'>
                          <span className='text-default-500 text-[10px] font-bold'>
                            {isAdjustment
                              ? 'ประเภท: ปรับราคาต้นทุนเดิม'
                              : `จำนวนโอน: ${item.quantity}`}
                          </span>
                          {!isAdjustment && (
                            <span className='text-sm font-bold'>
                              {formatCurrency(
                                Number(item.agreedPrice) * item.quantity,
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className='bg-primary/5 border-primary/10 mt-auto flex flex-col gap-2 rounded-lg border p-4'>
                  <div className='text-default-600 flex items-center justify-between text-sm'>
                    <span>มูลค่าตลาดรวม:</span>
                    <span className='text-default-400 line-through'>
                      {formatCurrency(totals.retailTotal)}
                    </span>
                  </div>
                  <Divider className='my-1 opacity-50' />
                  <div className='flex items-center justify-between text-lg font-bold'>
                    <span>ยอดสุทธิสัญญา:</span>
                    <span className='text-primary'>
                      {formatCurrency(totals.agreedTotal)}
                    </span>
                  </div>
                  <div className='text-success flex items-center justify-between text-sm font-bold'>
                    <span>ประมาณการกำไร (Margin):</span>
                    <span>{formatCurrency(totals.potentialProfit)}</span>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className='border-default-100 flex items-center border-t p-4'>
            <Button
              className='text-secondary flex-1 font-bold'
              color='danger'
              isDisabled={isLoading || !contract}
              isLoading={
                isUpdatingStatus && pendingStatus === ContractStatus.TERMINATED
              }
              size='lg'
              variant='flat'
              onPress={() => askConfirmation(ContractStatus.TERMINATED)}
            >
              ปฏิเสธสัญญา
            </Button>
            <Button
              className='text-secondary flex-1 font-bold'
              color='primary'
              isDisabled={isLoading || !contract}
              isLoading={
                isUpdatingStatus && pendingStatus === ContractStatus.ACTIVE
              }
              size='lg'
              onPress={() => askConfirmation(ContractStatus.ACTIVE)}
            >
              ยืนยันสัญญา
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDeleteModal
        confirmText='ยืนยัน'
        description={
          pendingStatus === ContractStatus.ACTIVE
            ? 'คุณแน่ใจหรือไม่ว่าต้องการยืนยันสัญญาฉบับนี้? เมื่อยืนยันแล้วระบบจะโอนสต็อกและปรับราคาตามที่ระบุ'
            : 'คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธสัญญาฉบับนี้?'
        }
        isOpen={isConfirmOpen}
        isPending={isUpdatingStatus}
        title={
          pendingStatus === ContractStatus.ACTIVE
            ? 'ยืนยันสัญญา'
            : 'ปฏิเสธสัญญา'
        }
        onConfirm={() => handleUpdateStatus()}
        onOpenChange={setIsConfirmOpen}
      />
    </>
  )
}

export { ContractApproveModal }
