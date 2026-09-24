export const MAX_AVATAR_BYTES = 1024 * 1024 // 1 MB

// Explicit allow-list. `file.type.startsWith('image/')` would also let
// image/svg+xml through, and SVGs can contain <script>.
export const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

/** Returns an error message, or null when the file is acceptable. */
export function validateAvatar(file: File | null | undefined): string | null {
  if (!file) {
    return 'Choose an image to upload.'
  }

  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return 'Only PNG, JPEG, WebP or GIF images are allowed.'
  }

  if (file.size === 0) {
    return 'That file is empty.'
  }

  if (file.size > MAX_AVATAR_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1)
    return `That image is ${mb} MB. The limit is 1 MB.`
  }

  return null
}
