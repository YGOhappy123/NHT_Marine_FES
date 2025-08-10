import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PencilLine } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import NoButtonImageUploader from '@/components/common/NoButtonImageUploader'
import fileService from '@/services/fileService'

const addStaffFormSchema = z.object({
    fullName: z
        .string()
        .min(1, { message: 'Họ và tên không được để trống.' })
        .max(255, { message: 'Họ và tên không vượt quá 255 ký tự.' }),
    email: z.email('Email không đúng định dạng.'),
    avatar: z.string().min(1, { message: 'Vui lòng chọn ảnh đại diện' }),
    roleId: z.number().min(1, { message: 'Vui lòng chọn vai trò.' })
})

type AddStaffDialogProps = {
    roles: IStaffRole[]
    addNewStaffMutation: UseMutationResult<any, any, Partial<IStaff>, any>
}

const AddStaffDialog = ({ roles, addNewStaffMutation }: AddStaffDialogProps) => {
    const [open, setOpen] = useState(false)
    const { uploadBase64Mutation } = fileService()

    const form = useForm<z.infer<typeof addStaffFormSchema>>({
        resolver: zodResolver(addStaffFormSchema),
        defaultValues: {
            fullName: '',
            email: '',
            avatar: '',
            roleId: 0
        }
    })

    const onSubmit = async (values: z.infer<typeof addStaffFormSchema>) => {
        const res = await uploadBase64Mutation.mutateAsync({ base64: values.avatar, folder: 'avatar' })
        const newImageUrl = res.data.data?.imageUrl

        await addNewStaffMutation.mutateAsync({
            fullName: values.fullName,
            email: values.email,
            avatar: newImageUrl,
            roleId: values.roleId
        })

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="flex h-8">
                    <PencilLine />
                    Thêm nhân viên
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm nhân viên</DialogTitle>
                    <DialogDescription>
                        Thêm các thông tin cần thiết cho nhân viên. Ấn "Xác nhận" sau khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                            <div className="col-span-1">
                                <FormField
                                    control={form.control}
                                    name="avatar"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center">
                                            <FormLabel className="text-card-foreground">Ảnh đại diện</FormLabel>
                                            <FormControl>
                                                <NoButtonImageUploader
                                                    hasPermission
                                                    image={field.value}
                                                    setImage={field.onChange}
                                                    originalImage={''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-1 flex flex-col gap-6 md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Họ và tên nhân viên</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Họ và tên nhân viên..."
                                                    className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Email..."
                                                    className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="roleId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Vai trò</FormLabel>
                                            <Select
                                                onValueChange={value => field.onChange(Number(value))}
                                                value={field.value?.toString() ?? ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                        <SelectValue placeholder="Vai trò..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {roles.map(role => (
                                                        <SelectItem
                                                            key={role.roleId}
                                                            value={role.roleId.toString()}
                                                            disabled={role.isImmutable}
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
                            </div>
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
                            <Button type="submit" disabled={form.formState.isLoading}>
                                Xác nhận
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddStaffDialog
