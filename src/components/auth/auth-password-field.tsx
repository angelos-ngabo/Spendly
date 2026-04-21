import { useState, type ReactNode } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { AuthFieldError } from '@/components/auth/auth-field-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function AuthPasswordField({
  id,
  label,
  error,
  registration,
  autoComplete,
  placeholder,
  className,
  appearance = 'default',
  showLockIcon = true,
  forgotSlot,
}: {
  id: string
  label: string
  error?: string
  registration: UseFormRegisterReturn
  autoComplete?: string
  placeholder?: string
  className?: string
  appearance?: 'default' | 'figma'
  showLockIcon?: boolean
  /** Placed under field (e.g. Forgot password). */
  forgotSlot?: ReactNode
}) {
  const [visible, setVisible] = useState(false)
  const figma = appearance === 'figma'

  return (
    <div className={cn('grid gap-2', className)}>
      <Label
        htmlFor={id}
        className={cn('text-sm font-semibold', figma ? 'text-muted-foreground' : 'font-medium text-foreground')}
      >
        {label}
      </Label>
      <div className="relative">
        {showLockIcon ? (
          <span
            className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-muted-foreground"
            aria-hidden
          >
            <Lock className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.75} />
          </span>
        ) : null}
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn(
            figma
              ? 'h-12 rounded border border-border bg-background py-2 pr-11 shadow-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/25'
              : 'h-12 rounded-2xl border-border/80 bg-muted/25 py-2 pr-11 shadow-sm focus-visible:border-primary/45 focus-visible:bg-background focus-visible:ring-primary/20',
            showLockIcon ? 'pl-10' : 'pl-3',
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...registration}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <AuthFieldError id={`${id}-error`} message={error} />
        {forgotSlot ? <div className="flex justify-end">{forgotSlot}</div> : null}
      </div>
    </div>
  )
}
