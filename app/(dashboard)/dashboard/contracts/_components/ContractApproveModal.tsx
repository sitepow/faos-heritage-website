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
                    {totals.isAdjustmentOnly && (
                      <tr className='text-[10px]'>
                        <td
                          className='border border-black p-1 text-center text-red-500'
                          colSpan={6}
                        >
                          * This contract is for price adjustment of existing
                          store items based on current stock levels. /
                          สัญญานี้ใช้สำหรับการปรับราคาขายของสินค้าคงเหลือในร้านตามจำนวนสต็อกปัจจุบัน
                        </td>
                      </tr>
                    )}
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
                  price specified in this Agreement.
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
                สัญญาฝากขายสินค้า
              </h1>

              <section className='mb-4'>
                <h2 className='mb-2 border-b border-black pb-1 font-bold'>
                  1. คู่สัญญา
                </h2>
                <p className='text-justify'>
                  สัญญาฝากขายฉบับนี้ (“สัญญา”) ทำขึ้นและตกลงกัน ณ วันที่{' '}
                  {formatDate(contract?.startDate, 'th', 'date')} โดยและระหว่าง:
                </p>
                <p className='mt-2'>
                  <strong>FOAS ASIA</strong>{' '}
                  นิติบุคคลที่จัดตั้งขึ้นและดำเนินกิจการภายใต้กฎหมายของประเทศไทย
                  โดยมีสถานประกอบการหลักตั้งอยู่เลขที่ 333/253 ซอยฉลองกรุง 44
                  แขวงลำปลาทิว เขตลาดกระบัง กรุงเทพมหานคร 10520 ประเทศไทย
                  (ซึ่งต่อไปนี้จะเรียกว่า <strong>“ผู้ฝากขาย”</strong>) และ
                </p>
                <p className='mt-2'>
                  <strong>{contract?.storefront?.name}</strong>{' '}
                  นิติบุคคลที่จัดตั้งขึ้นและดำเนินกิจการภายใต้กฎหมายของประเทศไทย
                  โดยมีสถานประกอบการหลักตั้งอยู่เลขที่{' '}
                  {contract?.storefront?.address} (ซึ่งต่อไปนี้จะเรียกว่า{' '}
                  <strong>“ผู้รับฝากขาย”</strong>)
                </p>
              </section>

              <section className='mb-4'>
                <p className='mb-2'>
                  เนื่องจาก ผู้ฝากขายเป็นเจ้าของกรรมสิทธิ์ในสินค้าที่นำมาฝากขาย
                  ซึ่งจะระบุรายละเอียดไว้ด้านล่างนี้
                </p>
                <p className='mb-2'>
                  เนื่องจาก
                  ผู้รับฝากขายประสงค์จะรับมอบสินค้าฝากขายดังกล่าวเพื่อวัตถุประสงค์ในการจำหน่ายในนามของผู้ฝากขาย
                </p>
                <p>
                  ดังนั้น
                  เพื่อเป็นการตอบแทนในคำมั่นสัญญาและข้อตกลงร่วมกันของคู่สัญญาทั้งสองฝ่าย
                  ผู้ฝากขายและผู้รับฝากขาย (ซึ่งต่อไปนี้อาจเรียกว่า
                  “ฝ่ายหนึ่งฝ่ายใด” และรวมเรียกว่า “คู่สัญญา”)
                  จึงตกลงและดำเนินการดังนี้:
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>2. ก) สินค้าฝากขาย</h3>
                <p>
                  รายการและข้อมูลราคาของสินค้าฝากขาย (ซึ่งต่อไปนี้จะเรียกว่า
                  “สินค้า”) ภายใต้สัญญาฝากขายนี้ แสดงอยู่ใน{' '}
                  <span className='font-bold underline'>ตารางที่ 1</span>{' '}
                  ด้านล่างนี้
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>
                  ข) การพร้อมจำหน่ายของสินค้าและการผลิตจำนวนจำกัด
                </h3>
                <ul className='list-disc pl-5'>
                  <li>
                    ผู้รับฝากขายรับทราบว่าสินค้าบางรายการที่จัดหาภายใต้สัญญานี้เป็นสินค้าที่มีจำนวนการผลิตจำกัด
                    ดังนั้น อาจเกิดภาวะสินค้าขาดแคลนหรือไม่มีสินค้าชั่วคราวได้
                  </li>
                  <li>
                    ผู้ฝากขายไม่รับประกันการมีอยู่ของสินค้าทุกรายการที่ระบุไว้ในสัญญานี้อย่างต่อเนื่อง
                  </li>
                  <li>
                    ในวันที่ 15 ของทุกเดือน
                    ผู้ฝากขายจะแจ้งให้ผู้รับฝากขายทราบเป็นลายลักษณ์อักษรเกี่ยวกับสถานะการพร้อมจำหน่ายของสินค้าแต่ละรายการ
                    รวมถึงการคาดการณ์สินค้าขาดแคลนหรือการยกเลิกการผลิต
                  </li>
                  <li>
                    ผู้ฝากขายจะใช้ความพยายามอย่างเต็มที่ในการดำเนินการตามคำสั่งซื้อเพื่อเติมสินค้า
                    ทั้งนี้ขึ้นอยู่กับการมีอยู่ของสินค้าในช่วงเวลานั้นๆ
                  </li>
                </ul>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>
                  ค) การตรวจสอบการส่งมอบและการตอบรับสินค้า
                </h3>
                <p className='text-justify'>
                  ในการส่งมอบ การเติมสินค้า การต่ออายุ
                  หรือการเพิ่มสินค้าประเภทน้ำผึ้งและน้ำมันมะกอกภายใต้สัญญานี้ในแต่ละครั้ง
                  ให้มีการตรวจสอบร่วมกันโดยตัวแทนที่ได้รับมอบอำนาจจากทั้งทางผู้ผลิตและ{' '}
                  {contract?.storefront?.name}{' '}
                  การตรวจสอบนี้ให้ครอบคลุมถึงทุกกล่องและทุกหน่วยสินค้าที่ส่งมอบหรือนำเข้ามาในพื้นที่ของ{' '}
                  {contract?.storefront?.name}
                </p>
                <p className='mt-2 text-justify'>
                  การตรวจสอบร่วมกันอย่างน้อยต้องครอบคลุมถึง จำนวนสินค้า
                  ความสมบูรณ์ของบรรจุภัณฑ์ การติดฉลาก หมายเลขรุ่นการผลิต (batch
                  numbers) วันหมดอายุ สภาพการจัดเก็บ และคุณภาพโดยรวมของสินค้า
                  เพื่อให้มั่นใจว่าเป็นไปตามรายละเอียดและมาตรฐานที่ตกลงกันไว้ในสัญญานี้ทุกประการ
                </p>
                <p className='mt-2 text-justify'>
                  เฉพาะสินค้าที่ผ่านการตรวจสอบร่วมกันเท่านั้นที่จะถูกรับเข้าเป็นสต็อกฝากขาย
                  เพื่อนำไปจัดแสดง จัดเก็บ หรือวางจำหน่ายโดย{' '}
                  {contract?.storefront?.name} หากพบสินค้าที่ชำรุด
                  มีร่องรอยการแกะ หมดอายุ ติดฉลากไม่ถูกต้อง มีการรั่วซึม
                  หรือไม่เป็นไปตามข้อกำหนด
                  ให้จัดทำเอกสารบันทึกไว้และแยกออกจากสต็อกฝากขาย
                  โดยจะต้องดำเนินการเปลี่ยนสินค้า ให้เครดิตคืน หรือนำสินค้าออกไป
                  ซึ่งเป็นความรับผิดชอบของผู้ผลิตตามแต่จะตกลงกันเป็นลายลักษณ์อักษร
                </p>
                <p className='mt-2 text-justify'>
                  การตอบรับสินค้าหลังการตรวจสอบร่วมกัน ไม่ถือเป็นการสละสิทธิ์ของ{' '}
                  {contract?.storefront?.name}{' '}
                  ในการยกประเด็นเรื่องคุณภาพหรือการไม่ปฏิบัติตามข้อกำหนดที่อาจตรวจพบในภายหลังระหว่างการจัดเก็บหรือการจำหน่าย
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
                    {totals.isAdjustmentOnly && (
                      <tr className='text-[10px]'>
                        <td
                          className='border border-black p-1 text-center text-red-500'
                          colSpan={6}
                        >
                          * This contract is for price adjustment of existing
                          store items based on current stock levels. /
                          สัญญานี้ใช้สำหรับการปรับราคาขายของสินค้าคงเหลือในร้านตามจำนวนสต็อกปัจจุบัน
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>3. ราคาและการชำระเงิน</h3>
                <p className='text-justify'>
                  ผู้รับฝากขายสามารถกำหนดราคาขายของสินค้าฝากขายภายใต้สัญญานี้ได้อย่างอิสระ
                  อย่างไรก็ตาม
                  ราคาขายที่แนะนำสำหรับสินค้าฝากขายได้ระบุไว้ในตาราง (ตารางที่
                  1) ด้านบน เงินจำนวนใดๆ
                  ที่ได้รับจากการขายสินค้าฝากขายที่เกินกว่าราคาขั้นต่ำที่กำหนดให้เป็นของผู้รับฝากขาย
                  หากมีการขายสินค้าฝากขายต่ำกว่าราคาขั้นต่ำที่ระบุไว้
                  ผู้รับฝากขายจะต้องรับผิดชอบในการชำระเงินส่วนต่างระหว่างราคาที่ขายจริงและราคาขั้นต่ำตามที่ระบุในสัญญานี้ให้แก่ผู้ฝากขาย
                </p>
                <p className='text-justify'>
                  ผู้รับฝากขายจะต้องชำระเงินให้แก่ผู้ฝากขายสำหรับสินค้าทั้งหมดที่ขายได้ภายในวันที่
                  15 ของทุกเดือน เมื่อได้รับชำระเงินดังกล่าวแล้ว
                  ผู้ฝากขายจะดำเนินการเติมสินค้าที่ขายไปเพื่อรักษาสต็อกสินค้าของผู้รับฝากขายให้มีจำนวนตามที่ระบุไว้ในตารางที่
                  1
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>4. การประกันภัย</h3>
                <p className='text-justify'>
                  ผู้รับฝากขายจะต้องจัดให้มีการประกันภัยที่ครอบคลุมและเพียงพอที่จะชดเชยให้แก่ผู้ฝากขายในกรณีที่เกิดอัคคีภัย
                  ความเสียหาย การโจรกรรม การลักทรัพย์ หรือเหตุอื่นๆ อย่างไรก็ตาม
                  ผู้ฝากขายมีหน้าที่ต้องทำประกันภัยที่เหมาะสมสำหรับความเสียหายหรือความสูญเสียที่อาจเกิดขึ้นระหว่างการขนส่ง
                  มิฉะนั้น
                  ผู้ฝากขายจะต้องรับผิดชอบต่อความสูญเสียและความเสียหายที่เกิดขึ้นระหว่างการขนส่งนั้นเอง
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>
                  5. การคืนหรือการเปลี่ยนสินค้าที่ขายไม่ได้
                </h3>
                <p className='text-justify'>
                  ในวันที่ 15 ของทุกเดือน
                  ผู้รับฝากขายมีสิทธิเลือกที่จะส่งคืนหรือเปลี่ยนสินค้าฝากขายที่ยังขายไม่ได้เป็นสินค้าชนิดอื่นที่ผู้รับฝากขายเชื่อโดยมีเหตุผลอันควรว่าจะสามารถขายได้ดีกว่า
                  การส่งคืนหรือเปลี่ยนสินค้าดังกล่าวจะต้องแจ้งให้ผู้ฝากขายทราบเป็นลายลักษณ์อักษรไม่เกินวันที่
                  15 ของเดือนนั้นๆ และต้องดำเนินการให้เสร็จสิ้นภายในเจ็ด (7)
                  วันหลังจากนั้น
                </p>
                <p className='text-justify'>
                  สินค้าที่ส่งคืนทั้งหมดต้องอยู่ในสภาพที่ยังไม่ได้ใช้งาน
                  ไม่มีความเสียหาย ไม่มีการดัดแปลง
                  และอยู่ในบรรจุภัณฑ์เดิมในสภาพที่เหมาะสมสำหรับการนำไปจำหน่ายต่อ
                  ผู้ฝากขายขอสงวนสิทธิ์ในการตรวจสอบสินค้าที่ส่งคืนทั้งหมดและมีสิทธิปฏิเสธสินค้าที่ไม่เป็นไปตามเงื่อนไขเหล่านี้
                </p>
                <p className='text-justify'>
                  มูลค่ารวมของสินค้าที่นำมาเปลี่ยนทดแทนจะต้องเท่ากับมูลค่ารวมของสินค้าที่ส่งคืนหรือเปลี่ยน
                  โดยคำนวณจากราคาขั้นต่ำที่ระบุไว้ในสัญญานี้ (ตารางที่ 1)
                  หากมีความแตกต่างของมูลค่า
                  ผู้รับฝากขายจะต้องดำเนินการชำระส่วนต่างให้เรียบร้อยก่อนการจัดส่งสินค้าทดแทน
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>6. ค่าใช้จ่ายในการจัดส่ง</h3>
                <p className='text-justify'>
                  ผู้ฝากขายจะเป็นผู้รับผิดชอบค่าใช้จ่ายในการจัดส่งสำหรับการส่งมอบสินค้าฝากขาย
                  ในกรณีที่มีการคืนสินค้าที่ขายไม่ได้
                  ค่าใช้จ่ายในการจัดส่งสำหรับการส่งคืนให้เป็นไปตามค่าใช้จ่ายที่เกิดขึ้นจริงในการส่งคืนสินค้า
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>7. การรับประกันสินค้า</h3>
                <p className='text-justify'>
                  ผู้ฝากขายรับรองว่าสินค้าทั้งหมดที่จัดหาภายใต้สัญญานี้เป็นไปตามรายละเอียดที่ผู้รับฝากขายต้องการ
                  มีความเหมาะสมตามวัตถุประสงค์การใช้งาน
                  มีวัสดุและฝีมือการผลิตที่ดี และไม่มีข้อบกพร่อง
                  ระยะเวลาการรับประกันอาจแตกต่างกันไปตามประเภทสินค้าตามที่ผู้ฝากขายกำหนด
                  นอกจากนี้ผู้ฝากขายยังรับรองว่าสินค้าทั้งหมดเป็นสินค้าใหม่
                  ยังไม่ผ่านการใช้งาน และเป็นรุ่นล่าสุดที่มีจำหน่ายในขณะส่งมอบ
                </p>
                <p className='text-justify'>
                  เมื่อได้รับสินค้าแล้ว
                  ผู้รับฝากขายจะต้องดำเนินการตรวจสอบสินค้าโดยทันทีเพื่อหาข้อบกพร่องหรือความเสียหายที่มองเห็นได้
                  รวมถึงความเสียหายที่อาจเกิดขึ้นระหว่างการขนส่ง
                  ผู้รับฝากขายจะต้องแจ้งให้ผู้ฝากขายทราบเป็นลายลักษณ์อักษรโดยไม่ชักช้าเมื่อพบข้อบกพร่องหรือความเสียหายดังกล่าว
                </p>
                <p className='text-justify'>
                  เมื่อได้รับแจ้งดังกล่าว
                  ผู้รับฝากขายอาจร้องขอให้มีการเปลี่ยนสินค้าที่ชำรุดหรือเสียหายด้วยสินค้าที่ถูกต้องโดยไม่มีค่าใช้จ่ายเพิ่มเติม
                  หรือร้องขอการลดราคาหรือส่วนลดที่เหมาะสม
                  ทั้งนี้ขึ้นอยู่กับการยืนยันของผู้ฝากขาย
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>8. การสิ้นสุดสัญญา</h3>
                <p className='text-justify'>
                  สัญญาฉบับนี้ทำขึ้นโดยไม่มีกำหนดระยะเวลา
                  และสามารถบอกเลิกสัญญาได้โดยไม่มีค่าปรับด้วยการแจ้งเป็นลายลักษณ์อักษรล่วงหน้า
                  30 วันโดยฝ่ายหนึ่งฝ่ายใด
                  คู่สัญญาอาจบอกเลิกสัญญาได้ทันทีด้วยความเห็นชอบร่วมกันเป็นลายลักษณ์อักษร
                  ในกรณีนี้
                  ให้นำบทบัญญัติเกี่ยวกับการชำระเงินและการคืนสินค้ามาใช้บังคับหลังการสิ้นสุดสัญญา
                  หากฝ่ายหนึ่งฝ่ายใดไม่สามารถปฏิบัติตามพันธกรณีภายใต้สัญญานี้
                  อีกฝ่ายหนึ่งอาจบอกเลิกสัญญาได้ด้วยการแจ้งล่วงหน้า 30 วัน
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>9. เหตุสุดวิสัย</h3>
                <p className='text-justify'>
                  ไม่ว่าในกรณีใด
                  คู่สัญญาไม่ต้องรับผิดชอบต่อความล้มเหลวหรือความล่าช้าในการปฏิบัติตามพันธกรณีภายใต้สัญญานี้
                  อันเกิดจากหรือมีสาเหตุมาจากกองกำลังที่อยู่นอกเหนือการควบคุมที่สมควร
                  ไม่ว่าโดยตรงหรือโดยอ้อม รวมถึงแต่ไม่จำกัดเพียง
                  การประท้วงหยุดงาน การหยุดงาน อุบัติเหตุ
                  การสงครามหรือการก่อการร้าย ความวุ่นวายทางแพ่งหรือทางทหาร
                  ภัยพิบัติทางนิวเคลียร์หรือทางธรรมชาติ หรือเหตุจากพระเจ้า
                  และการหยุดชะงัก การสูญเสีย หรือการทำงานผิดพลาดของสาธารณูปโภค
                  การสื่อสาร หรือบริการคอมพิวเตอร์ (ซอฟต์แวร์หรือฮาร์ดแวร์)
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>10. การรักษาความลับ</h3>
                <p className='text-justify'>
                  คู่สัญญารับทราบว่าการมีอยู่และเงื่อนไขของสัญญานี้
                  รวมถึงข้อมูลทางวาจาหรือลายลักษณ์อักษรใดๆ
                  ที่มีการแลกเปลี่ยนระหว่างคู่สัญญาเกี่ยวกับการเตรียมการและการปฏิบัติตามสัญญานี้
                  ถือเป็นข้อมูลลับ
                  คู่สัญญาแต่ละฝ่ายจะต้องรักษาความลับของข้อมูลดังกล่าวทั้งหมด
                  และหากไม่ได้รับความยินยอมเป็นลายลักษณ์อักษรจากอีกฝ่ายหนึ่ง
                  จะต้องไม่เปิดเผยข้อมูลลับที่เกี่ยวข้องให้แก่บุคคลภายนอก
                  ยกเว้นข้อมูลที่: (ก) เป็นหรือจะกลายเป็นข้อมูลสาธารณะ
                  (โดยมิได้เกิดจากการเปิดเผยโดยไม่ได้รับอนุญาตของฝ่ายที่ได้รับข้อมูล)
                  (ข)
                  มีพันธะต้องเปิดเผยตามกฎหมายหรือระเบียบข้อบังคับที่ใช้บังคับ
                  กฎของตลาดหลักทรัพย์ หรือคำสั่งศาลหรือหน่วยงานรัฐบาลอื่นๆ หรือ
                  (ค) จำเป็นต้องเปิดเผยต่อผู้ถือหุ้น นักลงทุน ที่ปรึกษากฎหมาย
                  หรือที่ปรึกษาทางการเงินเกี่ยวกับการทำธุรกรรมตามสัญญานี้
                  โดยมีเงื่อนไขว่าผู้ถือหุ้น นักลงทุน ที่ปรึกษากฎหมาย
                  หรือที่ปรึกษาทางการเงินดังกล่าวจะต้องผูกพันตามภาระหน้าที่ในการรักษาความลับเช่นเดียวกับที่ระบุไว้ในส่วนนี้
                </p>
                <p className='text-justify'>
                  การเปิดเผยข้อมูลลับใดๆ
                  โดยพนักงานหรือตัวแทนที่ว่าจ้างโดยฝ่ายใดฝ่ายหนึ่ง
                  ให้ถือเป็นการเปิดเผยข้อมูลลับโดยฝ่ายนั้นๆ
                  ซึ่งฝ่ายดังกล่าวจะต้องรับผิดชอบต่อการละเมิดสัญญานี้
                  ข้อกำหนดในส่วนนี้ให้มีผลบังคับใช้ต่อไปแม้สัญญานี้จะสิ้นสุดลงด้วยเหตุผลใดก็ตาม
                </p>
              </section>

              <section className='mb-4'>
                <h3 className='mb-1 font-bold'>11. ข้อกำหนดอื่นๆ</h3>
                <p className='text-justify'>
                  การแจ้งเตือน - การแจ้งเตือนใดๆ
                  ภายใต้สัญญานี้จะต้องส่งไปยังคู่สัญญาตามที่อยู่ที่ระบุไว้ในสัญญานี้
                </p>
                <p className='text-justify'>
                  ข้อตกลงทั้งหมด -
                  สัญญาฉบับนี้ถือเป็นความเข้าใจที่สมบูรณ์ของคู่สัญญาเกี่ยวกับเนื้อหาที่ระบุในสัญญานี้
                  และให้ใช้แทนที่ข้อตกลงหรือการจัดเตรียมอื่นๆ ทั้งหมด
                  ไม่ว่าโดยวาจาหรือลายลักษณ์อักษร
                </p>
                <p className='text-justify'>
                  การแยกส่วนสัญญา - ในกรณีที่ข้อกำหนดใดในสัญญานี้ตกเป็นโมฆะ
                  ไม่ชอบด้วยกฎหมาย หรือไม่สามารถบังคับใช้ได้ ให้ความสมบูรณ์
                  ความชอบด้วยกฎหมาย
                  และการบังคับใช้ของข้อกำหนดส่วนที่เหลือไม่ได้รับผลกระทบหรือเสื่อมเสียไป
                  และข้อกำหนดดังกล่าวนั้นให้ไม่มีผลบังคับเฉพาะในส่วนที่เป็นโมฆะ
                  ไม่ชอบด้วยกฎหมาย หรือไม่สามารถบังคับใช้ได้เท่านั้น
                </p>
                <p className='text-justify'>
                  การโอนสิทธิ - สัญญาฉบับนี้รวมถึงสิทธิ ผลประโยชน์
                  หรือพันธกรณีภายใต้สัญญานี้
                  คู่สัญญาฝ่ายหนึ่งฝ่ายใดไม่อาจโอนให้แก่กันได้
                  (ไม่ว่าจะโดยผลของกฎหมายหรือด้วยประการอื่นใด)
                  โดยไม่ได้รับความยินยอมเป็นลายลักษณ์อักษรล่วงหน้าจากคู่สัญญาอีกฝ่าย
                  ภายใต้บังคับของประโยคก่อนหน้า สัญญานี้จะมีผลผูกพัน
                  เป็นประโยชน์ต่อ
                  และบังคับใช้ได้โดยคู่สัญญาและผู้สืบสิทธิ์และผู้รับโอนสิทธิ์ของแต่ละฝ่าย
                </p>
                <p className='text-justify'>
                  การแก้ไขเพิ่มเติม - การแก้ไขเพิ่มเติมหรือการเปลี่ยนแปลงใดๆ
                  ในสัญญานี้จะต้องทำเป็นลายลักษณ์อักษรด้วยความยินยอมร่วมกันของทั้งสองฝ่าย
                </p>
                <p className='text-justify'>
                  กฎหมายที่ใช้บังคับและการระงับข้อพิพาท - การโอนสิทธิ์
                </p>
                <p className='text-justify'>
                  การลงนาม การมีผลบังคับใช้ การตีความ การปฏิบัติตาม
                  การแก้ไขเพิ่มเติม และการสิ้นสุดของสัญญานี้
                  รวมถึงการระงับข้อพิพาทภายใต้สัญญานี้
                  ให้เป็นไปตามกฎหมายที่ประกาศใช้และเผยแพร่ต่อสาธารณะของราชอาณาจักรไทย
                </p>
                <p className='text-justify'>
                  เพื่อเป็นหลักฐาน คู่สัญญาได้ลงนามในสัญญาฉบับนี้ ณ
                  วันและปีที่ระบุไว้ด้านล่างนี้
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
