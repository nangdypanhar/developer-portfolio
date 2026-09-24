import { describe, expect, it } from 'vitest'
import { MAX_AVATAR_BYTES, validateAvatar } from './validateAvatar'

function fakeFile(type: string, size: number) {
  const file = new File(['x'], 'avatar', { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

describe('validateAvatar', () => {
  it('accepts a small PNG', () => {
    expect(validateAvatar(fakeFile('image/png', 200_000))).toBeNull()
  })

  it('accepts a file exactly at the 1 MB limit', () => {
    expect(validateAvatar(fakeFile('image/jpeg', MAX_AVATAR_BYTES))).toBeNull()
  })

  it('refuses a 5 MB image', () => {
    expect(validateAvatar(fakeFile('image/png', 5 * 1024 * 1024))).toBe('That image is 5.0 MB. The limit is 1 MB.')
  })

  it('refuses non-images', () => {
    expect(validateAvatar(fakeFile('application/pdf', 1000))).toMatch(/Only PNG/)
  })

  it('refuses SVG even though it is an image type', () => {
    expect(validateAvatar(fakeFile('image/svg+xml', 1000))).toMatch(/Only PNG/)
  })

  it('refuses empty files and missing files', () => {
    expect(validateAvatar(fakeFile('image/png', 0))).toBe('That file is empty.')
    expect(validateAvatar(null)).toBe('Choose an image to upload.')
  })
})
