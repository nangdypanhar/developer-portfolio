import { supabase } from './supabase'

const BUCKET = 'avatars'

export async function fetchAvatarUrl(userId: string): Promise<string | null> {
  const { data, error } = await supabase.from('profiles').select('avatar_url').eq('id', userId).maybeSingle()

  if (error) {
    throw new Error(`Failed to load profile (${error.message})`)
  }

  // No row yet just means no avatar yet.
  return data?.avatar_url ?? null
}

/** Uploads to avatars/<userId>/avatar (replacing any previous one) and saves the URL. */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  // Fixed file name + upsert → re-uploading overwrites instead of piling up files.
  const path = `${userId}/avatar`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type, cacheControl: '3600' })

  if (uploadError) {
    throw new Error(`Upload failed (${uploadError.message})`)
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  // The URL never changes, so bust browser/CDN caches after each replace.
  const avatarUrl = `${data.publicUrl}?v=${Date.now()}`

  const { error: saveError } = await supabase
    .from('profiles')
    .upsert({ id: userId, avatar_url: avatarUrl, updated_at: new Date().toISOString() })

  if (saveError) {
    throw new Error(`Could not save avatar (${saveError.message})`)
  }

  return avatarUrl
}
