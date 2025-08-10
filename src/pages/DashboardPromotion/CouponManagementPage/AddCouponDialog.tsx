import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PencilLine } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import dayjs from 'dayjs'

const addCouponFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên khách hàng không được để trống.' }),
    code: z.string().min(1, { message: 'Mã giảm giá không được để trống.' }),
    type: z.string().min(1, { message: 'Loại giảm giá không được để trống.' }),
    amount: z.number().min(0, { message: 'Giá trị giảm giá phải lớn hơn hoặc bằng 0.' }),
    maxUsage: z.number().min(0, { message: 'SL tối đa phải lớn hơn hoặc bằng 0.' }),
    expiredAt: z.date(),
    isActive: z.boolean()
})

type AddCouponDialogProps = {
    addNewCouponMutation: UseMutationResult<any, any, Partial<ICoupon>, any>
}

const AddCouponDialog = ({ addNewCouponMutation }: AddCouponDialogProps) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof addCouponFormSchema>>({
        resolver: zodResolver(addCouponFormSchema),
        defaultValues: {
            name: '',
            code: '',
            type: '',
            amount: 0,
            maxUsage: 0,
            expiredAt: dayjs().toDate(),
            isActive: false
        }
    })

    const onSubmit = async (values: z.infer<typeof addCouponFormSchema>) => {
        await addNewCouponMutation.mutateAsync({
            name: values.name,
            code: values.code,
            type: values.type,
            amount: values.amount,
            maxUsage: values.maxUsage,
            expiredAt: values.expiredAt,
            isActive: values.isActive
        })

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="flex h-8">
                    <PencilLine />
                    Thêm phiếu giảm giá
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm mã giảm giá</DialogTitle>
                    <DialogDescription>
                        Thêm các thông tin cần thiết cho mã giảm giá. Ấn "Xác nhận" sau khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Tên khách hàng</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tên khách hàng..."
                                                className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Đặt lại
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset()
                                    setOpen(false)
                                }}
                            >
                                Hủy bỏ
                            </Button>
                            <Button type="submit">Xác nhận</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddCouponDialog
