import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import OrderManagementPage from '@/pages/DashboardOrder/OrderManagementPage'
import permissions from '@/configs/permissions'
import DeliveryServicePage from '@/pages/DashboardOrder/DeliveryServicePage'
import OrderStatusPage from '@/pages/DashboardOrder/OrderStatusPage'
import OrderStatusTransitionPage from '@/pages/DashboardOrder/OrderStatusTransitionPage'

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
    },
    {
        path: '/delivery-services',
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
                        children={<DeliveryServicePage />}
                        permission={permissions.accessDeliveryServiceDashboardPage}
                    />
                )
            }
        ]
    },
    {
        path: '/order-statuses',
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
                        children={<OrderStatusPage />}
                        permission={permissions.accessOrderStatusDashboardPage}
                    />
                )
            }
        ]
    },
    {
        path: '/status-transitions',
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
                        children={<OrderStatusTransitionPage />}
                        permission={permissions.accessOrderStatusDashboardPage}
                    />
                )
            }
        ]
    }
]

export default OrderRoutes
