import { useMutation } from '@tanstack/react-query'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'

const fileService = () => {
    const axios = useAxiosIns()

    const uploadFileMutation = useMutation({
        mutationFn: ({ file, folder }: { file: string | Blob; folder: string }) => {
            const form = new FormData()
            form.append('file', file)
            return axios.postForm(`/files/upload-image?folder=${folder}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        },
        onError: onError
    })

    const uploadBase64Mutation = useMutation({
        mutationFn: ({ base64, folder }: { base64: string; folder: string }) => {
            return axios.post(`/files/upload-base64-image?folder=${folder}`, {
                base64Image: base64
            })
        },
        onError: onError
    })

    const deleteMutation = useMutation({
        mutationFn: (imageUrl: string) => axios.post('/files/delete-image', { imageUrl }),
        onError: onError
    })

    return { uploadFileMutation, uploadBase64Mutation, deleteMutation }
}

export default fileService
