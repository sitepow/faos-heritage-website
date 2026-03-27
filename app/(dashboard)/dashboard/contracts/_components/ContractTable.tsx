/* eslint-disable no-unused-vars */
'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  useDisclosure,
} from '@heroui/react'
import { ContractStatus } from '@prisma/client'
import {
  FileSignatureIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  BanIcon,
} from 'lucide-react'
import { useState } from 'react'

import type { Selection } from '@heroui/react'

import { ContractApproveModal } from './ContractApproveModal'
import { ContractDetailModal } from './ContractDetailModal'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { useContractsAdmin } from '@/features/contract/hook'
import { useContractMutation } from '@/features/contract/mutation'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/date'

interface Props {
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
}

const ContractTable = ({ selectedKeys, onSelectionChange }: Props) => {
  const { isAdmin } = useAuth()
  const { data: contracts, isLoading } = useContractsAdmin()
  const { updateStatus, isUpdatingStatus } = useContractMutation()

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onOpenChange: onDetailOpenChange,
  } = useDisclosure()

  const {
    isOpen: isApproveOpen,
    onOpen: onApproveOpen,
    onOpenChange: onApproveOpenChange,
  } = useDisclosure()

  const {
    isOpen: isTerminateOpen,
    onOpen: onTerminateOpen,
    onOpenChange: onTerminateOpenChange,
  } = useDisclosure()

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleViewDetails = (id: string) => {
    setSelectedId(id)
    onDetailOpen()
  }

  const handleApproveClick = (id: string) => {
    setSelectedId(id)
    onApproveOpen()
  }

  const handleTerminateClick = (id: string) => {
    setSelectedId(id)
    onTerminateOpen()
  }

  const handleConfirmTerminate = async () => {
    if (!selectedId) {
      return
    }

    await updateStatus({
      id: selectedId,
      status: ContractStatus.TERMINATED,
    })

    onTerminateOpenChange()
    setSelectedId(null)
  }

  const statusColorMap: Record<
    ContractStatus,
    'default' | 'primary' | 'success' | 'warning' | 'danger'
  > = {
    DRAFT: 'default',
    PENDING: 'warning',
    ACTIVE: 'success',
    EXPIRED: 'danger',
    TERMINATED: 'danger',
    ARCHIVED: 'default',
  }

  const statusLabelMap: Record<ContractStatus, string> = {
    DRAFT: 'ฉบับร่าง',
    PENDING: 'รอลงนาม',
    ACTIVE: 'กำลังใช้งาน',
    EXPIRED: 'หมดอายุ',
    TERMINATED: 'ยกเลิกแล้ว',
    ARCHIVED: 'จัดเก็บถาวร',
  }

  return (
    <>
      <Table
        aria-label='ตารางสัญญา'
        checkboxesProps={{
          classNames: {
            wrapper: 'after:bg-primary before:border-default-100',
            icon: 'text-white font-bold',
          },
        }}
        selectedKeys={selectedKeys}
        selectionMode='multiple'
        onSelectionChange={onSelectionChange}
      >
        <TableHeader>
          <TableColumn>รหัสสัญญา</TableColumn>
          <TableColumn>ชื่อหน้าร้าน</TableColumn>
          <TableColumn>ประเภทสัญญา</TableColumn>
          <TableColumn>ระยะเวลาสัญญา</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีสัญญาในระบบ'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูลสัญญา...' />}
        >
          {(contracts || [])?.map((contract) => {
            const isDeletable =
              isAdmin &&
              (
                [
                  ContractStatus.DRAFT,
                  ContractStatus.PENDING,
                ] as ContractStatus[]
              ).includes(contract.status as ContractStatus)

            return (
              <TableRow key={contract.id}>
                <TableCell>
                  <span className='text-default-500 font-mono text-xs font-bold'>
                    #{contract.id.slice(-8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className='max-w-48 min-w-48 font-bold'>
                  {contract.storefront?.name || 'ไม่ระบุชื่อร้าน'}
                </TableCell>
                <TableCell>
                  {contract?.isAdjustment ? 'ปรับราคา' : 'โอนสต็อกและปรับราคา'}
                </TableCell>
                <TableCell className='max-w-48 min-w-48'>
                  {formatDate(contract.startDate, 'th', 'numeric') || '-'}
                  {contract.endDate
                    ? ` - ${formatDate(contract.endDate, 'th', 'numeric')}`
                    : ' - ไม่มีระยะเวลาสิ้นสุด'}
                </TableCell>
                <TableCell>
                  <Chip
                    color={statusColorMap[contract.status as ContractStatus]}
                    size='sm'
                    variant='dot'
                  >
                    {statusLabelMap[contract.status as ContractStatus]}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className='flex items-center justify-center gap-2'>
                    <Dropdown placement='bottom-end'>
                      <DropdownTrigger>
                        <Button isIconOnly size='sm' variant='light'>
                          <EllipsisVerticalIcon
                            className='text-default-500'
                            size={20}
                          />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label='จัดการสัญญา'>
                        <DropdownItem
                          key='view'
                          startContent={<EyeIcon size={16} />}
                          onPress={() => {
                            return handleViewDetails(contract.id)
                          }}
                        >
                          ดูรายละเอียด
                        </DropdownItem>

                        {contract.status === ContractStatus.DRAFT ? (
                          <DropdownItem
                            key='approve'
                            description='ตรวจสอบเงื่อนไขและลงนาม'
                            startContent={<FileSignatureIcon size={16} />}
                            onPress={() => {
                              return handleApproveClick(contract.id)
                            }}
                          >
                            ลงนามสัญญา
                          </DropdownItem>
                        ) : (
                          <DropdownItem
                            key='empty-approve'
                            aria-hidden='true'
                            className='hidden'
                          />
                        )}

                        {isDeletable ? (
                          <DropdownItem
                            key='terminate'
                            className='text-danger'
                            color='danger'
                            description='เปลี่ยนสถานะเป็นยกเลิกสัญญา'
                            startContent={<BanIcon size={16} />}
                            onPress={() => {
                              return handleTerminateClick(contract.id)
                            }}
                          >
                            ยกเลิกสัญญา
                          </DropdownItem>
                        ) : (
                          <DropdownItem
                            key='empty-terminate'
                            aria-hidden='true'
                            className='hidden'
                          />
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <ContractDetailModal
        contractId={selectedId}
        isOpen={isDetailOpen}
        onClose={() => {
          setSelectedId(null)
          onDetailOpenChange()
        }}
      />

      <ContractApproveModal
        contractId={selectedId}
        isOpen={isApproveOpen}
        onClose={() => {
          setSelectedId(null)
          onApproveOpenChange()
        }}
      />

      <ConfirmDeleteModal
        cancelText='กลับ'
        confirmText='ยืนยันยกเลิก'
        description='คุณต้องการยกเลิกสัญญานี้ใช่หรือไม่? ระบบจะเปลี่ยนสถานะเป็น "ยกเลิกแล้ว" และสัญญาจะไม่มีผลบังคับใช้'
        isOpen={isTerminateOpen}
        isPending={isUpdatingStatus}
        title='ยืนยันการยกเลิกสัญญา'
        onConfirm={handleConfirmTerminate}
        onOpenChange={onTerminateOpenChange}
      />
    </>
  )
}

export { ContractTable }
