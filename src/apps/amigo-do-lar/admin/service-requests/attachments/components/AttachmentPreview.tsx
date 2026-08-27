import { useEffect, useState } from 'react'
import { formatAttachmentSize } from '../utils/attachment-labels'

function ImagePreview({ file }: { file: File }) {
  const [url] = useState(() => URL.createObjectURL(file))
  useEffect(() => {
    return () => URL.revokeObjectURL(url)
  }, [url])
  return <img src={url} alt={`Pré-visualização de ${file.name}`} />
}

export function AttachmentPreview({ file }: { file: File }) {
  return <div className="amigo-attachment-preview">
    {file.type.startsWith('image/') ? <ImagePreview key={`${file.name}-${file.size}-${file.lastModified}`} file={file} /> : <div className="amigo-attachment-pdf" aria-label={`Arquivo PDF: ${file.name}`}>PDF</div>}
    <p><strong>{file.name}</strong></p><p>{file.type} · {formatAttachmentSize(file.size)}</p>
  </div>
}
