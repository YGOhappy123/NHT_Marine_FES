import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const statusTransitionService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [statusTransitions, setStatusTransitions] = useState<ITransitionGroup[]>([])
    const [statusTransitionCount, setStatusTransitionCount] = useState<number>(0)

    const getAllStatusTransitionsQuery = useQuery({
        queryKey: ['status-transitions'],
        queryFn: () => axios.get<IResponseData<ITransitionGroup[]>>('/order-statuses/transitions'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    const addNewTransitionMutation = useMutation({
        mutationFn: (data: Partial<IOrderStatusTransition>) =>
            axios.post<IResponseData<any>>('/order-statuses/transitions', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['status-transitions'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateTransitionMutation = useMutation({
        mutationFn: ({ transitionId, data }: { transitionId: number; data: Partial<IOrderStatusTransition> }) =>
            axios.patch<IResponseData<any>>(`/order-statuses/transitions/${transitionId}`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['status-transitions'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const removeTransitionMutation = useMutation({
        mutationFn: (transitionId: number) =>
            axios.delete<IResponseData<any>>(`/order-statuses/transitions/${transitionId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['status-transitions'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllStatusTransitionsQuery.isSuccess && getAllStatusTransitionsQuery.data) {
            setStatusTransitions(getAllStatusTransitionsQuery.data.data?.data)
            setStatusTransitionCount(getAllStatusTransitionsQuery.data.data?.total as number)
        }
    }, [getAllStatusTransitionsQuery.isSuccess, getAllStatusTransitionsQuery.data])

    return {
        statusTransitions,
        statusTransitionCount,
        addNewTransitionMutation,
        updateTransitionMutation,
        removeTransitionMutation
    }
}

export default statusTransitionService
