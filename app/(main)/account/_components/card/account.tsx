import { getUser } from '@/app/(dashboard)/dashboard/user/actions/user'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Role } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import type { FC } from 'react'

interface Props {
  onclick?: () => void
}

const AccountCard: FC<Props> = ({ onclick }) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY_KEY = ['account', 'user', userId]

  const { data: user } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  })

  return (
    <Card fullWidth>
      <CardHeader>
        <span>จัดการกับบัญชีของฉัน</span>
      </CardHeader>
      <CardBody>
        <div className='flex flex-col'>
          <div className='rounded-t-lg border border-divider p-2.5'>
            <span>ข้อมูลส่วนตัว</span>
          </div>

          <div className='rounded-b-lg border-x border-b border-divider p-2.5 *:flex *:gap-3'>
            <div>
              <span>ชื่อ - นามสกุล</span>
              <span>:</span>
              <span>{user?.name}</span>
            </div>

            <div>
              <span>อีเมล</span>
              <span>:</span>
              <span>{user?.email}</span>
            </div>

            <div>
              <span>สิทธิ์การใช้งาน</span>
              <span>:</span>
              <span>{user?.role === Role.ADMIN ? 'ผู้ดูแลระบบ' : 'ลูกค้า'}</span>
            </div>

            <Button className='mt-5' variant='faded' onPress={onclick}>
              แก้ไขข้อมูลส่วนตัว
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { AccountCard }
