import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PencilLine, CalendarIcon } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import dayjs from 'dayjs'

const addCouponFormSchema = z
    .object({
        code: z.string().min(1, { message: 'Mã giảm giá không được để trống.' }),
        type: z.enum(['Fixed', 'Percentage'], { message: 'Loại giảm giá không được để trống.' }),
        amount: z.number().min(0.01, { message: 'Giá trị giảm giá phải lớn hơn 0.' }),
        maxUsage: z.number().optional(),
        expiredAt: z.date().refine(date => date >= dayjs().startOf('day').toDate(), {
            message: 'Ngày hết hạn phải lớn hơn hoặc bằng ngày hiện tại.'
        }),
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

type AddCouponDialogProps = {
    addNewCouponMutation: UseMutationResult<any, any, Partial<ICoupon>, any>
}

export const couponTypes = [
    { value: 'Fixed', label: 'Cố định (VNĐ)' },
    { value: 'Percentage', label: 'Theo phần trăm (%)' }
]

const AddCouponDialog = ({ addNewCouponMutation }: AddCouponDialogProps) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof addCouponFormSchema>>({
        resolver: zodResolver(addCouponFormSchema),
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

    const onSubmit = async (values: z.infer<typeof addCouponFormSchema>) => {
        await addNewCouponMutation.mutateAsync({
            code: values.code,
            type: values.type,
            amount: values.amount,
            maxUsage: values.noLimitUsage ? undefined : values.maxUsage,
            expiredAt: values.expiredAt.toLocaleDateString('en-CA'),
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
            <DialogContent className="max-h-[90vh] min-w-2xl overflow-y-auto md:min-w-4xl">
                <DialogHeader>
                    <DialogTitle>Thêm mã giảm giá</DialogTitle>
                    <DialogDescription>
                        Thêm các thông tin cần thiết cho mã giảm giá. Ấn "Xác nhận" sau khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Mã giảm giá</FormLabel>
                                    <FormControl>
                                        <Input
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
                                            <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
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
                                                type="number"
                                                placeholder="Nhập số lượng..."
                                                disabled={form.watch('noLimitUsage')}
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
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
