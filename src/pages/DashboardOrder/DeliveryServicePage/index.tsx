
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardOrder/DeliveryServicePage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardOrder/DeliveryServicePage/getTableColumns'
import { RootState } from '@/store'
import deliveryServiceService from '@/services/deliveryServiceService'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'
import UpdateDeliveryService from '@/pages/DashboardOrder/DeliveryServicePage/UpdateDeliveryServiceDialog'

interface IDeliveryService {
    serviceId: number;
    name: string;
    contactPhone: string;
}

const DeliveryServicePage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedDeliveryService, setSelectedDeliveryService] = useState<IDeliveryService | null>(null)
    const { deliveryServices, addNewDeliveryServiceMutation, updateDeliveryServiceMutation, removeDeliveryServiceMutation } = deliveryServiceService({ enableFetching: true })

    const columns = useMemo(
        () =>
            getTableColumns({
                hasUpdatePermission: verifyPermission(user, appPermissions.updateDeliveryService),
                hasDeletePermission: verifyPermission(user, appPermissions.deleteDeliveryService),
                onUpdateDeliveryService: (deliveryService: IDeliveryService) => {
                    setSelectedDeliveryService(deliveryService)
                    setDialogOpen(true)
                },
                removeDeliveryServiceMutation
            }),
        [removeDeliveryServiceMutation, user]
    )

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user?.fullName ?? 'Người dùng'}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách đơn vị vận chuyển của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user?.avatar ?? ''} alt={user?.fullName ?? 'Người dùng'} />
                    </Avatar>
                </div>
            </div>

            <UpdateDeliveryService
                deliveryService={selectedDeliveryService}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateDeliveryServiceMutation={updateDeliveryServiceMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateDeliveryService)}
            />

            <DataTable
                data={deliveryServices}
                columns={columns}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        addNewDeliveryServiceMutation={addNewDeliveryServiceMutation}
                        hasAddDeliveryServicePermission={verifyPermission(user, appPermissions.addNewDeliveryService)}
                    />
                )}
            />
        </div>
    )
}

export default DeliveryServicePage
