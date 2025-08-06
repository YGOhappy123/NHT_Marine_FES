import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const orderStatusService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [orderStatuses, setOrderStatuses] = useState<IOrderStatus[]>([])
    const [orderStatusCount, setOrderStatusCount] = useState<number>(0)

    const getAllOrderStatusesQuery = useQuery({
        queryKey: ['orderStatuses'],
        queryFn: () => axios.get<IResponseData<IOrderStatus[]>>('/order-statuses'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000
    })

    const addNewOrderStatusMutation = useMutation({
        mutationFn: (data: any) => axios.post<IResponseData<any>>('/order-statuses', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['orderStatuses'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateOrderStatusMutation = useMutation({
        mutationFn: ({
            statusId,
            data
        }: {
            statusId: number
            data: {
                name: string;
                description: string;
                isDefaultState: boolean;
                isAccounted: boolean;
                isUnfulfilled: boolean;
            }
        }) => axios.patch<IResponseData<any>>(`/order-statuses/${statusId}`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['orderStatuses'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const removeOrderStatusMutation = useMutation({
        mutationFn: (statusId: number) => axios.delete<IResponseData<any>>(`/order-statuses/${statusId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['orderStatuses'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllOrderStatusesQuery.isSuccess && getAllOrderStatusesQuery.data) {
            setOrderStatuses(getAllOrderStatusesQuery.data.data?.data)
            setOrderStatusCount(getAllOrderStatusesQuery.data.data?.total as number)
        }
    }, [getAllOrderStatusesQuery.isSuccess, getAllOrderStatusesQuery.data])

    return {
        orderStatuses,
        orderStatusCount,
        addNewOrderStatusMutation,
        updateOrderStatusMutation,
        removeOrderStatusMutation
    }
}

export default orderStatusService
