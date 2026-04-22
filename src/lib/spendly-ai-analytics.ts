import { endOfMonth, format, parseISO, subMonths } from 'date-fns'
import type { Saving } from '@/types/saving'
import type { MonthlyPoint, Transaction } from '@/types/transaction'
import {
  availableToReserve,
  spendableBalance,
  totalSavingsAmount,
} from '@/utils/savings'
import {
  computeSummary,
  currentMonthTotals,
  expenseTotalsByCategory,
  monthlyTrend,
} from '@/utils/transactions'

export type SpendlyAiQuestionId =
  | 'how-it-works'
  | 'how-much-left'
  | 'save-this-month'
  | 'top-spending'
  | 'overspend'
  | 'compare-months'
  | 'biggest-expenses'
  | 'income-spent-pct'
  | 'safe-daily'
  | 'reduce-category'
  | 'avg-transaction'
  | 'top-three-categories'
  | 'ai-total-saved'
  | 'ai-spendable-left'
  | 'ai-can-save-more'
  | 'ai-income-reserved-pct'
  | 'ai-ledger-saved-pct'

export const SPENDLY_AI_SUGGESTIONS: { id: SpendlyAiQuestionId; label: string }[] = [
  { id: 'how-it-works', label: 'How does Spendly AI work?' },
  { id: 'how-much-left', label: 'How much do I have left?' },
  { id: 'save-this-month', label: 'How much did I save this month?' },
  { id: 'top-spending', label: 'What am I spending the most on?' },
  { id: 'overspend', label: 'Am I spending more than I earn?' },
  { id: 'compare-months', label: 'Compare this month to last month' },
  { id: 'biggest-expenses', label: 'What are my biggest expenses?' },
  { id: 'income-spent-pct', label: 'How much of my income is already spent?' },
  { id: 'safe-daily', label: 'What can I safely spend per day?' },
  { id: 'reduce-category', label: 'What should I cut back first?' },
  { id: 'avg-transaction', label: "What's my average transaction size?" },
  { id: 'top-three-categories', label: 'What are my top 3 expense categories?' },
  { id: 'ai-total-saved', label: 'How much have I saved?' },
  { id: 'ai-spendable-left', label: 'How much do I still have left to spend?' },
  { id: 'ai-can-save-more', label: 'Can I save more this month?' },
  { id: 'ai-income-reserved-pct', label: 'What percentage of my income is reserved?' },
  { id: 'ai-ledger-saved-pct', label: 'How much of my balance is already saved?' },
]

export type SpendlyAiAnalytics = {
  summary: ReturnType<typeof computeSummary>
  month: ReturnType<typeof currentMonthTotals> & { savings: number; left: number }
  prevMonthKey: string
  prevMonthLabel: string
  prevMonth: { income: number; expense: number }
  top3Categories: { category: string; amount: number; pctOfTotalExpense: number }[]
  highestCategory: { category: string; amount: number; pctOfTotalExpense: number } | null
  top3ExpenseTransactions: { title: string; amount: number; category: string; date: string }[]
  avgTransactionAmount: number
  biggestExpense: { title: string; amount: number; category: string; date: string } | null
  expenseTrend: 'up' | 'down' | 'flat' | 'unknown'
  thisMonthPoint: MonthlyPoint | undefined
  lastMonthPoint: MonthlyPoint | undefined
  overspendAllTime: boolean
  overspendThisMonth: boolean
  incomeSpentPctThisMonth: number | null
  /** Rough “per day” you could still spend to land near zero net for the month, if ahead. */
  safeDailySpendHint: number | null
  categoryToReduce: string | null
  daysLeftInMonth: number
  savingsRecords: Saving[]
  totalReservedSavings: number
  spendableBalance: number
  reservedPctOfIncome: number | null
  pctLedgerReserved: number | null
  roomToSaveMore: number
}

export function monthTotalsForKey(transactions: Transaction[], monthKey: string) {
  let income = 0
  let expense = 0
  for (const t of transactions) {
    if (t.date.slice(0, 7) !== monthKey) continue
    if (t.type === 'income') income += t.amount
    else expense += t.amount
  }
  return { income, expense }
}

export function buildSpendlyAiAnalytics(
  transactions: Transaction[],
  savingsRecords: Saving[] = [],
  now = new Date(),
): SpendlyAiAnalytics {
  const summary = computeSummary(transactions)
  const totalReservedSavings = totalSavingsAmount(savingsRecords)
  const spendable = spendableBalance(transactions, savingsRecords)
  const income = summary.totalIncome
  const reservedPctOfIncome = income > 0 ? (totalReservedSavings / income) * 100 : null
  const ledger = summary.balance
  const pctLedgerReserved =
    ledger > 0 ? Math.min(100, (totalReservedSavings / ledger) * 100) : totalReservedSavings > 0 ? 100 : 0
  const roomToSaveMore = availableToReserve(transactions, savingsRecords)
  const month = currentMonthTotals(transactions, now)
  const savings = month.income - month.expense
  const left = savings

  const prevRef = subMonths(now, 1)
  const prevMonthKey = format(prevRef, 'yyyy-MM')
  const prevMonthLabel = format(prevRef, 'MMMM yyyy')
  const prevMonth = monthTotalsForKey(transactions, prevMonthKey)

  const byCat = expenseTotalsByCategory(transactions)
  const totalExpenseAll = summary.totalExpense || 0
  const top3Categories = byCat.slice(0, 3).map((r) => ({
    category: r.category,
    amount: r.amount,
    pctOfTotalExpense: totalExpenseAll > 0 ? (r.amount / totalExpenseAll) * 100 : 0,
  }))

  const topCat = byCat[0]
  const highestCategory =
    topCat && totalExpenseAll > 0
      ? {
          category: topCat.category,
          amount: topCat.amount,
          pctOfTotalExpense: (topCat.amount / totalExpenseAll) * 100,
        }
      : null

  const expenseTx = transactions.filter((t) => t.type === 'expense')
  const top3ExpenseTransactions = [...expenseTx]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)
    .map((t) => ({ title: t.title, amount: t.amount, category: t.category, date: t.date }))

  const biggestExpense = expenseTx.length
    ? expenseTx.reduce((a, b) => (a.amount >= b.amount ? a : b))
    : null

  const avgTransactionAmount =
    transactions.length > 0
      ? transactions.reduce((s, t) => s + t.amount, 0) / transactions.length
      : 0

  const trend = monthlyTrend(transactions)
  const nowKey = format(now, 'yyyy-MM')
  const thisMonthPoint = trend.find((m) => m.month === nowKey)
  const lastMonthPoint = trend.find((m) => m.month === prevMonthKey)

  let expenseTrend: SpendlyAiAnalytics['expenseTrend'] = 'unknown'
  if (thisMonthPoint && lastMonthPoint) {
    if (thisMonthPoint.expense > lastMonthPoint.expense * 1.03) expenseTrend = 'up'
    else if (thisMonthPoint.expense < lastMonthPoint.expense * 0.97) expenseTrend = 'down'
    else expenseTrend = 'flat'
  }

  const overspendAllTime = summary.totalIncome > 0 && summary.totalExpense > summary.totalIncome
  const overspendThisMonth = month.income > 0 && month.expense > month.income
  const incomeSpentPctThisMonth =
    month.income > 0 ? Math.min(999, (month.expense / month.income) * 100) : month.expense > 0 ? null : 0

  const end = endOfMonth(now)
  const daysLeftInMonth = Math.max(1, Math.ceil((end.getTime() - now.getTime()) / 86_400_000))
  const safeDailySpendHint =
    month.income > month.expense && month.income > 0
      ? Math.max(0, (month.income - month.expense) / daysLeftInMonth)
      : null

  return {
    summary,
    month: { ...month, savings, left },
    prevMonthKey,
    prevMonthLabel,
    prevMonth,
    top3Categories,
    highestCategory,
    top3ExpenseTransactions,
    avgTransactionAmount,
    biggestExpense: biggestExpense
      ? {
          title: biggestExpense.title,
          amount: biggestExpense.amount,
          category: biggestExpense.category,
          date: biggestExpense.date,
        }
      : null,
    expenseTrend,
    thisMonthPoint,
    lastMonthPoint,
    overspendAllTime,
    overspendThisMonth,
    incomeSpentPctThisMonth,
    safeDailySpendHint,
    categoryToReduce: topCat?.category ?? null,
    daysLeftInMonth,
    savingsRecords,
    totalReservedSavings,
    spendableBalance: spendable,
    reservedPctOfIncome,
    pctLedgerReserved,
    roomToSaveMore,
  }
}

function noDataCopy(): string {
  return 'Add a few income and expense transactions (or savings reservations) to unlock personalized insights. Once your ledger has activity, I can break down spending, savings, and trends for you.'
}

export function getSpendlyAiAnswer(
  id: SpendlyAiQuestionId,
  a: SpendlyAiAnalytics,
  formatMoney: (amount: number) => string,
): string {
  const fc = formatMoney
  const { summary, month, prevMonthLabel } = a

  if (id === 'how-it-works') {
    return [
      'Spendly AI answers from the income, expense, and savings data already in your workspace—nothing is sent to an external chat model or third-party API.',
      'Tap a suggested question (or think of it as a shortcut): each one runs a focused calculation on your ledger—balances, categories, this month vs last, savings room, and similar—and returns plain-language text you can read here.',
      'Guest sessions keep everything in your browser; signed-in users get the same on-device logic with optional cloud sync for your data, not for sending prompts out.',
      'Insights are meant as a quick, practical read on your own numbers—not tax, legal, or investment advice. Add more categorized transactions and savings entries to make the answers richer.',
    ].join('\n\n')
  }

  const hasActivity = summary.count > 0 || a.totalReservedSavings > 0
  if (!hasActivity) {
    return noDataCopy()
  }

  switch (id) {
    case 'how-much-left': {
      const ledger = fc(summary.balance)
      const monthNet = fc(month.left)
      if (a.totalReservedSavings > 0) {
        return `Your ledger balance (income minus expenses) is ${ledger}. After ${fc(a.totalReservedSavings)} reserved in savings, your spendable balance is ${fc(a.spendableBalance)}. For ${month.label}, cash-flow net was about ${monthNet} (income ${fc(month.income)} minus expenses ${fc(month.expense)}).`
      }
      return `All time, your balance (income minus expenses) is ${ledger}. For ${month.label}, income was ${fc(month.income)} and expenses ${fc(month.expense)}, so you have about ${monthNet} left for the month after those recorded entries.`
    }
    case 'save-this-month': {
      if (month.savings >= 0) {
        return `In ${month.label}, you saved about ${fc(month.savings)} (income ${fc(month.income)} minus expenses ${fc(month.expense)}).`
      }
      return `In ${month.label}, spending exceeded income by about ${fc(-month.savings)}. Income was ${fc(month.income)} and expenses ${fc(month.expense)}.`
    }
    case 'top-spending': {
      if (!a.highestCategory) {
        return 'You have no categorized expenses yet. Add some expenses to see where money goes.'
      }
      return `Your highest spending category is ${a.highestCategory.category}, at about ${fc(a.highestCategory.amount)} all time — roughly ${a.highestCategory.pctOfTotalExpense.toFixed(0)}% of your total recorded expenses.`
    }
    case 'overspend': {
      if (a.overspendThisMonth && month.income > 0) {
        return `This month (${month.label}) expenses are higher than income by about ${fc(month.expense - month.income)}. All-time, you are ${a.overspendAllTime ? 'spending more than total income recorded' : 'within or under total income recorded'}.`
      }
      if (a.overspendAllTime) {
        return `All time, total expenses exceed total income by about ${fc(summary.totalExpense - summary.totalIncome)}. This month specifically may still be balanced — review the month cards above.`
      }
      return `Based on your ledger, you are not spending more than you earn all time. Keep logging entries so this stays accurate.`
    }
    case 'compare-months': {
      const t = a.thisMonthPoint
      const l = a.lastMonthPoint
      if (!t || !l) {
        return `I need activity in both ${month.label} and ${prevMonthLabel} to compare. Add transactions across months for a richer trend.`
      }
      const incDelta = t.income - l.income
      const expDelta = t.expense - l.expense
      const incDir = incDelta > 0 ? 'up' : incDelta < 0 ? 'down' : 'flat'
      const expDir = expDelta > 0 ? 'up' : expDelta < 0 ? 'down' : 'flat'
      return `${month.label} vs ${prevMonthLabel}: income is ${incDir} (${fc(t.income)} vs ${fc(l.income)}). Expenses are ${expDir} (${fc(t.expense)} vs ${fc(l.expense)}).`
    }
    case 'biggest-expenses': {
      if (!a.top3ExpenseTransactions.length) {
        return 'No expense transactions yet. Add expenses to see your largest purchases.'
      }
      const lines = a.top3ExpenseTransactions.map(
        (r, i) => `${i + 1}. ${r.title} — ${fc(r.amount)} (${r.category}, ${format(parseISO(r.date), 'MMM d')})`,
      )
      return `Your three largest single expenses:\n${lines.join('\n')}`
    }
    case 'income-spent-pct': {
      if (month.income <= 0) {
        return `This month (${month.label}) has no recorded income yet. Expenses are ${fc(month.expense)}. Add income entries to measure how much of income is spent.`
      }
      const pct = a.incomeSpentPctThisMonth ?? 0
      return `In ${month.label}, you have spent about ${pct.toFixed(0)}% of recorded income (${fc(month.expense)} of ${fc(month.income)}).`
    }
    case 'safe-daily': {
      if (a.safeDailySpendHint != null && a.safeDailySpendHint > 0) {
        return `With about ${a.daysLeftInMonth} days left in ${month.label}, and roughly ${fc(month.income - month.expense)} ahead of expenses for the month, a simple daily “cushion” is around ${fc(a.safeDailySpendHint)} per day if spending stayed flat. This is a rough guide, not financial advice.`
      }
      if (month.expense >= month.income && month.income > 0) {
        return `This month expenses already meet or exceed income. Focus on reducing discretionary categories before adding more flexible “daily” spend.`
      }
      return 'Add both income and expenses for the current month so I can estimate a daily spending cushion.'
    }
    case 'reduce-category': {
      if (!a.categoryToReduce) {
        return 'No expense categories to rank yet. Start by categorizing a few expenses.'
      }
      return `The category with the highest total spend is ${a.categoryToReduce}. Trimming recurring costs there usually has the biggest impact — review subscriptions, frequency, and substitutes.`
    }
    case 'avg-transaction': {
      if (summary.count === 0) {
        return 'Add income and expense transactions to compute an average entry size.'
      }
      return `Across ${summary.count} recorded entries, your average transaction amount is ${fc(a.avgTransactionAmount)} (including both income and expenses).`
    }
    case 'top-three-categories': {
      if (!a.top3Categories.length) {
        return 'No expense categories yet. Add expenses with categories to see a top-three breakdown.'
      }
      const parts = a.top3Categories.map(
        (c, i) =>
          `${i + 1}. ${c.category}: ${fc(c.amount)} (${c.pctOfTotalExpense.toFixed(0)}% of total expenses)`,
      )
      return `Your top three expense categories by total spend:\n${parts.join('\n')}`
    }
    case 'ai-total-saved': {
      return `You have reserved ${fc(a.totalReservedSavings)} into savings across ${a.savingsRecords.length} entr${a.savingsRecords.length === 1 ? 'y' : 'ies'}.`
    }
    case 'ai-spendable-left': {
      return `Your spendable balance (ledger minus savings reservations) is ${fc(a.spendableBalance)}. Ledger balance is ${fc(summary.balance)}.`
    }
    case 'ai-can-save-more': {
      if (summary.balance <= 0) {
        return `Your ledger balance is not positive (${fc(summary.balance)}), so you should not add more savings reservations until income exceeds expenses.`
      }
      if (a.roomToSaveMore <= 0) {
        return `Your positive ledger is fully allocated to savings reservations. To save more, add income, reduce expenses, or release an existing savings entry.`
      }
      return `You can still allocate up to about ${fc(a.roomToSaveMore)} more into savings without exceeding your ledger balance.`
    }
    case 'ai-income-reserved-pct': {
      if (summary.totalIncome <= 0) {
        return 'With no recorded income yet, a percentage of income reserved is not meaningful. Add income entries first.'
      }
      const pct = a.reservedPctOfIncome ?? 0
      return `About ${pct.toFixed(1)}% of your total recorded income (${fc(a.totalReservedSavings)} of ${fc(summary.totalIncome)}) is currently reserved in savings.`
    }
    case 'ai-ledger-saved-pct': {
      if (summary.balance <= 0 && a.totalReservedSavings === 0) {
        return `Your ledger balance is ${fc(summary.balance)} with no savings reservations.`
      }
      if (summary.balance <= 0 && a.totalReservedSavings > 0) {
        return `Your ledger is ${fc(summary.balance)} while ${fc(a.totalReservedSavings)} remains reserved in savings — spendable is ${fc(a.spendableBalance)}. Review expenses or release savings if that feels tight.`
      }
      return `Roughly ${(a.pctLedgerReserved ?? 0).toFixed(0)}% of your positive ledger (${fc(a.totalReservedSavings)} of ${fc(summary.balance)}) is marked as saved.`
    }
    default: {
      const _exhaustive: never = id
      return _exhaustive
    }
  }
}
