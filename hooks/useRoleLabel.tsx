import { Role } from '@prisma/client'
import { useTranslations } from 'next-intl'

const useRoleLabel = () => {
  const t = useTranslations('profile')

  const getRoleLabel = (roles: Role[] = []): string => {
    if (roles.length === 0) {
      return '-'
    }

    const roleMap: Record<Role, string> = {
      [Role.ADMIN]: t('roles.admin'),
      [Role.CUSTOMER]: t('roles.customer'),
      [Role.STOCK_MANAGER]: t('roles.stock_manager'),
    }

    return roles
      .map((role: Role) => {
        return roleMap[role] ?? role
      })
      .join(', ')
  }

  return { getRoleLabel }
}

export { useRoleLabel }
