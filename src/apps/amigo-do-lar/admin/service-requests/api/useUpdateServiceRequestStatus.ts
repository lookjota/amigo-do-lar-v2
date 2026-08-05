import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAdminServiceRequestStatus } from './service-requests-admin-api'
import { adminServiceRequestsKey } from './useServiceRequests'
import type { UpdateServiceRequestStatus } from '../types/contracts'

export function useUpdateServiceRequestStatus(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateServiceRequestStatus) =>
      updateAdminServiceRequestStatus(id, input),
    retry: false,
    onSuccess: async (updated) => {
      queryClient.setQueryData(
        [...adminServiceRequestsKey, 'detail', id],
        updated,
      )
      await queryClient.invalidateQueries({ queryKey: adminServiceRequestsKey })
    },
  })
}
