import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'
import ProfileForm from '@/pages/DashboardProfile/ProfilePage/ProfileForm'
import useAxiosIns from '@/hooks/useAxiosIns'

const ProfilePage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user) as IStaff
    const hasModifyPermission = verifyPermission(user, permissions.modifyPersonalInformation)

    const fetchAllRolesQuery = useQuery({
        queryKey: ['role-all'],
        queryFn: () => axios.get<IResponseData<IStaffRole[]>>(`/roles?sort=${JSON.stringify({ roleId: 'ASC' })}`),
        refetchOnWindowFocus: false,
        refetchInterval: 10000,
        enabled: true,
        select: (res) => res.data
    })
    const roles = fetchAllRolesQuery.data?.data || []

    return (
        <div className="flex-1 flex justify-center items-center">
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
                    <ProfileForm staffRoles={roles} />
                </CardContent>
            </Card>
        </div>
    )
}

export default ProfilePage
