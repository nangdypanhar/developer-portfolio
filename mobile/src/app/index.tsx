import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { useAuth } from '@/context/AuthContext'
import { shareHabits } from '@/lib/share'
import { fetchHabits, setDoneOn, today } from '@shared/lib/habits'
import type { Habit } from '@shared/types/habit'

const WEB_APP_URL = 'https://developer-portfolio-weld-two.vercel.app/habits'

export default function HabitList() {
  const { user, signOut } = useAuth()
  // The layout only shows this screen when signed in.
  const userId = user!.id
  const todayDate = today()
  const [habits, setHabits] = useState<Habit[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareStatus, setShareStatus] = useState<string | null>(null)

  const load = useCallback(async () => {
    setRefreshing(true)
    setError(null)
    try {
      setHabits(await fetchHabits(userId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load habits.')
    } finally {
      setRefreshing(false)
    }
  }, [userId])

  // Reload every time this screen comes back into view (e.g. after Add).
  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  async function toggleDone(habit: Habit) {
    const done = !habit.logDates.includes(todayDate)
    try {
      await setDoneOn(userId, habit.id, todayDate, done)
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habit.id
            ? { ...h, logDates: done ? [...h.logDates, todayDate] : h.logDates.filter((d) => d !== todayDate) }
            : h,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update habit.')
    }
  }

  async function handleShare() {
    const doneCount = habits.filter((h) => h.logDates.includes(todayDate)).length
    try {
      setShareStatus(
        await shareHabits({
          title: 'My habits',
          message: `I've done ${doneCount} of ${habits.length} habits today!`,
          url: WEB_APP_URL,
        }),
      )
    } catch {
      setShareStatus('Could not share.')
    }
  }

  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
        <Text numberOfLines={1} className="min-w-0 flex-1 text-sm text-gray-500">
          {user!.email}
        </Text>
        <Pressable onPress={handleShare} className="rounded-md border border-gray-300 px-3 py-1.5">
          <Text className="text-xs font-medium text-gray-700">Share</Text>
        </Pressable>
        <Pressable onPress={signOut} className="px-2 py-1.5">
          <Text className="text-xs font-medium text-gray-700">Sign out</Text>
        </Pressable>
      </View>

      {shareStatus && <Text className="px-4 pt-2 text-xs text-gray-500">{shareStatus}</Text>}
      {error && <Text className="px-4 pt-2 text-sm text-red-600">{error}</Text>}

      <FlatList
        data={habits}
        keyExtractor={(habit) => habit.id}
        refreshing={refreshing}
        onRefresh={load}
        contentContainerClassName="gap-3 p-4"
        ListEmptyComponent={
          refreshing ? null : <Text className="text-center text-sm text-gray-500">No habits yet. Add your first one.</Text>
        }
        renderItem={({ item }) => {
          const done = item.logDates.includes(todayDate)
          return (
            <Pressable
              onPress={() => toggleDone(item)}
              disabled={!item.isActive}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done, disabled: !item.isActive }}
              className="flex-row items-center gap-3 rounded-lg border border-gray-200 bg-white p-4"
            >
              <View
                className={`h-5 w-5 items-center justify-center rounded border ${done ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}
              >
                {done && <Text className="text-xs font-bold text-white">✓</Text>}
              </View>
              <View className="min-w-0 flex-1">
                <Text className={`text-base font-medium ${item.isActive ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                  {item.name}
                </Text>
                <Text className="text-xs text-gray-500">
                  {item.logDates.length} {item.logDates.length === 1 ? 'day' : 'days'} logged
                </Text>
              </View>
            </Pressable>
          )
        }}
      />

      <Pressable onPress={() => router.push('/add')} className="m-4 items-center rounded-md bg-indigo-600 py-3">
        <Text className="font-medium text-white">Add habit</Text>
      </Pressable>
    </View>
  )
}
