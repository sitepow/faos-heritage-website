'use client'

import { Accordion, AccordionItem } from '@heroui/accordion'

import { Header } from '../_components/section/header'

const Payment = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <Header
        description='Details of supported payment methods and channels'
        title='Payment Methods'
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
                <strong className='text-primary-website'>“Add to Cart”</strong>
              </p>
              <p>2. Open your cart to review the selected items</p>
              <p>
                3. When you are ready to pay, click{' '}
                <strong className='text-primary-website'>“Place Order”</strong>
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
                <strong className='text-primary-website'>
                  {' '}
                  Visa, Mastercard, or JCB
                </strong>{' '}
                logo, including virtual cards issued by banks.
              </p>
              <p>Steps:</p>
              <ul className='list-disc space-y-2 pl-5'>
                <li>
                  Enter your card number, expiration date, and CVC as shown on
                  your card
                </li>
                <li>Complete OTP verification if required by your bank</li>
                <li>
                  After successful payment, a confirmation email will be sent
                  automatically
                </li>
              </ul>
              <p className='text-default-500'>
                Your card information is encrypted and processed directly by
                Stripe. We do not have access to your card details.
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
                If you choose to pay via{' '}
                <strong className='text-primary-website'>
                  PromptPay QR Code
                </strong>
                , a payment QR code will be generated automatically on Stripe’s
                checkout page.
              </p>

              <p>Steps:</p>
              <ul className='list-disc space-y-2 pl-5'>
                <li>
                  Select{' '}
                  <strong className='text-primary-website'>
                    PromptPay (QR Code)
                  </strong>{' '}
                  as your payment method
                </li>
                <li>Scan the QR code using your mobile banking app</li>
                <li>
                  Complete the payment and wait for confirmation (usually within
                  a few seconds)
                </li>
                <li>Your order status will be updated automatically</li>
              </ul>

              <p className='text-default-500'>
                Supported by all Thai banks that offer PromptPay QR scanning.
              </p>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}

export default Payment
