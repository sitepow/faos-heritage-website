'use client'

import { Button, Spinner } from '@heroui/react'
import { ChevronLeftIcon, SaveIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

import type { PostLocalizationInput } from '@/features/post-localization/schema'

import { TableConfigHeader } from '@/app/(dashboard)/dashboard/products/_components/TableConfigHeader'
import { Container } from '@/components/layouts/Container'
import { MdEditorCustomize } from '@/components/ui/MdEditorCustomize'
import { usePostLocale } from '@/features/post-localization/hook'
import { usePostLocaleMutation } from '@/features/post-localization/mutation'

const PostLocalizationDescriptionPage = () => {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  const localeId = params.localeId as string

  const [content, setContent] = useState<string>('')
  const [loadCount, setLoadCount] = useState(0)

  const { data: localization, isLoading } = usePostLocale(localeId)
  const { upsert, isUpserting } = usePostLocaleMutation()

  useEffect(() => {
    if (localization && localization.id === localeId) {
      setContent(localization.content || '')
      setLoadCount((prev) => prev + 1)
    }
  }, [localization, localeId])

  const handleSave = useCallback(async () => {
    if (!localeId || !localization) {
      return
    }

    await upsert(
      {
        ...localization,
        id: localeId,
        content: content,
      } as PostLocalizationInput,
      {
        onSuccess: () => {
          router.push(`/dashboard/posts/${postId}/localization`)
        },
      },
    )
  }, [localeId, localization, content, upsert, router, postId])

  if (isLoading) {
    return (
      <Container className='flex h-[60vh] items-center justify-center'>
        <Spinner label='กำลังโหลดเนื้อหาภาษา...' />
      </Container>
    )
  }

  return (
    <Container className='flex flex-col gap-6 text-left'>
      <TableConfigHeader
        actionContent={
          <Button
            className='text-secondary font-bold'
            color='primary'
            isLoading={isUpserting}
            startContent={!isUpserting && <SaveIcon size={18} />}
            onPress={handleSave}
          >
            บันทึกเนื้อหาภาษา {localization?.languageCode?.toUpperCase()}
          </Button>
        }
        selectedCount={0}
        title={
          <div className='flex items-center gap-3'>
            <Button
              isIconOnly
              variant='light'
              onPress={() =>
                router.push(`/dashboard/posts/${postId}/localization`)
              }
            >
              <ChevronLeftIcon size={24} />
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>
                แก้ไขเนื้อหาบทความ ({localization?.languageCode?.toUpperCase()})
              </h1>
              <p className='text-small text-default-500'>
                แปลสำหรับ: {localization?.title}
              </p>
            </div>
          </div>
        }
        onDeleteSelected={() => {}}
      />

      <MdEditorCustomize
        key={loadCount}
        placeholder='เริ่มแปลเนื้อหาบทความแบบละเอียดที่นี่ (รองรับ Markdown)...'
        value={content}
        onChange={(val) => setContent(val)}
      />
    </Container>
  )
}

export default PostLocalizationDescriptionPage
