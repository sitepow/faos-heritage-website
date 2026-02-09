import { Role } from '@prisma/client'
import { useTranslations } from 'next-intl'

const useRoleLabel = () => {
  const t = useTranslations('profile')

  const getRoleLabel = (role?: Role | null) => {
    if (!role) {
      return '-'
    }

    const roleMap: Record<Role, string> = {
      [Role.ADMIN]: t('roles.admin'),
      [Role.CUSTOMER]: t('roles.customer'),
    }

    return roleMap[role] ?? role
  }

  return { getRoleLabel }
}

export { useRoleLabel }
