import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { PencilLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const dataCouponFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên khách hàng không được để trống.' })
})

type DataCouponDialogProps = {
    coupon: ICoupon | null
    mode: 'view' | 'update'
    setMode: (value: 'view' | 'update') => void
    open: boolean
    setOpen: (value: boolean) => void
    updateCouponMutation: UseMutationResult<any, any, { couponId: number; data: Partial<ICoupon> }, any>
    hasUpdatePermission: boolean
}

const DataCouponDialog = ({
    coupon,
    updateCouponMutation,
    hasUpdatePermission,
    mode,
    open,
    setMode,
    setOpen
}: DataCouponDialogProps) => {
    const form = useForm<z.infer<typeof dataCouponFormSchema>>({
        resolver: zodResolver(dataCouponFormSchema),
        defaultValues: {
            name: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof dataCouponFormSchema>) => {
        if (!coupon || !hasUpdatePermission) return

        await updateCouponMutation.mutateAsync({
            couponId: coupon.couponId,
            data: { name: values.name }
        })

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && coupon) {
            form.reset({
                name: coupon.name
            })
        }
    }, [open, mode])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>{mode === 'view' ? 'Thông tin khách hàng' : 'Cập nhật khách hàng'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'view'
                            ? 'Thông tin chi tiết về tên, loại và tất cả các quyền truy cập của khách hàng.'
                            : 'Chỉnh sửa các thông tin của khách hàng. Ấn "Xác nhận" sau khi hoàn tất.'}
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
                                                disabled={mode === 'view'}
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
                        {mode === 'update' && (
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Hủy bỏ</Button>
                                </DialogClose>
                                <Button type="submit">Xác nhận</Button>
                            </DialogFooter>
                        )}
                    </form>
                </Form>

                {/* Move <DialogFooter /> outside <Form /> to prevent auto-submitting behavior */}
                {mode === 'view' && (
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Đóng</Button>
                        </DialogClose>
                        {hasUpdatePermission && (
                            <Button type="button" onClick={() => setMode('update')}>
                                <PencilLine />
                                Chỉnh sửa
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default DataCouponDialog
