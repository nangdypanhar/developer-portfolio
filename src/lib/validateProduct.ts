import type { FormErrors, ProductDraft } from '../types/product'

export function validateProduct(draft: ProductDraft): FormErrors {
  const errors: FormErrors = {}

  const name = draft.name?.trim() ?? ''
  if (name.length === 0) {
    errors.name = 'Name is required.'
  }

  const priceRaw = draft.price?.trim() ?? ''
  const price = Number(priceRaw)

  if (priceRaw.length === 0 || Number.isNaN(price)) {
    errors.price = 'Price must be a number.'
  } else if (price <= 0) {
    errors.price = 'Price must be greater than 0.'
  }

  return errors
}
