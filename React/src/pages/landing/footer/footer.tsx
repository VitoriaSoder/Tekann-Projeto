import { Logo } from '@/components/brand/logo'
import { Heading } from '@/components/common/heading'
import { Text } from '@/components/common/text'

export function Footer() {


  return (
    <footer className="py-24 border-t border-border bg-background">
      <div className="container px-6 flex flex-col items-center gap-16 text-center">
        <div className="flex flex-col gap-6 items-center">
          <div className="flex items-center gap-2">
            <Logo size={24} strokeWidth={2.5} showText={false} />
            <Heading level={3} className="text-2xl font-black tracking-tighter uppercase text-foreground m-0">
              SportsCourt
            </Heading>
          </div>
          <Text
            variant="muted"
            tKey="common:landing.finalCta.subtitle"
            className="text-base font-medium max-w-sm leading-relaxed"
          />
        </div>

        <div className="flex flex-col gap-8 items-center pt-8 border-t border-border w-full max-w-4xl">
          <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
            © 2026 SportsCourt • <Text as="span" variant="inherit" tKey="common:landing.finalCta.title" />
          </Text>
        </div>
      </div>
    </footer>
  )
}
