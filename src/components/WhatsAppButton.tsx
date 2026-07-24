import { useEffect, useState } from 'react'

const WhatsAppButton = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const phone = '5561995646646'
  const message = 'Olá, quero um orçamento.'

  const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  if (!visible) return null

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-end gap-2 animate-fade-in"
    >
      {/* Badge online */}
      <div className="mb-2 bg-white shadow-md px-2 py-1 rounded-full text-xs text-green-600 font-medium">
        online
      </div>

      {/* Button */}
      <div className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M20.52 3.48A11.8 11.8 0 0 0 12.06 0C5.57 0 .27 5.3.27 11.8c0 2.1.55 4.14 1.6 5.95L0 24l6.42-1.84a11.7 11.7 0 0 0 5.64 1.44h.01c6.49 0 11.79-5.3 11.79-11.8 0-3.14-1.22-6.09-3.34-8.32zM12.07 21.5c-1.77 0-3.51-.48-5.02-1.39l-.36-.21-3.81 1.09 1.02-3.72-.23-.38a9.6 9.6 0 0 1-1.47-5.09c0-5.29 4.31-9.6 9.61-9.6 2.56 0 4.96 1 6.77 2.81a9.54 9.54 0 0 1 2.81 6.79c0 5.3-4.31 9.6-9.62 9.6zm5.27-7.2c-.29-.14-1.7-.84-1.96-.93-.26-.1-.45-.14-.64.14-.19.29-.74.93-.91 1.12-.17.19-.34.21-.63.07-.29-.14-1.23-.45-2.34-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.12-.59.12-.12.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.47-.64-.48h-.54c-.19 0-.5.07-.76.36-.26.29-1 1-.98 2.44.02 1.44 1.01 2.83 1.15 3.02.14.19 2.02 3.09 4.9 4.33.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.24.17-1.37-.07-.12-.26-.19-.55-.33z"/>
        </svg>
      </div>
    </a>
  )
}

export default WhatsAppButton