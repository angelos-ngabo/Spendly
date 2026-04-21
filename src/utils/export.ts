import type { BackupPayload, Transaction } from '@/types/transaction'

function escapeCsvCell(value: string | number | undefined) {
  const s = String(value ?? '')
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function transactionsToCsv(transactions: Transaction[]) {
  const headers = [
    'id',
    'title',
    'amount',
    'type',
    'category',
    'date',
    'note',
    'createdAt',
  ] as const
  const lines = [headers.join(',')]
  for (const t of transactions) {
    lines.push(
      [
        t.id,
        t.title,
        t.amount,
        t.type,
        t.category,
        t.date,
        t.note ?? '',
        t.createdAt,
      ]
        .map(escapeCsvCell)
        .join(','),
    )
  }
  return lines.join('\n')
}

export function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function buildBackup(transactions: Transaction[]): BackupPayload {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    transactions,
  }
}

export function backupToJson(backup: BackupPayload) {
  return JSON.stringify(backup, null, 2)
}
