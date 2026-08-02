export type PreferredContactMethod = 'whatsapp' | 'phone' | 'email'

export interface CreateQuoteRequestInput {
  customerName: string
  phone: string
  email?: string
  serviceSlug: string
  serviceAreaSlug: string
  description: string
  preferredContactMethod: PreferredContactMethod
}

export interface QuoteRequest {
  id: string
  status: 'pending' | 'contacted' | 'scheduled' | 'closed'
  createdAt: string
}

export interface CreateQuoteRequestResponse {
  data: QuoteRequest
}
