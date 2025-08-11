import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
    Dialog,
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

const distributeImportSchema = z.object({
    items: z.array(
        z
            .object({
                productItemId: z.number(),
                quantity: z.number(),
                storages: z
                    .array(
                        z.object({
                            storageId: z.number().min(1, { message: 'Vui lòng chọn kho/ bể.' }),
                            quantity: z.coerce.number().min(1, { message: 'Số lượng không được bé hơn 1.' })
                        })
                    )
                    .min(1, { message: 'Phải chọn ít nhất một kho/ bể.' })
                    .refine(storages => new Set(storages.map(s => s.storageId)).size === storages.length, {
                        message: 'Các kho/ bể lưu được chọn phải là duy nhất.'
                    })
            })
            .refine(
                data => {
                    const total = data.storages.reduce((sum, s) => sum + s.quantity, 0)
                    return total === data.quantity
                },
                {
                    message: 'Tổng số lượng đã phân bổ không khớp với số lượng yêu cầu.'
                }
            )
    )
})

type DistributeImportDialogProps = {
    productImport: IProductImport | null
    storages: IStorage[]
    open: boolean
    setOpen: (value: boolean) => void
    distributeImportMutation: UseMutationResult<
        any,
        any,
        {
            importId: number
            data: {
                items: {
                    productItemId: number
                    storages: {
                        storageId: number
                        quantity: number
                    }[]
                }[]
            }
        },
        any
    >
    onUpdateDone: () => Promise<any>
}

const DistributeImportDialog = ({
    productImport,
    storages,
    open,
    setOpen,
    distributeImportMutation,
    onUpdateDone
}: DistributeImportDialogProps) => {
    const form = useForm<z.infer<typeof distributeImportSchema>>({
        resolver: zodResolver(distributeImportSchema as any),
        defaultValues: {
            items: []
        }
    })

    const onSubmit = async (values: z.infer<typeof distributeImportSchema>) => {
        if (!productImport) return

        await distributeImportMutation.mutateAsync({
            importId: productImport.importId,
            data: {
                items: values.items.map(item => ({
                    productItemId: item.productItemId,
                    storages: item.storages.map(s => ({
                        storageId: s.storageId,
                        quantity: s.quantity
                    }))
                }))
            }
        })

        onUpdateDone()
        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && productImport) {
            form.reset({
                items: (productImport?.items ?? []).map(ii => ({
                    productItemId: ii.productItemId,
                    quantity: ii.quantity,
                    storages: [{ storageId: 0, quantity: 1 }]
                }))
            })
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Phân sản phẩm vào kho</DialogTitle>
                    <DialogDescription>
                        Chọn kho/ bể và số lượng sản phẩm để di dời. Ấn "Xác nhận" sau khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div className="flex max-h-[400px] flex-col gap-6 overflow-y-auto">
                            {productImport?.items.map((item, index) => {
                                return (
                                    <div key={item.productItemId} className="space-y-3 rounded-md border-2 p-4">
                                        <div className="flex flex-col">
                                            <h4 className="text-lg font-semibold">
                                                {index + 1}. {item.productItem?.rootProduct.name}
                                            </h4>
                                            <span className="text-muted-foreground text-sm">
                                                Phân loại:{' '}
                                                {item.productItem?.attributes
                                                    .map(attr => `${attr.variant}: ${attr.option}`)
                                                    .join(', ')}
                                            </span>
                                            <span className="text-muted-foreground text-sm">
                                                Tổng số lượng cần thiết: {item.quantity.toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="space-y-2">
                                            <FormLabel className="text-card-foreground mb-4">
                                                Danh sách kho hàng
                                            </FormLabel>
                                            <div className="flex flex-col gap-4">
                                                {form.watch(`items.${index}.storages`)?.map((_, storageIndex) => (
                                                    <div key={storageIndex} className="flex items-start gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`items.${index}.storages.${storageIndex}.storageId`}
                                                            render={({ field }) => (
                                                                <FormItem className="flex-1">
                                                                    <FormLabel className="text-card-foreground">
                                                                        Chọn kho/ bể
                                                                    </FormLabel>
                                                                    <Select
                                                                        onValueChange={value =>
                                                                            field.onChange(Number(value))
                                                                        }
                                                                        value={field.value?.toString() ?? ''}
                                                                    >
                                                                        <FormControl>
                                                                            <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                                                <SelectValue placeholder="Chọn kho/ bể..." />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {storages.map(role => (
                                                                                <SelectItem
                                                                                    key={role.storageId}
                                                                                    value={role.storageId.toString()}
                                                                                >
                                                                                    {role.name}
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
                                                            name={`items.${index}.storages.${storageIndex}.quantity`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-card-foreground">
                                                                        Số lượng
                                                                    </FormLabel>
                                                                    <div className="flex items-center gap-2">
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                placeholder="Số lượng..."
                                                                                className="caret-card-foreground text-card-foreground h-12 rounded border-2"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            onClick={() => {
                                                                                const current =
                                                                                    form.getValues(
                                                                                        `items.${index}.storages`
                                                                                    ) || []

                                                                                if (current.length <= 1) return

                                                                                form.setValue(
                                                                                    `items.${index}.storages`,
                                                                                    current.filter(
                                                                                        (_, i) => i !== storageIndex
                                                                                    )
                                                                                )
                                                                            }}
                                                                        >
                                                                            <Trash2 className="text-red-500" />
                                                                        </Button>
                                                                    </div>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            {form.formState.errors.items?.[index] && (
                                                <p className="text-destructive mt-2 text-sm">
                                                    {form.formState.errors.items?.[index].message}
                                                </p>
                                            )}
                                            {form.formState.errors.items?.[index]?.storages?.root && (
                                                <p className="text-destructive mt-2 text-sm">
                                                    {form.formState.errors.items?.[index].storages?.root.message}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                const current = form.getValues(`items.${index}.storages`) || []
                                                form.setValue(`items.${index}.storages`, [
                                                    ...current,
                                                    { storageId: 0, quantity: 1 }
                                                ])
                                            }}
                                        >
                                            <Plus /> Thêm kho/ bể
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                        <Separator />
                        <DialogFooter>
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

export default DistributeImportDialog
