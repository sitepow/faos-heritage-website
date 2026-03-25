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
import { FileSignatureIcon, EllipsisVerticalIcon, EyeIcon } from 'lucide-react'
import { useState } from 'react'

import type { Selection } from '@heroui/react'

import { ContractApproveModal } from './ContractApproveModal'
import { ContractDetailModal } from './ContractDetailModal'

import { useContractsAdmin } from '@/features/contract/hook'
import { formatCurrency } from '@/utils'
import { formatDate } from '@/utils/date'

interface Props {
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
}

const ContractTable = ({ selectedKeys, onSelectionChange }: Props) => {
  const { data: contracts, isLoading } = useContractsAdmin()

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

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleViewDetails = (id: string) => {
    setSelectedId(id)
    onDetailOpen()
  }

  const handleApproveClick = (id: string) => {
    setSelectedId(id)
    onApproveOpen()
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
          <TableColumn>ยอดเงินรวม</TableColumn>
          <TableColumn>ระยะเวลาสัญญา</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีสัญญาในระบบ'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูลสัญญา...' />}
        >
          {(contracts || [])?.map((contract) => (
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
                <span className='text-primary font-semibold'>
                  {formatCurrency(contract.totalAmount)}
                </span>
              </TableCell>
              <TableCell className='max-w-48 min-w-48'>
                <div className='flex flex-col gap-1 text-xs'>
                  <div className='flex items-center gap-1'>
                    <span className='text-default-400'>เริ่ม:</span>
                    <span>
                      {formatDate(contract.startDate, 'th', 'date') || '-'}
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='text-default-400'>สิ้นสุด:</span>
                    <span>
                      {contract.endDate
                        ? formatDate(contract.endDate, 'th', 'date')
                        : '-'}
                    </span>
                  </div>
                </div>
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
                          key='empty'
                          aria-hidden='true'
                          className='hidden'
                        />
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
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
    </>
  )
}

export { ContractTable }
