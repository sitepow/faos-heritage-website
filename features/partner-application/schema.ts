import { ApplicationStatus } from '@prisma/client'
import { z } from 'zod'

export const partnerApplicationSchema = z.object({
  id: z.string().optional(),
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  category: z.string().min(1, 'Category is required'),
  website: z.url('Invalid website URL').optional().or(z.literal('')),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long'),
  productSamples: z.string().min(1, 'Product samples description is required'),
  reasonToJoin: z.string().min(1, 'Reason to join is required'),
  status: z.enum(ApplicationStatus).default(ApplicationStatus.PENDING),
  adminNote: z.string().optional().nullable(),
})

export type PartnerApplicationInput = z.input<typeof partnerApplicationSchema>
