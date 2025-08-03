import { useState } from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardCustomer/CustomerListPage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardCustomer/CustomerListPage/getTableColumns'
import { RootState } from '@/store'
import customerService from '@/services/customerService'
import useAxiosIns from '@/hooks/useAxiosIns'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const CustomerListPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const { customers, deactivateCustomerAccountMutation } = customerService({
        enableFetching: true
    })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user.fullName}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách khách hàng của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                    </Avatar>
                </div>
            </div>

            <DataTable
                data={customers}
                columns={getTableColumns({
                    hasDeactivateCustomerAccountPermission: verifyPermission(
                        user,
                        appPermissions.deactivateCustomerAccount
                    ),
                    deactivateCustomerAccountMutation: deactivateCustomerAccountMutation
                })}
                renderToolbar={table => <TableToolbar table={table} />}
            />
        </div>
    )
}

export default CustomerListPage
