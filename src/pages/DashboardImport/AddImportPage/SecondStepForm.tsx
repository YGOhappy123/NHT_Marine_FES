import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { FunnelPlus } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const secondStepFormSchema = z.object({
    items: z
        .array(
            z
                .object({
                    rootProductId: z.number().min(1, { message: 'Vui lòng chọn sản phẩm.' }),
                    productItemId: z.number().min(1, { message: 'Vui lòng chọn phân loại.' }),
                    cost: z.coerce.number().min(100, { message: 'Giá tiền phải lớn hơn 100 đồng.' }),
                    quantity: z.coerce.number().min(1, { message: 'Số lượng không được bé hơn 1.' })
                })
                .refine(data => data.cost % 100 === 0, {
                    message: 'Giá tiền phải là bội số của 100 đồng.',
                    path: ['cost']
                })
        )
        .min(1, { message: 'Phải chọn ít nhất một sản phẩm.' })
        .refine(items => new Set(items.map(v => v.productItemId)).size === items.length, {
            message: 'Các phân loại của cùng một sản phẩm trong đơn nhập hàng phải là duy nhất.'
        })
})

export type SecondStepData = z.infer<typeof secondStepFormSchema>

type SecondStepFormProps = {
    defaultValues: SecondStepData | null
    rootProducts: IRootProduct[]
    onNext: (values: SecondStepData) => void
    onPrev: () => void
}

const SecondStepForm = ({ defaultValues, rootProducts, onNext, onPrev }: SecondStepFormProps) => {
    const form = useForm<SecondStepData>({
        resolver: zodResolver(secondStepFormSchema) as any,
        defaultValues: defaultValues ?? {
            items: [{ rootProductId: 0, productItemId: 0, cost: 0, quantity: 1 }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items'
    })

    const onSubmit = (values: SecondStepData) => {
        onNext(values)
    }

    const getVariants = (productId: number) => {
        const product = rootProducts.find(rp => rp.rootProductId === productId)
        if (!product) return []

        const combinations = product.variants!.reduce(
            (acc, v) => {
                const res: any = []
                acc.forEach(prefix => {
                    v.options!.forEach(o => {
                        res.push([...prefix, { variant: v.name, ...o }])
                    })
                })
                return res
            },
            [[]]
        )

        return combinations.map((combo: any) => {
            const matchingItem = product.productItems!.find(item =>
                item.attributes?.every(attr => combo.some((c: any) => c.optionId === attr.optionId))
            )

            return {
                productItemId: matchingItem?.productItemId,
                label: combo.map((c: any) => `${c.variant}: ${c.value}`).join(', ')
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <span className="font-medium">Tổng số sản phẩm: {form.getValues('items').length}</span>
                    <Button
                        type="button"
                        onClick={() => append({ rootProductId: 0, productItemId: 0, cost: 0, quantity: 1 })}
                    >
                        <FunnelPlus /> Thêm sản phẩm
                    </Button>
                </div>

                <div className="flex flex-col gap-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-3 rounded-md border-2 p-4">
                            <FormField
                                control={form.control}
                                name={`items.${index}.rootProductId`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Sản phẩm</FormLabel>
                                        <Select
                                            onValueChange={value => field.onChange(Number(value))}
                                            value={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
                                                    <SelectValue placeholder="Sản phẩm..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {rootProducts.map(rootProduct => (
                                                    <SelectItem
                                                        key={rootProduct.rootProductId}
                                                        value={rootProduct.rootProductId.toString()}
                                                    >
                                                        {rootProduct.name}
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
                                name={`items.${index}.productItemId`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Phân loại</FormLabel>
                                        <Select
                                            onValueChange={value => field.onChange(Number(value))}
                                            value={field.value.toString()}
                                            disabled={!form.watch(`items.${index}.rootProductId`)}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
                                                    <SelectValue placeholder="Phân loại..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {getVariants(form.watch(`items.${index}.rootProductId`)).map(
                                                    productItem => (
                                                        <SelectItem
                                                            key={productItem.productItemId}
                                                            value={productItem.productItemId!.toString()}
                                                        >
                                                            {productItem.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid w-full grid-cols-2 items-start gap-4">
                                <FormField
                                    control={form.control}
                                    name={`items.${index}.cost`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Đơn giá</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Đơn giá..."
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
                                    name={`items.${index}.quantity`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Số lượng</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Số lượng..."
                                                    className="caret-card-foreground text-card-foreground h-12 rounded border-2"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="mt-4 flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={fields.length <= 1}
                                    onClick={() => {
                                        if (fields.length > 1) remove(index)
                                    }}
                                >
                                    Xóa sản phẩm
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                {form.formState.errors.items?.root && (
                    <p className="text-destructive mt-2 text-sm">{form.formState.errors.items.root.message}</p>
                )}

                <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPrev}
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

export default SecondStepForm
