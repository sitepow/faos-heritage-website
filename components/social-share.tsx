import { SocialIcon } from 'react-social-icons'

const SocialShare = () => {
  return (
    <div className='flex items-center gap-2'>
      <span>แชร์ : </span>

      <SocialIcon network='facebook' style={{ width: 35, height: 35 }} />
      <SocialIcon network='telegram' style={{ width: 35, height: 35 }} />
      <SocialIcon network='line.me' style={{ width: 35, height: 35 }} />
      <SocialIcon network='x' style={{ width: 35, height: 35 }} />
      <SocialIcon network='discord' style={{ width: 35, height: 35 }} />
      <SocialIcon network='sharethis' style={{ width: 35, height: 35 }} />
      <SocialIcon network='threads' style={{ width: 35, height: 35 }} />
    </div>
  )
}

export { SocialShare }
