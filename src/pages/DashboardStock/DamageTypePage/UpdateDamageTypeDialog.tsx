
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

interface IDamageType {
    typeId: number
    name: string
}

const updateDamageTypeFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên loại thiệt hại không được để trống.' })
})

type UpdateDamageTypeDialogProps = {
    damageType: IDamageType | null
    updateDamageTypeMutation: UseMutationResult<any, any, { typeId: number; data: { name: string } }, any>
    hasUpdatePermission: boolean
    open: boolean
    setOpen: (open: boolean) => void
}

const UpdateDamageTypeDialog = ({
    damageType,
    updateDamageTypeMutation,
    hasUpdatePermission,
    open,
    setOpen
}: UpdateDamageTypeDialogProps) => {
    const form = useForm<z.infer<typeof updateDamageTypeFormSchema>>({
        resolver: zodResolver(updateDamageTypeFormSchema),
        defaultValues: {
            name: ''
        }
    })

    useEffect(() => {
        if (damageType && open) {
            form.reset({
                name: damageType.name
            })
        }
    }, [damageType, open, form])

    const onSubmit = async (values: z.infer<typeof updateDamageTypeFormSchema>) => {
        if (!damageType || !hasUpdatePermission) return
        await updateDamageTypeMutation.mutateAsync({
            typeId: damageType.typeId,
            data: { name: values.name }
        })
        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa loại thiệt hại</DialogTitle>
                    <DialogDescription>
                        Cập nhật tên loại thiệt hại. Nhấn Lưu để xác nhận.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên loại thiệt hại</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên loại thiệt hại"
                                            className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
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
                                    updateDamageTypeMutation.isPending ||
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

export default UpdateDamageTypeDialog
