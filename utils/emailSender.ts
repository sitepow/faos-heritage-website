import type React from 'react'

import { resend } from '@/lib/mail'

interface Params {
  to: string | string[]
  subject: string
  react: React.ReactElement
}

const sendEmail = async ({ to, subject, react }: Params) => {
  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: Array.isArray(to) ? to : [to],
    subject,
    react,
  })

  if (error) {
    return { success: false, error }
  }

  return { success: true, data }
}

export { sendEmail }
