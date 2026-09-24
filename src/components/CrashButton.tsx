import { useState } from 'react'

// Dev-only helper for testing ErrorBoundary: clicking it makes the component
// throw on its next render. The state lives here, so the boundary's
// "Try again" remounts it un-crashed.
function CrashButton({ label }: { label: string }) {
  const [crashed, setCrashed] = useState(false)

  if (crashed) {
    throw new Error(`Deliberate crash in ${label}`)
  }

  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <button
      type="button"
      onClick={() => setCrashed(true)}
      title={`Crash ${label} (dev only)`}
      className="rounded border border-dashed border-red-300 px-1.5 py-0.5 text-[10px] font-medium text-red-500 hover:bg-red-50"
    >
      Crash
    </button>
  )
}

export default CrashButton
