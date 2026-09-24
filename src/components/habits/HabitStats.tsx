import type { Habit } from '../../types/habit'
import CrashButton from '../CrashButton'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-gray-200 bg-white p-4">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xl font-semibold text-gray-900">{value}</span>
    </div>
  )
}

function HabitStats({ habits, today }: { habits: Habit[]; today: string }) {
  const active = habits.filter((h) => h.isActive)
  const doneToday = active.filter((h) => h.logDates.includes(today)).length
  const totalCheckIns = habits.reduce((sum, h) => sum + h.logDates.length, 0)
  const percent = active.length ? Math.round((doneToday / active.length) * 100) : 0

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-900">Stats</h3>
        <CrashButton label="Stats" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Done today" value={`${doneToday} / ${active.length}`} />
        <Stat label="Completion" value={`${percent}%`} />
        <Stat label="Total check-ins" value={String(totalCheckIns)} />
      </div>
    </section>
  )
}

export default HabitStats
