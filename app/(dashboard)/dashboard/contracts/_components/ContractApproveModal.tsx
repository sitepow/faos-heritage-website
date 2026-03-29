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
import { cn, formatCurrency, formatDate, formatNumber } from '@/utils'

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

  const ContractModalDraft = contract?.status === ContractStatus.DRAFT

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

  useEffect(() => {
    if (
      isOpen &&
      !isLoading &&
      storeSigRef.current &&
      contract?.storeSignature
    ) {
      const timer = setTimeout(() => {
        const signatureCanvas = storeSigRef.current
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

            if (contract?.storeSignature) {
              signatureCanvas.fromDataURL(contract?.storeSignature)
            }
          }
        }
      }, 300)

      return () => {
        return clearTimeout(timer)
      }
    }
  }, [isOpen, isLoading, contract?.storeSignature])

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

      const inventory =
        item.variant?.storefrontInventories?.[0] ??
        item.product?.storefrontInventories?.[0]
      const currentStock = inventory?.stockQuantity ?? 0

      const qty = hasTransfer ? item.quantity : currentStock
      return acc + basePrice * qty
    }, 0)

    const agreedTotal = items.reduce((acc: number, item) => {
      const agreedPrice = Number(item.agreedPrice || 0)
      const inventory =
        item.variant?.storefrontInventories?.[0] ??
        item.product?.storefrontInventories?.[0]
      const currentStock = inventory?.stockQuantity ?? 0

      const qty = hasTransfer ? item.quantity : currentStock
      return acc + agreedPrice * qty
    }, 0)

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
            <div className='mx-auto max-w-[210mm] bg-white p-[20mm] font-sans text-[14px] leading-relaxed text-black shadow-lg'>
              <h1 className='mb-6 text-center text-xl font-bold'>
                Consignment Agreement
              </h1>

              <section className='mb-4'>
                <h2 className='mb-2 border-b border-black pb-1 font-bold'>
                  1. Parties
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
                <h3 className='mb-1 font-bold'>2. a) Consigned Commodities</h3>
                <p>
                  The list and price information of the consigned commodities
                  (or shall be referred as the “goods”) subject to the
                  consignment are presented in{' '}
                  <span className='font-bold underline'>TABLE 1</span> below;
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>
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
                <h3 className='mb-1 font-bold'>
                  c) Delivery Inspection and Acceptance
                </h3>
                <p className='text-justify'>
                  Upon each delivery, replenishment, renewal, or top-up of any
                  honey and olive oil products supplied under this Agreement, a
                  joint inspection shall be conducted by authorized
                  representatives of both the Supplier and{' '}
                  {contract?.storefront?.name} This inspection shall apply to
                  every box and unit delivered or brought into{' '}
                  {contract?.storefront?.name} premises.
                </p>
                <p className='mt-2 text-justify'>
                  The joint inspection shall verify, at minimum, the quantity,
                  packaging integrity, labeling, batch numbers, expiration
                  dates, storage condition, and overall product quality,
                  ensuring full compliance with the specifications and standards
                  agreed upon in this Agreement.
                </p>
                <p className='mt-2 text-justify'>
                  Only products that successfully pass the joint inspection
                  shall be accepted into consignment stock, displayed, stored,
                  or made available for sale by {contract?.storefront?.name} Any
                  products found to be damaged, tampered with, expired,
                  improperly labeled, leaking, or otherwise non-compliant shall
                  be documented and excluded from consignment stock, and shall
                  be either replaced, credited, or removed at the Supplier’s
                  responsibility, as mutually agreed in writing.
                </p>
                <p className='mt-2 text-justify'>
                  Acceptance of products following joint inspection shall not
                  waive {contract?.storefront?.name} rights to raise quality or
                  compliance issues discovered subsequently during storage or
                  sale.
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
                      <th className='border border-black p-1'>
                        {totals.isAdjustmentOnly
                          ? 'Current Stock'
                          : 'Transfer Qty'}
                      </th>
                      <th className='border border-black p-1'>Web Price</th>
                      <th className='border border-black p-1'>Store Price</th>
                      <th className='border border-black p-1'>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract?.items?.map((item) => {
                      const retailPrice =
                        item.variant?.price ?? item.product?.price ?? 0

                      const inventory =
                        item.variant?.storefrontInventories?.[0] ??
                        item.product?.storefrontInventories?.[0]
                      const currentStock = inventory?.stockQuantity ?? 0
                      const displayQty = totals.isAdjustmentOnly
                        ? currentStock
                        : item.quantity

                      const itemSubtotal = Number(item.agreedPrice) * displayQty

                      return (
                        <tr key={item.id}>
                          <td className='border border-black p-1'>
                            {item?.productName}
                          </td>
                          <td className='border border-black p-1 text-center uppercase'>
                            {item?.variant?.name ?? '-'}
                          </td>
                          <td className='border border-black p-1 text-center'>
                            {formatNumber(displayQty)}
                          </td>
                          <td className='border border-black p-1 text-right line-through'>
                            {formatNumber(retailPrice)}
                          </td>
                          <td className='border border-black p-1 text-right'>
                            {formatNumber(item?.agreedPrice)}
                          </td>
                          <td className='border border-black p-1 text-right'>
                            {formatNumber(itemSubtotal)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className='font-bold'>
                    <tr>
                      <td
                        className='border border-black p-1 text-right uppercase'
                        colSpan={5}
                      >
                        Total Retail Value (Web Price)
                      </td>
                      <td className='border border-black p-1 text-right'>
                        {formatCurrency(totals.retailTotal)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className='border border-black p-1 text-right uppercase'
                        colSpan={5}
                      >
                        {totals.isAdjustmentOnly
                          ? 'Total Consignment Value'
                          : 'Grand Total (Store Price)'}
                      </td>
                      <td className='border border-black p-1 text-right'>
                        {formatCurrency(totals.agreedTotal)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className='border border-black p-1 text-right uppercase'
                        colSpan={5}
                      >
                        Consignee Potential Profit (Margin)
                      </td>
                      <td className='border border-black p-1 text-right'>
                        {formatCurrency(totals.potentialProfit)}
                      </td>
                    </tr>

                    <tr className='text-[10px]'>
                      <td
                        className='border border-black p-1 text-center text-red-500'
                        colSpan={6}
                      >
                        {totals.isAdjustmentOnly &&
                          '* This contract is for price adjustment of existing store items based on current stock levels. / สัญญานี้ใช้สำหรับการปรับราคาขายของสินค้าคงเหลือในร้านตามจำนวนสต็อกปัจจุบัน / '}
                        The consignee has inspected and verified the condition
                        and quantity of the consigned goods. The consignee
                        agrees to be responsible for any damage that may occur
                        thereafter. /
                        ผู้รับฝากได้ตรวจสอบสภาพและจำนวนสินค้าฝากขายเป็นที่เรียบร้อยแล้ว
                        ผู้รับฝากยินยอมรับผิดชอบหากเกิดสภาพเสียหายภายหลัง
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <section className='mb-4'>
                  <p className='text-justify'>
                    The ownership of the goods subject to the consignment
                    belongs to the consignor until these goods are sold and the
                    ownership passes to the third party. The Consignee agrees
                    and undertakes that it only has possession on the consigned
                    commodities. The Consignor grants the Consignee the right to
                    sell the consigned commodities on behalf of the Consignor.
                    The Consignee is likewise granted the right to display and
                    sell the consigned commodities in a way the Consignee finds
                    it deemed best for consigned commodities to possibly be
                    sold, but nonetheless in accordance with the terms and
                    conditions specified in this Agreement.
                  </p>
                </section>
              </div>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>3. Price and Payment</h3>
                <p className='text-justify'>
                  The Consignee may freely determine the selling price of the
                  consigned commodities under this Agreement. However, the
                  suggested selling prices for the consigned commodities are
                  indicated in the chart (Table 1) above. Any amount received
                  from the sale of a consigned commodity above the applicable
                  minimum price shall belong to the Consignee. If any consigned
                  commodity is sold below the indicated minimum price, the
                  Consignee shall be responsible for paying the Consignor the
                  difference between the actual selling price and the minimum
                  price specified in this Agreement. Prices will be reviewed
                  every three months. If there are no changes, the current
                  pricing will remain applicable as usual.
                </p>
                <p className='text-justify'>
                  The Consignee shall remit payment to the Consignor for all
                  goods sold on or before the 15th day of each month. Upon
                  receipt of such payment, the Consignor shall replenish the
                  sold items in order to restore the Consignee’s inventory to
                  the quantities set forth in Table 1.
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>4. Insurance</h3>
                <p className='text-justify'>
                  Consignee shall maintain insurance coverage that shall be
                  sufficient to compensate the Consignor in the event of fire,
                  damage, robbery, theft, or otherwise. However, the Consignor
                  is obliged to take out the appropriate insurance for any
                  damage or loss that may occur during transportation.
                  Otherwise, the Consignor will be responsible for the loss and
                  damage that occurred during transportation.
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>
                  5. Return or Switch of Unsold Goods
                </h3>
                <p className='text-justify'>
                  On the 15th day of each month, the Consignee shall have the
                  option to return or substitute any unsold consigned products
                  with other products that the Consignee reasonably believes
                  will sell more effectively. Any such return or substitution
                  must be notified to the Consignor in writing no later than the
                  15th day of the applicable month and completed within seven
                  (7) days thereafter.
                </p>
                <p className='text-justify'>
                  All returned products must be unused, undamaged, unaltered,
                  and in their original packaging, in a condition suitable for
                  resale. The Consignor reserves the right to inspect all
                  returned products and to reject any items that do not meet
                  these conditions.
                </p>
                <p className='text-justify'>
                  he total monetary value of the substitute products shall be
                  equal to the total monetary value of the products returned or
                  substituted, as calculated based on the minimum prices
                  specified in this Agreement (TABLE 1). Any discrepancy in
                  value shall be settled by the Consignee prior to shipment of
                  the substitute products.
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>6. Delivery Expenses</h3>
                <p className='text-justify'>
                  The Consignor shall bear the cost of shipping expenses for the
                  delivery of the consigned commodities. In the case of the
                  return of the unsold goods, the shipping expenses are borne
                  for shopping expenses in Returns.
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>7. Warranty of Goods</h3>
                <p className='text-justify'>
                  The Consignor warrants that all goods supplied under this
                  Agreement conform to the specifications requested by the
                  Consignee, are fit for their intended purpose, are of good
                  material and workmanship, and are free from defects. The
                  warranty period may vary by product, as specified by the
                  Consignor. The Consignor further warrants that all products
                  are new, unused, and of the latest model or manufacture
                  available at the time of delivery.
                </p>
                <p className='text-justify'>
                  Upon receipt of the goods, the Consignee shall promptly
                  inspect the goods for any visible defects or damage, including
                  damage that may have occurred during transportation. The
                  Consignee shall notify the Consignor in writing without undue
                  delay upon discovery of any such defects or damage.
                </p>
                <p className='text-justify'>
                  Upon receipt of such notice, the Consignee may, subject to the
                  Consignor’s confirmation, request replacement of the defective
                  or damaged goods with conforming goods at no additional cost,
                  or request an appropriate price reduction or discount.
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>
                  8. Termination of the Agreement
                </h3>
                <p className='text-justify'>
                  This Agreement has been concluded for an indefinite period and
                  can be terminated without penalty by a written notice of 30
                  days by either party. The parties may terminate the contract
                  immediately by written agreement. In this case, the provisions
                  regarding the payment obligation and the return of the goods
                  shall be applied after the termination of the Agreement. If
                  one of the parties fails to fulfill its obligations under this
                  Agreement, the other party may terminate the contract with 30
                  days for Notification.
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>9. Force Majeure</h3>
                <p className='text-justify'>
                  In no event shall the parties be responsible or liable for any
                  failure or delay in the performance of its obligations under
                  this Agreement arising out of or caused by, directly or
                  indirectly, forces beyond its reasonable control, including
                  without limitation strikes, work stoppages, accidents, acts of
                  war or terrorism, civil or military disturbances, nuclear or
                  natural catastrophes or acts of God, and interruptions, loss
                  or malfunctions of utilities, communications or
                  computer(software or hardware) services.
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>10. Confidentiality</h3>
                <p className='text-justify'>
                  The Parties acknowledge that the existence and the terms of
                  this Agreement and any oral or written information exchanged
                  between the Parties in connection with the preparation and
                  performance of this Agreement are regarded as confidential
                  information. Each Party shall maintain confidentiality of all
                  such confidential information, and without obtaining the
                  written consent of the other Party, it shall not disclose any
                  relevant confidential information to any third parties, except
                  for the information that: (a) is or will be in the public
                  domain (other than through the receiving Party’s unauthorized
                  disclosure); (b) is under the obligation to be disclosed
                  pursuant to the applicable laws or regulations, rules of any
                  stock exchange, or orders of the court or other government
                  authorities; or (c) is required to be disclosed by any Party
                  to its shareholders, investors, legal counsels or financial
                  advisors regarding the transaction contemplated hereunder,
                  provided that such shareholders, investors, legal counsels or
                  financial advisors shall be bound by the confidentiality
                  obligations similar to those set forth in this Section.
                </p>
                <p className='text-justify'>
                  Disclosure of any confidential information by the staff
                  members or agencies hired by any Party shall be deemed
                  disclosure of such confidential information by such Party,
                  which Party shall be held liable for breach of this Agreement.
                  This Section shall survive the termination of this Agreement
                  for any reason.
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>11. Miscellaneous</h3>
                <p className='text-justify'>
                  Notifications - Any notifications to be sent under this
                  Agreement shall be sent to a party attending the respective
                  address indicated in this Agreement.
                </p>
                <p className='text-justify'>
                  Entire Agreement - This Agreement constitutes the complete
                  understanding of the parties to this Agreement regarding the
                  subject matter contained in this Agreement and supersedes any
                  and all other agreements or arrangements, either oral or in
                  written.
                </p>
                <p className='text-justify'>
                  Severability - In case any provision in this Agreement shall
                  be invalid, illegal or unenforceable, the validity, legality
                  and enforceability of the remaining provisions shall not in
                  any way be affected or impaired thereby and such provision
                  shall be ineffective only to the extent of such invalidity,
                  illegality or unenforceability.
                </p>
                <p className='text-justify'>
                  Assignment - Neither this Agreement nor any of the rights,
                  interests or obligations hereunder shall be assigned by any of
                  the parties hereto (whether by operation of law or
                  otherwise)without the prior written consent of the other
                  parties. Subject to the preceding sentence, this Agreement
                  will be binding upon, inure to the benefit of and be
                  enforceable by the parties and their respective successors and
                  assigns.
                </p>
                <p className='text-justify'>
                  Amendments - Any amendments or variation to this Agreement
                  shall be in writing with the mutual consent of both parties.
                  Governing Law and Dispute Resolution - The assigns.
                </p>
                <p className='text-justify'>
                  execution, effectiveness, construction ,performance, amendment
                  and termination of this Agreement and the resolution of
                  disputes hereunder shall be governed by the formally published
                  and publicly available laws of the State of Thai Kingdom.
                </p>
                <p className='text-justify'>
                  IN WITNESS WHEREOF, the Parties hereunto has executed this
                  Agreement, on the day and year set forth below.
                </p>
              </section>
            </div>

            <div className='mx-auto max-w-[210mm] bg-white p-[20mm] font-sans text-[14px] leading-relaxed text-black shadow-lg'>
              <h1 className='mb-6 text-center text-xl font-bold'>
                ข้อตกลงการฝากขาย
              </h1>

              <section className='mb-4'>
                <h2 className='mb-2 border-b border-black pb-1 font-bold'>
                  1. คู่สัญญา
                </h2>
                <p className='text-justify'>
                  ข้อตกลงการฝากขายฉบับนี้ (“ข้อตกลง”)
                  ทำขึ้นและเริ่มมีผลตั้งแต่วันที่{' '}
                  {formatDate(contract?.startDate, 'th', 'date')} โดยและระหว่าง:
                </p>
                <p className='mt-2'>
                  <strong>บริษัท FAOS ASIA</strong>{' '}
                  ซึ่งเป็นนิติบุคคลที่จัดตั้งขึ้นและดำรงอยู่ตามกฎหมายของประเทศไทย
                  มีสถานที่ประกอบการหลักอยู่ที่ 333/253 ซอยฉลองกรุง 44
                  แขวงลำปลาทิว เขตลาดกระบัง กรุงเทพมหานคร 10520 ประเทศไทย
                  (ซึ่งต่อไปนี้จะเรียกว่า <strong>“ผู้ฝากขาย”</strong>) และ
                </p>
                <p className='mt-2'>
                  <strong>{contract?.storefront?.name}</strong>{' '}
                  ซึ่งเป็นนิติบุคคลที่จัดตั้งขึ้นและดำรงอยู่ตามกฎหมายของประเทศไทย
                  มีสถานที่ประกอบการหลักอยู่ที่ {contract?.storefront?.address}{' '}
                  (ซึ่งต่อไปนี้จะเรียกว่า <strong>“ผู้รับฝากขาย”</strong>)
                </p>
              </section>

              <section className='mb-4'>
                <p className='mb-2'>
                  เนื่องจาก ผู้ฝากขายเป็นเจ้าของกรรมสิทธิ์ในสินค้าที่นำมาฝากขาย
                  ซึ่งจะมีการระบุรายละเอียดไว้ด้านล่างนี้
                </p>
                <p className='mb-2'>
                  เนื่องจาก ผู้รับฝากขายประสงค์จะรับสินค้าที่ฝากขายไว้ในครอบครอง
                  โดยมีเจตนาที่จะจำหน่ายสินค้าในนามของผู้ฝากขาย
                </p>
                <p>
                  ดังนั้น
                  เพื่อเป็นการตอบแทนผลประโยชน์และคำมั่นสัญญาที่ให้ไว้แก่กันของคู่สัญญาในที่นี้
                  ผู้ฝากขายและผู้รับฝากขาย (ซึ่งเรียกว่า “คู่สัญญา”
                  ในกรณีอ้างถึงแต่ละฝ่าย และเรียกว่า “คู่สัญญาทั้งสองฝ่าย”
                  ในกรณีอ้างถึงรวมกัน) จึงตกลงและรับรองดังต่อไปนี้:
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>2. ก) สินค้าฝากขาย</h3>
                <p>
                  รายการและข้อมูลราคาของสินค้าฝากขาย (หรือจะเรียกว่า "สินค้า")
                  ที่อยู่ภายใต้การฝากขายนี้ แสดงอยู่ใน{' '}
                  <span className='font-bold underline'>ตารางที่ 1</span>{' '}
                  ด้านล่างนี้
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>
                  ข) ความพร้อมของสินค้าและการผลิตจำนวนจำกัด
                </h3>
                <ul className='list-disc pl-5'>
                  <li>
                    ผู้รับฝากขายรับทราบว่าผลิตภัณฑ์บางรายการที่จัดส่งภายใต้ข้อตกลงนี้มีการผลิตในจำนวนจำกัด
                    ดังนั้นอาจเกิดการขาดแคลนหรือไม่มีสินค้าชั่วคราวได้
                  </li>
                  <li>
                    ผู้ฝากขายไม่รับประกันความพร้อมของสินค้าอย่างต่อเนื่องสำหรับผลิตภัณฑ์ทั้งหมดที่ระบุไว้ในข้อตกลงนี้
                  </li>
                  <li>
                    ในวันที่ 15 ของทุกเดือน
                    ผู้ฝากขายจะต้องแจ้งให้ผู้รับฝากขายทราบเป็นลายลักษณ์อักษรถึงสถานะความพร้อมของสินค้าแต่ละรายการ
                    รวมถึงการคาดการณ์สินค้าขาดแคลนหรือการยกเลิกการผลิต
                  </li>
                  <li>
                    ผู้ฝากขายจะใช้ความพยายามอย่างสมเหตุสมผลในการเติมสินค้าตามคำสั่งซื้อ
                    โดยขึ้นอยู่กับความพร้อมของสินค้าในขณะนั้น
                  </li>
                </ul>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>
                  ค) การตรวจสอบและการรับมอบสินค้า
                </h3>
                <p className='text-justify'>
                  ในการส่งมอบ การเติมสินค้า การเปลี่ยนใหม่
                  หรือการเพิ่มสต็อกของผลิตภัณฑ์น้ำผึ้งและน้ำมันมะกอกใดๆ
                  ที่จัดส่งภายใต้ข้อตกลงนี้
                  จะต้องมีการตรวจสอบร่วมกันโดยตัวแทนที่ได้รับมอบอำนาจจากทั้งฝ่ายผู้จัดจำหน่ายและ{' '}
                  {contract?.storefront?.name}{' '}
                  โดยการตรวจสอบนี้จะครอบคลุมถึงทุกกล่องและทุกหน่วยสินค้าที่นำมาส่งมอบหรือนำเข้ามาในพื้นที่ของ{' '}
                  {contract?.storefront?.name}
                </p>
                <p className='mt-2 text-justify'>
                  การตรวจสอบร่วมกันจะดำเนินการตรวจสอบอย่างน้อยในเรื่องของ จำนวน,
                  ความสมบูรณ์ของบรรจุภัณฑ์, ฉลากสินค้า, เลขที่ชุดการผลิต (Batch
                  numbers), วันหมดอายุ, สภาพการจัดเก็บ
                  และคุณภาพโดยรวมของผลิตภัณฑ์
                  เพื่อให้แน่ใจว่าเป็นไปตามคุณลักษณะและมาตรฐานที่ตกลงกันไว้ในข้อตกลงนี้ทุกประการ
                </p>
                <p className='mt-2 text-justify'>
                  เฉพาะผลิตภัณฑ์ที่ผ่านการตรวจสอบร่วมกันโดยสมบูรณ์เท่านั้นที่จะได้รับการยอมรับเข้าสู่สต็อกสินค้าฝากขาย
                  การจัดแสดง การจัดเก็บ หรือการวางจำหน่ายโดย{' '}
                  {contract?.storefront?.name}{' '}
                  หากพบผลิตภัณฑ์ใดที่ได้รับความเสียหาย มีร่องรอยการแกะ
                  สิ้นอายุการใช้งาน ติดฉลากไม่ถูกต้อง มีการรั่วซึม
                  หรือไม่เป็นไปตามข้อกำหนดในลักษณะอื่น
                  จะต้องมีการบันทึกไว้และไม่นับรวมเข้าในสต็อกสินค้าฝากขาย
                  และจะต้องดำเนินการเปลี่ยนใหม่ ให้เครดิตคืน
                  หรือนำออกไปโดยเป็นความรับผิดชอบของผู้จัดจำหน่าย
                  ตามที่ได้ตกลงกันเป็นลายลักษณ์อักษร
                </p>
                <p className='mt-2 text-justify'>
                  การตอบรับสินค้าหลังจากการตรวจสอบร่วมกัน
                  ไม่ถือเป็นการสละสิทธิ์ของ {contract?.storefront?.name}
                  ในการยกประเด็นเรื่องคุณภาพหรือการไม่ปฏิบัติตามข้อกำหนดที่อาจตรวจพบในภายหลังระหว่างการจัดเก็บหรือการวางจำหน่าย
                </p>
              </section>

              <div className='mb-6 overflow-x-auto'>
                <p className='mb-1 font-bold'>ตารางที่ 1</p>
                <table className='w-full border-collapse border border-black text-[11px]'>
                  <thead>
                    <tr className='bg-gray-100'>
                      <th className='border border-black p-1 text-left'>
                        สินค้า
                      </th>
                      <th className='border border-black p-1'>ขนาด</th>
                      <th className='border border-black p-1'>
                        {totals.isAdjustmentOnly
                          ? 'จำนวนสต็อกปัจจุบัน'
                          : 'จำนวนที่โอน'}
                      </th>
                      <th className='border border-black p-1'>ราคาหน้าเว็บ</th>
                      <th className='border border-black p-1'>ราคาหน้าร้าน</th>
                      <th className='border border-black p-1'>ยอดรวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract?.items?.map((item) => {
                      const retailPrice = Number(
                        item.variant?.price ?? item.product?.price ?? 0,
                      )

                      const inventory =
                        item.variant?.storefrontInventories?.[0] ??
                        item.product?.storefrontInventories?.[0]
                      const currentStock = inventory?.stockQuantity ?? 0

                      const displayQty = totals.isAdjustmentOnly
                        ? currentStock
                        : item.quantity
                      const lineTotal = Number(item.agreedPrice) * displayQty

                      return (
                        <tr key={item.id}>
                          <td className='border border-black p-1'>
                            {item?.productName}
                          </td>
                          <td className='border border-black p-1 text-center uppercase'>
                            {item?.variant?.name ?? '-'}
                          </td>
                          <td className='border border-black p-1 text-center'>
                            {formatNumber(displayQty)}
                          </td>
                          <td className='border border-black p-1 text-right line-through'>
                            {formatNumber(retailPrice)}
                          </td>
                          <td className='border border-black p-1 text-right'>
                            {formatNumber(item?.agreedPrice)}
                          </td>
                          <td className='border border-black p-1 text-right'>
                            {formatNumber(lineTotal)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className='font-bold'>
                    <tr>
                      <td
                        className='border border-black p-1 text-right'
                        colSpan={5}
                      >
                        มูลค่ารวมตามราคาหน้าเว็บ (Web Price)
                      </td>
                      <td className='border border-black p-1 text-right'>
                        {formatCurrency(totals.retailTotal)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className='border border-black p-1 text-right'
                        colSpan={5}
                      >
                        {totals.isAdjustmentOnly
                          ? 'มูลค่ารวมราคาส่งฝากขาย'
                          : 'ยอดรวมสุทธิ (ราคาหน้าร้าน)'}
                      </td>
                      <td className='border border-black p-1 text-right'>
                        {formatCurrency(totals.agreedTotal)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className='border border-black p-1 text-right'
                        colSpan={5}
                      >
                        กำไรส่วนต่างประมาณการของร้าน (Margin)
                      </td>
                      <td className='border border-black p-1 text-right'>
                        {formatCurrency(totals.potentialProfit)}
                      </td>
                    </tr>
                    <tr className='text-[10px]'>
                      <td
                        className='border border-black p-1 text-center text-red-500'
                        colSpan={6}
                      >
                        {totals.isAdjustmentOnly &&
                          '* This contract is for price adjustment of existing store items based on current stock levels. / สัญญานี้ใช้สำหรับการปรับราคาขายของสินค้าคงเหลือในร้านตามจำนวนสต็อกปัจจุบัน / '}
                        The consignee has inspected and verified the condition
                        and quantity of the consigned goods. The consignee
                        agrees to be responsible for any damage that may occur
                        thereafter. /
                        ผู้รับฝากได้ตรวจสอบสภาพและจำนวนสินค้าฝากขายเป็นที่เรียบร้อยแล้ว
                        ผู้รับฝากยินยอมรับผิดชอบหากเกิดสภาพเสียหายภายหลัง
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <section className='mb-4'>
                  <p className='text-justify'>
                    กรรมสิทธิ์ในสินค้าที่ฝากขายยังคงเป็นของผู้ฝากขายจนกว่าสินค้านั้นจะถูกจำหน่ายออกไปและกรรมสิทธิ์จะถูกโอนไปยังบุคคลที่สาม
                    ผู้รับฝากขายตกลงและรับรองว่าตนเป็นเพียงผู้ครอบครองสินค้าที่ฝากขายเท่านั้น
                    ผู้ฝากขายมอบสิทธิให้แก่ผู้รับฝากขายในการจำหน่ายสินค้าที่ฝากขายในนามของผู้ฝากขาย
                    รวมถึงผู้รับฝากขายได้รับสิทธิในการจัดแสดงและจำหน่ายสินค้าที่ฝากขายในรูปแบบที่ผู้รับฝากขายเห็นสมควรว่าดีที่สุดเพื่อให้สินค้ามีโอกาสถูกจำหน่ายได้
                    แต่ทั้งนี้ต้องเป็นไปตามข้อกำหนดและเงื่อนไขที่ระบุไว้ในข้อตกลงฉบับนี้
                  </p>
                </section>
              </div>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>3. ราคาและการชำระเงิน</h3>
                <p className='text-justify'>
                  ผู้รับฝากขายสามารถกำหนดราคาขายของสินค้าที่ฝากขายภายใต้ข้อตกลงนี้ได้อย่างอิสระ
                  อย่างไรก็ตาม ราคาขายแนะนำสำหรับสินค้าฝากขายได้ระบุไว้ในแผนภูมิ
                  (ตารางที่ 1) ข้างต้น จำนวนเงินใดๆ
                  ที่ได้รับจากการขายสินค้าฝากขายที่สูงกว่าราคาขั้นต่ำที่กำหนดให้เป็นของผู้รับฝากขาย
                  หากสินค้าฝากขายใดถูกขายในราคาที่ต่ำกว่าราคาขั้นต่ำที่ระบุไว้
                  ผู้รับฝากขายจะต้องรับผิดชอบในการชำระส่วนต่างระหว่างราคาขายจริงและราคาขั้นต่ำที่ระบุไว้ในข้อตกลงนี้ให้แก่ผู้ฝากขาย
                  ทั้งนี้จะมีการทบทวนราคาในทุกๆ สามเดือน หากไม่มีการเปลี่ยนแปลง
                  ให้ใช้ราคาปัจจุบันต่อไปตามปกติ
                </p>
                <p className='text-justify'>
                  ผู้รับฝากขายจะต้องนำส่งชำระเงินให้แก่ผู้ฝากขายสำหรับสินค้าทั้งหมดที่ขายได้ภายในหรือก่อนวันที่
                  15 ของทุกเดือน เมื่อได้รับชำระเงินดังกล่าวแล้ว
                  ผู้ฝากขายจะต้องดำเนินการเติมสินค้าที่ขายไปเพื่อรักษาระดับสินค้าคงคลังของผู้รับฝากขายให้เป็นไปตามจำนวนที่ระบุไว้ในตารางที่
                  1
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>4. การประกันภัย</h3>
                <p className='text-justify'>
                  ผู้รับฝากขายจะต้องจัดให้มีการประกันภัยที่เพียงพอเพื่อชดเชยให้แก่ผู้ฝากขายในกรณีที่เกิดอัคคีภัย
                  ความเสียหาย การชิงทรัพย์ การลักทรัพย์ หรือเหตุอื่นๆ
                  อย่างไรก็ตาม
                  ผู้ฝากขายมีหน้าที่ต้องทำประกันภัยที่เหมาะสมสำหรับความเสียหายหรือความสูญเสียใดๆ
                  ที่อาจเกิดขึ้นระหว่างการขนส่ง มิฉะนั้น
                  ผู้ฝากขายจะต้องเป็นผู้รับผิดชอบต่อความสูญเสียและความเสียหายที่เกิดขึ้นระหว่างการขนส่งนั้นเอง
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>
                  5. การคืนหรือการเปลี่ยนสินค้าที่ขายไม่ได้
                </h3>
                <p className='text-justify'>
                  ในวันที่ 15 ของทุกเดือน
                  ผู้รับฝากขายมีสิทธิ์ในการคืนหรือเปลี่ยนสินค้าที่ฝากขายซึ่งยังคงค้างอยู่
                  ด้วยสินค้าชนิดอื่นที่ผู้รับฝากขายเชื่อโดยสมเหตุสมผลว่าจะสามารถขายได้มีประสิทธิภาพมากกว่า
                  การคืนหรือการเปลี่ยนสินค้าดังกล่าวจะต้องแจ้งให้ผู้ฝากขายทราบเป็นลายลักษณ์อักษรไม่เกินวันที่
                  15 ของเดือนนั้นๆ และดำเนินการให้แล้วเสร็จภายในเจ็ด (7)
                  วันหลังจากนั้น
                </p>
                <p className='text-justify'>
                  สินค้าที่ส่งคืนทั้งหมดต้องอยู่ในสภาพที่ยังไม่ได้ใช้งาน
                  ไม่เสียหาย ไม่มีการดัดแปลง และอยู่ในบรรจุภัณฑ์เดิม
                  ในสภาพที่เหมาะสมสำหรับการนำไปจำหน่ายต่อ
                  ทั้งนี้ผู้ฝากขายขอสงวนสิทธิ์ในการตรวจสอบสินค้าที่ส่งคืนทั้งหมด
                  และมีสิทธิ์ปฏิเสธสินค้าใดๆ ที่ไม่เป็นไปตามเงื่อนไขเหล่านี้
                </p>
                <p className='text-justify'>
                  มูลค่ารวมของสินค้าที่นำมาเปลี่ยนทดแทนจะต้องเท่ากับมูลค่ารวมของสินค้าที่ส่งคืนหรือถูกเปลี่ยน
                  โดยคำนวณจากราคาขั้นต่ำที่ระบุไว้ในข้อตกลงนี้ (ตารางที่ 1)
                  หากมีความแตกต่างของมูลค่าเกิดขึ้น
                  ผู้รับฝากขายจะต้องชำระส่วนต่างให้เรียบร้อยก่อนการจัดส่งสินค้าทดแทน
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>6. ค่าใช้จ่ายในการจัดส่ง</h3>
                <p className='text-justify'>
                  ผู้ฝากขายจะเป็นผู้รับภาระค่าใช้จ่ายในการจัดส่งสินค้าที่ฝากขาย
                  ในกรณีที่มีการคืนสินค้าที่ขายไม่ได้
                  ค่าใช้จ่ายในการจัดส่งคืนให้เป็นไปตามภาระค่าใช้จ่ายในการส่งคืนสินค้า
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>7. การรับประกันสินค้า</h3>
                <p className='text-justify'>
                  ผู้ฝากขายรับรองว่าสินค้าทั้งหมดที่จัดส่งภายใต้ข้อตกลงนี้เป็นไปตามคุณลักษณะที่ผู้รับฝากขายร้องขอ
                  มีความเหมาะสมกับวัตถุประสงค์ในการใช้งาน
                  มีวัสดุและฝีมือการผลิตที่ดี และปราศจากข้อบกพร่อง
                  ระยะเวลาการรับประกันอาจแตกต่างกันไปตามประเภทสินค้าตามที่ผู้ฝากขายระบุ
                  นอกจากนี้ ผู้ฝากขายขอรับรองว่าผลิตภัณฑ์ทั้งหมดเป็นของใหม่
                  ยังไม่ผ่านการใช้งาน และเป็นรุ่นล่าสุดหรือมีการผลิตล่าสุด ณ
                  เวลาที่ส่งมอบ
                </p>
                <p className='text-justify'>
                  เมื่อได้รับสินค้า
                  ผู้รับฝากขายจะต้องตรวจสอบสินค้าโดยทันทีเพื่อหาข้อบกพร่องหรือความเสียหายที่มองเห็นได้
                  รวมถึงความเสียหายที่อาจเกิดขึ้นระหว่างการขนส่ง
                  ผู้รับฝากขายจะต้องแจ้งให้ผู้ฝากขายทราบเป็นลายลักษณ์อักษรโดยไม่ชักช้าเมื่อตรวจพบข้อบกพร่องหรือความเสียหายดังกล่าว
                </p>
                <p className='text-justify'>
                  เมื่อได้รับแจ้งดังกล่าว
                  ผู้รับฝากขายอาจร้องขอให้มีการเปลี่ยนสินค้าที่ชำรุดหรือเสียหายด้วยสินค้าที่ถูกต้องโดยไม่มีค่าใช้จ่ายเพิ่มเติม
                  หรือร้องขอส่วนลดราคาที่เหมาะสม
                  ทั้งนี้ขึ้นอยู่กับการยืนยันของผู้ฝากขาย
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>8. การสิ้นสุดข้อตกลง</h3>
                <p className='text-justify'>
                  ข้อตกลงนี้ทำขึ้นโดยไม่มีกำหนดระยะเวลา
                  และสามารถยกเลิกได้โดยไม่มีค่าปรับด้วยการแจ้งเป็นลายลักษณ์อักษรล่วงหน้า
                  30 วันโดยฝ่ายใดฝ่ายหนึ่ง
                  คู่สัญญาอาจยกเลิกสัญญาได้ทันทีโดยความเห็นชอบร่วมกันเป็นลายลักษณ์อักษร
                  ในกรณีนี้ให้นำบทบัญญัติเกี่ยวกับการชำระเงินและการคืนสินค้ามาใช้บังคับหลังจากสิ้นสุดข้อตกลง
                  หากฝ่ายใดฝ่ายหนึ่งไม่ปฏิบัติตามภาระผูกพันภายใต้ข้อตกลงนี้
                  อีกฝ่ายหนึ่งอาจยกเลิกสัญญาได้โดยการแจ้งให้ทราบล่วงหน้า 30 วัน
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>9. เหตุสุดวิสัย</h3>
                <p className='text-justify'>
                  คู่สัญญาไม่ต้องรับผิดชอบต่อความล้มเหลวหรือความล่าช้าในการปฏิบัติตามภาระผูกพันภายใต้ข้อตกลงนี้
                  อันเกิดจากหรือมีสาเหตุมาจากปัจจัยภายนอกที่อยู่เหนือการควบคุมโดยสมเหตุสมผล
                  ไม่ว่าโดยตรงหรือโดยอ้อม ซึ่งรวมถึงแต่ไม่จำกัดเพียง
                  การนัดหยุดงาน การหยุดงานประท้วง อุบัติเหตุ
                  การก่อสงครามหรือการก่อการร้าย ความไม่สงบของพลเรือนหรือฝ่ายทหาร
                  ภัยพิบัติทางนิวเคลียร์หรือภัยธรรมชาติ
                  หรือเหตุสุดวิสัยจากธรรมชาติ ตลอดจนการขัดข้อง การสูญเสีย
                  หรือการทำงานผิดปกติของระบบสาธารณูปโภค การสื่อสาร
                  หรือบริการคอมพิวเตอร์ (ซอฟต์แวร์หรือฮาร์ดแวร์)
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>10. การรักษาความลับ</h3>
                <p className='text-justify'>
                  คู่สัญญาทั้งสองฝ่ายรับทราบว่าการมีอยู่และข้อกำหนดของข้อตกลงนี้
                  รวมถึงข้อมูลทางวาจาหรือลายลักษณ์อักษรใดๆ
                  ที่มีการแลกเปลี่ยนระหว่างคู่สัญญาที่เกี่ยวข้องกับการจัดทำและการปฏิบัติตามข้อตกลงนี้
                  ถือเป็นข้อมูลลับ
                  คู่สัญญาแต่ละฝ่ายต้องรักษาความลับของข้อมูลลับดังกล่าวทั้งหมด
                  และหากไม่ได้รับความยินยอมเป็นลายลักษณ์อักษรจากอีกฝ่ายหนึ่ง
                  ฝ่ายนั้นจะไม่เปิดเผยข้อมูลลับที่เกี่ยวข้องใดๆ แก่บุคคลที่สาม
                  ยกเว้นข้อมูลที่: (ก) เป็นหรือจะกลายเป็นข้อมูลสาธารณะ
                  (นอกเหนือจากการเปิดเผยโดยไม่ได้รับอนุญาตของฝ่ายที่ได้รับข้อมูล)
                  (ข)
                  อยู่ภายใต้ภาระผูกพันที่ต้องเปิดเผยตามกฎหมายหรือระเบียบข้อบังคับที่เกี่ยวข้อง
                  กฎเกณฑ์ของตลาดหลักทรัพย์ หรือคำสั่งศาลหรือหน่วยงานรัฐบาลอื่นๆ
                  หรือ (ค)
                  ข้อมูลที่คู่สัญญาฝ่ายใดฝ่ายหนึ่งจำเป็นต้องเปิดเผยแก่ผู้ถือหุ้น
                  นักลงทุน ที่ปรึกษากฎหมาย หรือที่ปรึกษาทางการเงิน
                  เกี่ยวกับธุรกรรมที่ระบุไว้ในที่นี้ โดยมีเงื่อนไขว่าผู้ถือหุ้น
                  นักลงทุน ที่ปรึกษากฎหมาย
                  หรือที่ปรึกษาทางการเงินดังกล่าวจะต้องผูกพันตามภาระผูกพันในการรักษาความลับเช่นเดียวกับที่ระบุไว้ในส่วนนี้
                </p>
                <p className='text-justify'>
                  การเปิดเผยข้อมูลลับใดๆ
                  โดยพนักงานหรือหน่วยงานที่ว่าจ้างโดยคู่สัญญาฝ่ายใดฝ่ายหนึ่ง
                  ให้ถือเป็นการเปิดเผยข้อมูลลับโดยคู่สัญญาฝ่ายนั้น
                  ซึ่งคู่สัญญาฝ่ายดังกล่าวจะต้องรับผิดชอบต่อการละเมิดข้อตกลงนี้
                  ทั้งนี้
                  ข้อกำหนดในส่วนนี้จะยังคงมีผลใช้บังคับต่อไปแม้ข้อตกลงนี้จะสิ้นสุดลงไม่ว่าด้วยเหตุผลใดก็ตาม
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>11. ข้อกำหนดอื่นๆ</h3>
                <p className='text-justify'>
                  การแจ้งเตือน - การแจ้งเตือนใดๆ
                  ภายใต้ข้อตกลงนี้จะต้องส่งไปยังคู่สัญญาตามที่อยู่ที่ระบุไว้ในข้อตกลงนี้
                </p>
                <p className='text-justify'>
                  ข้อตกลงที่สมบูรณ์ -
                  ข้อตกลงนี้ถือเป็นความเข้าใจที่สมบูรณ์ของคู่สัญญาในเรื่องที่ระบุไว้ในข้อตกลงนี้
                  และให้มีผลเหนือกว่าข้อตกลงหรือการจัดเตรียมอื่นๆ ทั้งหมด
                  ไม่ว่าจะเป็นทางวาจาหรือลายลักษณ์อักษร
                </p>
                <p className='text-justify'>
                  การแยกส่วนของข้อตกลง -
                  ในกรณีที่ข้อกำหนดใดในข้อตกลงนี้ตกเป็นโมฆะ ไม่ชอบด้วยกฎหมาย
                  หรือไม่สามารถบังคับใช้ได้ ให้ความสมบูรณ์ ความชอบด้วยกฎหมาย
                  และการบังคับใช้ของข้อกำหนดส่วนที่เหลือไม่ได้รับผลกระทบหรือเสื่อมเสียไป
                  โดยให้ข้อกำหนดดังกล่าวนั้นไม่มีผลบังคับเฉพาะในส่วนที่เป็นโมฆะ
                  ไม่ชอบด้วยกฎหมาย หรือไม่สามารถบังคับใช้ได้เท่านั้น
                </p>
                <p className='text-justify'>
                  การโอนสิทธิ - ห้ามมิให้คู่สัญญาฝ่ายใดฝ่ายหนึ่งโอนข้อตกลงนี้
                  หรือสิทธิ ผลประโยชน์ หรือภาระผูกพันใดๆ ภายใต้ข้อตกลงนี้
                  (ไม่ว่าโดยผลของกฎหมายหรือประการอื่นใด)
                  โดยไม่ได้รับความยินยอมเป็นลายลักษณ์อักษรล่วงหน้าจากอีกฝ่ายหนึ่ง
                  ภายใต้บังคับของประโยคข้างต้น ข้อตกลงนี้จะมีผลผูกพัน
                  เป็นประโยชน์ และบังคับใช้ได้โดยคู่สัญญา
                  รวมถึงผู้สืบทอดสิทธิและผู้รับโอนสิทธิของแต่ละฝ่าย
                </p>
                <p className='text-justify'>
                  การแก้ไขเพิ่มเติม - การแก้ไขเพิ่มเติมหรือการเปลี่ยนแปลงใดๆ
                  ในข้อตกลงนี้จะต้องทำเป็นลายลักษณ์อักษรโดยความยินยอมร่วมกันของทั้งสองฝ่าย
                  กฎหมายที่ใช้บังคับและการระงับข้อพิพาท - ผู้รับโอนสิทธิ
                </p>
                <p className='text-justify'>
                  การลงนาม การมีผลบังคับใช้ การตีความ การปฏิบัติตามสัญญา
                  การแก้ไขเพิ่มเติม และการสิ้นสุดของข้อตกลงนี้
                  รวมถึงการระงับข้อพิพาทภายใต้ข้อตกลงนี้
                  ให้อยู่ภายใต้บังคับแห่งกฎหมายของราชอาณาจักรไทยที่ประกาศใช้และเผยแพร่อย่างเป็นทางการ
                </p>
                <p className='text-justify'>
                  เพื่อเป็นหลักฐานแห่งการนี้
                  คู่สัญญาทั้งสองฝ่ายจึงได้ลงนามในข้อตกลงฉบับนี้ ณ
                  วันและปีที่ระบุไว้ด้านล่าง
                </p>
              </section>

              <div className='mt-12 grid grid-cols-1 gap-10 xl:grid-cols-2'>
                <div className='w-full text-center'>
                  <p className='mb-8 font-bold'>Consignor Signature</p>
                  <div className='relative h-40 w-full border border-gray-200'>
                    <SignatureCanvas
                      ref={brandSigRef}
                      canvasProps={{
                        className:
                          'sigCanvas block pointer-events-none w-full h-full',
                      }}
                    />
                  </div>
                  <p className='mt-2 text-left text-[12px]'>
                    Printed Name: Ms. Patcharin Chanaphukdee
                  </p>
                  <p className='text-left text-[12px]'>
                    Siam10 Inc.333/253 Chalongkrung Soi 44 LadkrabangLamplatiew,
                    Ladkrabang, Bangkok 10520 Thailand
                  </p>
                  <p className='text-left text-[12px]'>Title: Owner</p>
                  <p className='text-left text-[12px]'>
                    Date: {formatDate(contract?.createdAt, 'th', 'numeric')}
                  </p>
                </div>

                <div className='w-full text-center'>
                  <p className='mb-8 font-bold'>Consignee Signature</p>
                  <div className='relative h-40 w-full border border-gray-200'>
                    <SignatureCanvas
                      ref={storeSigRef}
                      canvasProps={{
                        className: cn(
                          `sigCanvas block size-full cursor-crosshair`,
                          !ContractModalDraft && 'pointer-events-none',
                        ),
                      }}
                      maxWidth={3}
                      minWidth={1.5}
                      penColor='black'
                    />
                  </div>
                  <p className='mt-2 text-left text-[12px]'>
                    Printed Name:{' '}
                    {contract?.storefront?.managers
                      ?.map((item) => item?.name)
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  <p className='text-left text-[12px]'>
                    {contract?.storefront?.address}
                  </p>
                  <p className='text-left text-[12px]'>Title: Director</p>
                  <p className='text-left text-[12px]'>
                    Date:{' '}
                    {formatDate(new Date().toISOString(), 'th', 'numeric')}
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className='border-default-100 flex flex-wrap items-center border-t p-4'>
            <Button size='lg' variant='faded' onPress={onClose}>
              ปิดหน้าต่าง
            </Button>
            {ContractModalDraft && (
              <>
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
                    isUpdatingStatus &&
                    pendingStatus === ContractStatus.TERMINATED
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
              </>
            )}
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
