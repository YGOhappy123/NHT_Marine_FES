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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

const dataStaffFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên nhân viên không được để trống.' }),
    permissions: z.array(z.number()).min(1, { message: 'Vui lòng chọn ít nhất một quyền truy cập.' })
})

type DataStaffDialogProps = {
    staff: IStaff | null
    permissions: IPermission[]
    mode: 'view' | 'update'
    setMode: (value: 'view' | 'update') => void
    open: boolean
    setOpen: (value: boolean) => void
    updateStaffMutation: UseMutationResult<any, any, { staffId: number; data: Partial<IStaff> }, any>
    hasUpdatePermission: boolean
}

const DataStaffDialog = ({
    staff,
    permissions,
    updateStaffMutation,
    hasUpdatePermission,
    mode,
    open,
    setMode,
    setOpen
}: DataStaffDialogProps) => {
    const form = useForm<z.infer<typeof dataStaffFormSchema>>({
        resolver: zodResolver(dataStaffFormSchema),
        defaultValues: {
            name: '',
            permissions: []
        }
    })

    const onSubmit = async (values: z.infer<typeof dataStaffFormSchema>) => {
        if (!staff || !hasUpdatePermission) return

        await updateStaffMutation.mutateAsync({
            staffId: staff.staffId,
            data: { name: values.name, permissions: values.permissions }
        })

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && staff) {
            form.reset({
                name: staff.name,
                permissions: (staff.permissions as IPermission[]).map(item => item.permissionId)
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
                            : 'Chỉnh sửa các thông tin của nhân viên. Ấn &apos;Xác nhận&apos; sau khi hoàn tất.'}
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Tên nhân viên</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={mode === 'view'}
                                                placeholder="Tên nhân viên..."
                                                className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                control={form.control}
                                name="isImmutable"
                                disabled
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Loại vai trò</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                disabled
                                                onValueChange={val => field.onChange(val === 'true')}
                                                defaultValue={field.value.toString()}
                                                className="flex items-center gap-12"
                                            >
                                                <FormItem className="flex items-center gap-3">
                                                    <FormControl>
                                                        <RadioGroupItem value="false" />
                                                    </FormControl>
                                                    <FormLabel className="text-muted-foreground font-normal">
                                                        Có thể chỉnh sửa
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center gap-3">
                                                    <FormControl>
                                                        <RadioGroupItem value="true" />
                                                    </FormControl>
                                                    <FormLabel className="text-muted-foreground font-normal">
                                                        Không thể chỉnh sửa
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="permissions"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Danh sách quyền truy cập</FormLabel>
                                        <div className="grid max-h-[200px] grid-cols-1 gap-2 overflow-y-auto md:max-h-[300px] md:grid-cols-2">
                                            {permissions.map(permission => (
                                                <FormField
                                                    key={permission.permissionId}
                                                    control={form.control}
                                                    name="permissions"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={permission.permissionId}
                                                                className="flex flex-row items-center gap-2"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        disabled={mode === 'view'}
                                                                        checked={field.value?.includes(
                                                                            permission.permissionId
                                                                        )}
                                                                        onCheckedChange={checked => {
                                                                            return checked
                                                                                ? field.onChange([
                                                                                      ...field.value,
                                                                                      permission.permissionId
                                                                                  ])
                                                                                : field.onChange(
                                                                                      field.value?.filter(
                                                                                          value =>
                                                                                              value !==
                                                                                              permission.permissionId
                                                                                      )
                                                                                  )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-card-foreground text-sm font-normal">
                                                                    {permission.name}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
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
                        {hasUpdatePermission && !staff?.isImmutable && (
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
