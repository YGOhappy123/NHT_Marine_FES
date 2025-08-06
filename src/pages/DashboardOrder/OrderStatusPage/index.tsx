
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardOrder/OrderStatusPage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardOrder/OrderStatusPage/getTableColumns'
import { RootState } from '@/store'
import orderStatusService from '@/services/orderStatusService'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'
import UpdateOrderStatus from '@/pages/DashboardOrder/OrderStatusPage/UpdateOrderStatusDialog'

interface IOrderStatus {
    statusId: number;
    name: string;
    description: string;
    isDefaultState: boolean;
    isAccounted: boolean;
    isUnfulfilled: boolean;
}

const OrderStatusPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedOrderStatus, setSelectedOrderStatus] = useState<IOrderStatus | null>(null)
    const { orderStatuses, addNewOrderStatusMutation, updateOrderStatusMutation, removeOrderStatusMutation } = orderStatusService({ enableFetching: true })

    const columns = useMemo(
        () =>
            getTableColumns({
                hasUpdatePermission: verifyPermission(user, appPermissions.updateOrderStatus),
                hasDeletePermission: verifyPermission(user, appPermissions.deleteOrderStatus),
                onUpdateOrderStatus: (orderStatus: IOrderStatus) => {
                    setSelectedOrderStatus(orderStatus)
                    setDialogOpen(true)
                },
                removeOrderStatusMutation
            }),
        [removeOrderStatusMutation, user]
    )

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user?.fullName ?? 'Người dùng'}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách trạng thái đơn hàng của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user?.avatar ?? ''} alt={user?.fullName ?? 'Người dùng'} />
                    </Avatar>
                </div>
            </div>

            <UpdateOrderStatus
                orderStatus={selectedOrderStatus}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateOrderStatusMutation={updateOrderStatusMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateOrderStatus)}
            />

            <DataTable
                data={orderStatuses}
                columns={columns}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        addNewOrderStatusMutation={addNewOrderStatusMutation}
                        hasAddOrderStatusPermission={verifyPermission(user, appPermissions.addNewOrderStatus)}
                        orderStatuses={orderStatuses}
                    />
                )}
            />
        </div>
    )
}

export default OrderStatusPage
