import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'

export function FirebaseSetupHelp({ className }: { className?: string }) {
  const { firebaseMissingEnvVars } = useAuth()

  return (
    <div className={cn('space-y-3 text-sm leading-relaxed text-muted-foreground', className)}>
      <p>
        Cloud sign-in needs a few configuration values from whoever set up this deployment. If you are just trying the
        app, ask them to add the missing entries below.
      </p>
      <p>
        Put keys in a file named <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">.env</code>{' '}
        or <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">.env.local</code> in the{' '}
        <strong className="font-medium text-foreground">project root</strong> (next to{' '}
        <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">package.json</code>). Each
        variable must start with <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">VITE_</code>{' '}
        so Vite exposes it to the browser.
      </p>
      <p>
        After saving <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">.env</code>, stop and
        restart <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">npm run dev</code>. For a
        production build, variables must be present when you run{' '}
        <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">npm run build</code>.
      </p>
      {firebaseMissingEnvVars.length > 0 ? (
        <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5">
          <p className="text-xs font-medium text-foreground">Missing or empty in the client bundle:</p>
          <ul className="mt-2 list-inside list-disc space-y-0.5 font-mono text-xs">
            {firebaseMissingEnvVars.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
