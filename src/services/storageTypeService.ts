import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const storageTypeService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [storageTypes, setStorageTypes] = useState<IStorageType[]>([])
    const [storageTypeCount, setStorageTypeCount] = useState<number>(0)

    const getAllStorageTypesQuery = useQuery({
        queryKey: ['storageTypes'],
        queryFn: () => axios.get<IResponseData<IStorageType[]>>('/storage-types'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000
    })

    const addNewStorageTypeMutation = useMutation({
        mutationFn: (data: any) => axios.post<IResponseData<any>>('/storage-types', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['storageTypes'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateStorageTypeMutation = useMutation({
        mutationFn: ({
            typeId,
            data
        }: {
            typeId: number
            data: {
                name: string
            }
        }) => axios.patch<IResponseData<any>>(`/storage-types/${typeId}`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['storageTypes'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const removeStorageTypeMutation = useMutation({
        mutationFn: (typeId: number) => axios.delete<IResponseData<any>>(`/storage-types/${typeId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['storageTypes'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllStorageTypesQuery.isSuccess && getAllStorageTypesQuery.data) {
            setStorageTypes(getAllStorageTypesQuery.data.data?.data)
            setStorageTypeCount(getAllStorageTypesQuery.data.data?.total as number)
        }
    }, [getAllStorageTypesQuery.isSuccess, getAllStorageTypesQuery.data])

    return {
        storageTypes,
        storageTypeCount,
        addNewStorageTypeMutation,
        updateStorageTypeMutation,
        removeStorageTypeMutation
    }
}

export default storageTypeService
