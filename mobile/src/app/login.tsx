import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { useAuth } from '@/context/AuthContext'

// Same account as the web app. Sign-up stays on the web.
export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit() {
    setBusy(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.')
      setBusy(false)
    }
  }

  return (
    <View className="flex-1 gap-3 p-4">
      <Text className="text-sm text-gray-500">Use the same email and password as the web app.</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        className="rounded-md border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        autoComplete="password"
        onSubmitEditing={handleSubmit}
        className="rounded-md border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900"
      />
      {error && <Text className="text-sm text-red-600">{error}</Text>}
      <Pressable
        onPress={handleSubmit}
        disabled={busy || !email || !password}
        className="items-center rounded-md bg-indigo-600 py-3 disabled:opacity-50"
      >
        <Text className="font-medium text-white">{busy ? 'Signing in…' : 'Sign in'}</Text>
      </Pressable>
    </View>
  )
}
