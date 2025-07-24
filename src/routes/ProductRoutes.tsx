import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import ProductPage from '@/pages/DashboardProduct/ProductPage'
import ProductDetailPage from '@/pages/DashboardProduct/ProductDetailPage'
import AddProductPage from '@/pages/DashboardProduct/AddProductPage'
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
                element: <ProductPage />
            },
            {
                path: ':productId',
                element: <ProductDetailPage />
            },
            {
                path: 'add',
                element: <PermissionProtector children={<AddProductPage />} permission={permissions.addNewProduct} />
            }
        ]
    }
]

export default ProductRoutes
