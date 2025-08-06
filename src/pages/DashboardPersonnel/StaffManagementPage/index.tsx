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
import DataStaffDialog from '@/pages/DashboardPersonnel/StaffManagementPage/DataStaffDialog'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const StaffManagementPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'view' | 'update'>('view')
    const [selectedStaff, setSelectedStaff] = useState<IStaff | null>(null)
    const { staffs, addNewStaffMutation, updateStaffMutation, deactivateStaffAccountMutation } = staffService({
        enableFetching: true
    })

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
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.fullName}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách nhân viên của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.fullName} />
                    </Avatar>
                </div>
            </div>

            <DataStaffDialog
                staff={selectedStaff}
                permissions={permissions}
                mode={dialogMode}
                setMode={setDialogMode}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateStaffMutation={updateStaffMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateStaff)}
            />

            <DataTable
                data={staffs}
                columns={getTableColumns({
                    hasUpdatePermission: verifyPermission(user, appPermissions.updateStaff),
                    hasDeactivateStaffAccountPermission: verifyPermission(user, appPermissions.deactivateStaffAccount),
                    onViewStaff: (staff: IStaff) => {
                        setSelectedStaff(staff)
                        setDialogMode('view')
                        setDialogOpen(true)
                    },
                    onUpdateStaff: (staff: IStaff) => {
                        setSelectedStaff(staff)
                        setDialogMode('update')
                        setDialogOpen(true)
                    },
                    deactivateStaffAccountMutation: deactivateStaffAccountMutation,
                    user
                })}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        permissions={permissions}
                        addNewStaffMutation={addNewStaffMutation}
                        hasAddStaffPermission={verifyPermission(user, appPermissions.addNewStaff)}
                    />
                )}
            />
        </div>
    )
}

export default StaffManagementPage
