import { ChangeEvent, useId } from 'react'
import { toast } from 'react-toastify'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toastConfig from '@/configs/toast'
import { twMerge } from 'tailwind-merge'

type NoButtonImageUploaderProps = {
    hasPermission: boolean
    image: string | undefined
    setImage: (image: string | undefined) => void
    originalImage: string | undefined
    shape?: 'circle' | 'square'
}

const NoButtonImageUploader = ({
    hasPermission,
    image,
    setImage,
    originalImage,
    shape = 'circle'
}: NoButtonImageUploaderProps) => {
    const inputId = useId()
    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !file.type.startsWith('image/')) {
            toast('Vui lòng chọn file hình ảnh.', toastConfig('info'))
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => setImage(reader.result as any)
        reader.readAsDataURL(file)
    }

    return (
        <div className="flex w-full max-w-[150px] flex-col items-center justify-start gap-6">
            <div
                className={twMerge(
                    'group border-primary relative flex w-full items-center justify-center overflow-hidden border-4 p-1',
                    shape === 'circle' ? 'rounded-full' : 'rounded-xl'
                )}
            >
                <label
                    htmlFor={hasPermission ? inputId : undefined}
                    style={{
                        cursor: hasPermission ? 'pointer' : 'default'
                    }}
                >
                    <img
                        src={image || '/images/upload-icon.jpg'}
                        alt="image"
                        className={twMerge(
                            'aspect-square h-full w-full object-cover',
                            shape === 'circle' ? 'rounded-full' : 'rounded-lg'
                        )}
                    />
                </label>

                {hasPermission && (
                    <div className="pointer-events-none absolute top-0 left-0 hidden h-full w-full flex-col items-center justify-center bg-black/30 text-white group-hover:flex">
                        <Upload />
                        <span>Tải ảnh lên</span>
                    </div>
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

            {image !== originalImage && (
                <Button type="button" variant="outline" onClick={() => setImage(originalImage)}>
                    Đặt lại ảnh cũ
                </Button>
            )}
        </div>
    )
}

export default NoButtonImageUploader
