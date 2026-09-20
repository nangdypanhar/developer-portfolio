import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import UserDirectory from './UserDirectory'

const mockUsers = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
  { id: 2, name: 'Grace Hopper', email: 'grace@example.com' },
]

function renderDirectory() {
  return render(
    <MemoryRouter>
      <UserDirectory />
    </MemoryRouter>,
  )
}

describe('UserDirectory', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockUsers,
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows a loading indicator, then the fetched users, and the indicator disappears', async () => {
    renderDirectory()

    expect(screen.getByRole('status', { name: 'Loading users' })).toBeInTheDocument()
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument()

    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument()

    expect(screen.queryByRole('status', { name: 'Loading users' })).not.toBeInTheDocument()
  })

  it('filters the list down to a name match, proving the rest are gone', async () => {
    const user = userEvent.setup()
    renderDirectory()

    await screen.findByText('Ada Lovelace')

    await user.type(screen.getByPlaceholderText('Search by name…'), 'Grace')

    expect(screen.getByText('Grace Hopper')).toBeInTheDocument()
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument()
  })
})
