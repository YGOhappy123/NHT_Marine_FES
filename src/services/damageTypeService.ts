import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const damageTypeService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [damageTypes, setDamageTypes] = useState<IDamageType[]>([])
    const [damageTypeCount, setDamageTypeCount] = useState<number>(0)

    const getAllDamageTypesQuery = useQuery({
        queryKey: ['damageTypes'],
        queryFn: () => axios.get<IResponseData<IDamageType[]>>('/damage-types'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000
    })

    const addNewDamageTypeMutation = useMutation({
        mutationFn: (data: any) => axios.post<IResponseData<any>>('/damage-types', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['damageTypes'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateDamageTypeMutation = useMutation({
        mutationFn: ({
            typeId,
            data
        }: {
            typeId: number
            data: {
                name: string
            }
        }) => axios.patch<IResponseData<any>>(`/damage-types/${typeId}`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['damageTypes'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const removeDamageTypeMutation = useMutation({
        mutationFn: (typeId: number) => axios.delete<IResponseData<any>>(`/damage-types/${typeId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['damageTypes'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllDamageTypesQuery.isSuccess && getAllDamageTypesQuery.data) {
            setDamageTypes(getAllDamageTypesQuery.data.data?.data)
            setDamageTypeCount(getAllDamageTypesQuery.data.data?.total as number)
        }
    }, [getAllDamageTypesQuery.isSuccess, getAllDamageTypesQuery.data])

    return {
        damageTypes,
        damageTypeCount,
        addNewDamageTypeMutation,
        updateDamageTypeMutation,
        removeDamageTypeMutation
    }
}

export default damageTypeService
