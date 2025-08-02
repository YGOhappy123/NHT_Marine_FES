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

interface ISupplier {
    supplierId: number
    name: string
    address: string
    contactEmail: string
    contactPhone: string
}

const updateSupplierFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên nhà cung cấp không được để trống.' }),
    address: z.string().min(1, { message: 'Địa chỉ không được để trống.' }),
    contactEmail: z.string().email({ message: 'Email không hợp lệ.' }).min(1, { message: 'Email không được để trống.' }),
    contactPhone: z.string()
        .min(1, { message: 'Số điện thoại không được để trống.' })
        .regex(/^0\d{9}$/, { message: 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.' })
})

type UpdateSupplierDialogProps = {
    supplier: ISupplier | null
    updateSupplierMutation: UseMutationResult<any, any, { supplierId: number; data: { name: string; address: string; contactEmail: string; contactPhone: string } }, any>
    hasUpdatePermission: boolean
    open: boolean
    setOpen: (open: boolean) => void
}

const UpdateSupplierDialog = ({
    supplier,
    updateSupplierMutation,
    hasUpdatePermission,
    open,
    setOpen
}: UpdateSupplierDialogProps) => {
    const form = useForm<z.infer<typeof updateSupplierFormSchema>>({
        resolver: zodResolver(updateSupplierFormSchema),
        defaultValues: {
            name: '',
            address: '',
            contactEmail: '',
            contactPhone: ''
        }
    })

    useEffect(() => {
        if (supplier && open) {
            form.reset({
                name: supplier.name,
                address: supplier.address,
                contactEmail: supplier.contactEmail,
                contactPhone: supplier.contactPhone
            })
        }
    }, [supplier, open, form])

    const onSubmit = async (values: z.infer<typeof updateSupplierFormSchema>) => {
        if (!supplier || !hasUpdatePermission) return
        await updateSupplierMutation.mutateAsync({
            supplierId: supplier.supplierId,
            data: {
                name: values.name,
                address: values.address,
                contactEmail: values.contactEmail,
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
                    <DialogTitle>Chỉnh sửa nhà cung cấp</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin nhà cung cấp. Nhấn Lưu để xác nhận.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên nhà cung cấp</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên nhà cung cấp"
                                            className="h-10"
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
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Địa chỉ</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập địa chỉ"
                                            className="h-10"
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
                            name="contactEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email liên hệ</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập email liên hệ"
                                            className="h-10"
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
                                            className="h-10"
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
                                    updateSupplierMutation.isPending ||
                                    !form.watch('name').trim() ||
                                    !form.watch('address').trim() ||
                                    !form.watch('contactEmail').trim() ||
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

export default UpdateSupplierDialog