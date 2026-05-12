import { Heading } from '@/components/common/heading'
import { Text } from '@/components/common/text'

export function HeroTitle() {
  return (
    <Heading level={1} className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-foreground">
      <Text as="span" variant="inherit" tKey="common:landing.hero.title1" />
      <br />
      <Text as="span" variant="none" tKey="common:landing.hero.title2" className="text-muted-foreground" />
    </Heading>
  )
}
