import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
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

const changeLocationFormSchema = z.object({
    currStorageId: z.number(),
    productItemId: z.number().min(1, { message: 'Vui lòng chọn sản phẩm.' }),
    newStorageId: z.number().min(1, { message: 'Vui lòng chọn kho/ bể mới.' }),
    quantity: z.coerce.number().min(1, { message: 'Số lượng không được bé hơn 1.' })
})

type ChangeLocationDialogProps = {
    storage: IStorage | null
    availableStorages: IStorage[]
    open: boolean
    setOpen: (value: boolean) => void
    changeInventoryLocationMutation: UseMutationResult<
        any,
        any,
        {
            storageId: number
            data: {
                newStorageId: number
                productItemId: number
                quantity: number
            }
        },
        any
    >
    hasUpdatePermission: boolean
}

const ChangeLocationDialog = ({
    storage,
    availableStorages,
    open,
    setOpen,
    changeInventoryLocationMutation,
    hasUpdatePermission
}: ChangeLocationDialogProps) => {
    const form = useForm<z.infer<typeof changeLocationFormSchema>>({
        resolver: zodResolver(changeLocationFormSchema as any),
        defaultValues: {
            currStorageId: 0,
            productItemId: 0,
            newStorageId: 0,
            quantity: 1
        }
    })

    const onSubmit = async (values: z.infer<typeof changeLocationFormSchema>) => {
        if (!storage || !hasUpdatePermission) return

        const maximumValue = storage.productItems!.find(iv => iv.productItemId === values.productItemId)?.quantity ?? 0
        if (values.quantity > maximumValue) {
            form.setError('quantity', {
                message: `Số lượng vượt mức tối đa (${maximumValue.toString().padStart(2, '0')}).`
            })
            return
        }

        await changeInventoryLocationMutation.mutateAsync({
            storageId: storage.storageId,
            data: {
                newStorageId: values.newStorageId,
                productItemId: values.productItemId,
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
                newStorageId: 0,
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
                        Chọn kho/ bể và số lượng sản phẩm để di dời. Ấn "Xác nhận" sau khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="currStorageId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Kho/ bể hiện tại</FormLabel>
                                    <Select onValueChange={value => {}} value={field.value?.toString() ?? ''} disabled>
                                        <FormControl>
                                            <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                <SelectValue placeholder="Kho/ bể hiện tại..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={storage!.storageId.toString()}>
                                                {storage?.name}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                            name="newStorageId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Chọn kho/ bể mới</FormLabel>
                                    <Select
                                        onValueChange={value => field.onChange(Number(value))}
                                        value={field.value?.toString() ?? ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                <SelectValue placeholder="Chọn kho/ bể mới..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableStorages.map(role => (
                                                <SelectItem key={role.storageId} value={role.storageId.toString()}>
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

export default ChangeLocationDialog
