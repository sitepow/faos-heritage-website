'use client'

import { Accordion, AccordionItem } from '@heroui/react'

import { SectionHeader } from '@/components/common/heading'

export const PaymentClient = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <SectionHeader
        description='Details of supported payment methods and channels'
        title='Payments'
      />

      <div className='mx-auto lg:w-1/2'>
        <Accordion variant='splitted'>
          <AccordionItem
            key='1'
            aria-label='How to start purchasing products'
            title='How to Start Shopping'
          >
            <div className='space-y-3 text-left'>
              <p>
                1. Select the product you want and click{' '}
                <span className='decoration-primary underline decoration-dotted underline-offset-4'>
                  “Add to Cart”
                </span>
              </p>
              <p>2. Open your cart to review the selected items</p>
              <p>
                3. When you are ready to pay, click{' '}
                <span className='decoration-primary underline decoration-dotted underline-offset-4'>
                  “Place Order”
                </span>
              </p>
              <p>4. You will be redirected to Stripe’s secure checkout page</p>
            </div>
          </AccordionItem>

          <AccordionItem
            key='2'
            aria-label='How to pay with debit or credit card'
            title='Pay with Debit / Credit Card'
          >
            <div className='space-y-3 text-left'>
              <p>
                We accept debit and credit cards from all banks with the
                <span className='decoration-primary underline decoration-dotted underline-offset-4'>
                  {' '}
                  Visa, Mastercard, or JCB
                </span>{' '}
                logo, including virtual cards issued by banks.
              </p>
            </div>
          </AccordionItem>

          <AccordionItem
            key='3'
            aria-label='How to pay using QR Code'
            title='Pay with QR Code'
          >
            <div className='space-y-3 text-left'>
              <p>
                Pay via{' '}
                <span className='decoration-primary underline decoration-dotted underline-offset-4'>
                  PromptPay QR Code
                </span>{' '}
                supported by all Thai banks.
              </p>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
