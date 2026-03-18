'use client'

import { Button } from '@heroui/react'
import { PlusIcon, DownloadIcon } from 'lucide-react'
import { useState, useMemo } from 'react'
import * as XLSX from 'xlsx'

import type { ProductWithPayload } from '@/features/product/action'
import type { Selection } from '@heroui/react'

import { InventoryTable } from './_components/InventoryTable'
import { TableConfigHeader } from '../products/_components/TableConfigHeader'

import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useProductsAdmin, useProductStats } from '@/features/product/hook'
import { useStockStore } from '@/features/stock/store'
import { StockAdjustmentForm } from '@/features/stock/ui/StockAdjustmentForm'
import { exportStockHistoryAction } from '@/features/stock-history/report'
import { formatDate } from '@/utils'

const InventoryPage = () => {
  const { openAdjustment } = useStockStore()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [page, setPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)

  const { data: stats } = useProductStats()
  const { data: productsData, isLoading } = useProductsAdmin(page, 50)

  const productList = useMemo(() => {
    const items =
      productsData && 'items' in productsData ? productsData.items : []
    return items as ProductWithPayload[]
  }, [productsData])

  const statsData = useMemo(() => {
    return Array.isArray(stats) ? stats : []
  }, [stats])

  const selectedCount = useMemo(() => {
    return selectedKeys === 'all' ? productList.length : selectedKeys.size
  }, [selectedKeys, productList])

  const handleExportExcel = async () => {
    setIsExporting(true)

    try {
      let productIds: string[] | undefined
      if (selectedKeys !== 'all') {
        const selectedSet = selectedKeys as Set<string>
        if (selectedSet.size > 0) {
          productIds = Array.from(selectedSet)
        }
      }

      const result = await exportStockHistoryAction(productIds)

      if (result.success && result.data && result.meta) {
        const worksheet = XLSX.utils.aoa_to_sheet([[]])

        const titleRow = [
          [`รายงานความเคลื่อนไหวสต็อก (ช่วงวันที่: ${result.meta.dateRange})`],
        ]
        XLSX.utils.sheet_add_aoa(worksheet, titleRow, { origin: 'A1' })

        XLSX.utils.sheet_add_json(worksheet, result.data, {
          origin: 'A2',
          skipHeader: false,
        })

        worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }]

        const summaryStartRow = result.data.length + 4
        const summaryData = [
          ['สรุปภาพรวมความเคลื่อนไหว'],
          ['รวมยอดรับเข้าทั้งหมด', result.meta.summary.totalIn],
          ['รวมยอดเบิกออกทั้งหมด', result.meta.summary.totalOut],
          ['ยอดสุทธิ (Net Change)', result.meta.summary.netChange],
        ]
        XLSX.utils.sheet_add_aoa(worksheet, summaryData, {
          origin: `D${summaryStartRow}`,
        })

        worksheet['!cols'] = [
          { wch: 20 },
          { wch: 30 },
          { wch: 20 },
          { wch: 15 },
          { wch: 10 },
          { wch: 10 },
          { wch: 20 },
          { wch: 25 },
          { wch: 20 },
          { wch: 18 },
        ]

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory_Report')

        const dateSuffix = formatDate(new Date(), 'th', 'short')?.replace(
          /\//g,
          '-',
        )
        XLSX.writeFile(workbook, `stock-report-${dateSuffix}.xlsx`)
      }
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Container className='flex flex-col gap-6 text-left'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {statsData.map((stat) => {
          return (
            <StatCard key={stat.name} label={stat.name} value={stat.value} />
          )
        })}
      </div>

      <TableConfigHeader
        actionContent={
          <div className='flex items-center gap-2'>
            <Button
              color='default'
              isLoading={isExporting}
              startContent={!isExporting && <DownloadIcon size={18} />}
              variant='flat'
              onPress={handleExportExcel}
            >
              {selectedCount > 0 ? `Export (${selectedCount})` : 'Export All'}
            </Button>
            <Button
              className='text-secondary font-bold'
              color='primary'
              startContent={<PlusIcon size={18} />}
              onPress={() => {
                return openAdjustment('')
              }}
            >
              ทำรายการใหม่
            </Button>
          </div>
        }
        selectedCount={selectedCount}
        title='จัดการสต็อกสินค้า'
      />

      <InventoryTable
        isLoading={isLoading}
        page={page}
        productList={productList}
        selectedKeys={selectedKeys}
        onPageChange={setPage}
        onSelectionChange={setSelectedKeys}
      />

      <StockAdjustmentForm />
    </Container>
  )
}

export default InventoryPage
