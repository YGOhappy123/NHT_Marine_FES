import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardStock/DamageTypePage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardStock/DamageTypePage/getTableColumns'
import { RootState } from '@/store'
import damageTypeService from '@/services/damageTypeService'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'
import UpdateDamageType from '@/pages/DashboardStock/DamageTypePage/UpdateDamageTypeDialog'

const DamageTypePage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedDamageType, setSelectedDamageType] = useState<IDamageType | null>(null)
    const { damageTypes, addNewDamageTypeMutation, updateDamageTypeMutation, removeDamageTypeMutation } =
        damageTypeService({ enableFetching: true })

    const columns = useMemo(
        () =>
            getTableColumns({
                hasUpdatePermission: verifyPermission(user, appPermissions.updateDamageCategory),
                hasDeletePermission: verifyPermission(user, appPermissions.deleteDamageCategory),
                onUpdateDamageType: (damageType: IDamageType) => {
                    setSelectedDamageType(damageType)
                    setDialogOpen(true)
                },
                removeDamageTypeMutation
            }),
        [removeDamageTypeMutation, user]
    )

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user?.fullName ?? 'Người dùng'}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách loại thiệt hại của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user?.avatar ?? ''} alt={user?.fullName ?? 'Người dùng'} />
                    </Avatar>
                </div>
            </div>

            <UpdateDamageType
                damageType={selectedDamageType}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateDamageTypeMutation={updateDamageTypeMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateDamageCategory)}
            />

            <DataTable
                data={damageTypes}
                columns={columns}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        addNewDamageTypeMutation={addNewDamageTypeMutation}
                        hasAddDamageTypePermission={verifyPermission(user, appPermissions.addNewDamageCategory)}
                    />
                )}
            />
        </div>
    )
}

export default DamageTypePage
