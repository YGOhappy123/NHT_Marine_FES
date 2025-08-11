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
import DataRoleDialog from '@/pages/DashboardPersonnel/RoleManagementPage/DataRoleDialog'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const OrderStatusTransitionPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedTransition, setSelectedTransition] = useState<IOrderStatusTransition | null>(null)
    // const { roles, addNewRoleMutation, updateRoleMutation, removeRoleMutation } = roleService({ enableFetching: true })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.fullName}!</h2>
                    <p className="text-muted-foreground">
                        Đây là danh sách chuyển đổi trạng thái đơn hàng của hệ thống NHT Marine.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.fullName} />
                    </Avatar>
                </div>
            </div>

            {/*  */}
        </div>
    )
}

export default OrderStatusTransitionPage
