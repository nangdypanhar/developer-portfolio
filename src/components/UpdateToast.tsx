import { useRegisterSW } from 'virtual:pwa-register/react'

function UpdateToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh && !offlineReady) {
    return null
  }

  function close() {
    setNeedRefresh(false)
    setOfflineReady(false)
  }

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-sm items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg"
    >
      <span className="flex-1">{needRefresh ? 'New version available' : 'Ready to work offline'}</span>
      {needRefresh && (
        <button
          type="button"
          onClick={() => updateServiceWorker(true)}
          className="rounded-md bg-indigo-500 px-3 py-1.5 font-medium hover:bg-indigo-400"
        >
          Refresh
        </button>
      )}
      <button type="button" onClick={close} className="text-gray-300 hover:text-white" aria-label="Dismiss">
        ✕
      </button>
    </div>
  )
}

export default UpdateToast
