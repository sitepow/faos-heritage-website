import { PlanType } from '@prisma/client'
import {
  BadgeCheck,
  Headset,
  InfinityIcon,
  ListOrdered,
  Percent,
  TrendingUp,
} from 'lucide-react'
import React from 'react'

export const PLANS = [
  {
    type: PlanType.STARTER,
    title: 'ขนาดเล็ก',
    description:
      'เหมาะสำหรับร้านอาหารขนาดเล็กที่ต้องการเริ่มต้นธุรกิจร่วมกับฟาวส์',
    displayPrice: 15000,
    currency: 'THB / Year',
    buttonText: 'Get Started',
    logic: {
      maxSku: 5,
      commissionRate: 15.0,
    },
    features: [
      {
        text: '15% Commission',
        icon: React.createElement(Percent, { size: 18 }),
      },
      {
        text: 'Up to 5 Listings',
        icon: React.createElement(ListOrdered, { size: 18 }),
      },
      {
        text: 'Standard Support',
        icon: React.createElement(Headset, { size: 18 }),
      },
    ],
  },
  {
    type: PlanType.STANDARD,
    title: 'ขนาดมาตรฐาน ',
    description:
      'ร้านค้าที่ต้องการขยายธุรกิจและเพิ่มยอดขายด้วยฟีเจอร์ที่มากขึ้นและค่าคอมมิชชั่นที่ต่ำกว่า',
    displayPrice: 30000,
    currency: 'THB / Year',
    isPopular: true,
    buttonText: 'Join as Partner',
    logic: {
      maxSku: 25,
      commissionRate: 10.0,
    },
    features: [
      {
        text: '10% Commission',
        icon: React.createElement(Percent, { size: 18 }),
      },
      {
        text: 'Up to 25 Listings',
        icon: React.createElement(ListOrdered, { size: 18 }),
      },
      {
        text: 'Advanced Analytics',
        icon: React.createElement(TrendingUp, { size: 18 }),
      },
    ],
  },
  {
    type: PlanType.PREMIUM,
    title: 'พรีเมียม',
    description:
      'สำหรับนักลงทุนสายธุรกิจที่ต้องการขยายธุรกิจอย่างเต็มรูปแบบและเข้าถึงฟีเจอร์พิเศษทั้งหมด',
    displayPrice: 50000,
    currency: 'THB / Year',
    buttonText: 'Upgrade to Premium',
    logic: {
      maxSku: 999999,
      commissionRate: 0.0,
    },
    features: [
      {
        text: '0% Commission',
        icon: React.createElement(Percent, { size: 18 }),
      },
      {
        text: 'Unlimited Listings',
        icon: React.createElement(InfinityIcon, { size: 18 }),
      },
      {
        text: 'Verified Partner Status',
        icon: React.createElement(BadgeCheck, { size: 18 }),
      },
    ],
  },
]
