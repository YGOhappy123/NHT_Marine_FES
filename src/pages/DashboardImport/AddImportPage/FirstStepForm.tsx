import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

const firstStepFormSchema = z.object({
    invoiceNumber: z.string().min(1, { message: 'Mã hóa đơn không được để trống.' }),
    importDate: z.date({
        error: issue =>
            issue.input === undefined
                ? { message: 'Vui lòng chọn ngày nhập hàng.' }
                : { message: 'Ngày nhập hàng không hợp lệ.' }
    }),
    supplierId: z.number().min(1, { message: 'Vui lòng chọn nhà cung cấp.' })
})

export type FirstStepData = z.infer<typeof firstStepFormSchema>

type FirstStepFormProps = {
    defaultValues: FirstStepData | null
    suppliers: ISupplier[]
    onNext: (values: FirstStepData) => void
}

const FirstStepForm = ({ defaultValues, suppliers, onNext }: FirstStepFormProps) => {
    const form = useForm<FirstStepData>({
        resolver: zodResolver(firstStepFormSchema),
        defaultValues: defaultValues ?? {
            supplierId: 0,
            invoiceNumber: '',
            importDate: new Date()
        }
    })

    const onSubmit = (values: FirstStepData) => {
        onNext(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-6">
                <div className="flex flex-col gap-6">
                    <FormField
                        control={form.control}
                        name="supplierId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Nhà cung cấp</FormLabel>
                                <Select
                                    onValueChange={value => field.onChange(Number(value))}
                                    value={field.value.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
                                            <SelectValue placeholder="Nhà cung cấp..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {suppliers.map(supplier => (
                                            <SelectItem
                                                key={supplier.supplierId}
                                                value={supplier.supplierId.toString()}
                                            >
                                                {supplier.name}
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
                        name="invoiceNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Mã hóa đơn</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Mã hóa đơn..."
                                        className="caret-card-foreground text-card-foreground h-12 rounded border-2"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="importDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-card-foreground">Ngày nhập hàng</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={twMerge(
                                                    'text-card-foreground h-12 w-full rounded border-2',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'dd LLL, y', { locale: vi })
                                                ) : (
                                                    <span>Chọn ngày nhập hàng</span>
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
                                            disabled={date => date > new Date() || date < new Date('1900-01-01')}
                                            captionLayout="dropdown"
                                            locale={vi}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={true}
                        className="h-12 rounded text-base capitalize"
                    >
                        Quay về bước trước
                    </Button>
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="h-12 rounded text-base capitalize"
                    >
                        {form.formState.isSubmitting ? 'Đang tải...' : 'Đến bước kế tiếp'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default FirstStepForm
