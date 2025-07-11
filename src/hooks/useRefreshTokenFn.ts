import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { signOut } from '@/slices/authSlice'
import { AxiosInstance } from 'axios'
import { LOGIN_SESSION_EXPIRED_MESSAGE } from '@/configs/constants'
import toastConfig from '@/configs/toast'
import cookies from '@/libs/cookies'
import dayjs from '@/libs/dayjs'

const REFRESH_TOKEN_API_ENDPOINT = '/auth/refresh-token'

const useRefreshTokenFn = (axiosIns: AxiosInstance) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleError = () => {
        toast(LOGIN_SESSION_EXPIRED_MESSAGE, toastConfig('info'))
        dispatch(signOut())
        navigate('/auth')
    }

    const refreshTokenFn = async (refreshToken: string) =>
        new Promise<string | null>((resolve, reject) => {
            axiosIns({
                url: REFRESH_TOKEN_API_ENDPOINT,
                method: 'POST',
                validateStatus: null,
                data: {
                    refreshToken: refreshToken
                }
            })
                .then(res => {
                    const { accessToken } = res?.data?.data
                    if (accessToken) {
                        cookies.set('access_token', accessToken, {
                            path: '/',
                            expires: new Date(dayjs(Date.now()).add(30, 'minutes').toISOString())
                        })
                        resolve(accessToken)
                    } else {
                        handleError()
                        resolve(null)
                    }
                })
                .catch(error => {
                    handleError()
                    reject(error)
                })
        })

    return refreshTokenFn
}

export default useRefreshTokenFn
