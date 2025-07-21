import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { AUTH_CAROUSEL_IMAGES } from '@/configs/constants'
import { RootState } from '@/store'
import useTitle from '@/hooks/useTitle'
import toastConfig from '@/configs/toast'
import SignInForm from '@/pages/AuthPage/SignInForm'
import AuthCarousel from '@/components/common/AuthCarousel'

export type FormType = 'login' | 'register' | 'forgot' | 'reset'

const AuthPage = () => {
    useTitle('NHT Marine | Đăng Nhập')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { isLogged } = useSelector(
        (state: RootState) => state.auth,
        () => true
    )

    if (isLogged) {
        toast(
            'Bạn đã đăng nhập rồi. Nếu bạn muốn sử dụng một tài khoản khác, vui lòng đăng xuất khỏi tài khoản hiện tại.',
            toastConfig('info')
        )
        return <Navigate to="/" />
    } else {
        return (
            <div className="bg-primary flex h-screen w-full items-center justify-center">
                <div className="bg-primary-foreground flex gap-3 rounded-xl p-3">
                    <div>
                        <AuthCarousel
                            images={AUTH_CAROUSEL_IMAGES}
                            size={{
                                width: 500,
                                height: 620
                            }}
                            autoplayDuration={2000}
                        />
                    </div>

                    <div className="h-[620px] w-[500px]">
                        <SignInForm />
                    </div>
                </div>
            </div>
        )
    }
}

export default AuthPage
