import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import DamageTypePage from '@/pages/DashboardStock/DamageTypePage'
import StorageTypePage from '@/pages/DashboardStock/StorageTypePage'
import SupplierPage from '@/pages/DashboardStock/SupplierPage'

const StockRoutes = [
    {
        path: '/damage-types',
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
                        children={<DamageTypePage />}
                        permission={permissions.accessDamageReportDashboardPage}
                    />
                )
            }
        ]
    },
    {
        path: '/storage-types',
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
                        children={<StorageTypePage />}
                        permission={permissions.accessStorageDashboardPage}
                    />
                )
            }
        ]
    },
    {
        path: '/suppliers',
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
                        children={<SupplierPage />}
                        permission={permissions.accessSupplierDashboardPage}
                    />
                )
            }
        ]
    }
]

export default StockRoutes
