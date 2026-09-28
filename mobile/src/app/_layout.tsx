import '../../global.css'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View } from 'react-native'
import { AuthProvider, useAuth } from '@/context/AuthContext'

function RootStack() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator color="#4f46e5" />
      </View>
    )
  }

  // Signed out → only "login" exists; signed in → only the habit screens exist.
  return (
    <Stack screenOptions={{ headerTintColor: '#4f46e5', contentStyle: { backgroundColor: '#f9fafb' } }}>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" options={{ title: 'Sign in' }} />
      </Stack.Protected>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="index" options={{ title: 'Habit Tracker' }} />
        <Stack.Screen name="add" options={{ title: 'New habit', presentation: 'modal' }} />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootStack />
      <StatusBar style="dark" />
    </AuthProvider>
  )
}
