import { ReactNode, useEffect } from 'react'
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

const AuthProtector = ({ redirect = '/', children }: AuthProtectorProps) => {
    const accessToken = cookies.get('access_token_fes') || localStorage.getItem('access_token_fes')
    const auth = useSelector((state: RootState) => state.auth as AuthState)
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {
        cookies.set('redirect_path_fes', location.pathname, { path: '/' })

        // Prevent redirecting to a protected page after login if user was previously denied access
        if (accessToken) {
            cookies.remove('redirect_path_fes', { path: '/' })
        }
    }, [location])

    const redirectFn = () => {
        dispatch(setLogged(false))
        dispatch(setUser(null as any))
        toast('Vui lòng đăng nhập để truy cập ứng dụng.', toastConfig('info'))
        return <Navigate to={redirect} replace />
    }

    if (!auth.isLogged) {
        return redirectFn()
    } else {
        return <>{children}</>
    }
}

export default AuthProtector
