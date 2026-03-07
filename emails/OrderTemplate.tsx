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
      subject: `ยืนยันการสั่งซื้อ #${id} (รอชำระเงิน)`,
      preview:
        'ขอบคุณสำหรับการสั่งซื้อ โปรดดำเนินการชำระเงินเพื่อยืนยันออเดอร์',
      heading: 'คำสั่งซื้อรอการชำระเงิน',
      message: `ขอบคุณสำหรับการสั่งซื้อ #${id} ขณะนี้ระบบกำลังรอการยืนยันยอดชำระเงินเพื่อดำเนินการในขั้นตอนถัดไป`,
    },
    [OrderStatus.PAID]: {
      subject: `ได้รับยอดชำระเงินสำหรับคำสั่งซื้อ #${id} เรียบร้อยแล้ว`,
      preview: 'เราได้รับยอดชำระเงินของคุณแล้ว',
      heading: 'ชำระเงินเรียบร้อยแล้ว',
      message: `ได้รับยอดชำระเงินสำหรับคำสั่งซื้อ #${id} เรียบร้อยแล้ว ขณะนี้เรากำลังเตรียมข้อมูลเพื่อดำเนินการให้คุณโดยเร็วที่สุด`,
    },
    [OrderStatus.PROCESSING]: {
      subject: `คำสั่งซื้อ #${id} กำลังอยู่ระหว่างการจัดเตรียม`,
      preview: 'สินค้าของคุณกำลังถูกจัดเตรียม',
      heading: 'กำลังเตรียมรายการสินค้า',
      message: `เรากำลังจัดเตรียมสินค้าสำหรับคำสั่งซื้อ #${id} และจะแจ้งให้ทราบทันทีเมื่อสินค้าพร้อมสำหรับการดำเนินการขั้นถัดไป`,
    },
    [OrderStatus.READY_FOR_PICKUP]: {
      subject: `คำสั่งซื้อ #${id} พร้อมสำหรับการรับสินค้าแล้ว`,
      preview: 'คุณสามารถมารับสินค้าได้ตามสาขาที่ระบุ',
      heading: 'สินค้าพร้อมสำหรับการรับแล้ว',
      message: `สินค้าสำหรับคำสั่งซื้อ #${id} ได้ถูกจัดเตรียมเรียบร้อยแล้ว คุณสามารถเดินทางมารับสินค้าได้ที่สาขาตามข้อมูลด้านล่างนี้`,
    },
    [OrderStatus.DELIVERED]: {
      subject: `คำสั่งซื้อ #${id} สำเร็จเรียบร้อยแล้ว`,
      preview: 'ขอบคุณที่ไว้วางใจเลือกซื้อสินค้ากับเรา',
      heading: 'คำสั่งซื้อสำเร็จเรียบร้อยแล้ว',
      message: `คำสั่งซื้อ #${id} ได้ดำเนินการเสร็จสิ้นเรียบร้อยแล้ว ขอบคุณที่คุณไว้วางใจเลือกซื้อสินค้าจาก FAOS เราหวังว่าจะได้ให้บริการคุณอีกในครั้งถัดไป`,
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
          <Text style={text}>สวัสดีคุณ {shippingName || 'ลูกค้า'},</Text>
          <Text style={text}>{config.message}</Text>

          {status === OrderStatus.READY_FOR_PICKUP && isPickup && (
            <Section style={infoBlock}>
              <Text style={infoTitle}>ข้อมูลการรับสินค้า</Text>
              <Text style={text}>
                <strong>สถานที่รับ:</strong>{' '}
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
