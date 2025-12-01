import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { User } from '@heroui/user'
import { Role } from '@prisma/client'
import { LogOutIcon, Settings, UserIcon } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import type { FC } from 'react'

interface Props {
  setIsMenuOpen: (state: boolean) => void
}

const Panel: FC<Props> = ({ setIsMenuOpen }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const isAdmin = user?.role === Role.ADMIN
  const isDashboard = usePathname().startsWith('/dashboard')

  const menuItems = [
    {
      key: 'account',
      label: 'บัญชีของฉัน',
      icon: <UserIcon />,
      action: () => router.push('/account'),
    },
    ...(isAdmin && !isDashboard
      ? [
          {
            key: 'admin-dashboard',
            label: 'จัดการข้อมูลหลังร้าน (เฉพาะเจ้าหน้าที่)',
            icon: <Settings />,
            action: () => router.push('/dashboard'),
          },
        ]
      : []),
    {
      key: 'logout',
      label: 'ออกจากระบบ',
      icon: <LogOutIcon />,
      color: 'danger',
      className: 'text-danger',
      action: () => signOut(),
    },
  ]

  return (
    <Dropdown>
      <DropdownTrigger>
        <User
          avatarProps={{
            src: `${user?.image ?? '/placeholder.svg'}`,
          }}
          className='cursor-pointer'
          description={user?.email}
          name={user?.name}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions'>
        {menuItems.map((item) => (
          <DropdownItem
            key={item.key}
            startContent={item.icon}
            className={item.className}
            onClick={() => {
              item.action()
              setIsMenuOpen(false)
            }}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

export { Panel }
