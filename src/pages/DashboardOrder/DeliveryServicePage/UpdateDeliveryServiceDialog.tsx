import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface IDeliveryService {
    serviceId: number
    name: string
    contactPhone: string
}

const updateDeliveryServiceFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên nhà cung cấp không được để trống.' }),
    contactPhone: z.string()
        .min(1, { message: 'Số điện thoại không được để trống.' })
        .regex(/^0\d{9}$/, { message: 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.' })
})

type UpdateDeliveryServiceDialogProps = {
    deliveryService: IDeliveryService | null
    updateDeliveryServiceMutation: UseMutationResult<any, any, { serviceId: number; data: { name: string; contactPhone: string } }, any>
    hasUpdatePermission: boolean
    open: boolean
    setOpen: (open: boolean) => void
}

const UpdateDeliveryServiceDialog = ({
    deliveryService,
    updateDeliveryServiceMutation,
    hasUpdatePermission,
    open,
    setOpen
}: UpdateDeliveryServiceDialogProps) => {
    const form = useForm<z.infer<typeof updateDeliveryServiceFormSchema>>({
        resolver: zodResolver(updateDeliveryServiceFormSchema),
        defaultValues: {
            name: '',
            contactPhone: ''
        }
    })

    useEffect(() => {
        if (deliveryService && open) {
            form.reset({
                name: deliveryService.name,
                contactPhone: deliveryService.contactPhone
            })
        }
    }, [deliveryService, open, form])

    const onSubmit = async (values: z.infer<typeof updateDeliveryServiceFormSchema>) => {
        if (!deliveryService || !hasUpdatePermission) return
        await updateDeliveryServiceMutation.mutateAsync({
            serviceId: deliveryService.serviceId,
            data: {
                name: values.name,
                contactPhone: values.contactPhone
            }
        })
        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa đơn vị vận chuyển</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin đơn vị vận chuyển. Nhấn Lưu để xác nhận.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên đơn vị vận chuyển</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên đơn vị vận chuyển"
                                            className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                            disabled={!hasUpdatePermission}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập số điện thoại (0xxxxxxxxx)"
                                            className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                            disabled={!hasUpdatePermission}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset()
                                    setOpen(false)
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    !hasUpdatePermission ||
                                    updateDeliveryServiceMutation.isPending ||
                                    !form.watch('name').trim() ||
                                    !form.watch('contactPhone').trim()
                                }
                            >
                                Lưu
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateDeliveryServiceDialog