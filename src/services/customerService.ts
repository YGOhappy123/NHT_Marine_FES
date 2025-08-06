import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const customerService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [customers, setCustomers] = useState<ICustomer[]>([])
    const [customerCount, setCustomerCount] = useState<number>(0)

    const getAllCustomersQuery = useQuery({
        queryKey: ['customers'],
        queryFn: () => axios.get<IResponseData<ICustomer[]>>('/customers'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000
    })

    const deactivateCustomerAccountMutation = useMutation({
        mutationFn: (customerId: number) =>
            axios.post<IResponseData<any>>(`/customers/deactivate-account/${customerId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllCustomersQuery.isSuccess && getAllCustomersQuery.data) {
            setCustomers(getAllCustomersQuery.data.data?.data)
            setCustomerCount(getAllCustomersQuery.data.data?.total as number)
        }
    }, [getAllCustomersQuery.isSuccess, getAllCustomersQuery.data])

    return { customers, customerCount, deactivateCustomerAccountMutation }
}
export default customerService
