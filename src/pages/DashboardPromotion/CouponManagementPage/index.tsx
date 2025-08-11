import { useState } from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardPromotion/CouponManagementPage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardPromotion/CouponManagementPage/getTableColumns'
import { RootState } from '@/store'
import couponService from '@/services/couponService'
import DataCouponDialog from '@/pages/DashboardPromotion/CouponManagementPage/DataCouponDialog'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const CouponManagementPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'view' | 'update'>('view')
    const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null)
    const { coupons, addNewCouponMutation, updateCouponMutation, disableCouponMutation } = couponService({
        enableFetching: true
    })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user?.fullName}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách phiếu giảm giá của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user?.avatar} alt={user?.fullName} />
                    </Avatar>
                </div>
            </div>

            <DataCouponDialog
                coupon={selectedCoupon}
                mode={dialogMode}
                setMode={setDialogMode}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateCouponMutation={updateCouponMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateCoupon)}
            />

            <DataTable
                data={coupons}
                columns={getTableColumns({
                    hasUpdatePermission: verifyPermission(user, appPermissions.updateCoupon),
                    hasDisablePermission: verifyPermission(user, appPermissions.disableCoupon),
                    onViewCoupon: (coupon: ICoupon) => {
                        setSelectedCoupon(coupon)
                        setDialogMode('view')
                        setDialogOpen(true)
                    },
                    onUpdateCoupon: (coupon: ICoupon) => {
                        setSelectedCoupon(coupon)
                        setDialogMode('update')
                        setDialogOpen(true)
                    },
                    disableCouponMutation: disableCouponMutation
                })}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        addNewCouponMutation={addNewCouponMutation as any}
                        hasAddCouponPermission={verifyPermission(user, appPermissions.addNewCoupon)}
                    />
                )}
            />
        </div>
    )
}

export default CouponManagementPage
