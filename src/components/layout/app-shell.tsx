import { Menu, Wallet2 } from 'lucide-react'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AccountStrip } from '@/components/layout/account-strip'
import { AppSidebar, AppSidebarCard, MobileWorkspaceActions } from '@/components/layout/app-sidebar'
import { GuestUpgradeBanner } from '@/components/layout/guest-upgrade-banner'
import { SpendlyAI } from '@/components/dashboard/spendly-ai'
import { APP_BASE, NAV_ITEMS } from '@/components/layout/nav'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSavings } from '@/store/savings-context'
import { useTransactions } from '@/store/transactions-context'

function normalizePath(pathname: string) {
  return pathname.replace(/\/$/, '') || '/'
}

function appSectionLabel(pathname: string) {
  const normalized = normalizePath(pathname)
  if (normalized === APP_BASE) return 'Dashboard'
  const item = NAV_ITEMS.find((i) => i.to !== APP_BASE && normalized.startsWith(i.to))
  return item?.label ?? 'Dashboard'
}

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileAiOpen, setMobileAiOpen] = useState(false)
  const { pathname } = useLocation()
  const { transactions } = useTransactions()
  const { savings } = useSavings()

  return (
    <div className="min-h-svh bg-[#fafafa] text-foreground dark:bg-zinc-950">
      <div className="min-h-svh bg-[radial-gradient(ellipse_110%_70%_at_50%_-18%,rgba(35,166,240,0.07),transparent)] dark:bg-[radial-gradient(ellipse_110%_70%_at_50%_-18%,rgba(77,184,245,0.1),transparent)]">
        <div className="mx-auto flex w-full max-w-[min(1880px,calc(100vw-0.5rem))]">
          <AppSidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 md:hidden">
              <div className="flex min-w-0 items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl border-border/60"
                  aria-label="Open navigation"
                  onClick={() => setMobileNavOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-md">
                    <Wallet2 className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <div className="truncate text-sm font-semibold tracking-tight">Spendly</div>
                    <div className="truncate text-xs text-muted-foreground">{appSectionLabel(pathname)}</div>
                  </div>
                </div>
              </div>
              <MobileWorkspaceActions onOpenAi={() => setMobileAiOpen(true)} showAiButton />
            </header>

            <main className="flex min-w-0 flex-1 justify-center px-4 pb-12 pt-5 md:px-6 md:pb-16 md:pt-8 lg:px-10">
              <div className="mx-auto w-full max-w-6xl">
                <AccountStrip />
                <GuestUpgradeBanner />
                <Outlet />
              </div>
            </main>
          </div>

          <aside className="sticky top-0 z-20 hidden h-svh w-[260px] shrink-0 py-4 pr-2 md:flex md:flex-col lg:w-[min(100%,300px)] xl:w-[min(100%,320px)]">
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-primary/20 bg-card/95 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_12px_32px_rgba(35,166,240,0.1)] backdrop-blur-xl dark:border-primary/15 dark:bg-card/85 dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
              <SpendlyAI transactions={transactions} savings={savings} layout="rail" />
            </div>
          </aside>
        </div>
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(92vw,300px)] flex-col bg-background/98 py-5 pl-4 pr-3 shadow-2xl shadow-black/25 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between pr-1">
              <span className="text-sm font-semibold tracking-tight">Menu</span>
              <Button type="button" variant="ghost" size="sm" className="rounded-xl" onClick={() => setMobileNavOpen(false)}>
                Close
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <AppSidebarCard onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}

      {mobileAiOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close Spendly AI"
            onClick={() => setMobileAiOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(92vw,400px)] max-w-[100vw] flex-col border-l border-border/60 bg-background shadow-2xl shadow-black/25">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3.5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assistant</div>
                <div className="text-sm font-semibold tracking-tight">Spendly AI</div>
              </div>
              <Button type="button" variant="ghost" size="sm" className="rounded-xl" onClick={() => setMobileAiOpen(false)}>
                Close
              </Button>
            </div>
            <Separator className="opacity-50" />
            <div className="min-h-0 flex-1 overflow-hidden p-3">
              <SpendlyAI transactions={transactions} savings={savings} layout="drawer" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
