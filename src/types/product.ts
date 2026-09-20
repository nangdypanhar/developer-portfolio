export interface Product {
  id: string
  name: string
  price: number
  inStock: boolean
  onSale: boolean
  costPrice: number
}

export type PublicProduct = Omit<Product, 'costPrice'>

export interface NewProductForm {
  name: string
  price: string
}

export type ProductDraft = Partial<NewProductForm>

export interface FormErrors {
  name?: string
  price?: string
}
