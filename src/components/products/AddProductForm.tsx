import { useState, type SubmitEvent } from 'react'
import { validateProduct } from '../../lib/validateProduct'
import type { FormErrors, NewProductForm } from '../../types/product'

interface AddProductFormProps {
  onAdd: (name: string, price: number) => void
}

const emptyForm: NewProductForm = { name: '', price: '' }

function AddProductForm({ onAdd }: AddProductFormProps) {
  const [form, setForm] = useState<NewProductForm>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const validationErrors = validateProduct(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    onAdd(form.name.trim(), Number(form.price))
    setForm(emptyForm)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-900">Add product</h3>

      <div className="flex flex-col gap-1">
        <label htmlFor="product-name" className="text-xs font-medium text-gray-700">
          Name
        </label>
        <input
          id="product-name"
          type="text"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
        />
        {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="product-price" className="text-xs font-medium text-gray-700">
          Price
        </label>
        <input
          id="product-price"
          type="text"
          value={form.price}
          onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
        />
        {errors.price && <p className="text-xs text-red-600">{errors.price}</p>}
      </div>

      <button
        type="submit"
        className="w-fit rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        Add product
      </button>
    </form>
  )
}

export default AddProductForm
