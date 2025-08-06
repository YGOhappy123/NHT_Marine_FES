
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardStock/SupplierPage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardStock/SupplierPage/getTableColumns'
import { RootState } from '@/store'
import supplierService from '@/services/supplierService'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'
import UpdateSupplier from '@/pages/DashboardStock/SupplierPage/UpdateSupplierDialog'

interface ISupplier {
    supplierId: number;
    name: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
}

const SupplierPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null)
    const { suppliers, addNewSupplierMutation, updateSupplierMutation, removeSupplierMutation } = supplierService({ enableFetching: true })

    const columns = useMemo(
        () =>
            getTableColumns({
                hasUpdatePermission: verifyPermission(user, appPermissions.updateSupplier),
                hasDeletePermission: verifyPermission(user, appPermissions.deleteSupplier),
                onUpdateSupplier: (supplier: ISupplier) => {
                    setSelectedSupplier(supplier)
                    setDialogOpen(true)
                },
                removeSupplierMutation
            }),
        [removeSupplierMutation, user]
    )

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user?.fullName ?? 'Người dùng'}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách nhà cung cấp của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user?.avatar ?? ''} alt={user?.fullName ?? 'Người dùng'} />
                    </Avatar>
                </div>
            </div>

            <UpdateSupplier
                supplier={selectedSupplier}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateSupplierMutation={updateSupplierMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateSupplier)}
            />

            <DataTable
                data={suppliers}
                columns={columns}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        addNewSupplierMutation={addNewSupplierMutation}
                        hasAddSupplierPermission={verifyPermission(user, appPermissions.addNewSupplier)}
                    />
                )}
            />
        </div>
    )
}

export default SupplierPage
