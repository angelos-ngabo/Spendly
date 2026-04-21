/** A reservation of ledger balance into tracked savings (not spendable until released). */
export type Saving = {
  id: string
  userId: string
  amount: number
  /** Short label / reason for the reservation */
  title: string
  note?: string
  /** Calendar date of the reservation (yyyy-MM-dd) */
  date: string
  createdAt: string
}
