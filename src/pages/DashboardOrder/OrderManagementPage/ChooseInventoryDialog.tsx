import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult, useQuery } from '@tanstack/react-query'
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
import { Avatar as RadixAvatar, AvatarImage as RadixAvatarImage } from '@radix-ui/react-avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useAxiosIns from '@/hooks/useAxiosIns'

const chooseInventorySchema = z.object({
    products: z.array(
        z
            .object({
                productItemId: z.number(),
                desiredQuantity: z.number(),
                storages: z.array(
                    z
                        .object({
                            availableQuantity: z.number(),
                            storageId: z.number(),
                            quantity: z.coerce.number().min(0, { message: 'Số lượng không được bé hơn 0.' })
                        })
                        .refine(data => data.quantity <= data.availableQuantity, {
                            message: 'Số lượng vượt quá số lượng tối đa của kho hàng.'
                        })
                )
            })
            .refine(
                data => {
                    const total = data.storages.reduce((sum, s) => sum + s.quantity, 0)
                    return total === data.desiredQuantity
                },
                {
                    message: 'Tổng số lượng đã phân bổ không khớp với số lượng yêu cầu.'
                }
            )
    )
})

type ProductItemInventory = {
    productItemId: number
    storages: {
        storageId: number
        quantity: number
        storage: Partial<IStorageType>
    }[]
}

type ChooseInventoryDialogProps = {
    selectedStatus: IOrderStatus
    orderItems: IOrder['items']
    desireProducts: { productItemId: number; quantity: number }[]
    orderId: number
    open: boolean
    setOpen: (value: boolean) => void
    chooseInventoryMutation: UseMutationResult<
        any,
        any,
        {
            orderId: number
            data: {
                statusId: number
                inventories: {
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
}

const ChooseInventoryDialog = ({
    selectedStatus,
    desireProducts,
    orderItems,
    orderId,
    open,
    setOpen,
    chooseInventoryMutation
}: ChooseInventoryDialogProps) => {
    const axios = useAxiosIns()
    const form = useForm<z.infer<typeof chooseInventorySchema>>({
        resolver: zodResolver(chooseInventorySchema as any),
        defaultValues: {
            products: desireProducts.map(p => ({
                productItemId: p.productItemId,
                desiredQuantity: p.quantity,
                storages: []
            }))
        }
    })

    const { data, isLoading } = useQuery({
        queryKey: ['inventory', desireProducts],
        enabled: open,
        queryFn: () => {
            const query = new URLSearchParams()
            desireProducts.forEach(prod => query.append('ids', prod.productItemId.toString()))

            return axios.get<IResponseData<ProductItemInventory[]>>(`/orders/inventory?${query.toString()}`)
        }
    })

    const inventoryData = data?.data.data ?? []

    const isSuitable = useMemo(() => {
        if (inventoryData.length === 0) return false
        return inventoryData.every((item, index) => {
            const stock = item.storages.reduce((acc, cur) => acc + cur.quantity, 0)
            return stock >= orderItems[index].quantity
        })
    }, [inventoryData])

    useEffect(() => {
        if (!isLoading && inventoryData.length > 0) {
            form.reset({
                products: inventoryData.map(i => ({
                    productItemId: i.productItemId,
                    desiredQuantity: orderItems.find(item => item.productItemId === i.productItemId)!.quantity,
                    storages: i.storages.map(s => ({
                        availableQuantity: s.quantity,
                        storageId: s.storageId,
                        quantity: 0
                    }))
                }))
            })
        }
    }, [inventoryData, isLoading])

    const onSubmit = async (values: z.infer<typeof chooseInventorySchema>) => {
        if (!isSuitable) return
        await chooseInventoryMutation.mutateAsync({
            orderId: orderId,
            data: {
                statusId: selectedStatus.statusId,
                inventories: values.products.map(item => ({
                    productItemId: item.productItemId,
                    storages: item.storages
                        .filter(s => s.quantity > 0)
                        .map(s => ({
                            storageId: s.storageId,
                            quantity: s.quantity
                        }))
                }))
            }
        })

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Chọn hàng hóa để giao cho khách</DialogTitle>
                    <DialogDescription>Chọn hàng hóa từ các kho để đấp ứng đơn hàng.</DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        {!isSuitable && (
                            <div className="flex flex-col items-center gap-2">
                                <RadixAvatar className="w-[40%] xl:w-[30%]">
                                    <RadixAvatarImage src="/images/empty-cart.png" alt="empty cart"></RadixAvatarImage>
                                </RadixAvatar>
                                <p className="mt-2 font-semibold">
                                    Số lượng tồn kho hiện không đủ đáp ứng đơn hàng này
                                </p>
                                <p className="font-semibold">Xin vui liên hệ bộ phận quản lý kho...</p>
                            </div>
                        )}

                        {isSuitable && (
                            <div className="flex max-h-[400px] flex-col gap-6 overflow-y-auto">
                                {inventoryData.map((item, index) => {
                                    const orderItem = orderItems.find(oi => oi.productItemId === item.productItemId)!

                                    return (
                                        <div key={item.productItemId} className="space-y-3 rounded-md border-2 p-4">
                                            <div className="flex flex-col">
                                                <h4 className="text-lg font-semibold">
                                                    {index + 1}. {orderItem.productItem.rootProduct.name}
                                                </h4>
                                                <span className="text-muted-foreground text-sm">
                                                    Phân loại:{' '}
                                                    {orderItem.productItem.attribute
                                                        .map(attr => `${attr.variant}: ${attr.option}`)
                                                        .join(', ')}
                                                </span>
                                                <span className="text-muted-foreground text-sm">
                                                    Tổng số lượng cần thiết:{' '}
                                                    {orderItem.quantity.toString().padStart(2, '0')}
                                                </span>
                                            </div>
                                            <Separator />
                                            {item.storages.map((storage, _index) => {
                                                return (
                                                    <FormField
                                                        key={_index}
                                                        control={form.control}
                                                        name={`products.${index}.storages.${_index}.quantity`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-card-foreground">
                                                                    Số lượng từ "{storage.storage.name}" (tối đa{' '}
                                                                    {storage.quantity})
                                                                </FormLabel>
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
                                                )
                                            })}
                                            {form.formState.errors.products?.[index] && (
                                                <p className="text-destructive mt-2 text-sm">
                                                    {form.formState.errors.products?.[index].message}
                                                </p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

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
                            <Button type="submit" disabled={!isSuitable}>
                                Xác nhận
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ChooseInventoryDialog
