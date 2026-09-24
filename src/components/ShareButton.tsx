import { useState } from 'react'

interface ShareButtonProps {
  title: string
  text: string
  url: string
}

// Native share sheet on phones; copies to the clipboard where that isn't available.
function ShareButton({ title, text, url }: ShareButtonProps) {
  const [status, setStatus] = useState<string | null>(null)

  async function handleShare() {
    setStatus(null)

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch (err) {
        // The user closed the share sheet: not an error.
        if (err instanceof DOMException && err.name === 'AbortError') return
        // Otherwise fall through to the clipboard.
      }
    }

    try {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setStatus('Link copied!')
    } catch {
      setStatus('Could not copy. Share this link: ' + url)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
      >
        Share
      </button>
      {status && (
        <span role="status" className="text-xs text-gray-500">
          {status}
        </span>
      )}
    </div>
  )
}

export default ShareButton
