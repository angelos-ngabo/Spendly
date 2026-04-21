import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { LANDING_PATH } from '@/components/layout/nav'
import { PageHeader } from '@/components/shared/page-header'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SettingsCurrencySection } from '@/components/settings/settings-currency-section'
import { useAuth } from '@/context/auth-context'
import { buildDemoTransactions } from '@/data/demo'
import { backupToJson, buildBackup, downloadTextFile, transactionsToCsv } from '@/utils/export'
import { useSavings } from '@/store/savings-context'
import { useTransactions } from '@/store/transactions-context'

function LoadDemoWithConfirm({
  hasExisting,
  onConfirm,
}: {
  hasExisting: boolean
  onConfirm: () => void
}) {
  if (!hasExisting) {
    return (
      <Button type="button" variant="secondary" onClick={onConfirm}>
        Load sample demo data
      </Button>
    )
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="secondary">
          Load sample demo data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Replace guest data with sample transactions?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes your current guest transactions from this browser and replaces them with demo
            entries. Export first if you need a copy.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Replace with sample data</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('merge')
  const { transactions, importBackup, importTransactionsArray, replaceAll } = useTransactions()
  const { clearAllSavings } = useSavings()
  const { user, guestSession, signOutEverywhere, displayLabel, accountProfile } = useAuth()

  const exportCsv = () => {
    try {
      const csv = transactionsToCsv(transactions)
      downloadTextFile('spendly-transactions.csv', csv, 'text/csv;charset=utf-8')
      toast.success('CSV exported')
    } catch {
      toast.error('Export failed')
    }
  }

  const exportJson = () => {
    try {
      const json = backupToJson(buildBackup(transactions))
      downloadTextFile('spendly-backup.json', json, 'application/json;charset=utf-8')
      toast.success('JSON backup exported')
    } catch {
      toast.error('Export failed')
    }
  }

  const loadDemo = async () => {
    try {
      await replaceAll(buildDemoTransactions())
      toast.success('Sample data loaded')
    } catch {
      /* provider toast */
    }
  }

  const resetAll = async () => {
    try {
      await replaceAll([])
      await clearAllSavings()
      localStorage.removeItem('spendly-welcome-dismissed')
      toast.success(user ? 'Transactions and savings cleared' : 'All local data cleared')
    } catch {
      toast.error('Could not reset data')
    }
  }

  const onPickImportFile = () => fileInputRef.current?.click()

  const onImportFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const text = await file.text()
      const raw: unknown = JSON.parse(text)
      const backupResult = await importBackup(raw, importMode)
      const res = backupResult.ok ? backupResult : await importTransactionsArray(raw, importMode)
      if (!res.ok) {
        toast.error(res.message)
        return
      }
      toast.success(
        importMode === 'replace'
          ? 'Data imported (replaced existing records)'
          : `Imported ${res.count} transactions`,
      )
    } catch {
      toast.error('Could not read JSON file')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full space-y-8">
      <PageHeader
        title="Settings & export"
        description="Back up your ledger, bring data back in, or reset your workspace."
      />

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            {user
              ? 'You are signed in. Transactions sync to your private cloud collection.'
              : guestSession
                ? 'Guest mode keeps data in this browser only until you create an account.'
                : 'Session information'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-sm font-medium">{displayLabel}</div>
            <div className="text-xs text-muted-foreground">
              {user ? 'Authenticated' : guestSession ? 'Guest session' : 'Unknown'}
            </div>
            {user && accountProfile?.phoneE164 ? (
              <div className="text-xs text-muted-foreground">
                Phone:{' '}
                <span className="font-mono text-foreground/90">{accountProfile.phoneE164}</span>
              </div>
            ) : null}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void (async () => {
                await signOutEverywhere()
                navigate(LANDING_PATH, { replace: true })
              })()
            }}
          >
            Sign out
          </Button>
        </CardContent>
      </Card>

      <SettingsCurrencySection />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Export</CardTitle>
            <CardDescription>Download everything as CSV or a structured JSON backup.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={exportCsv}>
              Export CSV
            </Button>
            <Button type="button" onClick={exportJson}>
              Export JSON backup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import</CardTitle>
            <CardDescription>
              Restore from a Spendly JSON backup or a raw transactions array. Merge updates matching IDs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={importMode === 'merge' ? 'default' : 'outline'}
                onClick={() => setImportMode('merge')}
              >
                Merge
              </Button>
              <Button
                type="button"
                variant={importMode === 'replace' ? 'default' : 'outline'}
                onClick={() => setImportMode('replace')}
              >
                Replace all
              </Button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => void onImportFile(e.target.files?.[0])}
              />
              <Button type="button" variant="outline" onClick={onPickImportFile}>
                Choose JSON file
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Helpful utilities while you are evaluating Spendly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {guestSession ? (
            <>
              <div className="text-sm text-muted-foreground">
                Sample data replaces everything in your <strong className="font-medium text-foreground">local</strong>{' '}
                guest ledger. Hidden when you use a signed-in account so cloud data is never bulk-replaced
                from here.
              </div>
              <LoadDemoWithConfirm
                hasExisting={transactions.length > 0}
                onConfirm={() => void loadDemo()}
              />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sample demo data is available in <strong className="font-medium text-foreground">guest mode</strong>{' '}
              only. Signed-in accounts keep only what you add or import.
            </p>
          )}
          <Separator />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium">Reset all transactions</div>
              <div className="text-sm text-muted-foreground">
                {user
                  ? 'Deletes every transaction document in your cloud ledger for this account.'
                  : 'Removes guest transactions stored in this browser.'}{' '}
                Export first if you need a copy.
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  Reset data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all transactions?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {user
                      ? 'This permanently deletes your transactions from the cloud for this user.'
                      : 'This permanently clears guest transactions stored locally.'}{' '}
                    This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => void resetAll()}
                  >
                    Reset everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
