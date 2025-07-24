import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import OrderPage from '@/pages/DashboardOrder/OrderPage'
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
                    <PermissionProtector children={<OrderPage />} permission={permissions.accessOrderDashboardPage} />
                )
            }
        ]
    }
]

export default OrderRoutes
