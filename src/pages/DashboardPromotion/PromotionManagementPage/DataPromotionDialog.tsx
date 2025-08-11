import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { CalendarIcon, PencilLine } from 'lucide-react'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import dayjs from 'dayjs'

const dataPromotionFormSchema = z
    .object({
        name: z.string().min(1, { message: 'Tên chương trình khuyến mãi không được để trống.' }),
        description: z.string().min(1, { message: 'Mô tả chương trình khuyến mãi không được để trống.' }),
        discountRate: z
            .number('Giá trị giảm giá phải là số')
            .int('Giá trị giảm giá phải là số nguyên')
            .min(0, { message: 'Giá trị giảm giá phải lớn hơn hoặc bằng 0.' })
            .max(100, {
                message: 'Giá trị giảm giá phải nhỏ hơn hoặc bằng 100.'
            }),
        startDate: z.date(),
        endDate: z.date(),
        products: z.array(z.number()).min(1, { message: 'Vui lòng chọn ít nhất một sản phẩm.' })
    })
    .refine(data => data.endDate >= data.startDate, {
        message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.',
        path: ['endDate']
    })

type DataPromotionDialogProps = {
    promotion: IPromotion | null
    rootProducts: IRootProduct[]
    mode: 'view' | 'update'
    setMode: (value: 'view' | 'update') => void
    open: boolean
    setOpen: (value: boolean) => void
    updatePromotionMutation: UseMutationResult<any, any, { promotionId: number; data: Partial<IPromotion> }, any>
    hasUpdatePermission: boolean
}

const DataPromotionDialog = ({
    rootProducts,
    promotion,
    updatePromotionMutation,
    hasUpdatePermission,
    mode,
    open,
    setMode,
    setOpen
}: DataPromotionDialogProps) => {
    const form = useForm<z.infer<typeof dataPromotionFormSchema>>({
        resolver: zodResolver(dataPromotionFormSchema),
        defaultValues: {
            name: '',
            description: '',
            discountRate: 0,
            startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            products: []
        }
    })

    const onSubmit = async (values: z.infer<typeof dataPromotionFormSchema>) => {
        if (!promotion || !hasUpdatePermission) return

        await updatePromotionMutation.mutateAsync({
            promotionId: promotion.promotionId,
            data: {
                name: values.name,
                description: values.description,
                discountRate: values.discountRate,
                startDate: values.startDate.toLocaleDateString('en-CA'),
                endDate: values.endDate.toLocaleDateString('en-CA'),
                products: values.products
            }
        })

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && promotion) {
            form.reset({
                name: promotion.name,
                description: promotion.description,
                discountRate: promotion.discountRate,
                startDate: new Date(promotion.startDate),
                endDate: new Date(promotion.endDate),
                products: (promotion.products as any[]).map(item => item.productId || item.rootProductId)
            })
        }
    }, [open, mode])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'view' ? 'Thông tin chương trình khuyến mãi' : 'Cập nhật chương trình khuyến mãi'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'view'
                            ? 'Thông tin chi tiết về tên, loại và tất cả các quyền truy cập của chương trình khuyến mãi.'
                            : 'Chỉnh sửa các thông tin của chương trình khuyến mãi. Ấn "Xác nhận" sau khi hoàn tất.'}
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
                                        <FormLabel className="text-card-foreground">
                                            Tên chương trình khuyến mãi
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={mode === 'view'}
                                                placeholder="Tên chương trình khuyến mãi..."
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
                                        <FormLabel className="text-card-foreground">Mô tả</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={mode === 'view'}
                                                placeholder="Mô tả..."
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
                                name="discountRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Phần trăm giảm</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={mode === 'view'}
                                                placeholder="Phần trăm giảm..."
                                                type="number"
                                                className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                {...field}
                                                onChange={e => {
                                                    const value = e.target.value
                                                    field.onChange(value === '' ? '' : Number(value))
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Ngày bắt đầu</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            disabled={mode === 'view'}
                                                            variant={'outline'}
                                                            className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2"
                                                        >
                                                            {field.value ? (
                                                                format(field.value, 'dd/MM/yyyy')
                                                            ) : (
                                                                <span>Chọn ngày bắt đầu</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={field.onChange}
                                                        defaultMonth={dayjs(field.value).toDate()}
                                                        disabled={date =>
                                                            date < dayjs().startOf('day').toDate() ||
                                                            date < new Date('1900-01-01')
                                                        }
                                                        captionLayout="dropdown"
                                                        required
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Ngày kết thúc</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            disabled={mode === 'view'}
                                                            variant={'outline'}
                                                            className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2"
                                                        >
                                                            {field.value ? (
                                                                format(field.value, 'dd/MM/yyyy')
                                                            ) : (
                                                                <span>Chọn ngày kết thúc</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={field.onChange}
                                                        defaultMonth={dayjs(field.value).toDate()}
                                                        disabled={date =>
                                                            date < dayjs(form.getValues('startDate')).toDate() ||
                                                            date < dayjs().startOf('day').toDate() ||
                                                            date < new Date('1900-01-01')
                                                        }
                                                        captionLayout="dropdown"
                                                        required
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="products"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Danh sách sản phẩm</FormLabel>
                                        <div className="grid max-h-[200px] grid-cols-1 gap-2 overflow-y-auto md:max-h-[300px] md:grid-cols-2">
                                            {rootProducts.map(product => (
                                                <FormField
                                                    key={product.rootProductId}
                                                    control={form.control}
                                                    name="products"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={product.rootProductId}
                                                                className="flex flex-row items-center gap-2"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        disabled={mode === 'view'}
                                                                        checked={field.value?.includes(
                                                                            product.rootProductId
                                                                        )}
                                                                        onCheckedChange={checked => {
                                                                            return checked
                                                                                ? field.onChange([
                                                                                      ...field.value,
                                                                                      product.rootProductId
                                                                                  ])
                                                                                : field.onChange(
                                                                                      field.value?.filter(
                                                                                          value =>
                                                                                              value !==
                                                                                              product.rootProductId
                                                                                      )
                                                                                  )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-card-foreground text-sm font-normal">
                                                                    {product.name}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
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
                        {hasUpdatePermission && promotion?.isActive && (
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

export default DataPromotionDialog
