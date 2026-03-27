'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react'
import { ContractStatus } from '@prisma/client'
import { useRef, useEffect, useState, useMemo } from 'react'
import { SignatureCanvas } from 'react-signature-canvas'
import { toast } from 'react-toastify'

import type { RefObject } from 'react'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { BRAND_SIGNATURE } from '@/constants'
import { useContractDetails } from '@/features/contract/hook'
import { useContractMutation } from '@/features/contract/mutation'
import { formatDate, formatNumber } from '@/utils'

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
        isAdjustmentOnly: true,
      }
    }

    const items = contract.items
    const hasTransfer = items.some((item) => item.quantity > 0)

    const retailTotal = items.reduce((acc: number, item) => {
      const basePrice = Number(item.variant?.price ?? item.product?.price ?? 0)
      const qty = hasTransfer ? item.quantity : 1
      return acc + basePrice * qty
    }, 0)

    const agreedTotal = Number(contract.totalAmount || 0)

    return {
      retailTotal: Number(retailTotal.toFixed(2)),
      agreedTotal: Number(agreedTotal.toFixed(2)),
      potentialProfit: Number((retailTotal - agreedTotal).toFixed(2)),
      isAdjustmentOnly: !hasTransfer,
    }
  }, [contract])

  return (
    <>
      <Modal
        hideCloseButton
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
            <div className='mx-auto w-[210mm] bg-white p-[20mm] font-sans text-[14px] leading-relaxed text-black shadow-lg'>
              <h1 className='mb-6 text-center text-xl font-bold'>
                Consignment Agreement
              </h1>

              <section className='mb-4'>
                <h2 className='mb-2 border-b border-black pb-1 font-bold'>
                  Parties
                </h2>
                <p className='text-justify'>
                  This Consignment Agreement (the “Agreement”), is made and
                  entered into on{' '}
                  {formatDate(contract?.startDate, 'en', 'date')} by and
                  between:
                </p>
                <p className='mt-2'>
                  <strong>FOAS ASIA</strong> a corporation duly organized and
                  existing under the laws of Thailand having its principal place
                  of business at 333/253 Chalongkrung Soi 44 Ladkrabang
                  Lamplatiew, Ladkrabang, Bangkok 10520 Thailand. (hereinafter
                  referred to as <strong>“Consignor”</strong>), and
                </p>
                <p className='mt-2'>
                  <strong>{contract?.storefront?.name}</strong> a corporation
                  duly organized and existing under the laws of Thailand, having
                  its principal place of business{' '}
                  {contract?.storefront?.address} (hereinafter referred to as{' '}
                  <strong>“Consignee”</strong>).
                </p>
              </section>

              <section className='mb-4'>
                <p className='mb-2'>
                  WHEREAS, the Consignor owns the property rights of the
                  commodities on consignment, which will described in detail
                  below;
                </p>
                <p className='mb-2'>
                  WHEREAS, the Consignee desires to take possession of the
                  consigned commodities with the intention of selling on behalf
                  of the Consignor;
                </p>
                <p>
                  NOW, THEREFORE, in consideration of the mutual covenants and
                  promises made by the parties hereto, the Consignor and the
                  Consignee (individually, each a “Party” and collectively, the
                  “Parties”) agree and undertake as follows:
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold uppercase'>
                  a) Consigned Commodities
                </h3>
                <p>
                  The list and price information of the consigned commodities
                  (or shall be referred as the “goods”) subject to the
                  consignment are presented in <strong>TABLE 1</strong> below;
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold uppercase'>
                  b) Product Availability and Limited Production
                </h3>
                <ul className='list-disc pl-5'>
                  <li>
                    The Consignee acknowledges that certain products supplied
                    under this Agreement are of limited production and, as such,
                    may be subject to shortages or temporary unavailability.
                  </li>
                  <li>
                    The Consignor does not guarantee continuous availability of
                    all products listed in this Agreement.
                  </li>
                  <li>
                    On the 15th day of each month, the Consignor shall inform
                    the Consignee in writing of the current availability status
                    of each product, including any anticipated shortages or
                    discontinuations.
                  </li>
                  <li>
                    The Consignor shall use reasonable efforts to fulfill
                    replenishment orders subject to product availability.
                  </li>
                </ul>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold uppercase'>
                  c) Delivery Inspection and Acceptance
                </h3>
                <p className='text-justify'>
                  Upon each delivery, replenishment, renewal, or top-up of any
                  honey and olive oil products supplied under this Agreement, a
                  joint inspection shall be conducted by authorized
                  representatives of both the Supplier and Rallis Group. This
                  inspection shall apply to every box and unit delivered or
                  brought into Rallis Group’s premises.
                </p>
                <p className='mt-2 text-justify'>
                  The joint inspection shall verify, at minimum, the quantity,
                  packaging integrity, labeling, batch numbers, expiration
                  dates, storage condition, and overall product quality,
                  ensuring full compliance with the specifications and standards
                  agreed upon in this Agreement. Only products that successfully
                  pass the joint inspection shall be accepted into consignment
                  stock, displayed, stored, or made available for sale by Rallis
                  Group.
                </p>
              </section>

              <div className='mb-6 overflow-x-auto'>
                <p className='mb-1 font-bold'>TABLE 1</p>
                <table className='w-full border-collapse border border-black text-[11px]'>
                  <thead>
                    <tr className='bg-gray-100'>
                      <th className='border border-black p-1 text-left'>
                        Product
                      </th>
                      <th className='border border-black p-1'>Size</th>
                      {!totals.isAdjustmentOnly && (
                        <th className='border border-black p-1'>Qty</th>
                      )}
                      <th className='border border-black p-1'>Web Price</th>
                      <th className='border border-black p-1'>Store Price</th>
                      {!totals.isAdjustmentOnly && (
                        <th className='border border-black p-1'>
                          Total Amount
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {contract?.items?.map((item) => {
                      const retailPrice =
                        item.variant?.price ?? item.product?.price ?? 0

                      return (
                        <tr key={item.id}>
                          <td className='border border-black p-1'>
                            {item?.productName}
                          </td>
                          <td className='border border-black p-1 text-center uppercase'>
                            {item?.variant?.name ?? '-'}
                          </td>
                          {!totals.isAdjustmentOnly && (
                            <td className='border border-black p-1 text-center'>
                              {item?.quantity
                                ? formatNumber(item?.quantity)
                                : '-'}
                            </td>
                          )}
                          <td className='border border-black p-1 text-right'>
                            {formatNumber(retailPrice)}
                          </td>
                          <td className='border border-black p-1 text-right'>
                            {formatNumber(item?.agreedPrice)}
                          </td>
                          {!totals.isAdjustmentOnly && (
                            <td className='border border-black p-1 text-right'>
                              {formatNumber(item?.subtotal)}
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    {totals.isAdjustmentOnly && (
                      <tr className='font-bold'>
                        <td
                          className='border border-black p-1 text-right uppercase'
                          colSpan={6}
                        >
                          This contract is for price adjustment of existing
                          store items. Please review the product prices listed
                          above.
                        </td>
                      </tr>
                    )}

                    {!totals.isAdjustmentOnly && (
                      <tr className='font-bold'>
                        <td
                          className='border border-black p-1 text-right uppercase'
                          colSpan={5}
                        >
                          Grand Total
                        </td>
                        <td className='border border-black p-1 text-right'>
                          {formatNumber(totals.agreedTotal)}
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>

              <div className='grid grid-cols-2 gap-4 text-justify'>
                <div className='space-y-4'>
                  <section>
                    <h3 className='font-bold uppercase underline'>
                      d) Property Rights
                    </h3>
                    <p>
                      The ownership of the goods subject to the consignment
                      belongs to the consignor until these goods are sold and
                      the ownership passes to the third party. The Consignee
                      agrees and undertakes that it only has possession on the
                      consigned commodities.
                    </p>
                  </section>
                  <section>
                    <h3 className='font-bold uppercase underline'>
                      Price and Payment
                    </h3>
                    <p>
                      The Consignee may freely determine the selling price of
                      the consigned commodities under this Agreement. However,
                      the suggested selling prices for the consigned commodities
                      are indicated in the chart (Table 1) above.
                    </p>
                    <p className='mt-1'>
                      The Consignee shall remit payment to the Consignor for all
                      goods sold on or before the 15th day of each month.
                    </p>
                  </section>
                </div>
                <div className='space-y-4'>
                  <section>
                    <h3 className='font-bold uppercase underline'>Insurance</h3>
                    <p>
                      Consignee shall maintain insurance coverage that shall be
                      sufficient to compensate the Consignor in the event of
                      fire, damage, robbery, theft, or otherwise.
                    </p>
                  </section>
                  <section>
                    <h3 className='font-bold uppercase underline'>
                      Warranty of Goods
                    </h3>
                    <p>
                      The Consignor warrants that all goods supplied under this
                      Agreement conform to the specifications requested by the
                      Consignee, are fit for their intended purpose, are of good
                      material and workmanship, and are free from defects.
                    </p>
                  </section>
                </div>
              </div>

              <section className='mt-4'>
                <h3 className='font-bold uppercase underline'>
                  Termination of the Agreement
                </h3>
                <p>
                  This Agreement has been concluded for an indefinite period and
                  can be terminated without penalty by a written notice of 30
                  days by either party. If one of the parties fails to fulfill
                  its obligations under this Agreement, the other party may
                  terminate the contract with 30 days for Notification.
                </p>
              </section>

              <div className='mt-12 grid grid-cols-2 gap-10'>
                <div className='text-center'>
                  <p className='mb-8 font-bold'>Consignor Signature</p>
                  <SignatureCanvas
                    ref={brandSigRef}
                    canvasProps={{
                      className: 'sigCanvas block pointer-events-none',
                    }}
                  />
                  <p className='text-left text-[12px]'>
                    Ms. Patcharin Chanaphukdee
                  </p>
                  <p className='text-left text-[12px]'>Title: Owner</p>
                  <p className='text-left text-[12px]'>
                    Date: {formatDate(new Date(), 'th', 'numeric')}
                  </p>
                </div>
                <div className='text-center'>
                  <p className='mb-8 font-bold'>Consignee Signature</p>
                  <SignatureCanvas
                    ref={storeSigRef}
                    canvasProps={{
                      className: 'sigCanvas  cursor-crosshair block',
                    }}
                    maxWidth={3}
                    minWidth={1.5}
                    penColor='black'
                  />
                  <p className='text-left text-[12px]'>
                    Printed Name:{' '}
                    {contract?.storefront?.managers
                      ?.map((item) => item?.name)
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  <p className='text-left text-[12px]'>Title: Director</p>
                  <p className='text-left text-[12px]'>
                    Date: {formatDate(new Date(), 'th', 'numeric')}
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className='border-default-100 flex items-center border-t p-4'>
            <Button size='lg' variant='faded' onPress={onClose}>
              ปิดหน้าต่าง
            </Button>
            <Button
              size='lg'
              variant='faded'
              onPress={() => storeSigRef.current?.clear()}
            >
              ล้างค่าลายเซ็นต์
            </Button>
            <Button
              isDisabled={isLoading || !contract}
              isLoading={
                isUpdatingStatus && pendingStatus === ContractStatus.TERMINATED
              }
              size='lg'
              variant='faded'
              onPress={() => askConfirmation(ContractStatus.TERMINATED)}
            >
              ปฏิเสธสัญญา/ขอให้ปรับราคาใหม่อีกครั้ง
            </Button>
            <Button
              className='text-secondary font-bold'
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
