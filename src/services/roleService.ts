import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const roleService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [roles, setRoles] = useState<IStaffRole[]>([])
    const [roleCount, setRoleCount] = useState<number>(0)

    const getAllRolesQuery = useQuery({
        queryKey: ['staff-roles'],
        queryFn: () => axios.get<IResponseData<IStaffRole[]>>('/roles'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    const addNewRoleMutation = useMutation({
        mutationFn: (data: Partial<IStaffRole>) => axios.post<IResponseData<any>>('/roles', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['staff-roles'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateRoleMutation = useMutation({
        mutationFn: ({ roleId, data }: { roleId: number; data: Partial<IStaffRole> }) =>
            axios.patch<IResponseData<any>>(`/roles/${roleId}`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['staff-roles'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const removeRoleMutation = useMutation({
        mutationFn: (roleId: number) => axios.delete<IResponseData<any>>(`/roles/${roleId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['staff-roles'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllRolesQuery.isSuccess && getAllRolesQuery.data) {
            setRoles(getAllRolesQuery.data.data?.data)
            setRoleCount(getAllRolesQuery.data.data?.total as number)
        }
    }, [getAllRolesQuery.isSuccess, getAllRolesQuery.data])

    return {
        roles,
        roleCount,
        addNewRoleMutation,
        updateRoleMutation,
        removeRoleMutation
    }
}

export default roleService
