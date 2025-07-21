import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useMutation, useQuery } from '@tanstack/react-query'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import permissions from '@/configs/permissions'

const roleService = ({ enableFetching = false }: { enableFetching?: boolean }) => {
    const axios = useAxiosIns()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [roles, setRoles] = useState<IStaffRole[]>([])
    const [total, setTotal] = useState<number>(0)

    const getAllRolesQuery = useQuery({
        queryKey: ['staff-roles'],
        queryFn: () => axios.get<IResponseData<IStaffRole[]>>('/roles'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 30000
    })

    useEffect(() => {
        if (getAllRolesQuery.isSuccess && getAllRolesQuery.data) {
            setRoles(getAllRolesQuery.data.data?.data)
            setTotal(getAllRolesQuery.data.data?.total as number)
        }
    }, [getAllRolesQuery.isSuccess, getAllRolesQuery.data])

    return {
        roles,
        total
    }
}

export default roleService
