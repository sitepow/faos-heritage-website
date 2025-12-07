import { FileEditIcon } from 'lucide-react'

const About = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center text-default-500'>
      <FileEditIcon className='size-10' />
      <span className='text-center lg:max-w-1/2'>
        เนื่องจาก <span className='text-primary-website'>ZentraCore</span>{' '}
        เป็นซอฟต์แวร์ร้านค้าที่สามารถให้ผู้ใช้งานปรับแต่งได้ตามความต้องการ
        รวมถึงหน้าต่างๆ เช่นหน้า “เกี่ยวกับเรา” หากท่านซื้อซอฟต์แวร์ของเราแล้ว
        สามารถแจ้งความต้องการเพื่อให้เราปรับแก้หน้าเกี่ยวกับเราได้ทันที
        หรือหากต้องการแก้ไขเอง ก็สามารถแก้ไขได้ที่ไฟล์{' '}
        <span className='text-primary-website'>app/(main)/about/page.tsx</span>{' '}
        ภายในโปรเจกต์
      </span>
    </section>
  )
}

export default About
