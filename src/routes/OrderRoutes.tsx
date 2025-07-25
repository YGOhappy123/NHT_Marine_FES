import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import OrderManagementPage from '@/pages/DashboardOrder/OrderManagementPage'
import permissions from '@/configs/permissions'

const OrderRoutes = [
    {
        path: '/orders',
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
                        children={<OrderManagementPage />}
                        permission={permissions.accessOrderDashboardPage}
                    />
                )
            }
        ]
    }
]

export default OrderRoutes
