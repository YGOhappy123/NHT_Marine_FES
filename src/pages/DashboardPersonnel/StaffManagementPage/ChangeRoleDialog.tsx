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

const dataStaffFormSchema = z.object({
    roleId: z.number().min(1, { message: 'Vui lòng chọn vai trò.' })
})

type ChangeRoleDialogProps = {
    staff: IStaff | null
    roles: IStaffRole[]
    open: boolean
    setOpen: (value: boolean) => void
    changeStaffRoleMutation: UseMutationResult<any, any, { staffId: number; data: { roleId: number } }, any>
    hasChangeRolePermission: boolean
}

const ChangeRoleDialog = ({
    staff,
    roles,
    open,
    setOpen,
    changeStaffRoleMutation,
    hasChangeRolePermission
}: ChangeRoleDialogProps) => {
    const form = useForm<z.infer<typeof dataStaffFormSchema>>({
        resolver: zodResolver(dataStaffFormSchema),
        defaultValues: {
            roleId: 0
        }
    })

    const onSubmit = async (values: z.infer<typeof dataStaffFormSchema>) => {
        if (!staff || !hasChangeRolePermission) return

        await changeStaffRoleMutation.mutateAsync({
            staffId: staff.staffId,
            data: { roleId: values.roleId }
        })

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && staff) {
            form.reset({
                roleId: staff.roleId
            })
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thay đổi vai trò nhân viên</DialogTitle>
                    <DialogDescription>
                        Thay đổi vai trò của nhân viên. Ấn "Xác nhận" sau khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

export default ChangeRoleDialog
