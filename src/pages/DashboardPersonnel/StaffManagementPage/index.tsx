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
import ChangeRoleDialog from '@/pages/DashboardPersonnel/StaffManagementPage/ChangeRoleDialog'

const StaffManagementPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false)
    const [dataDialogOpen, setDataDialogOpen] = useState(false)
    const [dataDialogMode, setDataDialogMode] = useState<'view' | 'update'>('view')
    const [selectedStaff, setSelectedStaff] = useState<IStaff | null>(null)
    const {
        staffs,
        addNewStaffMutation,
        updateStaffInfoMutation,
        changeStaffRoleMutation,
        deactivateStaffAccountMutation
    } = staffService({
        enableFetching: true
    })

    const fetchAllRolesQuery = useQuery({
        queryKey: ['roles-all'],
        queryFn: () => axios.get<IResponseData<IStaffRole[]>>('/roles'),
        enabled: true,
        select: res => res.data
    })
    const roles = fetchAllRolesQuery.data?.data || []

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
                mode={dataDialogMode}
                setMode={setDataDialogMode}
                open={dataDialogOpen}
                setOpen={setDataDialogOpen}
                updateStaffInfoMutation={updateStaffInfoMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateStaffInformation)}
            />

            <ChangeRoleDialog
                staff={selectedStaff}
                roles={roles}
                open={changeRoleDialogOpen}
                setOpen={setChangeRoleDialogOpen}
                changeStaffRoleMutation={changeStaffRoleMutation}
                hasChangeRolePermission={verifyPermission(user, appPermissions.changeStaffRole)}
            />

            <DataTable
                data={staffs}
                columns={getTableColumns({
                    hasUpdateInfoPermission: verifyPermission(user, appPermissions.updateStaffInformation),
                    hasChangeRolePermission: verifyPermission(user, appPermissions.changeStaffRole),
                    hasDeactivateAccountPermission: verifyPermission(user, appPermissions.deactivateStaffAccount),
                    onViewStaff: (staff: IStaff) => {
                        setSelectedStaff(staff)
                        setDataDialogMode('view')
                        setDataDialogOpen(true)
                    },
                    onUpdateStaffInfo: (staff: IStaff) => {
                        setSelectedStaff(staff)
                        setDataDialogMode('update')
                        setDataDialogOpen(true)
                    },
                    onChangeStaffRole: (staff: IStaff) => {
                        setSelectedStaff(staff)
                        setChangeRoleDialogOpen(true)
                    },
                    deactivateStaffAccountMutation: deactivateStaffAccountMutation,
                    user
                })}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        roles={roles}
                        addNewStaffMutation={addNewStaffMutation}
                        hasAddStaffPermission={verifyPermission(user, appPermissions.addNewStaff)}
                    />
                )}
            />
        </div>
    )
}

export default StaffManagementPage
