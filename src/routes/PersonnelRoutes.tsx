import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import RoleManagementPage from '@/pages/DashboardPersonnel/RoleManagementPage'

const PersonnelRoutes = [
    {
        path: '/personnel',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
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

export default PersonnelRoutes
