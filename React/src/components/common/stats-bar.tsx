import { Heading } from "./heading"
import { Text } from "./text"

export interface StatsItemProps {
  value: string
  label?: string
  tKey?: string
}

export interface StatsBarProps {
  items: StatsItemProps[]
}

export function StatsBar({ items }: StatsBarProps) {
  return (
    <div className="flex justify-center gap-12 border-b border-border py-12 bg-card flex-wrap text-center">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <Heading level={3} className="text-3xl font-semibold leading-none text-foreground m-0">
            {item.value}
          </Heading>
          <Text variant="muted" tKey={item.tKey} className="mt-2 text-sm">
            {item.label}
          </Text>
        </div>
      ))}
    </div>
  )
}

