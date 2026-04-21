import { Bot, Sparkles } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  type SpendlyAiQuestionId,
  SPENDLY_AI_SUGGESTIONS,
  buildSpendlyAiAnalytics,
  getSpendlyAiAnswer,
} from '@/lib/spendly-ai-analytics'
import { useMoneyFormat } from '@/context/currency-preference-context'
import { cn } from '@/lib/utils'
import type { Saving } from '@/types/saving'
import type { Transaction } from '@/types/transaction'

type ThreadItem = { id: string; role: 'user' | 'assistant'; text: string }

type SpendlyAiLayout = 'embedded' | 'rail' | 'drawer'

export function SpendlyAI({
  transactions,
  savings = [],
  layout = 'embedded',
}: {
  transactions: Transaction[]
  savings?: Saving[]
  layout?: SpendlyAiLayout
}) {
  const { formatMoney } = useMoneyFormat()
  const analytics = useMemo(() => buildSpendlyAiAnalytics(transactions, savings), [transactions, savings])
  const [thread, setThread] = useState<ThreadItem[]>([])

  const ask = useCallback(
    (id: SpendlyAiQuestionId, label: string) => {
      const answer = getSpendlyAiAnswer(id, analytics, formatMoney)
      const ts = Date.now()
      setThread((prev) => [
        ...prev,
        { id: `${ts}-u`, role: 'user', text: label },
        { id: `${ts}-a`, role: 'assistant', text: answer },
      ])
    },
    [analytics, formatMoney],
  )

  const clear = useCallback(() => setThread([]), [])

  const isRail = layout === 'rail' || layout === 'drawer'

  const header = (
    <CardHeader
      className={cn(
        'shrink-0 space-y-0 border-b border-border/50 pb-4',
        isRail ? 'px-4 pb-3 pt-4' : 'pb-4',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-inner ring-1 ring-primary/20">
            <Sparkles className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold tracking-tight">Spendly AI</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Smart insights from your spending activity — powered locally, no external API.
            </CardDescription>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          {thread.length > 0 ? (
            <Button type="button" variant="outline" size="sm" className="h-8 rounded-lg text-xs" onClick={clear}>
              Clear chat
            </Button>
          ) : null}
          <Bot className="h-5 w-5 shrink-0 text-muted-foreground/70" aria-hidden />
        </div>
      </div>
    </CardHeader>
  )

  const scrollInner = (
    <div className="space-y-4 px-5 pb-5 pt-4">
      <div>
        <span className="text-xs font-medium text-muted-foreground">Suggested questions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SPENDLY_AI_SUGGESTIONS.map((s) => (
          <Button
            key={s.id}
            type="button"
            variant="secondary"
            size="sm"
            className="h-auto min-h-10 max-w-full whitespace-normal rounded-full border border-border/70 bg-background/80 px-3 py-2 text-left text-xs font-medium leading-snug shadow-sm transition-all hover:border-primary/35 hover:bg-primary/[0.06] sm:py-1.5"
            onClick={() => ask(s.id, s.label)}
          >
            {s.label}
          </Button>
        ))}
      </div>

      <Separator className="opacity-60" />

      <div className="space-y-3">
        {thread.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            Choose a question above for a tailored read on your actual transaction data.
          </div>
        ) : (
          thread.map((m) => (
            <div
              key={m.id}
              className={cn(
                'rounded-xl px-3.5 py-3 text-sm leading-relaxed shadow-sm ring-1',
                m.role === 'user'
                  ? 'ml-6 bg-primary/10 text-foreground ring-primary/15'
                  : 'mr-4 bg-background/90 text-foreground ring-border/60',
              )}
            >
              {m.role === 'assistant' ? (
                <p className="whitespace-pre-wrap">{m.text}</p>
              ) : (
                <p>{m.text}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )

  const content = (
    <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
      <ScrollArea
        className={cn(
          'min-h-0 flex-1',
          layout === 'embedded' && 'min-h-[min(360px,50vh)]',
          layout === 'drawer' && 'min-h-[min(260px,42dvh)]',
        )}
      >
        {scrollInner}
      </ScrollArea>
    </CardContent>
  )

  const cardClass = cn(
    'overflow-hidden',
    isRail
      ? 'flex h-full min-h-0 flex-col border-0 bg-transparent shadow-none dark:bg-transparent'
      : 'border-primary/25 bg-gradient-to-b from-primary/[0.07] via-card to-card shadow-lg shadow-primary/[0.06] dark:from-primary/[0.12] dark:shadow-black/40',
  )

  if (isRail) {
    return (
      <Card className={cardClass}>
        {header}
        {content}
      </Card>
    )
  }

  return (
    <div className="lg:sticky lg:top-8 lg:self-start">
      <Card className={cn(cardClass, 'flex max-h-[min(90vh,900px)] min-h-0 flex-col')}>
        {header}
        {content}
      </Card>
    </div>
  )
}
