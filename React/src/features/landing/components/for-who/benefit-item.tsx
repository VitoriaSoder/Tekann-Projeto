interface BenefitItemProps {
  text: string
  highlight?: boolean
}
export function BenefitItem({ text, highlight = false }: BenefitItemProps) {
  return (
    <li className="flex gap-4 items-start">
      <div className={`mt-1 rounded-full p-1.5 flex-shrink-0 flex items-center justify-center ${highlight ? 'bg-primary/20 text-primary' : 'bg-primary text-black'}`}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <p className={`text-lg font-medium leading-snug ${highlight ? 'opacity-90' : 'text-foreground'}`}>
          {text}
        </p>
      </div>
    </li>
  )
}
