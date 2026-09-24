export interface Habit {
  id: string
  name: string
  isActive: boolean
  createdAt: string
  /** Dates (YYYY-MM-DD) this habit was checked off. */
  logDates: string[]
}
