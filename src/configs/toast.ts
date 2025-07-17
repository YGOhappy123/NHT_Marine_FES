import { ToastOptions, TypeOptions } from 'react-toastify'

const toastConfig = (type: TypeOptions): ToastOptions => ({
    type,
    position: 'top-right',
    hideProgressBar: true,
    progress: undefined,
    theme: 'light',
    pauseOnHover: false,
    autoClose: 2000
})

export default toastConfig
