import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import ProfilePage from '@/pages/DashboardProfile/ProfilePage'
import permissions from '@/configs/permissions'
import OrderPage from '@/pages/DashboardOrder/OrderPage'
import ChangePasswordPage from '@/pages/DashboardProfile/ChangePasswordPage'
import RoleManagementPage from '@/pages/DashboardPersonnel/RoleManagementPage'

const MainRoutes = [
    {
        path: '/',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
            </Suspense>
        ),
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
                path: 'change-password',
                element: <ChangePasswordPage />
            },
            {
                path: 'orders',
                element: (
                    <PermissionProtector children={<OrderPage />} permission={permissions.accessOrderDashboardPage} />
                )
            },
            {
                path: 'staff-roles',
                element: (
                    <PermissionProtector
                        children={<RoleManagementPage />}
                        permission={permissions.accessRoleDashboardPage}
                    />
                )
            }
        ]
    }
]

export default MainRoutes
