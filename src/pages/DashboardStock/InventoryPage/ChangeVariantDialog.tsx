import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult, useQuery } from '@tanstack/react-query'
import { Sparkles } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import useAxiosIns from '@/hooks/useAxiosIns'

const changeVariantFormSchema = z.object({
    currStorageId: z.number(),
    productItemId: z.number().min(1, { message: 'Vui lòng chọn sản phẩm.' }),
    newProductItemId: z.number().min(1, { message: 'Vui lòng chọn phân loại mới.' }),
    quantity: z.coerce.number().min(1, { message: 'Số lượng không được bé hơn 1.' })
})

type ChangeVariantDialogProps = {
    storage: IStorage | null
    open: boolean
    setOpen: (value: boolean) => void
    changeInventoryVariantMutation: UseMutationResult<
        any,
        any,
        {
            storageId: number
            data: {
                productItemId: number
                newProductItemId: number
                quantity: number
            }
        },
        any
    >
    hasUpdatePermission: boolean
}

const ChangeVariantDialog = ({
    storage,
    open,
    setOpen,
    changeInventoryVariantMutation,
    hasUpdatePermission
}: ChangeVariantDialogProps) => {
    const axios = useAxiosIns()
    const form = useForm<z.infer<typeof changeVariantFormSchema>>({
        resolver: zodResolver(changeVariantFormSchema as any),
        defaultValues: {
            currStorageId: 0,
            productItemId: 0,
            newProductItemId: 0,
            quantity: 1
        }
    })

    // Handle get root product data
    const rootProductId = useMemo(() => {
        if (!storage) return null

        const matchingInventory = storage.productItems!.find(iv => iv.productItemId === form.watch('productItemId'))
        return matchingInventory?.productItem?.rootProduct.rootProductId
    }, [form.watch('productItemId')])

    const fetchRootProductQuery = useQuery({
        queryKey: ['product-detail', rootProductId],
        enabled: rootProductId != null,
        queryFn: () => axios.get<IResponseData<IRootProduct>>(`/products/${rootProductId}`),
        select: res => res.data
    })

    const rootProduct = fetchRootProductQuery.data?.data

    // Handle display variants
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({})
    const handleSelect = (variantId: number, optionId: number) => {
        setSelectedOptions(prev => ({ ...prev, [variantId]: optionId }))
    }

    useEffect(() => {
        if (!rootProduct || !rootProduct.productItems || !form.getValues('productItemId')) return

        const currentItem = rootProduct.productItems.find(
            item => item.productItemId === form.getValues('productItemId')
        )

        if (currentItem && currentItem.attributes) {
            const initialSelections: Record<number, number> = {}
            currentItem.attributes.forEach(attr => {
                const variantId =
                    rootProduct.variants?.find(v => v.options?.some(o => o.optionId === attr.optionId))?.variantId ?? 0

                initialSelections[variantId] = attr.optionId
            })
            setSelectedOptions(initialSelections)
        }
    }, [rootProduct, form.watch('productItemId')])

    useEffect(() => {
        if (!rootProduct || !rootProduct.productItems) return

        const selectedOptionIds = Object.values(selectedOptions)
        if (selectedOptionIds.length === rootProduct?.variants?.length) {
            const matchingItem = rootProduct.productItems.find(item =>
                item.attributes?.every(attr => selectedOptionIds.includes(attr.optionId))
            )

            if (matchingItem) {
                form.setValue('newProductItemId', matchingItem.productItemId ?? 0)
            }
        }
    }, [selectedOptions, rootProduct])

    // Handle submit form
    const onSubmit = async (values: z.infer<typeof changeVariantFormSchema>) => {
        if (!storage || !hasUpdatePermission) return

        const maximumValue = storage.productItems!.find(iv => iv.productItemId === values.productItemId)?.quantity ?? 0
        if (values.quantity > maximumValue) {
            form.setError('quantity', {
                message: `Số lượng vượt mức tối đa (${maximumValue.toString().padStart(2, '0')}).`
            })
            return
        }

        if (!values.newProductItemId || values.productItemId === values.newProductItemId) {
            form.reset()
            setOpen(false)
            return
        }

        await changeInventoryVariantMutation.mutateAsync({
            storageId: storage.storageId,
            data: {
                productItemId: values.productItemId,
                newProductItemId: values.newProductItemId,
                quantity: values.quantity
            }
        })

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && storage) {
            form.reset({
                currStorageId: storage.storageId,
                productItemId: storage.productItems?.[0].productItemId ?? 0,
                newProductItemId: 0,
                quantity: 1
            })
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Đổi kho/ bể lưu trữ sản phẩm</DialogTitle>
                    <DialogDescription>
                        Chọn kho/bể và số lượng sản phẩm để di dời. Ấn "Xác nhận" sau khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="productItemId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Chọn sản phẩm cẩn chuyển</FormLabel>
                                    <Select
                                        onValueChange={value => field.onChange(Number(value))}
                                        value={field.value?.toString() ?? ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                <SelectValue placeholder="Chọn sản phẩm cẩn chuyển..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {storage!.productItems!.map(inventory => (
                                                <SelectItem
                                                    key={inventory.productItemId}
                                                    value={inventory.productItemId!.toString()}
                                                >
                                                    {inventory.productItem?.rootProduct.name} -{' '}
                                                    {inventory.productItem?.attributes
                                                        .map(attr => `${attr.variant}: ${attr.option}`)
                                                        .join(', ')}
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
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Số lượng cần chuyển</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Số lượng cần chuyển..."
                                            className="caret-card-foreground text-card-foreground h-12 rounded border-2"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {rootProduct && (
                            <div>
                                <p className="mb-3 text-sm font-medium">Chọn giá trị phân loại muốn chuyến sang</p>
                                <div className="flex flex-col gap-3">
                                    {rootProduct.variants!.map(variant => (
                                        <div key={variant.variantId} className="flex items-center gap-3">
                                            <Sparkles size={18} />
                                            <span className="text-sm">Chọn "{variant.name}": </span>
                                            <div className="flex flex-wrap items-center gap-3">
                                                {variant.options?.map(option => {
                                                    const isActive =
                                                        selectedOptions[variant.variantId!] === option.optionId

                                                    return (
                                                        <Button
                                                            type="button"
                                                            key={option.optionId}
                                                            variant={isActive ? 'default' : 'outline'}
                                                            size="sm"
                                                            disabled={!variant.isAdjustable}
                                                            onClick={() =>
                                                                handleSelect(variant.variantId!, option.optionId)
                                                            }
                                                        >
                                                            {option.value}
                                                        </Button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Hủy bỏ</Button>
                            </DialogClose>
                            <Button type="submit">Xác nhận</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ChangeVariantDialog
