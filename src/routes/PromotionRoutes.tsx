import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import PromotionManagementPage from '@/pages/DashboardPromotion/PromotionManagementPage'
import CouponManagementPage from '@/pages/DashboardPromotion/CouponManagementPage'
import permissions from '@/configs/permissions'

const PromotionRoutes = [
    {
        path: '/promotions',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: (
                    <PermissionProtector
                        children={<PromotionManagementPage />}
                        permission={permissions.accessPromotionDashboardPage}
                    />
                )
            }
        ]
    },
    {
        path: '/coupons',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: (
                    <PermissionProtector
                        children={<CouponManagementPage />}
                        permission={permissions.accessCouponDashboardPage}
                    />
                )
            }
        ]
    }
]

export default PromotionRoutes
