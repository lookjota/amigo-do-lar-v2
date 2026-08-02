import { useCallback, useRef, useState } from 'react'
import { toUiError } from '../../api/errors'
import { createQuoteRequest } from './api'
import type { CreateQuoteRequestInput, QuoteRequest } from './contracts'

function getErrorMessage(error: unknown): string {
  return `${toUiError(error).userMessage} Você também pode continuar pelo WhatsApp.`
}

export function useCreateQuoteRequest() {
  const submissionInProgress = useRef(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [createdQuoteRequest, setCreatedQuoteRequest] =
    useState<QuoteRequest>()

  const submit = useCallback(async (input: CreateQuoteRequestInput) => {
    if (submissionInProgress.current) {
      return undefined
    }

    submissionInProgress.current = true
    setIsSubmitting(true)
    setErrorMessage(undefined)
    setCreatedQuoteRequest(undefined)

    try {
      const response = await createQuoteRequest(input)
      setCreatedQuoteRequest(response.data)
      return response.data
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      return undefined
    } finally {
      submissionInProgress.current = false
      setIsSubmitting(false)
    }
  }, [])

  const reset = useCallback(() => {
    if (submissionInProgress.current) {
      return
    }

    setErrorMessage(undefined)
    setCreatedQuoteRequest(undefined)
  }, [])

  return {
    submit,
    reset,
    isSubmitting,
    errorMessage,
    createdQuoteRequest,
  }
}
