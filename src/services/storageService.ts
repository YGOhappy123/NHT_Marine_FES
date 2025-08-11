import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const storageService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [storages, setStorages] = useState<IStorage[]>([])
    const [storageCount, setStorageCount] = useState<number>(0)

    const getAllStoragesQuery = useQuery({
        queryKey: ['storages'],
        queryFn: () => axios.get<IResponseData<IStorage[]>>('/storages'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    const changeInventoryLocationMutation = useMutation({
        mutationFn: ({
            storageId,
            data
        }: {
            storageId: number
            data: {
                newStorageId: number
                productItemId: number
                quantity: number
            }
        }) => axios.patch<IResponseData<any>>(`/storages/${storageId}/inventory-location`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['storages'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const changeInventoryVariantMutation = useMutation({
        mutationFn: ({
            storageId,
            data
        }: {
            storageId: number
            data: {
                productItemId: number
                newProductItemId: number
                quantity: number
            }
        }) => axios.patch<IResponseData<any>>(`/storages/${storageId}/inventory-variant`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['storages'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllStoragesQuery.isSuccess && getAllStoragesQuery.data) {
            setStorages(getAllStoragesQuery.data.data?.data)
            setStorageCount(getAllStoragesQuery.data.data?.total as number)
        }
    }, [getAllStoragesQuery.isSuccess, getAllStoragesQuery.data])

    const addNewStorageMutation = useMutation({
        mutationFn: (data: any) => axios.post<IResponseData<any>>('/storages', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['storages'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateStorageMutation = useMutation({
        mutationFn: ({ storageId, data }: { storageId: number; data: Partial<IStorage> }) =>
            axios.patch<IResponseData<any>>(`/storages/${storageId}`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['storages'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })


    const removeStorageMutation = useMutation({
        mutationFn: (storageId: number) => axios.delete<IResponseData<any>>(`/storages/${storageId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['storages'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllStoragesQuery.isSuccess && getAllStoragesQuery.data) {
            setStorages(getAllStoragesQuery.data.data?.data)
            setStorageCount(getAllStoragesQuery.data.data?.total as number)
        }
    }, [getAllStoragesQuery.isSuccess, getAllStoragesQuery.data])

    return {
        storages,
        storageCount,
        changeInventoryLocationMutation,
        changeInventoryVariantMutation,
        addNewStorageMutation,
        updateStorageMutation,
        removeStorageMutation
    }
}
export default storageService
