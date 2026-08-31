'use client'

import { Button, useDisclosure } from '@heroui/react'
import { ContractStatus } from '@prisma/client'
import { PlusIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { ContractListItem } from '@/features/contract/action'
import type { Selection } from '@heroui/react'

import { ContractPOSModal } from './_components/ContractPOSModal'
import { ContractTable } from './_components/ContractTable'
import { TableConfigHeader } from '../products/_components/TableConfigHeader'

import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useContractsAdmin } from '@/features/contract/hook'
import { useAuth } from '@/hooks/useAuth'
import { useIsMounted } from '@/hooks/useIsMounted'

const ContractPage = () => {
  const isMounted = useIsMounted()
  const { isAdmin } = useAuth()

  const {
    isOpen: isPOSOpen,
    onOpen: onOpenPOS,
    onClose: onClosePOS,
  } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

  const { data: contracts } = useContractsAdmin()

  const statsData = useMemo(() => {
    const list = contracts || []
    return [
      { name: 'All Contract', value: list.length },
      {
        name: 'Active contract',
        value: list.filter(
          (c: ContractListItem) => c.status === ContractStatus.ACTIVE,
        ).length,
      },
      {
        name: 'Wating vertify',
        value: list.filter(
          (c: ContractListItem) => c.status === ContractStatus.PENDING,
        ).length,
      },
    ]
  }, [contracts])

  const selectedCount = useMemo(() => {
    return selectedKeys === 'all' ? contracts?.length || 0 : selectedKeys.size
  }, [selectedKeys, contracts])

  if (!isMounted) {
    return null
  }

  return (
    <Container className='flex flex-col gap-6 text-left'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {statsData.map((stat) => (
          <StatCard key={stat.name} label={stat.name} value={stat.value} />
        ))}
      </div>

      <TableConfigHeader
        actionContent={
          isAdmin && (
            <Button
              className='text-secondary font-bold'
              color='primary'
              startContent={<PlusIcon size={18} />}
              onPress={onOpenPOS}
            >
              Create new contract
            </Button>
          )
        }
        selectedCount={selectedCount}
        title='Bussiness partner management'
      />

      <ContractTable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />

      <ContractPOSModal isOpen={isPOSOpen} onClose={onClosePOS} />
    </Container>
  )
}

export default ContractPage
