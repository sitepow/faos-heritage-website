'use server'

import { Role, ContractStatus, StockMovementType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { contractSchema, type ContractInput } from './schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole, getServerUser } from '@/lib/session'
import { decimalToNumber } from '@/utils/number'

type ContractWithPayload = NonNullable<
  Awaited<ReturnType<typeof getContractDetails>>
>
type ContractItemPayload = ContractWithPayload['items'][number]
type ContractListItem = NonNullable<
  Awaited<ReturnType<typeof getContractsAdmin>>
>[number]

const createContract = async (data: ContractInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = contractSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    try {
      const { items, ...contractData } = validated.data

      const contract = await prisma.contract.create({
        data: {
          ...contractData,
          profitType: validated.data.profitType,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              variantName: item.variantName,
              quantity: item.quantity,
              agreedPrice: item.agreedPrice,
              subtotal: item.subtotal,
            })),
          },
        },
      })

      revalidatePath('/dashboard/contracts')
      return ok(contract.id)
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updateContract = async (id: string, data: ContractInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = contractSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    try {
      const { items, ...contractData } = validated.data

      const updatedContract = await prisma.$transaction(async (tx) => {
        await tx.contractItem.deleteMany({ where: { contractId: id } })

        return tx.contract.update({
          where: { id },
          data: {
            ...contractData,
            items: {
              create: items.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                productName: item.productName,
                variantName: item.variantName,
                quantity: item.quantity,
                agreedPrice: item.agreedPrice,
                subtotal: item.subtotal,
              })),
            },
          },
        })
      })

      revalidatePath('/dashboard/contracts')
      return ok(updatedContract.id)
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteContract = async (id: string | string[]) =>
  withRole([Role.ADMIN], async () => {
    try {
      const ids = Array.isArray(id) ? id : [id]
      await prisma.contract.deleteMany({
        where: { id: { in: ids } },
      })

      revalidatePath('/dashboard/contracts')
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getContractsAdmin = async () => {
  const { userId, roles, isAuthenticated } = await getServerUser()

  if (!isAuthenticated || !userId) {
    return []
  }

  const isAdmin = roles.includes(Role.ADMIN)
  const isPOS = roles.includes(Role.POS)

  if (!isAdmin && !isPOS) {
    return []
  }

  const contracts = await prisma.contract.findMany({
    where: !isAdmin
      ? {
          storefront: {
            managers: { some: { id: userId } },
          },
        }
      : {},
    include: {
      storefront: {
        select: { name: true },
      },
      items: {
        select: { quantity: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const formattedContracts = contracts.map((contract) => {
    const isAdjustment =
      contract.items.length > 0 &&
      contract.items.every((item) => item.quantity === 0)

    return {
      ...contract,
      isAdjustment,
    }
  })

  return decimalToNumber(formattedContracts)
}

const getContractDetails = async (id: string) => {
  const { userId, roles, isAuthenticated } = await getServerUser()

  if (!isAuthenticated || !userId) {
    return null
  }

  const isAdmin = roles.includes(Role.ADMIN)
  const isPOS = roles.includes(Role.POS)

  if (!isAdmin && !isPOS) {
    return null
  }

  const baseContract = await prisma.contract.findUnique({
    where: { id },
    select: { storefrontId: true },
  })

  if (!baseContract) {
    return null
  }

  const contract = await prisma.contract.findFirst({
    where: {
      id,
      ...(!isAdmin && {
        storefront: {
          managers: {
            some: { id: userId },
          },
        },
      }),
    },
    include: {
      storefront: {
        include: {
          managers: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      items: {
        include: {
          product: {
            select: {
              price: true,
              images: true,
              storefrontInventories: {
                where: {
                  storefrontId: baseContract.storefrontId,
                },
                select: {
                  stockQuantity: true,
                },
              },
            },
          },
          variant: {
            select: {
              name: true,
              price: true,
              storefrontInventories: {
                where: {
                  storefrontId: baseContract.storefrontId,
                },
                select: {
                  stockQuantity: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!contract) {
    return null
  }

  return decimalToNumber(contract)
}

const updateContractStatus = async (
  id: string,
  status: ContractStatus,
  storeSignature?: string,
) =>
  withRole([Role.ADMIN, Role.POS], async (userId) => {
    const { roles } = await getServerUser()
    const isAdmin = roles.includes(Role.ADMIN)

    try {
      if (!isAdmin) {
        const check = await prisma.contract.findFirst({
          where: {
            id,
            storefront: { managers: { some: { id: userId } } },
          },
        })

        if (!check) {
          return fail(ERROR_CODES.UNAUTHORIZED)
        }

        if (status === ContractStatus.DRAFT) {
          return fail(ERROR_CODES.FORBIDDEN)
        }
      }

      return await prisma.$transaction(async (tx) => {
        const contract = await tx.contract.update({
          where: { id },
          data: {
            status,
            ...(status === ContractStatus.ACTIVE && {
              storeSignature,
              signedAt: new Date(),
            }),
          },
          include: { items: true },
        })

        if (status === ContractStatus.ACTIVE) {
          for (const item of contract.items) {
            const isVariant = !!item.variantId
            const targetId = item.variantId || item.productId

            if (item.quantity > 0) {
              if (isVariant) {
                await tx.productVariant.update({
                  where: { id: targetId },
                  data: { stockQuantity: { decrement: item.quantity } },
                })
              } else {
                await tx.product.update({
                  where: { id: targetId },
                  data: { stockQuantity: { decrement: item.quantity } },
                })
              }
            }

            let currentRetailPrice = 0
            if (isVariant) {
              const v = await tx.productVariant.findUnique({
                where: { id: item.variantId! },
                select: { price: true },
              })
              currentRetailPrice = Number(v?.price || item.agreedPrice)
            } else {
              const p = await tx.product.findUnique({
                where: { id: item.productId },
                select: { price: true },
              })
              currentRetailPrice = Number(p?.price || item.agreedPrice)
            }

            await tx.storefrontInventory.upsert({
              where: {
                storefrontId_productId_variantId: {
                  storefrontId: contract.storefrontId,
                  productId: item.productId,
                  variantId: item.variantId || '',
                },
              },
              update: {
                stockQuantity: { increment: item.quantity },
                netPrice: item.agreedPrice,
                retailPrice: currentRetailPrice,
              },
              create: {
                storefrontId: contract.storefrontId,
                productId: item.productId,
                variantId: item.variantId,
                stockQuantity: item.quantity,
                netPrice: item.agreedPrice,
                retailPrice: currentRetailPrice,
              },
            })

            await tx.stockHistory.create({
              data: {
                productId: item.productId,
                variantId: item.variantId,
                userId: userId!,
                quantity: item.quantity,
                type:
                  item.quantity > 0
                    ? StockMovementType.TRANSFER
                    : StockMovementType.ADJUSTMENT,
                toStorefrontId: contract.storefrontId,
                reference: contract.id,
                note:
                  item.quantity > 0
                    ? `โอนสินค้าและปรับราคาตามสัญญา #${contract.id.slice(-8).toUpperCase()}`
                    : `ปรับปรุงราคาต้นทุนตามสัญญา #${contract.id.slice(-8).toUpperCase()} (สต็อกเดิม)`,
              },
            })
          }
        }

        revalidatePath('/dashboard/contracts')
        revalidatePath(`/dashboard/storefronts/${contract.storefrontId}`)

        return ok(contract.id)
      })
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const checkStorefrontContract = async (storefrontId: string) => {
  const { userId, isAuthenticated } = await getServerUser()

  if (!isAuthenticated || !userId || !storefrontId) {
    return null
  }

  const now = new Date()

  const contract = await prisma.contract.findFirst({
    where: {
      storefrontId,
      status: ContractStatus.ACTIVE,
      startDate: { lte: now },
      OR: [{ endDate: null }, { endDate: { gte: now } }],
    },
    select: {
      id: true,
      status: true,
      endDate: true,
    },
  })

  return decimalToNumber(contract)
}

export type { ContractListItem, ContractItemPayload }
export {
  checkStorefrontContract,
  createContract,
  updateContract,
  deleteContract,
  getContractsAdmin,
  getContractDetails,
  updateContractStatus,
}
