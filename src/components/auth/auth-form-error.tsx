import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AuthFormError({ message, className }: { message: string | null; className?: string }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className={cn(
        'flex gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive',
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  )
}
