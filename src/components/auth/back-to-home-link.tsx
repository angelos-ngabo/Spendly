import { Link } from 'react-router-dom'
import { LANDING_PATH } from '@/components/layout/nav'
import { cn } from '@/lib/utils'

/** Always routes to the public landing page, replacing history so “back” does not return to auth. */
export function BackToHomeLink({ className }: { className?: string }) {
  return (
    <Link to={LANDING_PATH} replace className={cn(className)}>
      Back to home
    </Link>
  )
}
