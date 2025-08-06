import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const staffService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [staffs, setStaffs] = useState<IStaff[]>([])
    const [staffCount, setStaffCount] = useState<number>(0)

    const getAllStaffsQuery = useQuery({
        queryKey: ['staffs'],
        queryFn: () => axios.get<IResponseData<IStaff[]>>('/staffs'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    const updateStaffMutation = useMutation({
        mutationFn: ({ staffId, data }: { staffId: number; data: Partial<IStaff> }) =>
            axios.patch<IResponseData<any>>(`/staffs/${staffId}`, data),
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['staffs'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    const deactivateStaffAccountMutation = useMutation({
        mutationFn: (staffId: number) => axios.post<IResponseData<any>>(`/staffs/deactivate-account/${staffId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['staffs'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllStaffsQuery.isSuccess && getAllStaffsQuery.data) {
            setStaffs(getAllStaffsQuery.data.data?.data)
            setStaffCount(getAllStaffsQuery.data.data?.total as number)
        }
    }, [getAllStaffsQuery.isSuccess, getAllStaffsQuery.data])

    return { staffs, staffCount, updateStaffMutation, deactivateStaffAccountMutation }
}
export default staffService
