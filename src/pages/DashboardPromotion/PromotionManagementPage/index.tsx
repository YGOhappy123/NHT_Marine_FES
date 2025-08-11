import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardPromotion/PromotionManagementPage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardPromotion/PromotionManagementPage/getTableColumns'
import { RootState } from '@/store'
import promotionService from '@/services/promotionService'
import useAxiosIns from '@/hooks/useAxiosIns'
import DataPromotionDialog from '@/pages/DashboardPromotion/PromotionManagementPage/DataPromotionDialog'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const PromotionManagementPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'view' | 'update'>('view')
    const [selectedPromotion, setSelectedPromotion] = useState<IPromotion | null>(null)
    const { promotions, addNewPromotionMutation, updatePromotionMutation, disablePromotionMutation } = promotionService(
        {
            enableFetching: true
        }
    )

    const fetchAllRootProductsQuery = useQuery({
        queryKey: ['products-all'],
        queryFn: () => axios.get<IResponseData<IRootProduct[]>>('/products'),
        enabled: true,
        select: res => res.data
    })
    const rootProducts = fetchAllRootProductsQuery.data?.data || []

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user?.fullName}!</h2>
                    <p className="text-muted-foreground">
                        Đây là danh sách chương trình khuyến mãi của hệ thống NHT Marine.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user?.avatar} alt={user?.fullName} />
                    </Avatar>
                </div>
            </div>

            <DataPromotionDialog
                rootProducts={rootProducts}
                promotion={selectedPromotion}
                mode={dialogMode}
                setMode={setDialogMode}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updatePromotionMutation={updatePromotionMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updatePromotion)}
            />

            <DataTable
                data={promotions}
                columns={getTableColumns({
                    hasUpdatePermission: verifyPermission(user, appPermissions.updatePromotion),
                    hasDisablePermission: verifyPermission(user, appPermissions.disablePromotion),
                    onViewPromotion: (promotion: IPromotion) => {
                        setSelectedPromotion(promotion)
                        setDialogMode('view')
                        setDialogOpen(true)
                    },
                    onUpdatePromotion: (promotion: IPromotion) => {
                        setSelectedPromotion(promotion)
                        setDialogMode('update')
                        setDialogOpen(true)
                    },
                    disablePromotionMutation: disablePromotionMutation
                })}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        rootProducts={rootProducts}
                        addNewPromotionMutation={addNewPromotionMutation as any}
                        hasAddPromotionPermission={verifyPermission(user, appPermissions.addNewPromotion)}
                    />
                )}
            />
        </div>
    )
}

export default PromotionManagementPage
