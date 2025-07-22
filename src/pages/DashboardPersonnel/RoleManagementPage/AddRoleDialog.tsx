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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

const addRoleFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên vai trò không được để trống.' }),
    isImmutable: z.boolean(),
    permissions: z.array(z.number()).min(1, { message: 'Vui lòng chọn ít nhất một quyền truy cập.' })
})

type AddRoleDialogProps = {
    permissions: IPermission[]
    addNewRoleMutation: UseMutationResult<any, any, Partial<IStaffRole>, any>
}

const AddRoleDialog = ({ permissions, addNewRoleMutation }: AddRoleDialogProps) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof addRoleFormSchema>>({
        resolver: zodResolver(addRoleFormSchema),
        defaultValues: {
            name: '',
            isImmutable: false,
            permissions: []
        }
    })

    const onSubmit = async (values: z.infer<typeof addRoleFormSchema>) => {
        await addNewRoleMutation.mutateAsync({
            name: values.name,
            permissions: values.permissions
        })

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="ml-2 flex h-8">
                    <PencilLine />
                    Thêm vai trò
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm vai trò nhân viên</DialogTitle>
                    <DialogDescription>
                        Thêm các thông tin cần thiết cho vai trò. Ấn &apos;Xác nhận&apos; sau khi hoàn tất.
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
                                        <FormLabel className="text-card-foreground">Tên vai trò</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tên vai trò..."
                                                className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isImmutable"
                                disabled
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Loại vai trò</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={val => field.onChange(val === 'true')}
                                                defaultValue={field.value.toString()}
                                                className="flex items-center gap-12"
                                            >
                                                <FormItem className="flex items-center gap-3">
                                                    <FormControl>
                                                        <RadioGroupItem value="false" />
                                                    </FormControl>
                                                    <FormLabel className="text-card-foreground font-normal">
                                                        Có thể chỉnh sửa
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center gap-3">
                                                    <FormControl>
                                                        <RadioGroupItem value="true" disabled />
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
                            />
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
                            <Button type="submit">Xác nhận</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddRoleDialog
