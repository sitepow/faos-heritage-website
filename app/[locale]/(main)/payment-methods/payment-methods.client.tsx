'use client'

import { Accordion, AccordionItem } from '@heroui/react'

import { StepItem } from './_components/StepItem'

interface Props {
  data: {
    howToShop: { title: string; steps: string[] }
    card: { title: string; accepted: string; security: string }
    qr: { title: string; method: string; note: string }
    atStore: {
      title: string
      description: string
      locations: string[]
      note: string
    }
  }
}

const PaymentMethodsClient = ({ data }: Props) => {
  return (
    <Accordion variant='splitted'>
      <AccordionItem title={data.howToShop.title}>
        {data.howToShop.steps.map((step, index) => (
          <StepItem key={index} index={index} text={step} />
        ))}
      </AccordionItem>

      <AccordionItem className='text-start' title={data.card.title}>
        <p>{data.card.accepted}</p>
        <p>{data.card.security}</p>
      </AccordionItem>

      <AccordionItem className='text-start' title={data.qr.title}>
        <p>{data.qr.method}</p>
        <p>{data.qr.note}</p>
      </AccordionItem>

      <AccordionItem className='text-start' title={data.atStore.title}>
        <p>{data.atStore.description}</p>

        <div className='my-2.5 flex flex-col gap-1.5'>
          {data.atStore.locations.map((loc, idx) => (
            <StepItem key={idx} index={idx} text={loc} />
          ))}
        </div>

        <p>{data.atStore.note}</p>
      </AccordionItem>
    </Accordion>
  )
}

export { PaymentMethodsClient }
