import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardPersonnel/RoleManagementPage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardPersonnel/RoleManagementPage/getTableColumns'
import { RootState } from '@/store'
import roleService from '@/services/roleService'
import useAxiosIns from '@/hooks/useAxiosIns'
import ViewRoleDialog from '@/pages/DashboardPersonnel/RoleManagementPage/ViewRoleDialog'
import UpdateRoleDialog from '@/pages/DashboardPersonnel/RoleManagementPage/UpdateRoleDialog'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const RoleManagementPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<IStaffRole | null>(null)
    const { roles, addNewRoleMutation, updateRoleMutation, removeRoleMutation } = roleService({ enableFetching: true })

    const fetchAllPermissionsQuery = useQuery({
        queryKey: ['permissions-all'],
        queryFn: () => axios.get<IResponseData<IPermission[]>>('/roles/permissions'),
        enabled: true,
        select: res => res.data
    })
    const permissions = fetchAllPermissionsQuery.data?.data || []

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user.fullName}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách vai trò nhân viên của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                    </Avatar>
                </div>
            </div>

            <ViewRoleDialog
                role={selectedRole}
                permissions={permissions}
                open={viewDialogOpen}
                setOpen={setViewDialogOpen}
            />

            <UpdateRoleDialog
                role={selectedRole}
                permissions={permissions}
                open={updateDialogOpen}
                setOpen={setUpdateDialogOpen}
                updateRoleMutation={updateRoleMutation}
            />

            <DataTable
                data={roles}
                columns={getTableColumns({
                    hasUpdatePermission: verifyPermission(user, appPermissions.updateRole),
                    hasDeletePermission: verifyPermission(user, appPermissions.removeRole),
                    onViewRole: (role: IStaffRole) => {
                        setSelectedRole(role)
                        setViewDialogOpen(true)
                    },
                    onUpdateRole: (role: IStaffRole) => {
                        setSelectedRole(role)
                        setUpdateDialogOpen(true)
                    },
                    removeRoleMutation: removeRoleMutation
                })}
                renderToolbar={table => (
                    <TableToolbar table={table} permissions={permissions} addNewRoleMutation={addNewRoleMutation} />
                )}
            />
        </div>
    )
}

export default RoleManagementPage
