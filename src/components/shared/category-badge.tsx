import { cn } from '@/lib/utils'
import { styleForCategory } from '@/data/categoryStyles'

export function CategoryBadge({
  category,
  className,
}: {
  category: string
  className?: string
}) {
  const s = styleForCategory(category)
  return (
    <span
      className={cn(
        'inline-flex max-w-[200px] items-center truncate rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        s.badge,
        className,
      )}
    >
      {category}
    </span>
  )
}
