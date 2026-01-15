'use client'

import { Card, CardBody } from '@heroui/react'
import Image from 'next/image'

export const MarketplaceBanner = () => {
  return (
    <Card fullWidth radius='none' className='min-h-[350px]'>
      <CardBody
        className='flex w-full flex-col items-center justify-center gap-10 px-5 py-12 text-white'
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.7), rgba(0,0,0,1)),
            url(https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2 className='mx-auto max-w-11/12 text-center text-xl leading-tight font-semibold sm:max-w-10/12 sm:text-2xl md:max-w-1/2 xl:max-w-1/3'>
          อีกขั้นของความสำเร็จ... วันนี้เราพร้อมวางจำหน่ายแล้วที่ห้างสรรพสินค้า
          และแพลตฟอร์มออนไลน์ชั้นนำ
        </h2>

        <div className='flex max-w-4xl flex-wrap justify-center gap-2'>
          <Image
            src={'/images/market/food-land.jpg'}
            width={200}
            height={200}
            alt=''
            className='object-contain'
          />
          <Image
            src={'/images/market/villa-market.jpg'}
            width={200}
            height={200}
            alt=''
            className='object-contain'
          />
          <Image
            src={'/images/market/lazada.png'}
            width={200}
            height={200}
            alt=''
            className='object-contain'
          />
          <Image
            src={'/images/market/shopee.png'}
            width={200}
            height={200}
            alt=''
            className='object-contain'
          />
        </div>

        <div className='flex flex-col justify-center gap-4 text-center'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.7647160757874!2d100.5608179!3d13.732689800000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f1d78e70295%3A0x65672fcbcdb9c20d!2z4Lif4Li54LmJ4LiU4LmB4Lil4LiZ4LiU4LmM!5e0!3m2!1sth!2sth!4v1768481262322!5m2!1sth!2sth'
            width={600}
            height={450}
            style={{ border: 0 }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          />
          <div className='flex flex-col gap-1'>
            <span className='text-lg font-bold'>
              📍 สัมผัสสินค้าจริงได้แล้ววันนี้ที่ Foodland และ Villa Market
            </span>
            <span className='text-sm text-gray-500'>
              ใกล้ที่ไหน แวะไปช้อปที่นั่นได้เลย!
              อีกหนึ่งช่องทางเพื่อความสะดวกของคุณ
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
