
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardStock/StorageTypePage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardStock/StorageTypePage/getTableColumns'
import { RootState } from '@/store'
import storageTypeService from '@/services/storageTypeService'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'
import UpdateStorageType from '@/pages/DashboardStock/StorageTypePage/UpdateStorageTypeDialog'

interface IStorageType {
    typeId: number
    name: string
}

const StorageTypePage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedStorageType, setSelectedStorageType] = useState<IStorageType | null>(null)
    const { storageTypes, addNewStorageTypeMutation, updateStorageTypeMutation, removeStorageTypeMutation } = storageTypeService({ enableFetching: true })

    const columns = useMemo(
        () =>
            getTableColumns({
                hasUpdatePermission: verifyPermission(user, appPermissions.updateStorageType),
                hasDeletePermission: verifyPermission(user, appPermissions.deleteStorageType),
                onUpdateStorageType: (storageType: IStorageType) => {
                    setSelectedStorageType(storageType)
                    setDialogOpen(true)
                },
                removeStorageTypeMutation
            }),
        [removeStorageTypeMutation, user]
    )

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user?.fullName ?? 'Người dùng'}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách loại kho của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user?.avatar ?? ''} alt={user?.fullName ?? 'Người dùng'} />
                    </Avatar>
                </div>
            </div>

            <UpdateStorageType
                storageType={selectedStorageType}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateStorageTypeMutation={updateStorageTypeMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateStorageType)}
            />

            <DataTable
                data={storageTypes}
                columns={columns}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        addNewStorageTypeMutation={addNewStorageTypeMutation}
                        hasAddStorageTypePermission={verifyPermission(user, appPermissions.addNewStorageType)}
                    />
                )}
            />
        </div>
    )
}

export default StorageTypePage
