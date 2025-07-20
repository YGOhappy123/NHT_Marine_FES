import { useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const staffService = () => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [isSearching, setIsSearching] = useState(false)

    const updateStaffMutation = useMutation({
        mutationFn: ({ staffId, data }: { staffId: number; data: Partial<IStaff> }) =>
            axios.patch<IResponseData<any>>(`/staffs/${staffId}`, data),
        onSuccess: (res) => {
            if (isSearching) {
                queryClient.invalidateQueries({ queryKey: ['search-staffs'] })
                // searchStaffsQuery.refetch()
            } else {
                queryClient.invalidateQueries({ queryKey: ['staffs'] })
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    return { updateStaffMutation }
}
export default staffService
