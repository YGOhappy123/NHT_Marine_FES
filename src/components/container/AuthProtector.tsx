import { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { AuthState, setLogged, setUser } from '@/slices/authSlice'
import { RootState } from '@/store'
import cookies from '@/libs/cookies'
import toastConfig from '@/configs/toast'

type AuthProtectorProps = {
    redirect: string
    children: ReactNode
}

const AuthProtector = ({ redirect, children }: AuthProtectorProps) => {
    const [shouldRedirect, setShouldRedirect] = useState(false)
    const accessToken = cookies.get('access_token') || localStorage.getItem('access_token')
    const auth = useSelector((state: RootState) => state.auth as AuthState)
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {
        cookies.set('redirect_path', location.pathname, { path: '/' })

        // Prevent redirecting to a protected page after login if user was previously denied access
        if (accessToken) {
            cookies.remove('redirect_path', { path: '/' })
        }
    }, [location])

    useEffect(() => {
        if (!auth.isLogged) {
            dispatch(setLogged(false))
            dispatch(setUser(null as any))
            toast('Vui lòng đăng nhập để truy cập trang này.', toastConfig('info'))
            setShouldRedirect(true)
        }
    }, [auth.isLogged])

    if (shouldRedirect) {
        return <Navigate to={redirect} replace />
    }

    return <>{children}</>
}

export default AuthProtector
