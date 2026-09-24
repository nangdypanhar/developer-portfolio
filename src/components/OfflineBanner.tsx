import { useOnlineStatus } from '../hooks/useOnlineStatus'

function OfflineBanner() {
  const online = useOnlineStatus()

  if (online) {
    return null
  }

  return (
    <div role="status" className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900">
      You're offline. New habits will be saved and synced when you reconnect.
    </div>
  )
}

export default OfflineBanner
