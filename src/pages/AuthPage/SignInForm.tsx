import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import authService from '@/services/authService'
import { PasswordInput } from '@/components/ui/password-input'

const signInFormSchema = z.object({
    username: z.string().min(1, { message: 'Tên đăng nhập không được để trống.' }),
    password: z.string().min(1, { message: 'Mật khẩu không được để trống.' })
})

const SignInForm = () => {
    const { signInMutation } = authService()

    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
        await signInMutation.mutateAsync({
            username: values.username,
            password: values.password
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col px-5 py-7">
                <h2 className="text-primary mb-10 text-center text-4xl font-medium">Đăng Nhập Tài Khoản</h2>

                <div className="mb-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên đăng nhập</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Tên đăng nhập..."
                                        className="rounded h-12 font-semibold border-2"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="mb-6">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Mật khẩu..."
                                        className="rounded h-12 font-semibold border-2"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col items-center">
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="w-full rounded font-semibold capitalize text-base h-12"
                    >
                        {form.formState.isSubmitting ? 'Đang tải...' : 'Đăng nhập'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default SignInForm
