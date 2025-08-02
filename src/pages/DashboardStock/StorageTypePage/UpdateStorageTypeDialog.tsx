
import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface IStorageType {
    typeId: number
    name: string
}

const updateStorageTypeFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên loại kho không được để trống.' })
})

type UpdateStorageTypeDialogProps = {
    storageType: IStorageType | null
    updateStorageTypeMutation: UseMutationResult<any, any, { typeId: number; data: { name: string } }, any>
    hasUpdatePermission: boolean
    open: boolean
    setOpen: (open: boolean) => void
}

const UpdateStorageTypeDialog = ({
    storageType,
    updateStorageTypeMutation,
    hasUpdatePermission,
    open,
    setOpen
}: UpdateStorageTypeDialogProps) => {
    const form = useForm<z.infer<typeof updateStorageTypeFormSchema>>({
        resolver: zodResolver(updateStorageTypeFormSchema),
        defaultValues: {
            name: ''
        }
    })

    useEffect(() => {
        if (storageType && open) {
            form.reset({
                name: storageType.name
            })
        }
    }, [storageType, open, form])

    const onSubmit = async (values: z.infer<typeof updateStorageTypeFormSchema>) => {
        if (!storageType || !hasUpdatePermission) return
        await updateStorageTypeMutation.mutateAsync({
            typeId: storageType.typeId,
            data: { name: values.name }
        })
        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa loại kho</DialogTitle>
                    <DialogDescription>
                        Cập nhật tên loại kho. Nhấn Lưu để xác nhận.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên loại kho</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên loại kho"
                                            className="h-10"
                                            disabled={!hasUpdatePermission}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset()
                                    setOpen(false)
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    !hasUpdatePermission ||
                                    updateStorageTypeMutation.isPending ||
                                    !form.watch('name').trim()
                                }
                            >
                                Lưu
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateStorageTypeDialog
