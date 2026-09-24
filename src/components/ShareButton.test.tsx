import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ShareButton from './ShareButton'

const props = { title: 'Habit Tracker', text: 'I did 2/3 habits today!', url: 'https://example.com' }

describe('ShareButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    Reflect.deleteProperty(navigator, 'share')
  })

  it('uses the native share sheet when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', { value: share, configurable: true })
    const user = userEvent.setup()
    render(<ShareButton {...props} />)

    await user.click(screen.getByRole('button', { name: 'Share' }))

    expect(share).toHaveBeenCalledWith(props)
    expect(screen.queryByText('Link copied!')).not.toBeInTheDocument()
  })

  it('falls back to the clipboard when Web Share is missing', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    render(<ShareButton {...props} />)

    await user.click(screen.getByRole('button', { name: 'Share' }))

    expect(writeText).toHaveBeenCalledWith('I did 2/3 habits today! https://example.com')
    expect(await screen.findByText('Link copied!')).toBeInTheDocument()
  })
})
