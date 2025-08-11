import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const promotionService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [promotions, setPromotions] = useState<IPromotion[]>([])
    const [promotionCount, setPromotionCount] = useState<number>(0)

    const getAllPromotionsQuery = useQuery({
        queryKey: ['promotions'],
        queryFn: () =>
            axios.get<IResponseData<IPromotion[]>>(`/promotions?sort=${JSON.stringify({ createdAt: 'DESC' })}`),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000
    })

    const addNewPromotionMutation = useMutation({
        mutationFn: (data: IPromotion) => axios.post<IResponseData<any>>('/promotions', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['promotions'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updatePromotionMutation = useMutation({
        mutationFn: ({ promotionId, data }: { promotionId: number; data: Partial<IPromotion> }) =>
            axios.patch<IResponseData<any>>(`/promotions/${promotionId}`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['promotions'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const removePromotionMutation = useMutation({
        mutationFn: (promotionId: number) => axios.delete<IResponseData<any>>(`/promotions/${promotionId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['promotions'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllPromotionsQuery.isSuccess && getAllPromotionsQuery.data) {
            setPromotions(getAllPromotionsQuery.data.data?.data)
            setPromotionCount(getAllPromotionsQuery.data.data?.total as number)
        }
    }, [getAllPromotionsQuery.isSuccess, getAllPromotionsQuery.data])

    return { promotions, promotionCount, addNewPromotionMutation, updatePromotionMutation, removePromotionMutation }
}
export default promotionService
