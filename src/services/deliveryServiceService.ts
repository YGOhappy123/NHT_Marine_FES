import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const deliveryServiceService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [deliveryServices, setDeliveryServices] = useState<IDeliveryService[]>([])
    const [deliveryServiceCount, setDeliveryServiceCount] = useState<number>(0)

    const getAllDeliveryServicesQuery = useQuery({
        queryKey: ['deliveryServices'],
        queryFn: () => axios.get<IResponseData<IDeliveryService[]>>('/delivery-services'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000
    })

    const addNewDeliveryServiceMutation = useMutation({
        mutationFn: (data: any) => axios.post<IResponseData<any>>('/delivery-services', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['deliveryServices'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateDeliveryServiceMutation = useMutation({
        mutationFn: ({
            serviceId,
            data
        }: {
            serviceId: number
            data: {
                name: string
                contactPhone: string
            }
        }) => axios.patch<IResponseData<any>>(`/delivery-services/${serviceId}`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['deliveryServices'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const removeDeliveryServiceMutation = useMutation({
        mutationFn: (serviceId: number) => axios.delete<IResponseData<any>>(`/delivery-services/${serviceId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['deliveryServices'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllDeliveryServicesQuery.isSuccess && getAllDeliveryServicesQuery.data) {
            setDeliveryServices(getAllDeliveryServicesQuery.data.data?.data)
            setDeliveryServiceCount(getAllDeliveryServicesQuery.data.data?.total as number)
        }
    }, [getAllDeliveryServicesQuery.isSuccess, getAllDeliveryServicesQuery.data])

    return {
        deliveryServices,
        deliveryServiceCount,
        addNewDeliveryServiceMutation,
        updateDeliveryServiceMutation,
        removeDeliveryServiceMutation
    }
}

export default deliveryServiceService
