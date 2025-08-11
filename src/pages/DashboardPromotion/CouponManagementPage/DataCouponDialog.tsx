import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { PencilLine, CalendarIcon } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { couponTypes } from '@/pages/DashboardPromotion/CouponManagementPage/AddCouponDialog'

const dataCouponFormSchema = z
    .object({
        code: z.string().min(1, { message: 'Mã giảm giá không được để trống.' }),
        type: z.enum(['Fixed', 'Percentage'], { message: 'Loại giảm giá không được để trống.' }),
        amount: z.number().min(0.01, { message: 'Giá trị giảm giá phải lớn hơn 0.' }),
        maxUsage: z.number().optional(),
        expiredAt: z.date(),
        isActive: z.boolean(),
        noLimitUsage: z.boolean()
    })
    .refine(data => !(data.type === 'Percentage' && data.amount > 100), {
        message: 'Phần trăm giảm giá không được vượt quá 100%.',
        path: ['amount']
    })
    .refine(
        data => {
            if (!data.noLimitUsage) {
                return typeof data.maxUsage === 'number' && data.maxUsage > 0
            }
            return true
        },
        {
            message: 'SL tối đa phải lớn hơn 0.',
            path: ['maxUsage']
        }
    )

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
            code: '',
            type: 'Percentage',
            amount: 0,
            maxUsage: 1,
            expiredAt: dayjs().add(7, 'day').toDate(),
            isActive: true,
            noLimitUsage: false
        }
    })

    const onSubmit = async (values: z.infer<typeof dataCouponFormSchema>) => {
        if (!coupon || !hasUpdatePermission) return

        await updateCouponMutation.mutateAsync({
            couponId: coupon.couponId,
            data: {
                code: values.code,
                type: values.type,
                amount: values.amount,
                maxUsage: values.noLimitUsage ? undefined : values.maxUsage,
                expiredAt: values.expiredAt.toLocaleDateString('en-CA'),
                isActive: values.isActive
            }
        })

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && coupon) {
            form.reset({
                code: coupon.code,
                type: coupon.type,
                amount: coupon.amount,
                maxUsage: coupon.maxUsage,
                expiredAt: new Date(coupon.expiredAt),
                isActive: coupon.isActive,
                noLimitUsage: coupon.maxUsage === undefined
            })
        }
    }, [open, mode])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>{mode === 'view' ? 'Thông tin mã giảm giá' : 'Cập nhật mã giảm giá'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'view'
                            ? 'Thông tin chi tiết về mã giảm giá.'
                            : 'Chỉnh sửa các thông tin của mã giảm giá. Ấn "Xác nhận" sau khi hoàn tất.'}
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Mã giảm giá</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={mode === 'view'}
                                            placeholder="Nhập mã giảm giá..."
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
                            name="expiredAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Ngày hết hạn</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    disabled={mode === 'view'}
                                                    variant="outline"
                                                    className="caret-card-foreground text-card-foreground h-12 w-full rounded border-2"
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'dd/MM/yyyy')
                                                    ) : (
                                                        <span>Chọn ngày hết hạn</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={date => date < dayjs().startOf('day').toDate()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Loại giảm giá</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger
                                                disabled={mode === 'view'}
                                                className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2"
                                            >
                                                <SelectValue placeholder="Chọn loại giảm giá..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {couponTypes.map(type => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">
                                        {form.watch('type') === 'Percentage'
                                            ? 'Phần trăm giảm (%)'
                                            : 'Số tiền giảm (VNĐ)'}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={mode === 'view'}
                                            type="number"
                                            placeholder={form.watch('type') === 'Percentage' ? '0-100' : '0'}
                                            className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="maxUsage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Số lượng sử dụng tối đa</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={mode === 'view' || form.watch('noLimitUsage')}
                                                type="number"
                                                placeholder="Nhập số lượng..."
                                                className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                {...field}
                                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="noLimitUsage"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-y-0 space-x-1 pt-7">
                                        <FormControl>
                                            <Checkbox
                                                disabled={mode === 'view'}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-card-foreground">
                                                Sử dụng không giới hạn
                                            </FormLabel>
                                            <p className="text-muted-foreground text-sm">
                                                Mã giảm giá sẽ không giới hạn số lượng khách hàng sử dụng
                                            </p>
                                        </div>
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
                        {hasUpdatePermission && coupon?.isActive && (
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
