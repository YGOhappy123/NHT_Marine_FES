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
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { PencilLine } from 'lucide-react'

const addOrderStatusFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên trạng thái không được để trống.' }),
    description: z.string().min(1, { message: 'Mô tả không được để trống.' }),
    isDefaultState: z.boolean(),
    isAccounted: z.boolean(),
    isUnfulfilled: z.boolean()
})

type AddOrderStatusDialogProps = {
    addNewOrderStatusMutation: UseMutationResult<any, any, Partial<IOrderStatus>, any>
    existingOrderStatuses: IOrderStatus[]
}

const AddOrderStatusDialog = ({ addNewOrderStatusMutation, existingOrderStatuses }: AddOrderStatusDialogProps) => {
    const hasDefaultState = existingOrderStatuses.some(status => status.isDefaultState)
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof addOrderStatusFormSchema>>({
        resolver: zodResolver(addOrderStatusFormSchema),
        defaultValues: {
            name: '',
            description: '',
            isDefaultState: false,
            isAccounted: false,
            isUnfulfilled: false
        }
    })

    const onSubmit = async (values: z.infer<typeof addOrderStatusFormSchema>) => {
        await addNewOrderStatusMutation.mutateAsync({
            name: values.name,
            description: values.description,
            isDefaultState: values.isDefaultState,
            isAccounted: values.isAccounted,
            isUnfulfilled: values.isUnfulfilled
        })
        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="flex h-8">
                    <PencilLine />
                    Thêm trạng thái đơn hàng
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thêm trạng thái đơn hàng mới</DialogTitle>
                    <DialogDescription>Nhập thông tin trạng thái đơn hàng mới. Nhấn Lưu để tạo.</DialogDescription>
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
                                            checked={!hasDefaultState}
                                            onCheckedChange={field.onChange}
                                            disabled
                                        />
                                    </FormControl>
                                    <FormLabel className={hasDefaultState ? 'opacity-50' : ''}>
                                        Trạng thái mặc định
                                    </FormLabel>
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
                                            disabled={!hasDefaultState}
                                        />
                                    </FormControl>
                                    <FormLabel className={!hasDefaultState ? 'opacity-50' : ''}>
                                        Đã thanh toán
                                    </FormLabel>
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
                                            disabled={!hasDefaultState}
                                        />
                                    </FormControl>
                                    <FormLabel className={!hasDefaultState ? 'opacity-50' : ''}>
                                        <span>
                                            Chưa hoàn thành <i>(Không thể chỉnh sửa sau khi đã chọn)</i>
                                        </span>
                                    </FormLabel>
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
                                    addNewOrderStatusMutation.isPending ||
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

export default AddOrderStatusDialog
