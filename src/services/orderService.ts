import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const orderService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [orders, setOrders] = useState<IOrder[]>([])
    const [orderCount, setOrderCount] = useState<number>(0)

    const getAllOrdersQuery = useQuery({
        queryKey: ['orders'],
        queryFn: () => axios.get<IResponseData<IOrder[]>>(`/orders?sort=${JSON.stringify({ createdAt: 'DESC' })}`),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 20000
    })

    useEffect(() => {
        if (getAllOrdersQuery.isSuccess && getAllOrdersQuery.data) {
            setOrders(getAllOrdersQuery.data.data?.data)
            setOrderCount(getAllOrdersQuery.data.data?.total as number)
        }
    }, [getAllOrdersQuery.isSuccess, getAllOrdersQuery.data])

    return {
        orders,
        orderCount
    }
}

export default orderService
