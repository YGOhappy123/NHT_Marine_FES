import { useNavigate, useRouteError } from 'react-router-dom'

const ErrorPage = () => {
    const error: any = useRouteError()
    const navigate = useNavigate()

    return (
        <div id="error-page" className="flex h-screen flex-col items-center justify-center">
            <span className="font-nunito error-page-linear-gradient !bg-clip-text text-9xl font-bold text-transparent select-none">Oops!</span>
            <p className="mt-5 text-base font-medium">Rất tiếc, đã xảy ra lỗi không mong muốn.</p>
            <p className="text-base font-medium">
                <i>
                    {error.status} - {error.statusText || error.message}
                </i>
            </p>
            <button
                className="error-page-linear-gradient mt-5 cursor-pointer rounded px-5 py-3 text-base font-medium text-white select-none hover:opacity-80"
                onClick={() => navigate('/')}
            >
                Về trang chủ
            </button>
        </div>
    )
}

export default ErrorPage
