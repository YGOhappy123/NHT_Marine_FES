import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const importService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [imports, setImports] = useState<IProductImport[]>([])
    const [importCount, setImportCount] = useState<number>(0)

    const getAllImportsQuery = useQuery({
        queryKey: ['imports'],
        queryFn: () =>
            axios.get<IResponseData<IProductImport[]>>(
                `/product-imports?sort=${JSON.stringify({ trackedAt: 'DESC' })}`
            ),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    const trackNewImportMutation = useMutation({
        mutationFn: (data: {
            supplierId: number
            invoiceNumber: string
            importDate: string
            items: {
                productItemId: number
                cost: number
                quantity: number
            }[]
        }) => axios.post<IResponseData<any>>('/product-imports', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['imports'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const distributeImportMutation = useMutation({
        mutationFn: ({
            importId,
            data
        }: {
            importId: number
            data: {
                items: {
                    productItemId: number
                    storages: {
                        storageId: number
                        quantity: number
                    }[]
                }[]
            }
        }) => axios.patch<IResponseData<any>>(`/product-imports/${importId}/distribute`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['imports'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllImportsQuery.isSuccess && getAllImportsQuery.data) {
            setImports(getAllImportsQuery.data.data?.data)
            setImportCount(getAllImportsQuery.data.data?.total as number)
        }
    }, [getAllImportsQuery.isSuccess, getAllImportsQuery.data])

    return {
        imports,
        importCount,
        trackNewImportMutation,
        distributeImportMutation
    }
}

export default importService
