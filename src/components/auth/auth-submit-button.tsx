import { Loader2 } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ButtonProps = ComponentProps<typeof Button>

export function AuthSubmitButton({
  loading,
  loadingLabel,
  children,
  className,
  shape = 'figma',
  ...props
}: ButtonProps & {
  loading: boolean
  /** Shown next to spinner while `loading` */
  loadingLabel: string
  /** `figma` uses 8px radius / 54px height per Login frame. */
  shape?: 'figma' | 'pill'
}) {
  return (
    <Button
      type="submit"
      disabled={loading || props.disabled}
      className={cn(
        'w-full max-w-[440px] text-sm font-semibold text-primary-foreground transition hover:bg-primary/90',
        shape === 'figma'
          ? 'h-[54px] rounded-lg bg-primary shadow-md shadow-primary/15'
          : 'h-12 rounded-full bg-primary shadow-lg shadow-primary/20',
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
