import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ChangePasswordForm from '@/pages/DashboardProfile/ChangePasswordPage/ChangePasswordForm'

const ChangePasswordPage = () => {
    return (
        <div className="flex-1 flex justify-center items-center">
            <Card className="w-full max-w-4xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Mật khẩu</CardTitle>
                    <CardDescription>Cập nhật mật khẩu cho tài khoản của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default ChangePasswordPage
