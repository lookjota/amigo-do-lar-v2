import { z } from 'zod'

const phoneCharacters = /^[\d\s()+.-]+$/

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '')
}

export const serviceRequestFormSchema = z.object({
  customerName: z.string().trim().min(2, 'Informe seu nome completo.').max(120, 'O nome deve ter no máximo 120 caracteres.'),
  phone: z.string().trim().refine((value) => phoneCharacters.test(value), 'Use apenas números e os símbolos comuns de telefone.').transform(normalizePhone).refine((value) => value.length === 10 || value.length === 11, 'Informe um telefone com DDD e 10 ou 11 dígitos.'),
  email: z.string().trim().toLowerCase().refine((value) => value === '' || z.email().safeParse(value).success, 'Informe um e-mail válido.').transform((value) => value || undefined),
  serviceSlug: z.string().trim().min(1, 'Selecione um serviço.'),
  serviceAreaSlug: z.string().trim().min(1, 'Selecione uma região.'),
  address: z.string().trim().min(1, 'Informe o endereço do atendimento.').max(300, 'O endereço deve ter no máximo 300 caracteres.').transform((value) => value.replace(/\s+/g, ' ')),
  description: z.string().trim().min(10, 'Descreva a necessidade em pelo menos 10 caracteres.').max(2_000, 'A descrição deve ter no máximo 2.000 caracteres.'),
})

export type ServiceRequestFormValues = z.input<typeof serviceRequestFormSchema>
export type ValidServiceRequestFormValues = z.output<typeof serviceRequestFormSchema>
