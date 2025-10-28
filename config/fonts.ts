import localFont from 'next/font/local'

export const fontSukhumvit = localFont({
  src: [
    {
      path: './fonts/SukhumvitSet-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/SukhumvitSet-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/SukhumvitSet-Text.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/SukhumvitSet-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/SukhumvitSet-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/SukhumvitSet-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sukhumvit',
  display: 'swap',
})
