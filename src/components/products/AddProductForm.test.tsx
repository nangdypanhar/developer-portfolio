import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import AddProductForm from './AddProductForm'

describe('AddProductForm', () => {
  it('renders the name and price fields', () => {
    render(<AddProductForm onAdd={vi.fn()} />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Price')).toBeInTheDocument()
  })

  it('calls onAdd with the trimmed name and numeric price on valid submit', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddProductForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Name'), '  Desk Lamp  ')
    await user.type(screen.getByLabelText('Price'), '19.99')
    await user.click(screen.getByRole('button', { name: 'Add product' }))

    expect(onAdd).toHaveBeenCalledWith('Desk Lamp', 19.99)
  })

  it('shows a validation error when the name is empty', async () => {
    const user = userEvent.setup()
    render(<AddProductForm onAdd={vi.fn()} />)

    expect(screen.queryByText('Name is required.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add product' }))

    expect(await screen.findByText('Name is required.')).toBeInTheDocument()
  })

  it('shows a validation error when the price is not a number', async () => {
    const user = userEvent.setup()
    render(<AddProductForm onAdd={vi.fn()} />)

    await user.type(screen.getByLabelText('Name'), 'Desk Lamp')
    await user.type(screen.getByLabelText('Price'), 'abc')
    await user.click(screen.getByRole('button', { name: 'Add product' }))

    expect(await screen.findByText('Price must be a number.')).toBeInTheDocument()
  })

  it('clears the error and the form after a successful submit', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddProductForm onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: 'Add product' }))
    expect(await screen.findByText('Name is required.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Name'), 'Desk Lamp')
    await user.type(screen.getByLabelText('Price'), '19.99')
    await user.click(screen.getByRole('button', { name: 'Add product' }))

    expect(onAdd).toHaveBeenCalledWith('Desk Lamp', 19.99)
    expect(screen.queryByText('Name is required.')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('')
  })
})
