import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { fetchAvatarUrl, uploadAvatar } from '../../lib/profile'
import { ALLOWED_AVATAR_TYPES, validateAvatar } from '../../lib/validateAvatar'
import CrashButton from '../CrashButton'

function AvatarUploader({ userId, email }: { userId: string; email: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    fetchAvatarUrl(userId)
      .then((url) => !cancelled && setAvatarUrl(url))
      .catch((err: unknown) => !cancelled && setError(err instanceof Error ? err.message : 'Failed to load avatar.'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [userId])

  // Free the object URL whenever the preview changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function clearSelection() {
    setFile(null)
    setPreviewUrl(null)
    // Reset the input so choosing the same file again still fires onChange.
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0] ?? null
    setError(null)

    const validationError = validateAvatar(chosen)
    if (validationError || !chosen) {
      clearSelection()
      setError(validationError)
      return
    }

    setFile(chosen)
    setPreviewUrl(URL.createObjectURL(chosen))
  }

  async function handleUpload() {
    // Re-check at submit time; never trust earlier state alone.
    const validationError = validateAvatar(file)
    if (validationError || !file) {
      setError(validationError)
      return
    }

    setUploading(true)
    setError(null)
    try {
      setAvatarUrl(await uploadAvatar(userId, file))
      clearSelection()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const shownUrl = previewUrl ?? avatarUrl

  return (
    <section className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
        {shownUrl ? (
          <img src={shownUrl} alt={previewUrl ? 'Avatar preview' : 'Your avatar'} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-400">
            {loading ? '…' : email.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">{email}</p>
          <CrashButton label="Profile" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
            {avatarUrl ? 'Change avatar' : 'Choose avatar'}
            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED_AVATAR_TYPES.join(',')}
              onChange={handleChange}
              disabled={uploading}
              className="sr-only"
            />
          </label>

          {file && (
            <>
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
              <button
                type="button"
                onClick={clearSelection}
                disabled={uploading}
                className="text-xs font-medium text-gray-500 hover:text-gray-900"
              >
                Cancel
              </button>
            </>
          )}

          <span className="text-xs text-gray-400">PNG, JPEG, WebP or GIF · max 1 MB</span>
        </div>

        {error && (
          <p role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}

export default AvatarUploader
