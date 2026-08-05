export { createCustomerSchema, updateCustomerSchema } from '../types/contracts'

export function formatCustomerPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return value
}

export function isValidCustomerPhone(value: string) {
  return /^\d{10,11}$/.test(value.replace(/\D/g, ''))
}

export function isValidCustomerEmail(value: string | null) {
  return value !== null && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
