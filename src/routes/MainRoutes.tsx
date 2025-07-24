import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'
import ProfilePage from '@/pages/DashboardProfile/ProfilePage'
import ChangePasswordPage from '@/pages/DashboardProfile/ChangePasswordPage'

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
            }
        ]
    }
]

export default MainRoutes
