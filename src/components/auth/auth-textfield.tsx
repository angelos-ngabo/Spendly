import type { ComponentProps, ReactNode } from 'react'
import { AuthFieldError } from '@/components/auth/auth-field-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type InputProps = ComponentProps<typeof Input>

export function AuthTextField({
  id,
  label,
  error,
  className,
  inputClassName,
  leadingIcon,
  labelEnd,
  appearance = 'default',
  ...inputProps
}: InputProps & {
  id: string
  label: string
  error?: string
  inputClassName?: string
  leadingIcon?: ReactNode
  /** e.g. information icon (Figma title row). */
  labelEnd?: ReactNode
  /** `figma` matches Login frame inputs (label row + 4px radius field). */
  appearance?: 'default' | 'figma'
}) {
  const figma = appearance === 'figma'

  return (
    <div className={cn('grid gap-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <Label
          htmlFor={id}
          className={cn(
            'text-sm font-semibold',
            figma ? 'text-muted-foreground' : 'font-medium text-foreground',
          )}
        >
          {label}
        </Label>
        {labelEnd ? <span className="shrink-0 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">{labelEnd}</span> : null}
      </div>
      <div className="relative">
        {leadingIcon ? (
          <span
            className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-muted-foreground [&_svg]:h-[1.05rem] [&_svg]:w-[1.05rem]"
            aria-hidden
          >
            {leadingIcon}
          </span>
        ) : null}
        <Input
          id={id}
          className={cn(
            figma
              ? 'h-12 rounded border border-border bg-background px-3 py-2 text-sm shadow-none transition-colors focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/25'
              : 'h-12 rounded-2xl border-border/80 bg-muted/25 shadow-sm focus-visible:border-primary/45 focus-visible:bg-background focus-visible:ring-primary/20',
            leadingIcon ? 'pl-10' : null,
            inputClassName,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...inputProps}
        />
      </div>
      <AuthFieldError id={`${id}-error`} message={error} />
    </div>
  )
}
