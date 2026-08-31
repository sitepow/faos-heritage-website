/* eslint-disable react/no-array-index-key */
import { OrderStatus, DeliveryType } from '@prisma/client'
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'

import type { Prisma } from '@prisma/client'

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true; storefront: true }
}>

interface Props {
  order: OrderWithItems
}

const getOrderContent = (status: OrderStatus, id: string) => {
  const contents: Record<
    OrderStatus,
    { subject: string; preview: string; heading: string; message: string }
  > = {
    [OrderStatus.PENDING]: {
      subject: `Confirm order#${id} (Waiting Payment)`,
      preview:
        'Thank you for your order. Please proceed with payment to confirm your order.',
      heading: 'Order placed awaiting payment.',
      message: `Thank you for your order. #${id} The system is currently awaiting payment confirmation before proceeding to the next step.`,
    },
    [OrderStatus.PAID]: {
      subject: `Payment has been received for the order. #${id} Completed`,
      preview: 'We have received your payment.',
      heading: 'Payment has been completed.',
      message: `Payment has been received for the purchase order. #${id} Your request is complete. We are now preparing the information to process your request as soon as possible.`,
    },
    [OrderStatus.PROCESSING]: {
      subject: `Order #${id} Currently being prepared.`,
      preview: 'Your order is being prepared.',
      heading: 'กPreparing the product.',
      message: `We are preparing the goods for your order. #${id} We will notify you as soon as the product is ready for the next step.`,
    },
    [OrderStatus.READY_FOR_PICKUP]: {
      subject: `Order #${id} Ready for pickup.`,
      preview: 'You can pick up your order at the specified branch.',
      heading: 'The item is ready for pickup.',
      message: `Items for the order. #${id} Your order has been prepared. You can pick it up at the branch listed below.`,
    },
    [OrderStatus.DELIVERED]: {
      subject: `Order #${id} Successfully`,
      preview: 'Thank you for your trust in choosing to purchase products from us.',
      heading: 'คThe order has been successfully completed.',
      message: `Order #${id} The transaction has been completed successfully. Thank you for your trust in choosing FAOS. We hope to serve you again in the future.`,
    },
    [OrderStatus.CANCELLED]: {
      subject: `แจ้งยกเลิกคำสั่งซื้อ #${id}`,
      preview: 'คำสั่งซื้อของคุณถูกยกเลิกแล้ว',
      heading: 'คำสั่งซื้อถูกยกเลิก',
      message: `คำสั่งซื้อ #${id} ได้รับการยกเลิกเรียบร้อยแล้ว หากมีข้อสงสัยหรือต้องการความช่วยเหลือเพิ่มเติม โปรดติดต่อฝ่ายบริการลูกค้า`,
    },
    [OrderStatus.REFUNDED]: {
      subject: `ยืนยันการคืนเงินสำหรับคำสั่งซื้อ #${id}`,
      preview: 'เราได้ดำเนินการคืนเงินให้คุณเรียบร้อยแล้ว',
      heading: 'ดำเนินการคืนเงินเรียบร้อยแล้ว',
      message: `เราได้ดำเนินการคืนเงินสำหรับคำสั่งซื้อ #${id} แล้ว ยอดเงินจะคืนเข้าสู่บัญชีเดิมของคุณตามระยะเวลาและเงื่อนไขของธนาคารที่ให้บริการ`,
    },
  }
  return contents[status] || contents[OrderStatus.PENDING]
}

const OrderTemplate = ({ order }: Props) => {
  const {
    id,
    status,
    currency,
    total,
    subtotal,
    shippingCost,
    discount,
    shippingName,
    items,
    trackingNumber,
    trackingWebsite,
    deliveryType,
    storefront,
    shippingAddressText,
    shippingPhone,
  } = order

  const config = getOrderContent(status, id.slice(-8).toUpperCase())
  const isPickup = deliveryType === DeliveryType.PICKUP

  return (
    <Html>
      <Head />
      <Preview>{config.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{config.heading}</Heading>
          <Text style={text}>Hello {shippingName || 'Customer'},</Text>
          <Text style={text}>{config.message}</Text>

          {status === OrderStatus.READY_FOR_PICKUP && isPickup && (
            <Section style={infoBlock}>
              <Text style={infoTitle}>Product receiving information</Text>
              <Text style={text}>
                <strong>Devlivery to:</strong>{' '}
                {storefront?.name || 'หน้าร้านตามที่ระบุ'}
              </Text>
              <Text style={text}>
                <strong>ที่อยู่สาขา:</strong> {shippingAddressText}
              </Text>
              <Text style={text}>
                <strong>เบอร์โทรติดต่อสาขา:</strong> {shippingPhone}
              </Text>
            </Section>
          )}

          {status === OrderStatus.DELIVERED && !isPickup && trackingNumber && (
            <Section style={infoBlock}>
              <Text style={infoTitle}>ข้อมูลการจัดส่ง</Text>
              <Text style={text}>
                <strong>หมายเลขพัสดุ:</strong> {trackingNumber}
              </Text>
              {trackingWebsite && (
                <Link href={trackingWebsite} style={button}>
                  ติดตามสถานะพัสดุ
                </Link>
              )}
            </Section>
          )}

          <Section style={orderSummary}>
            <Text style={infoTitle}>สรุปรายการสั่งซื้อ</Text>
            {items.map((item, index) => {
              return (
                <Row key={index} style={itemRow}>
                  <Column>
                    <Text style={itemText}>
                      <strong>{item.productName}</strong>
                      {item.variantName && (
                        <span style={variantText}> ({item.variantName})</span>
                      )}
                      <br />
                      <span style={quantityText}>จำนวน: {item.quantity}</span>
                    </Text>
                  </Column>
                  <Column align='right'>
                    <Text style={itemText}>
                      {Number(item.subtotal).toLocaleString()} {currency}
                    </Text>
                  </Column>
                </Row>
              )
            })}

            <Hr style={hr} />

            <Row>
              <Column align='right'>
                <Text style={summaryText}>ยอดรวมสินค้า:</Text>
                <Text style={summaryText}>
                  {isPickup ? 'ค่าธรรมเนียมการรับ:' : 'ค่าจัดส่ง:'}
                </Text>
                {Number(discount) > 0 && (
                  <Text style={summaryText}>ส่วนลด:</Text>
                )}
                <Text style={totalText}>ยอดรวมสุทธิ:</Text>
              </Column>
              <Column align='right' style={{ width: '120px' }}>
                <Text style={summaryText}>
                  {Number(subtotal).toLocaleString()} {currency}
                </Text>
                <Text style={summaryText}>
                  {isPickup
                    ? 'ฟรี'
                    : `${Number(shippingCost).toLocaleString()} ${currency}`}
                </Text>
                {Number(discount) > 0 && (
                  <Text style={summaryText}>
                    -{Number(discount).toLocaleString()} {currency}
                  </Text>
                )}
                <Text style={totalText}>
                  {Number(total).toLocaleString()} {currency}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>FAOS - Organic Olive Oil & Natural Honey</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  width: '600px',
  backgroundColor: '#ffffff',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
}

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
}

const infoBlock = {
  padding: '20px',
  backgroundColor: '#f4f7ff',
  borderRadius: '8px',
  margin: '20px 0',
}

const infoTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '10px',
}

const orderSummary = {
  marginTop: '32px',
}

const itemRow = {
  paddingBottom: '8px',
}

const itemText = {
  fontSize: '14px',
  color: '#525f7f',
  margin: '4px 0',
}

const variantText = {
  fontSize: '12px',
  color: '#8898aa',
}

const quantityText = {
  fontSize: '12px',
  color: '#8898aa',
}

const summaryText = {
  fontSize: '14px',
  color: '#525f7f',
  margin: '4px 0',
}

const totalText = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  margin: '8px 0',
}

const button = {
  backgroundColor: '#1a1a1a',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  marginTop: '15px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '12px',
}

export { OrderTemplate, getOrderContent }
