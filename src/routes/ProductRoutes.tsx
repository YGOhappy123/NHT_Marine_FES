import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import ProductManagementPage from '@/pages/DashboardProduct/ProductManagementPage'
import ProductDetailPage from '@/pages/DashboardProduct/ProductDetailPage'
import ProductImportPage from '@/pages/DashboardImport/ProductImportPage'
import AddProductPage from '@/pages/DashboardProduct/AddProductPage'
import AddImportPage from '@/pages/DashboardImport/AddImportPage'
import permissions from '@/configs/permissions'

const ProductRoutes = [
    {
        path: '/products',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <ProductManagementPage />
            },
            {
                path: ':productId',
                element: <ProductDetailPage />
            },
            {
                path: 'add',
                element: <PermissionProtector children={<AddProductPage />} permission={permissions.addNewProduct} />
            },
            {
                path: 'imports',
                element: (
                    <PermissionProtector
                        children={<ProductImportPage />}
                        permission={permissions.accessImportDashboardPage}
                    />
                )
            },
            {
                path: 'imports/add',
                element: <PermissionProtector children={<AddImportPage />} permission={permissions.addNewImport} />
            }
        ]
    }
]

export default ProductRoutes
