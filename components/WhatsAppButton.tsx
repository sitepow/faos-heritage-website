import { MessageCircle } from 'lucide-react'
import React from 'react'

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/qr/64AMGOIJSFXTF1`

  return (
    <a
      aria-label='Chat on WhatsApp'
      className='fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-600'
      href={whatsappUrl}
      rel='noopener noreferrer'
      target='_blank'
    >
      <MessageCircle className='h-8 w-8' />
    </a>
  )
}
