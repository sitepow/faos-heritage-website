/* eslint-disable @typescript-eslint/no-explicit-any */
import { AffiliateStatus } from '@prisma/client'
import { z } from 'zod'

const affiliateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(Object.values(AffiliateStatus) as [string, ...string[]]),
})

const getAffiliateProfileSchema = (t: any) =>
  z
    .object({
      phoneNumber: z
        .string()
        .min(1, t('validation.phoneRequired'))
        .regex(
          /^[+]?[(]?[0-9]{3,4}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{4,6}$/,
          t('validation.phoneInvalid'),
        ),
      socialMedia: z.string().min(1, t('validation.socialRequired')),
      payoutMethod: z.enum(['THAI_BANK', 'DIGITAL_WALLET', 'PAYPAL']),
      bankName: z.string().optional(),
      bankAccountNo: z.string().optional(),
      bankAccountName: z.string().optional(),
      bankAccountImage: z.string().optional(),
      walletNetwork: z.string().optional(),
      walletAddress: z.string().optional(),
      payoutEmail: z
        .string()
        .email(t('validation.emailInvalid'))
        .optional()
        .or(z.literal('')),
      idCardImage: z.string().min(1, t('validation.idCardRequired')),
    })
    .superRefine((data, ctx) => {
      if (data.payoutMethod === 'THAI_BANK') {
        if (!data.bankName) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.bankRequired'),
            path: ['bankName'],
          })
        }
        if (!data.bankAccountNo) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.accountNoRequired'),
            path: ['bankAccountNo'],
          })
        } else if (!/^\d{10,12}$/.test(data.bankAccountNo)) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.accountNoDigits'),
            path: ['bankAccountNo'],
          })
        }
        if (!data.bankAccountName) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.accountNameRequired'),
            path: ['bankAccountName'],
          })
        }
        if (!data.bankAccountImage) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.bankImageRequired'),
            path: ['bankAccountImage'],
          })
        }
      }

      if (data.payoutMethod === 'DIGITAL_WALLET') {
        if (!data.walletNetwork) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.networkRequired'),
            path: ['walletNetwork'],
          })
        }
        if (!data.walletAddress || data.walletAddress.trim() === '') {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.walletRequired'),
            path: ['walletAddress'],
          })
        } else {
          const address = data.walletAddress.trim()
          if (address.length < 26) {
            ctx.addIssue({
              code: 'custom',
              message: t('validation.walletShort'),
              path: ['walletAddress'],
            })
          }
          if (data.walletNetwork === 'TRC20' && !address.startsWith('T')) {
            ctx.addIssue({
              code: 'custom',
              message: t('validation.walletPrefixT'),
              path: ['walletAddress'],
            })
          } else if (
            data.walletNetwork === 'ERC20' ||
            data.walletNetwork === 'BEP20'
          ) {
            if (!address.startsWith('0x')) {
              ctx.addIssue({
                code: 'custom',
                message: t('validation.walletPrefix0x'),
                path: ['walletAddress'],
              })
            } else if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
              ctx.addIssue({
                code: 'custom',
                message: t('validation.walletInvalidEVM'),
                path: ['walletAddress'],
              })
            }
          }
        }
      }

      if (
        data.payoutMethod === 'PAYPAL' &&
        (!data.payoutEmail || data.payoutEmail.trim() === '')
      ) {
        ctx.addIssue({
          code: 'custom',
          message: t('validation.paypalRequired'),
          path: ['payoutEmail'],
        })
      }
    })

export { affiliateStatusSchema, getAffiliateProfileSchema }
export type AffiliateProfileInput = z.infer<
  ReturnType<typeof getAffiliateProfileSchema>
>
