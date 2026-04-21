import { useState } from 'react'
import { toast } from 'sonner'
import { useMoneyFormat } from '@/context/currency-preference-context'
import { DISPLAY_CURRENCY_LABELS, DISPLAY_CURRENCIES, type DisplayCurrencyCode } from '@/lib/currencies'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SettingsCurrencySection() {
  const { currency, formatMoney, setCurrency } = useMoneyFormat()
  const [saving, setSaving] = useState(false)

  const onChange = (value: string) => {
    const next = value as DisplayCurrencyCode
    if (!DISPLAY_CURRENCIES.includes(next)) return
    setSaving(true)
    void setCurrency(next).then(() => {
      toast.success('Currency preference updated')
      setSaving(false)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency preferences</CardTitle>
        <CardDescription>
          Choose how Spendly displays and formats your financial data. Amounts in your ledger are not converted—only
          labels and grouping change to match your region.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currency-select" className="text-sm font-medium">
            Display currency
          </Label>
          <Select value={currency} onValueChange={onChange} disabled={saving}>
            <SelectTrigger id="currency-select" className="h-12 w-full max-w-md rounded-xl text-left">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {DISPLAY_CURRENCIES.map((code) => (
                <SelectItem key={code} value={code}>
                  {DISPLAY_CURRENCY_LABELS[code]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Everyday amount:{' '}
            <span className="font-semibold tabular-nums text-foreground">{formatMoney(25)}</span>
            <span className="mx-2 text-border">·</span>
            Larger amount:{' '}
            <span className="font-semibold tabular-nums text-foreground">{formatMoney(25000)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
