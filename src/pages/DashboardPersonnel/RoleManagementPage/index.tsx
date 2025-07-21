import { useSelector } from 'react-redux'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { columns } from '@/pages/DashboardPersonnel/RoleManagementPage/RoleTableColumns'
import { RootState } from '@/store'
import roleService from '@/services/roleService'
import { TableToolbar } from '@/pages/DashboardPersonnel/RoleManagementPage/TableToolbar'

const RoleManagementPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const { roles } = roleService({ enableFetching: true })

    if (user == null) return null

    const nameInitials = (user as IStaff).fullName
        .split(' ')
        .slice(0, 2)
        .map(str => str[0])
        .join('')

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user.fullName}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách vai trò nhân viên của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback className="bg-primary text-primary-foreground uppercase">
                            {nameInitials}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <DataTable data={roles} columns={columns} renderToolbar={table => <TableToolbar table={table} />} />
        </div>
    )
}

export default RoleManagementPage
