import { Menu, Wallet2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LANDING_PATH, SIGN_UP_PATH } from '@/components/layout/nav'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const linkClass =
  'text-[11px] font-semibold uppercase tracking-wide text-white/90 transition hover:text-white sm:text-xs'

const mobileNavLinkClass =
  'block rounded-xl px-4 py-3.5 text-[13px] font-semibold uppercase tracking-wide text-white/95 transition hover:bg-white/10 hover:text-white active:bg-white/15'

export function MarketingNav({ firebaseEnabled, onPrimaryCta }: { firebaseEnabled: boolean; onPrimaryCta: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!mobileMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileMenuOpen])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="relative z-50 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-start">
        <Link
          to={LANDING_PATH}
          className="flex min-w-0 items-center gap-3 outline-none ring-offset-2 ring-offset-[#1a1d21] focus-visible:ring-2 focus-visible:ring-[#23A6F0]"
          onClick={closeMobileMenu}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#23A6F0] text-white shadow-md shadow-black/15">
            <Wallet2 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <div className="text-[17px] font-bold leading-tight tracking-tight text-white">Spendly</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Money workspace</div>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Button
            asChild
            size="sm"
            className="h-10 rounded-full bg-[#23A6F0] px-4 text-xs font-bold text-white shadow-md shadow-black/25 hover:bg-[#1a8fd4]"
          >
            <Link to={SIGN_UP_PATH} onClick={closeMobileMenu}>
              Create account
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl border-white/40 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="marketing-mobile-nav"
            onClick={() => setMobileMenuOpen((o) => !o)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={2} aria-hidden /> : <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />}
          </Button>
        </div>
      </div>

      <div className="hidden flex-wrap items-center gap-6 md:flex md:gap-8">
        <nav className="flex flex-wrap items-center gap-4" aria-label="Page">
          <a href="#features" className={linkClass}>
            Features
          </a>
          <a href="#devices" className={linkClass}>
            Devices
          </a>
          <a href="#demo" className={linkClass}>
            Preview
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
              <Link to="/sign-in">Sign in</Link>
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

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden" id="marketing-mobile-nav">
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity"
            aria-label="Close menu"
            onClick={closeMobileMenu}
          />
          <nav
            className="absolute left-3 right-3 top-[max(5.5rem,env(safe-area-inset-top)+4.5rem)] max-h-[min(78dvh,520px)] overflow-y-auto overscroll-y-contain rounded-2xl border border-white/15 bg-[#0c0f14]/95 p-2 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl motion-safe:animate-[spendly-nav-panel-in_0.2s_ease-out_both]"
            aria-label="Mobile page sections"
          >
            <a href="#features" className={mobileNavLinkClass} onClick={closeMobileMenu}>
              Features
            </a>
            <a href="#devices" className={mobileNavLinkClass} onClick={closeMobileMenu}>
              Devices
            </a>
            <a href="#demo" className={mobileNavLinkClass} onClick={closeMobileMenu}>
              Preview
            </a>
            <Link to={SIGN_UP_PATH} className={mobileNavLinkClass} onClick={closeMobileMenu}>
              Create account
            </Link>
            <div className="my-2 border-t border-white/10" />
            <button
              type="button"
              className={cn(mobileNavLinkClass, 'w-full text-left font-bold text-[#7dd3fc]')}
              onClick={() => {
                closeMobileMenu()
                onPrimaryCta()
              }}
            >
              Try as guest
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
