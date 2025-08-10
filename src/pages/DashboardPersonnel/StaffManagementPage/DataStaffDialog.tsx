import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { PencilLine } from 'lucide-react'
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
import NoButtonImageUploader from '@/components/common/NoButtonImageUploader'
import fileService from '@/services/fileService'

const dataStaffFormSchema = z.object({
    fullName: z
        .string()
        .min(1, { message: 'Họ và tên không được để trống.' })
        .max(255, { message: 'Họ và tên không vượt quá 255 ký tự.' }),
    email: z.email('Email không đúng định dạng.'),
    avatar: z.string().min(1, { message: 'Vui lòng chọn ảnh đại diện' }),
    roleId: z.number().min(1, { message: 'Vui lòng chọn vai trò.' })
})

type DataStaffDialogProps = {
    staff: IStaff | null
    mode: 'view' | 'update'
    setMode: (value: 'view' | 'update') => void
    open: boolean
    setOpen: (value: boolean) => void
    updateStaffInfoMutation: UseMutationResult<any, any, { staffId: number; data: Partial<IStaff> }, any>
    hasUpdatePermission: boolean
}

const DataStaffDialog = ({
    staff,
    updateStaffInfoMutation,
    hasUpdatePermission,
    mode,
    open,
    setMode,
    setOpen
}: DataStaffDialogProps) => {
    const { uploadBase64Mutation } = fileService()

    const form = useForm<z.infer<typeof dataStaffFormSchema>>({
        resolver: zodResolver(dataStaffFormSchema),
        defaultValues: {
            fullName: '',
            email: '',
            avatar: '',
            roleId: 0
        }
    })

    const onSubmit = async (values: z.infer<typeof dataStaffFormSchema>) => {
        if (!staff || !hasUpdatePermission) return

        let newImageUrl = null
        if (values.avatar !== staff.avatar) {
            const res = await uploadBase64Mutation.mutateAsync({ base64: values.avatar, folder: 'avatar' })
            newImageUrl = res.data.data?.imageUrl
        }

        await updateStaffInfoMutation.mutateAsync({
            staffId: staff.staffId,
            data: {
                fullName: values.fullName,
                email: values.email,
                avatar: newImageUrl ?? staff.avatar
            }
        })

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && staff) {
            form.reset({
                fullName: staff.fullName,
                email: staff.email,
                avatar: staff.avatar,
                roleId: staff.roleId
            })
        }
    }, [open, mode])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>{mode === 'view' ? 'Thông tin nhân viên' : 'Cập nhật nhân viên'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'view'
                            ? 'Thông tin chi tiết về tên, email và vai trò của nhân viên.'
                            : 'Chỉnh sửa các thông tin của nhân viên. Ấn "Xác nhận" sau khi hoàn tất.'}
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
                                                    hasPermission={mode === 'update'}
                                                    image={field.value}
                                                    setImage={field.onChange}
                                                    originalImage={staff?.avatar}
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
                                                    disabled={mode === 'view'}
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
                                                    disabled={mode === 'view'}
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
                                                disabled
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2 font-semibold">
                                                        <SelectValue placeholder="Vai trò..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {[staff?.role as Partial<IStaffRole>].map(role => (
                                                        <SelectItem
                                                            key={role.roleId}
                                                            value={role.roleId!.toString()}
                                                            disabled
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
                        {mode === 'update' && (
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Hủy bỏ</Button>
                                </DialogClose>
                                <Button type="submit">Xác nhận</Button>
                            </DialogFooter>
                        )}
                    </form>
                </Form>

                {/* Move <DialogFooter /> outside <Form /> to prevent auto-submitting behavior */}
                {mode === 'view' && (
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Đóng</Button>
                        </DialogClose>
                        {hasUpdatePermission &&
                            !(staff?.role as Partial<IStaffRole>)?.isImmutable &&
                            staff?.isActive && (
                                <Button type="button" onClick={() => setMode('update')}>
                                    <PencilLine />
                                    Chỉnh sửa
                                </Button>
                            )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default DataStaffDialog
