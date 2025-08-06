import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const supplierService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [suppliers, setSuppliers] = useState<ISupplier[]>([])
    const [supplierCount, setSupplierCount] = useState<number>(0)

    const getAllSuppliersQuery = useQuery({
        queryKey: ['suppliers'],
        queryFn: () => axios.get<IResponseData<ISupplier[]>>('/suppliers'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000
    })

    const addNewSupplierMutation = useMutation({
        mutationFn: (data: any) => axios.post<IResponseData<any>>('/suppliers', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateSupplierMutation = useMutation({
        mutationFn: ({
            supplierId,
            data
        }: {
            supplierId: number
            data: {
                name: string
                address: string
                contactEmail: string
                contactPhone: string
            }
        }) => axios.patch<IResponseData<any>>(`/suppliers/${supplierId}`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const removeSupplierMutation = useMutation({
        mutationFn: (supplierId: number) => axios.delete<IResponseData<any>>(`/suppliers/${supplierId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllSuppliersQuery.isSuccess && getAllSuppliersQuery.data) {
            setSuppliers(getAllSuppliersQuery.data.data?.data)
            setSupplierCount(getAllSuppliersQuery.data.data?.total as number)
        }
    }, [getAllSuppliersQuery.isSuccess, getAllSuppliersQuery.data])

    return {
        suppliers,
        supplierCount,
        addNewSupplierMutation,
        updateSupplierMutation,
        removeSupplierMutation
    }
}

export default supplierService
