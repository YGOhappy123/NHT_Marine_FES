import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CalendarIcon, PencilLine } from 'lucide-react'
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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'

const addPromotionFormSchema = z
    .object({
        name: z.string().min(1, { message: 'Tên chương trình khuyến mãi không được để trống.' }),
        discountRate: z
            .number('Giá trị giảm giá phải là số')
            .min(0, { message: 'Giá trị giảm giá phải lớn hơn hoặc bằng 0.' })
            .max(100, {
                message: 'Giá trị giảm giá phải nhỏ hơn hoặc bằng 100.'
            }),
        startDate: z.date().refine(date => date > new Date(), {
            message: 'Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại.'
        }),
        endDate: z.date(),
        products: z.array(z.number()).min(1, { message: 'Vui lòng chọn ít nhất một sản phẩm.' })
    })
    .refine(data => data.endDate > data.startDate, {
        message: 'Ngày kết thúc phải sau ngày bắt đầu.',
        path: ['endDate']
    })

type AddPromotionDialogProps = {
    rootProducts: IRootProduct[]
    addNewPromotionMutation: UseMutationResult<any, any, Partial<IPromotion>, any>
}

const AddPromotionDialog = ({ rootProducts, addNewPromotionMutation }: AddPromotionDialogProps) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof addPromotionFormSchema>>({
        resolver: zodResolver(addPromotionFormSchema),
        defaultValues: {
            name: '',
            discountRate: 0,
            startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            products: []
        }
    })

    const onSubmit = async (values: z.infer<typeof addPromotionFormSchema>) => {
        await addNewPromotionMutation.mutateAsync({
            name: values.name,
            discountRate: values.discountRate,
            startDate: new Date(values.startDate).toISOString().split('T')[0] + 'T00:00:00.000Z',
            endDate: new Date(values.endDate).toISOString().split('T')[0] + 'T23:59:59.999Z',
            products: values.products
        })

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="flex h-8">
                    <PencilLine />
                    Thêm CT khuyến mãi
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm chương trình khuyến mãi</DialogTitle>
                    <DialogDescription>
                        Thêm các thông tin cần thiết cho chương trình khuyến mãi. Ấn &apos;Xác nhận&apos; sau khi hoàn
                        tất.
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
                                name="discountRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Phần trăm giảm</FormLabel>
                                        <FormControl>
                                            <Input
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
                                                    disabled={date =>
                                                        date < new Date() || date < new Date('1900-01-01')
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
                                                    disabled={date =>
                                                        date < form.getValues('startDate') ||
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

export default AddPromotionDialog
