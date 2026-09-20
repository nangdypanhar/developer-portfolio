export interface User {
  id: number
  name: string
  email: string
  company?: {
    name: string
  }
  address?: {
    street: string
    city: string
  }
}
