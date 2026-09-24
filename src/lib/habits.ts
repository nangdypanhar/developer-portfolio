import type { Habit } from '../types/habit'
import { supabase } from './supabase'

// Every query below filters by user_id as well as relying on RLS. RLS is the
// real guarantee; the explicit filter keeps intent obvious and fails safe.

interface HabitRow {
  id: string
  name: string
  is_active: boolean
  created_at: string
  daily_logs: { log_date: string }[]
}

const HABIT_COLUMNS = 'id, name, is_active, created_at, daily_logs(log_date)'

function toHabit(row: HabitRow): Habit {
  return {
    id: row.id,
    name: row.name,
    isActive: row.is_active,
    createdAt: row.created_at,
    logDates: (row.daily_logs ?? []).map((log) => log.log_date).sort(),
  }
}

/** Today's date in the user's local timezone, as YYYY-MM-DD. */
export function today(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

export async function fetchHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select(HABIT_COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to load habits (${error.message})`)
  }

  return (data as HabitRow[]).map(toHabit)
}

export async function createHabit(userId: string, name: string): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .insert({ user_id: userId, name })
    .select(HABIT_COLUMNS)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return toHabit(data as HabitRow)
}

export async function updateHabit(
  userId: string,
  id: string,
  changes: { name?: string; isActive?: boolean },
): Promise<Habit> {
  const patch: { name?: string; is_active?: boolean } = {}
  if (changes.name !== undefined) patch.name = changes.name
  if (changes.isActive !== undefined) patch.is_active = changes.isActive

  const { data, error } = await supabase
    .from('habits')
    .update(patch)
    .eq('id', id)
    .eq('user_id', userId)
    .select(HABIT_COLUMNS)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return toHabit(data as HabitRow)
}

export async function deleteHabit(userId: string, id: string): Promise<void> {
  // daily_logs rows go with it via ON DELETE CASCADE.
  const { error } = await supabase.from('habits').delete().eq('id', id).eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function setDoneOn(userId: string, habitId: string, date: string, done: boolean): Promise<void> {
  const { error } = done
    ? await supabase.from('daily_logs').insert({ user_id: userId, habit_id: habitId, log_date: date })
    : await supabase
        .from('daily_logs')
        .delete()
        .eq('habit_id', habitId)
        .eq('user_id', userId)
        .eq('log_date', date)

  if (error) {
    throw new Error(error.message)
  }
}
