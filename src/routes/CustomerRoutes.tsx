import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import CustomerListPage from '@/pages/DashboardCustomer/CustomerListPage'
import permissions from '@/configs/permissions'

const CustomerRoutes = [
    {
        path: '/customers',
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
                        children={<CustomerListPage />}
                        permission={permissions.accessCustomerDashboardPage}
                    />
                )
            }
        ]
    }
]

export default CustomerRoutes
