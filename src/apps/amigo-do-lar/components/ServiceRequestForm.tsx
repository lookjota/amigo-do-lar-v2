import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getServices, type ApiService } from '../api/services-api'
import { useCreateServiceRequest } from '../api/useCreateServiceRequest'
import { createWhatsAppUrl } from '../config/site'
import { publishedServiceAreas } from '../data/serviceAreas'
import { services } from '../data/services'
import { serviceRequestFormSchema, type ServiceRequestFormValues } from '../validation/service-request-schema'

type FieldName = keyof ServiceRequestFormValues
type FieldErrors = Partial<Record<FieldName, string>>

const fieldOrder: FieldName[] = ['customerName', 'phone', 'email', 'serviceSlug', 'serviceAreaSlug', 'address', 'description']

function publicErrorMessage(category: string, code?: string): string {
  if (code === 'DUPLICATE_SERVICE_REQUEST') return 'Esta solicitação já foi recebida. Aguarde nosso contato ou continue pelo WhatsApp.'
  if (code === 'SERVICE_INACTIVE' || code === 'SERVICE_NOT_FOUND') return 'O serviço selecionado não está disponível neste momento. Escolha outro serviço ou fale conosco pelo WhatsApp.'
  if (category === 'validation') return 'Revise os campos destacados e tente novamente.'
  if (category === 'network' || category === 'timeout') return 'Não foi possível conectar ao atendimento agora. Verifique sua conexão e tente novamente.'
  return 'Não foi possível enviar sua solicitação neste momento. Tente novamente em alguns instantes.'
}

export function ServiceRequestForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const mutation = useCreateServiceRequest()
  const [apiServices, setApiServices] = useState<ApiService[]>([])
  const [catalogUnavailable, setCatalogUnavailable] = useState(false)
  const [serviceSlug, setServiceSlug] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const candidate = new URLSearchParams(location.search).get('servico')
    if (candidate && services.some((service) => service.slug === candidate)) {
      queueMicrotask(() => setServiceSlug(candidate))
    }
  }, [location.search])

  useEffect(() => {
    const controller = new AbortController()
    getServices(controller.signal).then(setApiServices).catch(() => { if (!controller.signal.aborted) setCatalogUnavailable(true) })
    return () => controller.abort()
  }, [])

  const selectedApiService = useMemo(() => apiServices.find((service) => service.slug === serviceSlug), [apiServices, serviceSlug])
  const whatsappUrl = createWhatsAppUrl('Olá! Não consegui concluir a solicitação pelo site e gostaria de atendimento residencial.')

  function focusFirstError(nextErrors: FieldErrors) {
    const first = fieldOrder.find((field) => nextErrors[field])
    if (first) {
      const element = formRef.current?.elements.namedItem(first)
      if (element instanceof HTMLElement) element.focus()
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mutation.isSubmitting) return
    const formData = new FormData(event.currentTarget)
    const result = serviceRequestFormSchema.safeParse(Object.fromEntries(formData))
    if (!result.success) {
      const nextErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as FieldName
        if (fieldOrder.includes(field) && !nextErrors[field]) nextErrors[field] = issue.message
      }
      setErrors(nextErrors)
      focusFirstError(nextErrors)
      return
    }
    setErrors({})
    if (!selectedApiService) {
      setCatalogUnavailable(true)
      return
    }
    const created = await mutation.submit({
      customer: { name: result.data.customerName, phone: result.data.phone, ...(result.data.email ? { email: result.data.email } : {}) },
      serviceId: selectedApiService.id,
      description: result.data.description,
      address: `${result.data.address} — ${publishedServiceAreas.find((area) => area.slug === result.data.serviceAreaSlug)?.name ?? ''}`,
      city: 'Brasília',
    })
    if (created) navigate('/solicitacao-enviada')
  }

  const errorId = (field: FieldName) => errors[field] ? `${field}-error` : undefined

  return (
    <form ref={formRef} className="amigo-quote-request-form" onSubmit={handleSubmit} noValidate aria-busy={mutation.isSubmitting}>
      <div className="amigo-form-grid">
        <label>Nome completo<input name="customerName" type="text" autoComplete="name" maxLength={120} aria-invalid={Boolean(errors.customerName)} aria-describedby={errorId('customerName')} />{errors.customerName && <span id="customerName-error" className="amigo-field-error">{errors.customerName}</span>}</label>
        <label>Telefone<input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} aria-invalid={Boolean(errors.phone)} aria-describedby={errorId('phone')} />{errors.phone && <span id="phone-error" className="amigo-field-error">{errors.phone}</span>}</label>
        <label>E-mail <span>(opcional)</span><input name="email" type="email" inputMode="email" autoComplete="email" maxLength={320} aria-invalid={Boolean(errors.email)} aria-describedby={errorId('email')} />{errors.email && <span id="email-error" className="amigo-field-error">{errors.email}</span>}</label>
        <label>Serviço<select name="serviceSlug" value={serviceSlug} onChange={(event) => setServiceSlug(event.target.value)} aria-invalid={Boolean(errors.serviceSlug)} aria-describedby={errorId('serviceSlug')}><option value="">Selecione o serviço</option>{services.map((service) => <option key={service.slug} value={service.slug}>{service.name}</option>)}</select>{errors.serviceSlug && <span id="serviceSlug-error" className="amigo-field-error">{errors.serviceSlug}</span>}</label>
        <label>Região<select name="serviceAreaSlug" defaultValue="" aria-invalid={Boolean(errors.serviceAreaSlug)} aria-describedby={errorId('serviceAreaSlug')}><option value="">Selecione a região</option>{publishedServiceAreas.map((area) => <option key={area.slug} value={area.slug}>{area.name}</option>)}</select>{errors.serviceAreaSlug && <span id="serviceAreaSlug-error" className="amigo-field-error">{errors.serviceAreaSlug}</span>}</label>
        <label>Endereço do atendimento<input name="address" type="text" autoComplete="street-address" maxLength={300} aria-invalid={Boolean(errors.address)} aria-describedby={errorId('address')} />{errors.address && <span id="address-error" className="amigo-field-error">{errors.address}</span>}</label>
      </div>
      <label>Descreva o que precisa ser feito<textarea name="description" rows={6} maxLength={2_000} aria-invalid={Boolean(errors.description)} aria-describedby={errorId('description')} />{errors.description && <span id="description-error" className="amigo-field-error">{errors.description}</span>}</label>
      <button className="amigo-button amigo-button-primary" type="submit" disabled={mutation.isSubmitting}>{mutation.isSubmitting ? 'Enviando solicitação…' : 'Enviar solicitação'}</button>
      {(catalogUnavailable || mutation.status === 'error') && <div className="amigo-form-message amigo-form-message-error" role="alert"><p>{catalogUnavailable && !selectedApiService ? 'O envio pelo site está temporariamente indisponível porque o catálogo de atendimento não pôde confirmar este serviço.' : publicErrorMessage(mutation.error?.category ?? 'unknown', mutation.error?.originalError && typeof mutation.error.originalError === 'object' && 'code' in mutation.error.originalError ? String(mutation.error.originalError.code) : undefined)}</p><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Continuar pelo WhatsApp</a></div>}
    </form>
  )
}
