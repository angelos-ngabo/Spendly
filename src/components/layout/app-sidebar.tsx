import { LogOut, Moon, Sparkles, Sun, Wallet2 } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { APP_BASE, LANDING_PATH, NAV_ITEMS } from '@/components/layout/nav'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/context/auth-context'
import { writeUserColorMode } from '@/services/firebase/user-profile'
import { getInitials } from '@/lib/initials'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const { user, firebaseEnabled } = useAuth()

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="relative h-9 w-9 shrink-0 rounded-xl border-border/50 bg-background/80 shadow-sm transition-all hover:shadow-md"
      aria-label="Toggle color theme"
      onClick={() => {
        const next = resolvedTheme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        if (firebaseEnabled && user?.uid) void writeUserColorMode(user.uid, next)
      }}
    >
      <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  )
}

function UserMenu({ collapsed }: { collapsed?: boolean }) {
  const { user, displayLabel, guestSession, signOutEverywhere } = useAuth()
  const navigate = useNavigate()
  const initials = getInitials(displayLabel)
  const subtitle = !guestSession && user?.email && user.email !== displayLabel ? user.email : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'h-auto min-h-10 w-full justify-start gap-3 rounded-xl border-border/50 bg-background/70 py-2 shadow-sm transition-all hover:bg-background hover:shadow-md',
            collapsed && 'px-2',
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-[10px] font-bold text-primary-foreground shadow-inner">
            {initials}
          </span>
          <span className="min-w-0 flex-1 truncate text-left text-sm font-medium leading-tight">
            <span className="block truncate">{displayLabel}</span>
            {subtitle ? (
              <span className="block truncate text-xs font-normal text-muted-foreground">{subtitle}</span>
            ) : null}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="start">
        <DropdownMenuLabel className="font-normal">
          <div className="text-xs text-muted-foreground">Signed in as</div>
          <div className="truncate text-sm font-semibold">{displayLabel}</div>
          {subtitle ? <div className="truncate text-xs text-muted-foreground">{subtitle}</div> : null}
          {guestSession ? (
            <div className="mt-1.5 inline-flex rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
              Guest
            </div>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`${APP_BASE}/settings`}>Settings & export</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={async () => {
            await signOutEverywhere()
            navigate(LANDING_PATH, { replace: true })
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="grid gap-0.5">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === APP_BASE}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium tracking-tight transition-all duration-200 md:min-h-0',
              isActive
                ? 'bg-foreground/[0.06] text-foreground shadow-sm ring-1 ring-border/80 dark:bg-white/[0.06] dark:ring-white/10'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            )
          }
        >
          <item.icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AppSidebarCard({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-border/50 bg-card/95 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-border/40 dark:bg-card/80 dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]',
        className,
      )}
    >
      <div className="border-b border-border/40 px-4 pb-4 pt-5">
        <Link
          to={APP_BASE}
          className="flex items-center gap-3 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20">
            <Wallet2 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-foreground">Spendly</div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Finance</div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-4">
        <NavLinks onNavigate={onNavigate} />
      </div>

      <div className="space-y-3 border-t border-border/40 p-3.5">
        <UserMenu />
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export function MobileWorkspaceActions({
  onOpenAi,
  showAiButton,
}: {
  onOpenAi: () => void
  showAiButton?: boolean
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {showAiButton ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-primary/25 bg-primary/[0.06] text-primary shadow-sm transition-all hover:bg-primary/10"
          aria-label="Open Spendly AI"
          onClick={onOpenAi}
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
        </Button>
      ) : null}
      <UserMenu collapsed />
      <ThemeToggle />
    </div>
  )
}

export function AppSidebar({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  return (
    <aside
      className={cn(
        'sticky top-0 z-20 hidden h-svh w-[248px] shrink-0 py-4 pl-2 md:flex md:flex-col lg:w-[260px]',
        className,
      )}
    >
      <AppSidebarCard onNavigate={onNavigate} />
    </aside>
  )
}
