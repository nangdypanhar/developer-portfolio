import type { FormErrors, NewProductForm } from '../types/product'

export function validateProduct(form: NewProductForm): FormErrors {
  const errors: FormErrors = {}

  if (form.name.trim().length === 0) {
    errors.name = 'Name is required.'
  }

  const trimmedPrice = form.price.trim()
  const price = Number(trimmedPrice)

  if (trimmedPrice.length === 0 || Number.isNaN(price)) {
    errors.price = 'Price must be a number.'
  } else if (price <= 0) {
    errors.price = 'Price must be greater than 0.'
  }

  return errors
}
