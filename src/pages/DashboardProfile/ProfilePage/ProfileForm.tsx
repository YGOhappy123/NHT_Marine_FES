import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RootState } from '@/store'
import ImageUploader from '@/pages/DashboardProfile/ProfilePage/ImageUploader'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'
import fileService from '@/services/fileService'
import staffService from '@/services/staffService'
import { setUser } from '@/slices/authSlice'

const profileFormSchema = z.object({
    fullName: z
        .string()
        .min(1, { message: 'Họ và tên không được để trống.' })
        .max(255, { message: 'Họ và tên không vượt quá 255 ký tự.' }),
    email: z.email('Email không đúng định dạng.'),
    roleId: z.number().min(1, { message: 'Vui lòng chọn vai trò.' })
})

type ProfileFormProps = {
    staffRoles: IStaffRole[]
}

const ProfileForm = ({ staffRoles }: ProfileFormProps) => {
    const user = useSelector((state: RootState) => state.auth.user) as IStaff
    const hasModifyPermission = verifyPermission(user, permissions.modifyPersonalInformation)
    const [avatar, setAvatar] = useState(user?.avatar)
    const { uploadBase64Mutation } = fileService()
    const { updateStaffMutation } = staffService()
    const dispatch = useDispatch()

    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: user.fullName,
            email: user.email,
            roleId: user.roleId
        }
    })

    const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
        if (!hasModifyPermission) return

        try {
            let newImageUrl = null
            if (avatar && avatar !== user.avatar) {
                const res = await uploadBase64Mutation.mutateAsync({ base64: avatar, folder: 'avatar' })
                newImageUrl = res.data.data?.imageUrl
                setAvatar(newImageUrl)
            }

            await updateStaffMutation.mutateAsync({
                staffId: user.staffId,
                data: {
                    fullName: values.fullName,
                    email: values.email,
                    avatar: newImageUrl ?? user.avatar
                }
            })

            dispatch(
                setUser({
                    ...user,
                    fullName: values.fullName,
                    email: values.email,
                    avatar: newImageUrl ?? user.avatar
                })
            )
        } catch {
            form.reset()
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-6">
                <div className="grid grid-cols-3 mb-12 gap-12">
                    <ImageUploader
                        hasPermission={hasModifyPermission}
                        avatar={avatar}
                        setAvatar={setAvatar}
                        currentAvatar={user.avatar}
                    />

                    <div className="col-span-2 flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-card-foreground">Họ và tên</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={!hasModifyPermission}
                                            placeholder="Họ và tên..."
                                            className="rounded h-12 font-semibold border-2 text-card-foreground"
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
                                            disabled={!hasModifyPermission}
                                            placeholder="Email..."
                                            className="rounded h-12 font-semibold border-2 text-card-foreground"
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
                                        onValueChange={(value) => {}}
                                        value={field.value?.toString() ?? ''}
                                        disabled
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded w-full h-12! font-semibold border-2 text-card-foreground">
                                                <SelectValue placeholder="Vai trò..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {staffRoles.map((role) => (
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

                <Button
                    type="submit"
                    disabled={!hasModifyPermission || form.formState.isSubmitting}
                    className="w-full rounded font-semibold capitalize text-base h-12"
                >
                    {form.formState.isSubmitting ? 'Đang tải...' : 'Cập nhật thông tin'}
                </Button>
            </form>
        </Form>
    )
}

export default ProfileForm
