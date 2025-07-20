import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import ProfilePage from '@/pages/DashboardProfile/ProfilePage'
import permissions from '@/configs/permissions'
import OrderPage from '@/pages/DashboardOrder/OrderPage'

const MainRoutes = [
    {
        path: '/',
        element: <AuthProtector children={<DashboardLayout />} redirect="/auth" />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <Navigate to="/profile" replace />
            },
            {
                path: 'profile',
                element: <ProfilePage />
            },
            {
                path: 'orders',
                element: (
                    <PermissionProtector children={<OrderPage />} permission={permissions.accessOrderDashboardPage} />
                )
            }
        ]
    }
]

export default MainRoutes
