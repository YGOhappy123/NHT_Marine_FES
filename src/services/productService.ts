import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const productService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [products, setProducts] = useState<IRootProduct[]>([])
    const [productCount, setProductCount] = useState<number>(0)

    const getAllProductsQuery = useQuery({
        queryKey: ['products'],
        queryFn: () => axios.get<IResponseData<IRootProduct[]>>('/products'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000
    })

    // const addNewProductMutation = useMutation({
    //     mutationFn: (data: Partial<IRootProduct>) => axios.post<IResponseData<any>>('/products', data),
    //     onError: onError,
    //     onSuccess: res => {
    //         queryClient.invalidateQueries({ queryKey: ['products'] })
    //         toast(getMappedMessage(res.data.message), toastConfig('success'))
    //     }
    // })

    // const updateProductMutation = useMutation({
    //     mutationFn: ({ productId, data }: { productId: number; data: Partial<IRootProduct> }) =>
    //         axios.patch<IResponseData<any>>(`/products/${productId}`, data),
    //     onError: onError,
    //     onSuccess: res => {
    //         queryClient.invalidateQueries({ queryKey: ['products'] })
    //         toast(getMappedMessage(res.data.message), toastConfig('success'))
    //     }
    // })

    // const removeProductMutation = useMutation({
    //     mutationFn: (productId: number) => axios.delete<IResponseData<any>>(`/products/${productId}`),
    //     onError: onError,
    //     onSuccess: res => {
    //         queryClient.invalidateQueries({ queryKey: ['products'] })
    //         toast(getMappedMessage(res.data.message), toastConfig('success'))
    //     }
    // })

    useEffect(() => {
        if (getAllProductsQuery.isSuccess && getAllProductsQuery.data) {
            setProducts(getAllProductsQuery.data.data?.data)
            setProductCount(getAllProductsQuery.data.data?.total as number)
        }
    }, [getAllProductsQuery.isSuccess, getAllProductsQuery.data])

    return {
        products,
        productCount
        // addNewProductMutation,
        // updateProductMutation,
        // removeProductMutation
    }
}

export default productService
