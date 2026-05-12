import { useScrollReveal } from '@/logic/hooks/use-scroll-reveal'
import { useTranslation } from 'react-i18next'
import { AudienceCard } from './audience-card'

import { SectionHeader } from '@/components/common/section-header'

export function ForWho() {
  const revealRef = useScrollReveal()
  const { t } = useTranslation()

  const audiences = [
    {
      key: 'managers',
      highlight: true,
      ctaHref: '/auth/register'
    },
    {
      key: 'users',
      ctaHref: '/auth/register'
    }
  ]

  return (
    <section id="for-who" ref={revealRef} className="py-24 bg-background opacity-0 transition-all duration-1000">
      <div className="container px-6">
        <SectionHeader
          title1Key="common:landing.forWho.title1"
          title2Key="common:landing.forWho.title2"
          subtitleKey="common:landing.forWho.subtitle"
          align="start"
          highlightColor="muted"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {audiences.map((audience) => (
            <AudienceCard
              key={audience.key}
              badgeKey={`common:landing.forWho.${audience.key}.badge`}
              titleKey={`common:landing.forWho.${audience.key}.title`}
              benefits={t(`common:landing.forWho.${audience.key}.benefits`, { returnObjects: true }) as string[]}
              ctaLabelKey="common:landing.hero.cta.start"
              ctaHref={audience.ctaHref}
              highlight={audience.highlight}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
