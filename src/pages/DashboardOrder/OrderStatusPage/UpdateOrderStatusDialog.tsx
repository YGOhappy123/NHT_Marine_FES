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
import { Checkbox } from '@/components/ui/checkbox'

interface IOrderStatus {
    statusId: number
    name: string
    description: string
    isDefaultState: boolean
    isAccounted: boolean
    isUnfulfilled: boolean
}

const updateOrderStatusFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên trạng thái không được để trống.' }),
    description: z.string().min(1, { message: 'Mô tả không được để trống.' }),
    isDefaultState: z.boolean(),
    isAccounted: z.boolean(),
    isUnfulfilled: z.boolean()
})

type UpdateOrderStatusDialogProps = {
    orderStatus: IOrderStatus | null
    updateOrderStatusMutation: UseMutationResult<
        any,
        any,
        {
            statusId: number
            data: {
                name: string
                description: string
                isDefaultState: boolean
                isAccounted: boolean
                isUnfulfilled: boolean
            }
        },
        any
    >
    hasUpdatePermission: boolean
    open: boolean
    setOpen: (open: boolean) => void
}

const UpdateOrderStatusDialog = ({
    orderStatus,
    updateOrderStatusMutation,
    hasUpdatePermission,
    open,
    setOpen
}: UpdateOrderStatusDialogProps) => {
    const form = useForm<z.infer<typeof updateOrderStatusFormSchema>>({
        resolver: zodResolver(updateOrderStatusFormSchema),
        defaultValues: {
            name: '',
            description: '',
            isDefaultState: false,
            isAccounted: false,
            isUnfulfilled: false
        }
    })

    useEffect(() => {
        if (orderStatus && open) {
            form.reset({
                name: orderStatus.name,
                description: orderStatus.description,
                isDefaultState: orderStatus.isDefaultState,
                isAccounted: orderStatus.isAccounted,
                isUnfulfilled: orderStatus.isUnfulfilled
            })
        }
    }, [orderStatus, open, form])

    const onSubmit = async (values: z.infer<typeof updateOrderStatusFormSchema>) => {
        if (!orderStatus || !hasUpdatePermission) return
        await updateOrderStatusMutation.mutateAsync({
            statusId: orderStatus.statusId,
            data: {
                name: values.name,
                description: values.description,
                isDefaultState: values.isDefaultState,
                isAccounted: values.isAccounted,
                isUnfulfilled: values.isUnfulfilled
            }
        })
        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa trạng thái đơn hàng</DialogTitle>
                    <DialogDescription>Cập nhật thông tin trạng thái đơn hàng. Nhấn Lưu để xác nhận.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên trạng thái đơn hàng</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên trạng thái đơn hàng"
                                            className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                            disabled={!hasUpdatePermission}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập mô tả trạng thái đơn hàng"
                                            className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                            disabled={!hasUpdatePermission}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isDefaultState"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={checked => {
                                                if (orderStatus?.isDefaultState && !checked) return
                                                field.onChange(checked)
                                            }}
                                            disabled={!hasUpdatePermission}
                                        />
                                    </FormControl>
                                    <FormLabel>Trạng thái mặc định</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isAccounted"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!hasUpdatePermission}
                                        />
                                    </FormControl>
                                    <FormLabel>Đã thanh toán</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isUnfulfilled"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!hasUpdatePermission}
                                        />
                                    </FormControl>
                                    <FormLabel>Chưa hoàn thành</FormLabel>
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
                                    updateOrderStatusMutation.isPending ||
                                    !form.watch('name').trim() ||
                                    !form.watch('description').trim()
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

export default UpdateOrderStatusDialog
