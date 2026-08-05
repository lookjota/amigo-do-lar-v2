import {
  serviceRequestStatusLabels,
  type ServiceRequestStatus,
} from '../types/contracts'

export function ServiceRequestStatusBadge({
  status,
}: {
  status: ServiceRequestStatus
}) {
  return (
    <span className={`amigo-admin-status amigo-admin-status-${status.toLowerCase()}`}>
      {serviceRequestStatusLabels[status]}
    </span>
  )
}
