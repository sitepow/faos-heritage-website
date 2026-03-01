'use client'

import { Button } from '@heroui/react'
import { PlusIcon, TrashIcon } from 'lucide-react'

import type { ReactNode } from 'react'

interface Props {
  title: ReactNode
  selectedCount: number
  onDeleteSelected?: () => void
  bulkActions?: ReactNode
  actionContent?: ReactNode
  onAddClick?: () => void
  addLabel?: string
}

const TableConfigHeader = ({
  title,
  selectedCount,
  onDeleteSelected,
  bulkActions,
  actionContent,
  onAddClick,
  addLabel = 'เพิ่มใหม่',
}: Props) => {
  return (
    <div className='flex w-full flex-wrap items-center justify-between gap-4'>
      <div className='flex flex-col gap-1'>
        {typeof title === 'string' ? (
          <h1 className='text-2xl font-bold'>{title}</h1>
        ) : (
          title
        )}
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        {selectedCount > 0 && (
          <>
            {bulkActions
              ? bulkActions
              : onDeleteSelected && (
                  <Button
                    color='danger'
                    startContent={<TrashIcon size={18} />}
                    variant='flat'
                    onPress={onDeleteSelected}
                  >
                    ลบที่เลือก ({selectedCount})
                  </Button>
                )}
          </>
        )}

        {actionContent
          ? actionContent
          : onAddClick && (
              <Button
                className='text-secondary font-bold'
                color='primary'
                startContent={<PlusIcon size={18} />}
                onPress={onAddClick}
              >
                {addLabel}
              </Button>
            )}
      </div>
    </div>
  )
}

export { TableConfigHeader }
