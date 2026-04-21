import { Wallet2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LANDING_PATH } from '@/components/layout/nav'
import { Button } from '@/components/ui/button'
const linkClass =
  'text-[11px] font-semibold uppercase tracking-wide text-white/90 transition hover:text-white sm:text-xs'

export function MarketingNav({ firebaseEnabled, onPrimaryCta }: { firebaseEnabled: boolean; onPrimaryCta: () => void }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Link
        to={LANDING_PATH}
        className="flex items-center gap-3 outline-none ring-offset-2 ring-offset-[#1a1d21] focus-visible:ring-2 focus-visible:ring-[#23A6F0]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#23A6F0] text-white shadow-md shadow-black/15">
          <Wallet2 className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div>
          <div className="text-[17px] font-bold leading-tight tracking-tight text-white">Spendly</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Personal finance</div>
        </div>
      </Link>

      <div className="flex flex-wrap items-center gap-6 sm:gap-8">
        <nav className="flex flex-wrap items-center gap-4 sm:gap-4" aria-label="Page">
          <a href="#features" className={linkClass}>
            Features
          </a>
          <a href="#stories" className={linkClass}>
            Stories
          </a>
          <a href="#demo" className={linkClass}>
            Product tour
          </a>
          <a href="#cta" className={linkClass}>
            Get started
          </a>
        </nav>
        <div className="flex items-center gap-3 sm:gap-4">
          {firebaseEnabled ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-auto px-0 text-[11px] font-bold tracking-wide text-white hover:bg-transparent hover:text-white sm:text-xs"
            >
              <Link to="/sign-in">Login</Link>
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            onClick={onPrimaryCta}
            className="rounded-md bg-[#23A6F0] px-5 text-[11px] font-bold tracking-wide text-white shadow-md hover:bg-[#1a8fd4] sm:text-xs"
          >
            Open as guest
          </Button>
        </div>
      </div>
    </header>
  )
}
