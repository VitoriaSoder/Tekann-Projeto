import { useTranslation } from 'react-i18next'
import { Box } from '@/components/common/box'
import { Container } from '@/components/common/container'
import { Heading } from '@/components/common/heading'
import { Text } from '@/components/common/text'
import dashboardImg from '@/assets/images/dashboard-mockup.png'
import mobileImg from '@/assets/images/mobile-mockup.png'

export function MockupSection() {
  const { t } = useTranslation()

  return (
    <Box className="py-24 bg-muted/30 overflow-hidden">
      <Container>
        <Box className="flex flex-col items-center text-center mb-20">
          <Heading level={2} className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-8">
            <Text as="span" variant="inherit" tKey="common:landing.mockups.title1" />{" "}
            <Text as="span" variant="none" tKey="common:landing.mockups.title2" className="text-primary" />
          </Heading>
          <Text variant="muted" tKey="common:landing.mockups.subtitle" className="text-lg max-w-2xl font-medium" />
        </Box>
        
        <Box className="relative">
          <Box className="relative z-10 rounded-3xl border-[8px] border-card shadow-xl overflow-hidden bg-card max-w-4xl mx-auto">
            <img 
              src={dashboardImg} 
              alt="Quadra de Padel profissional ultra moderna" 
              className="w-full h-auto"
            />
          </Box>
          
          <Box className="absolute -bottom-10 -right-5 md:right-10 z-20 w-40 md:w-64 rounded-[2.5rem] border-[6px] border-black shadow-2xl overflow-hidden bg-black transform rotate-3 hidden sm:block">
            <img 
              src={mobileImg} 
              alt="Jogador de tênis em ação" 
              className="w-full h-auto"
            />
          </Box>
          
          <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-primary/20 blur-[120px] -z-10 rounded-full" />
        </Box>
      </Container>
    </Box>
  )
}
