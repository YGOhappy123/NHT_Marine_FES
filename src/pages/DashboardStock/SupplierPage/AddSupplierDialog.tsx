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
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { PencilLine } from 'lucide-react'

const addSupplierFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên nhà cung cấp không được để trống.' }),
    address: z.string().min(1, { message: 'Địa chỉ không được để trống.' }),
    contactEmail: z.string().email({ message: 'Email không hợp lệ.' }).min(1, { message: 'Email không được để trống.' }),
    contactPhone: z.string()
        .min(1, { message: 'Số điện thoại không được để trống.' })
        .regex(/^0\d{9}$/, { message: 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.' })
})

type AddSupplierDialogProps = {
    addNewSupplierMutation: UseMutationResult<any, any, Partial<ISupplier>, any>
}

const AddSupplierDialog = ({ addNewSupplierMutation }: AddSupplierDialogProps) => {
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof addSupplierFormSchema>>({
        resolver: zodResolver(addSupplierFormSchema),
        defaultValues: {
            name: '',
            address: '',
            contactEmail: '',
            contactPhone: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof addSupplierFormSchema>) => {
        await addNewSupplierMutation.mutateAsync({
            name: values.name,
            address: values.address,
            contactEmail: values.contactEmail,
            contactPhone: values.contactPhone
        })
        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="flex h-8">
                    <PencilLine />
                    Thêm nhà cung cấp
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thêm nhà cung cấp mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin nhà cung cấp mới. Nhấn Lưu để tạo.
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
                                    addNewSupplierMutation.isPending ||
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

export default AddSupplierDialog