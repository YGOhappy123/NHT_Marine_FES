import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter'
import { roleTypes } from '@/pages/DashboardPersonnel/RoleManagementPage/getTableColumns'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import appPermissions from '@/configs/permissions'
import AddRoleDialog from '@/pages/DashboardPersonnel/RoleManagementPage/AddRoleDialog'
import verifyPermission from '@/utils/verifyPermission'

interface TableToolbarProps<TData> {
    table: Table<TData>
    permissions: IPermission[]
    addNewRoleMutation: UseMutationResult<any, any, Partial<IStaffRole>, any>
}

export function TableToolbar<TData>({ table, permissions, addNewRoleMutation }: TableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const user = useSelector((state: RootState) => state.auth.user)
    const hasAddRolePermission = verifyPermission(user, appPermissions.addNewRole)

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Tìm vai trò theo tên..."
                    value={(table.getColumn('Tên vai trò')?.getFilterValue() as string) ?? ''}
                    onChange={event => table.getColumn('Tên vai trò')?.setFilterValue(event.target.value)}
                    className="text-foreground caret-foreground h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn('Loại vai trò') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('Loại vai trò')}
                        title="Loại vai trò"
                        options={roleTypes}
                    />
                )}
                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                        Đặt lại
                        <X />
                    </Button>
                )}
            </div>

            <DataTableViewOptions table={table} />

            {hasAddRolePermission && (
                <AddRoleDialog permissions={permissions} addNewRoleMutation={addNewRoleMutation} />
            )}
        </div>
    )
}
