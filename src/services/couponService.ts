import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const couponService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [coupons, setCoupons] = useState<ICoupon[]>([])
    const [couponCount, setCouponCount] = useState<number>(0)

    const getAllCouponsQuery = useQuery({
        queryKey: ['coupons'],
        queryFn: () => axios.get<IResponseData<ICoupon[]>>('/promotions/coupons'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000
    })

    const addNewCouponMutation = useMutation({
        mutationFn: (data: ICoupon) => axios.post<IResponseData<any>>('/promotions/coupons', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateCouponMutation = useMutation({
        mutationFn: ({ couponId, data }: { couponId: number; data: Partial<ICoupon> }) =>
            axios.patch<IResponseData<any>>(`/promotions/coupons/${couponId}`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const disableCouponMutation = useMutation({
        mutationFn: (couponId: number) =>
            axios.post<IResponseData<any>>(`/promotions/coupons/disable-coupon/${couponId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllCouponsQuery.isSuccess && getAllCouponsQuery.data) {
            setCoupons(getAllCouponsQuery.data.data?.data)
            setCouponCount(getAllCouponsQuery.data.data?.total as number)
        }
    }, [getAllCouponsQuery.isSuccess, getAllCouponsQuery.data])

    return { coupons, couponCount, addNewCouponMutation, updateCouponMutation, disableCouponMutation }
}
export default couponService
