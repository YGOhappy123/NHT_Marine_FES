import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { getMappedMessage } from '@/utils/resMessageMapping'
import toastConfig from '@/configs/toast'

const DEFAULT_CLIENT_ERROR_MESSAGE = 'Xảy ra lỗi không xác định. Vui lòng thử lại sau.'

export const onError = (error: Error) => {
    const errorMessage =
        ((error as AxiosError<IResponseData<unknown>>).response?.data?.message as string) ||
        DEFAULT_CLIENT_ERROR_MESSAGE
    toast(getMappedMessage(errorMessage), toastConfig('error'))
}
