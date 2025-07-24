import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { roleTypes } from '@/pages/DashboardPersonnel/RoleManagementPage/getTableColumns'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import appPermissions from '@/configs/permissions'
import AddRoleDialog from '@/pages/DashboardPersonnel/RoleManagementPage/AddRoleDialog'
import verifyPermission from '@/utils/verifyPermission'
import TableDataFilter from '@/components/common/TableDataFilter'
import { useIsMobile } from '@/hooks/useMobile'
import { twMerge } from 'tailwind-merge'

interface TableToolbarProps<TData> {
    table: Table<TData>
    permissions: IPermission[]
    addNewRoleMutation: UseMutationResult<any, any, Partial<IStaffRole>, any>
}

export function TableToolbar<TData>({ table, permissions, addNewRoleMutation }: TableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const user = useSelector((state: RootState) => state.auth.user)
    const hasAddRolePermission = verifyPermission(user, appPermissions.addNewRole)
    const isMobile = useIsMobile()

    return (
        <div className="flex items-center justify-between">
            <div className={twMerge('flex gap-2', isMobile ? '' : 'flex-col items-start xl:flex-row')}>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Tìm vai trò theo tên..."
                        value={(table.getColumn('Tên vai trò')?.getFilterValue() as string) ?? ''}
                        onChange={event => table.getColumn('Tên vai trò')?.setFilterValue(event.target.value)}
                        className="text-foreground caret-foreground h-8 w-[150px] md:w-[200px] lg:w-[250px]"
                    />
                    {!isMobile && isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => table.resetColumnFilters()}
                            className="h-8 px-2 lg:px-3 xl:hidden"
                        >
                            Đặt lại
                            <X />
                        </Button>
                    )}
                </div>
                {table.getColumn('Loại vai trò') && (
                    <TableDataFilter
                        table={table}
                        rootColumn="roleId"
                        filterColumn="Loại vai trò"
                        title="Loại vai trò"
                        options={roleTypes}
                        filterFn={(rawValue: boolean, option) => rawValue === option}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="hidden h-8 px-2 lg:px-3 xl:block"
                    >
                        Đặt lại
                        <X />
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <DataTableViewOptions table={table} />

                {hasAddRolePermission && (
                    <AddRoleDialog permissions={permissions} addNewRoleMutation={addNewRoleMutation} />
                )}
            </div>
        </div>
    )
}
