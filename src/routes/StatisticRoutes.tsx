import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import PermissionProtector from '@/components/container/PermissionProtector'
import permissions from '@/configs/permissions'
import SalesStatisticPage from '@/pages/DashboardStatistic/SalesStatisticPage'
import DetailStatisticPage from '@/pages/DashboardStatistic/DetailStatisticPage'

const StatisticRoutes = [
    {
        path: '/statistics',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'sales',
                element: (
                    <PermissionProtector
                        children={<SalesStatisticPage />}
                        permission={permissions.accessStatisticDashboardPage}
                    />
                )
            },
            {
                path: 'detail',
                element: (
                    <PermissionProtector
                        children={<DetailStatisticPage />}
                        permission={permissions.accessStatisticDashboardPage}
                    />
                )
            }
        ]
    }
]

export default StatisticRoutes
