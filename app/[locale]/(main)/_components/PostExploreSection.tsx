'use client'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { PostList } from '@/components/ui/Post/PostList'
import { SectionHeader } from '@/components/ui/SectionHeader'

const PostExploreSection = () => {
  return (
    <Container>
      <AppSection>
        <SectionHeader
          //   description={tShared('productDiscovery.description')}
          //   title={tShared('productDiscovery.title')}
          description={'สำรวจบทความและสาระน่ารู้จากเรา'}
          title={'บทความ'}
        />
        <PostList />
      </AppSection>
    </Container>
  )
}

export { PostExploreSection }
