import { useEffect, useState } from 'react'
import { toUiError } from '../../../../api/errors'
import { useServiceRequestAttachmentBlob } from '../api/useServiceRequestAttachmentBlob'

interface Props {
  serviceRequestId: string
  attachmentId: string
  name: string
  previewOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export function AttachmentImage({ serviceRequestId, attachmentId, name, previewOpen, onOpen, onClose }: Props) {
  const query = useServiceRequestAttachmentBlob(serviceRequestId, attachmentId)
  if (query.data) return <BlobAttachmentImage blob={query.data} name={name} previewOpen={previewOpen} onOpen={onOpen} onClose={onClose} />
  return <button type="button" className="amigo-attachment-thumbnail" disabled aria-label={`Visualizar ${name}`}>
      {query.isPending && <span role="status">Carregando miniatura…</span>}
      {query.isError && <span role="alert">{toUiError(query.error).userMessage}</span>}
    </button>
}

function BlobAttachmentImage({ blob, name, previewOpen, onOpen, onClose }: Omit<Props, 'serviceRequestId' | 'attachmentId'> & { blob: Blob }) {
  const [url] = useState(() => URL.createObjectURL(blob))
  useEffect(() => () => URL.revokeObjectURL(url), [url])
  return <>
    <button type="button" className="amigo-attachment-thumbnail" onClick={onOpen} aria-label={`Visualizar ${name}`}><img src={url} alt="" /></button>
    {previewOpen && url && <div className="amigo-admin-modal-backdrop" onClick={onClose}>
      <section className="amigo-admin-modal amigo-image-modal" role="dialog" aria-modal="true" aria-label={`Visualização de ${name}`} onClick={(event) => event.stopPropagation()}>
        <header><h3>{name}</h3><button type="button" onClick={onClose} aria-label="Fechar visualização">Fechar</button></header>
        <img src={url} alt={name} />
      </section>
    </div>}
  </>
}
