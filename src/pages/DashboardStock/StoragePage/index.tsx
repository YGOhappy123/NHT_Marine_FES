import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardPersonnel/StaffManagementPage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardPersonnel/StaffManagementPage/getTableColumns'
import { RootState } from '@/store'
import staffService from '@/services/staffService'
import useAxiosIns from '@/hooks/useAxiosIns'

const StoragePage = () => {
    const axios = useAxiosIns()

    const fetchAllStorageTypesQuery = useQuery({
        queryKey: ['storage-types-all'],
        queryFn: () => axios.get<IResponseData<IStorageType[]>>('/storage-types'),
        enabled: true,
        select: res => res.data
    })
    const storageTypes = fetchAllStorageTypesQuery.data?.data || []

    return <div>StoragePage</div>
}

export default StoragePage
