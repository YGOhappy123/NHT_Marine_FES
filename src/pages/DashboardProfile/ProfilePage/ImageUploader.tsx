import { ChangeEvent, useId } from 'react'
import { toast } from 'react-toastify'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toastConfig from '@/configs/toast'

type ImageUploaderProps = {
    hasPermission: boolean
    avatar: string | undefined
    setAvatar: (avatar: string | undefined) => void
    currentAvatar: string | undefined
}

const ImageUploader = ({ hasPermission, avatar, setAvatar, currentAvatar }: ImageUploaderProps) => {
    const inputId = useId()
    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !file.type.startsWith('image/')) {
            toast('Vui lòng chọn file hình ảnh.', toastConfig('info'))
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => setAvatar(reader.result as any)
        reader.readAsDataURL(file)
    }

    return (
        <div className="flex flex-col items-center justify-start gap-6">
            <div className="border-primary relative flex w-full max-w-[200px] items-center justify-center rounded-full border-4 p-1">
                <img src={avatar} alt="user avatar" className="aspect-square h-full w-full rounded-full object-cover" />

                {hasPermission && (
                    <label
                        htmlFor={inputId}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground absolute right-2 bottom-2 flex aspect-square w-10 cursor-pointer items-center justify-center rounded-full"
                    >
                        <Edit />
                    </label>
                )}

                <input
                    type="file"
                    name="image"
                    id={inputId}
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                />
            </div>

            {avatar !== currentAvatar && (
                <Button type="button" variant="outline" onClick={() => setAvatar(currentAvatar)}>
                    Đặt lại ảnh cũ
                </Button>
            )}
        </div>
    )
}

export default ImageUploader
