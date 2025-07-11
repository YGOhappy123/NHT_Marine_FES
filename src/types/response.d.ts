import type { AxiosResponse } from 'axios'

declare global {
    interface IResponse<T> extends AxiosResponse {
        data: IResponseData<T>
    }

    interface IResponseData<T> {
        data: T
        code: number
        message: string
        total?: number
        took?: number
    }
}

export {}
