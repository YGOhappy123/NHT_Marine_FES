import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import authService from '@/services/authService'

const changePasswordFormSchema = z
    .object({
        oldPassword: z.string().min(1, { message: 'Mật khẩu cũ không được để trống.' }),
        newPassword: z
            .string()
            .min(8, { message: 'Mật khẩu mới phải lớn hơn 8 ký tự.' })
            .max(20, { message: 'Mật khẩu mới không vượt quá 20 ký tự.' }),
        confirmPassword: z.string()
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu không trùng khớp.',
        path: ['confirmPassword']
    })

const ChangePasswordForm = () => {
    const { changePasswordMutation } = authService()

    const form = useForm<z.infer<typeof changePasswordFormSchema>>({
        resolver: zodResolver(changePasswordFormSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof changePasswordFormSchema>) => {
        await changePasswordMutation.mutateAsync({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword
        })

        form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-6">
                <div className="mb-12 flex flex-col gap-6">
                    <FormField
                        control={form.control}
                        name="oldPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Mật khẩu cũ</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Mật khẩu cũ..."
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
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Mật khẩu mới</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Mật khẩu mới..."
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
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Nhập lại mật khẩu</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Nhập lại mật khẩu..."
                                        className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="h-12 w-full rounded text-base font-semibold capitalize"
                >
                    {form.formState.isSubmitting ? 'Đang tải...' : 'Đổi mật khẩu'}
                </Button>
            </form>
        </Form>
    )
}

export default ChangePasswordForm
