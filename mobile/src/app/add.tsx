import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { useAuth } from '@/context/AuthContext'
import { createHabit } from '@shared/lib/habits'

export default function AddHabit() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Name is required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await createHabit(user!.id, trimmed)
      // The list reloads when it comes back into focus.
      router.back()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save habit.')
      setSaving(false)
    }
  }

  return (
    <View className="flex-1 gap-3 p-4">
      <Text className="text-sm font-medium text-gray-700">Habit name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Meditate 10 minutes"
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleSave}
        className="rounded-md border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900"
      />
      {error && <Text className="text-sm text-red-600">{error}</Text>}
      <Pressable
        onPress={handleSave}
        disabled={saving}
        className="items-center rounded-md bg-indigo-600 py-3 disabled:opacity-50"
      >
        <Text className="font-medium text-white">{saving ? 'Saving…' : 'Save habit'}</Text>
      </Pressable>
    </View>
  )
}
