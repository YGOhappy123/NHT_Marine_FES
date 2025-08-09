import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'
import ProfileForm from '@/pages/DashboardProfile/ProfilePage/ProfileForm'

const ProfilePage = () => {
    const user = useSelector((state: RootState) => state.auth.user) as IStaff
    const hasModifyPermission =
        verifyPermission(user, permissions.modifyPersonalInformation) ||
        verifyPermission(user, permissions.updateStaffInformation)

    return (
        <div className="flex flex-1 items-center justify-center">
            <Card className="w-full max-w-4xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
                    <CardDescription>
                        {hasModifyPermission
                            ? 'Cập nhật thông tin tài khoản của bạn'
                            : 'Tài khoản của bạn không được cấp quyền tự cập nhật thông tin'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileForm hasModifyPermission={hasModifyPermission} />
                </CardContent>
            </Card>
        </div>
    )
}

export default ProfilePage
