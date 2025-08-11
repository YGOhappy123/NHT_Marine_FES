import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardStock/StoragePage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardStock/StoragePage/getTableColumns'
import storageService from '@/services/storageService'
import useAxiosIns from '@/hooks/useAxiosIns'
import appPermissions from '@/configs/permissions'
import verifyPermission from '@/utils/verifyPermission'
import { RootState } from '@/store'
import DataStorageDialog from '@/pages/DashboardStock/StoragePage/UpdateStorageDialog'

const StoragePage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'view' | 'update'>('view')
    const [selectedStorage, setSelectedStorage] = useState<IStorage | null>(null)
    const { storages, addNewStorageMutation, updateStorageMutation, removeStorageMutation } = storageService({
        enableFetching: true
    })
    

    const fetchAllStorageTypesQuery = useQuery({
        queryKey: ['storage-types-all'],
        queryFn: () => axios.get<IResponseData<IStorageType[]>>('/storage-types'),
        enabled: true,
        select: res => res.data
    })
    const storageTypes = fetchAllStorageTypesQuery.data?.data || []

    useEffect(() => {
        if (addNewStorageMutation.isSuccess) {
            fetchAllStorageTypesQuery.refetch()
        }
    }, [addNewStorageMutation.isSuccess])

    useEffect(() => {
        if (updateStorageMutation.isSuccess) {
            fetchAllStorageTypesQuery.refetch()
        }
    }, [updateStorageMutation.isSuccess])

    useEffect(() => {
        if (removeStorageMutation.isSuccess) {
            fetchAllStorageTypesQuery.refetch()
        }
    }, [removeStorageMutation.isSuccess])

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user?.fullName}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách kho của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user?.avatar} alt={user?.fullName} />
                    </Avatar>
                </div>
            </div>

            <DataStorageDialog
                storage={selectedStorage}
                storageTypes={storageTypes}
                mode={dialogMode}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateStorageMutation={updateStorageMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateStorage)}
            />

            <DataTable
                data={storages}
                columns={getTableColumns({
                    hasUpdatePermission: verifyPermission(user, appPermissions.updateStorage),
                    hasDeletePermission: verifyPermission(user, appPermissions.deleteStorage),
                    onViewStorage: (storage: IStorage) => {
                        setSelectedStorage(storage)
                        setDialogMode('view')
                        setDialogOpen(true)
                    },
                    onUpdateStorage: (storage: IStorage) => {
                        setSelectedStorage(storage)
                        setDialogMode('update')
                        setDialogOpen(true)
                    },
                    removeStorageMutation: removeStorageMutation
                })}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        storageTypes={storageTypes}
                        addNewStorageMutation={addNewStorageMutation}
                    />
                )}
            />
        </div>
    )
}

export default StoragePage
