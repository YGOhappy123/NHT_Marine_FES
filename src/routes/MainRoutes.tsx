import { Suspense } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import HomePage from '@/pages/HomePage'
import ErrorPage from '@/pages/ErrorPage'

const MainRoutes = [
    {
        path: '/',
        element: (
            <Suspense>
                <DashboardLayout />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <HomePage />
            }
        ]
    }
]

export default MainRoutes
