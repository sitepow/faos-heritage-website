import { OrderStatus } from '@prisma/client'
import {
  ClockIcon,
  CheckCircle2Icon,
  PackageIcon,
  TruckIcon,
  XCircleIcon,
  Undo2Icon,
  StoreIcon,
} from 'lucide-react'

import type { ReactNode } from 'react'

const ORDER_STATUS_ICON_MAP: Record<OrderStatus, ReactNode> = {
  [OrderStatus.PENDING]: <ClockIcon size={14} />,
  [OrderStatus.PAID]: <CheckCircle2Icon size={14} />,
  [OrderStatus.PROCESSING]: <PackageIcon size={14} />,
  [OrderStatus.READY_FOR_PICKUP]: <StoreIcon size={14} />,
  [OrderStatus.DELIVERED]: <TruckIcon size={14} />,
  [OrderStatus.CANCELLED]: <XCircleIcon size={14} />,
  [OrderStatus.REFUNDED]: <Undo2Icon size={14} />,
}

export { ORDER_STATUS_ICON_MAP }
