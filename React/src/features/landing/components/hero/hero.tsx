import { HeroTitle } from './hero-title'
import { HeroCTA } from './hero-cta'
import playerImg from '@/assets/images/Elite_tennis_player_202604172141.png'
import { useTranslation } from 'react-i18next'
import { Text } from '@/components/common/text'

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative w-full min-h-screen flex items-center bg-background overflow-hidden pt-24 pb-20">
      <div className="absolute inset-0 z-0">
        <img 
          src={playerImg} 
          alt={t('common:landing.hero.imageAlt')}
          className="w-full h-full object-cover object-top opacity-30 md:opacity-40" 
          fetchPriority="high"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent md:via-background/10" />
      </div>
      <div className="container relative z-10 px-6">
        <div className="max-w-4xl">
          <HeroTitle />
          <Text variant="none" className="text-lg md:text-xl font-medium mb-12 max-w-2xl leading-relaxed mt-8 text-muted-foreground">
            <Text as="span" variant="inherit" tKey="common:landing.hero.subtitle1" />{" "}
            <Text as="span" variant="bold" tKey="common:landing.hero.subtitle2" className="text-foreground" />{" "}
            <Text as="span" variant="inherit" tKey="common:landing.hero.subtitle3" />
          </Text>
          <HeroCTA />
        </div>
      </div>
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  )
}
