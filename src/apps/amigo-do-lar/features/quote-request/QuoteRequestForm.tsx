import { useState, type FormEvent } from 'react'
import { trackEvent } from '../../analytics/analytics'
import { createWhatsAppUrl } from '../../config/site'
import { publishedServiceAreas } from '../../data/serviceAreas'
import { services } from '../../data/services'
import type { CreateQuoteRequestInput } from './contracts'
import { useCreateQuoteRequest } from './useCreateQuoteRequest'

interface QuoteRequestFormProps {
  eyebrow: string
  title: string
  description: string
}

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'

function createFallbackMessage(input: CreateQuoteRequestInput): string {
  const service =
    services.find((item) => item.slug === input.serviceSlug)?.name ??
    input.serviceSlug
  const area =
    publishedServiceAreas.find(
      (item) => item.slug === input.serviceAreaSlug,
    )?.name ?? input.serviceAreaSlug

  return [
    `Olá! Sou ${input.customerName} e gostaria de solicitar um orçamento.`,
    `Serviço: ${service}.`,
    `Região: ${area}.`,
    `Descrição: ${input.description}`,
  ].join('\n')
}

export function QuoteRequestForm({
  eyebrow,
  title,
  description,
}: QuoteRequestFormProps) {
  const {
    submit,
    reset,
    isSubmitting,
    errorMessage,
    createdQuoteRequest,
  } = useCreateQuoteRequest()
  const [fallbackUrl, setFallbackUrl] = useState<string>()

  const status: SubmissionStatus = isSubmitting
    ? 'submitting'
    : createdQuoteRequest
      ? 'success'
      : errorMessage
        ? 'error'
        : 'idle'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const form = event.currentTarget
    if (!form.reportValidity()) {
      return
    }

    const formData = new FormData(form)
    const input: CreateQuoteRequestInput = {
      customerName: String(formData.get('customerName')).trim(),
      phone: String(formData.get('phone')).trim(),
      email: String(formData.get('email')).trim() || undefined,
      serviceSlug: String(formData.get('serviceSlug')),
      serviceAreaSlug: String(formData.get('serviceAreaSlug')),
      description: String(formData.get('description')).trim(),
      preferredContactMethod: String(
        formData.get('preferredContactMethod'),
      ) as CreateQuoteRequestInput['preferredContactMethod'],
    }

    setFallbackUrl(undefined)
    const quoteRequest = await submit(input)

    if (!quoteRequest) {
      setFallbackUrl(createWhatsAppUrl(createFallbackMessage(input)))
    }
  }

  function handleReset() {
    reset()
    setFallbackUrl(undefined)
  }

  return (
    <div className="amigo-quote-request-layout">
      <div>
        <p className="amigo-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="amigo-quote-request-introduction">{description}</p>
      </div>

      <form
        className="amigo-quote-request-form"
        onSubmit={handleSubmit}
        onReset={handleReset}
        aria-busy={isSubmitting}
      >
        <div className="amigo-form-grid">
          <label>
            Nome completo
            <input
              name="customerName"
              type="text"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label>
            Telefone
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              minLength={8}
              maxLength={20}
              required
            />
          </label>

          <label>
            E-mail <span>(opcional)</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
            />
          </label>

          <label>
            Como prefere receber o contato?
            <select
              name="preferredContactMethod"
              defaultValue="whatsapp"
              required
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="phone">Telefone</option>
              <option value="email">E-mail</option>
            </select>
          </label>

          <label>
            Serviço
            <select name="serviceSlug" defaultValue="" required>
              <option value="" disabled>
                Selecione o serviço
              </option>
              {services.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Região
            <select name="serviceAreaSlug" defaultValue="" required>
              <option value="" disabled>
                Selecione a região
              </option>
              {publishedServiceAreas.map((area) => (
                <option key={area.slug} value={area.slug}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Descreva o serviço
          <textarea
            name="description"
            rows={5}
            minLength={10}
            maxLength={2_000}
            required
          />
        </label>

        <label className="amigo-consent-field">
          <input name="privacyConsent" type="checkbox" required />
          <span>
            Concordo com o tratamento dos dados para responder à solicitação,
            conforme a <a href="/politica-de-privacidade">política de privacidade</a>.
          </span>
        </label>

        <div className="amigo-actions">
          <button
            className="amigo-button amigo-button-primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando…' : 'Solicitar orçamento'}
          </button>
          {(status === 'success' || status === 'error') && (
            <button
              className="amigo-button amigo-button-secondary"
              type="reset"
            >
              Limpar mensagem
            </button>
          )}
        </div>

        {status === 'submitting' && (
          <p className="amigo-form-message" role="status">
            Enviando sua solicitação…
          </p>
        )}

        {status === 'success' && createdQuoteRequest && (
          <p className="amigo-form-message amigo-form-message-success" role="status">
            Solicitação recebida com sucesso. Protocolo:{' '}
            <strong>{createdQuoteRequest.id}</strong>.
          </p>
        )}

        {status === 'error' && (
          <div className="amigo-form-message amigo-form-message-error" role="alert">
            <p>{errorMessage}</p>
            {fallbackUrl && (
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click')}
              >
                Continuar pelo WhatsApp
              </a>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
