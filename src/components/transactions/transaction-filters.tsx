import { SlidersHorizontal, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TransactionFilters, TransactionSort } from '@/types/transaction'
import { formatMonthYear } from '@/lib/format'

export function TransactionFiltersBar({
  value,
  onChange,
  categories,
  months,
}: {
  value: TransactionFilters
  onChange: (next: TransactionFilters) => void
  categories: string[]
  months: string[]
}) {
  const patch = (partial: Partial<TransactionFilters>) => onChange({ ...value, ...partial })

  return (
    <div className="grid gap-5 rounded-2xl border border-border/50 bg-card/60 p-5 shadow-sm shadow-black/[0.03] backdrop-blur-sm dark:bg-card/40 dark:shadow-black/20 md:grid-cols-2 lg:grid-cols-6">
      <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground lg:col-span-6">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
        Filters
      </div>
      <div className="grid gap-2 lg:col-span-2">
        <Label htmlFor="search" className="text-xs font-medium text-muted-foreground">
          Search
        </Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            value={value.search}
            onChange={(e) => patch({ search: e.target.value })}
            placeholder="Search title or notes"
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Type</Label>
        <Select value={value.type} onValueChange={(v) => patch({ type: v as TransactionFilters['type'] })}>
          <SelectTrigger aria-label="Filter by type">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Category</Label>
        <Select
          value={value.category}
          onValueChange={(v) => patch({ category: v })}
        >
          <SelectTrigger aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Month</Label>
        <Select value={value.month} onValueChange={(v) => patch({ month: v })}>
          <SelectTrigger aria-label="Filter by month">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All months</SelectItem>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {formatMonthYear(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Sort</Label>
        <Select
          value={value.sort}
          onValueChange={(v) => patch({ sort: v as TransactionSort })}
        >
          <SelectTrigger aria-label="Sort transactions">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="amount-high">Highest amount</SelectItem>
            <SelectItem value="amount-low">Lowest amount</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
