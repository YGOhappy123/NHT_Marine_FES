import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import DamageTypePage from '@/pages/DashboardStock/DamageTypePage'
import StorageTypePage from '@/pages/DashboardStock/StorageTypePage'
import SupplierPage from '@/pages/DashboardStock/SupplierPage'
import InventoryPage from '@/pages/DashboardStock/InventoryPage'
import StoragePage from '@/pages/DashboardStock/StoragePage'
import InventoryDistributionPage from '@/pages/DashboardImport/InventoryDistributionPage'

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
    },
    {
        path: '/storages',
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
                        children={<StoragePage />}
                        permission={permissions.accessStorageDashboardPage}
                    />
                )
            }
        ]
    },
    {
        path: '/inventories',
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
                        children={<InventoryPage />}
                        permission={permissions.accessStorageDashboardPage}
                    />
                )
            },
            {
                path: 'distributions',
                element: (
                    <PermissionProtector
                        children={<InventoryDistributionPage />}
                        permission={permissions.updateInventory}
                    />
                )
            }
        ]
    }
]

export default StockRoutes
