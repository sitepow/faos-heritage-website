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
    title: 'Starter Partner',
    description:
      'Perfect for new brands looking to test the market and start selling.',
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
    title: 'Standard Partner',
    description:
      'For growing brands ready to scale with better visibility and insights.',
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
    title: 'Premium Partner',
    description:
      'The ultimate brand experience with zero commission and top-tier features.',
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
