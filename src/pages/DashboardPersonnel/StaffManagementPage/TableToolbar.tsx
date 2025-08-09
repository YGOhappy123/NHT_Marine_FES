import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { staffTypes } from '@/pages/DashboardPersonnel/StaffManagementPage/getTableColumns'
import { useIsMobile } from '@/hooks/useMobile'
import { twMerge } from 'tailwind-merge'
import AddStaffDialog from '@/pages/DashboardPersonnel/StaffManagementPage/AddStaffDialog'
import TableDataFilter from '@/components/common/TableDataFilter'

interface TableToolbarProps<TData> {
    table: Table<TData>
    roles: IStaffRole[]
    addNewStaffMutation: UseMutationResult<any, any, Partial<IStaff>, any>
    hasAddStaffPermission: boolean
}

export function TableToolbar<TData>({
    table,
    roles,
    addNewStaffMutation,
    hasAddStaffPermission
}: TableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const isMobile = useIsMobile()

    return (
        <div className="flex items-center justify-between">
            <div className={twMerge('flex gap-2', isMobile ? '' : 'flex-col items-start xl:flex-row')}>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Tìm nhân viên theo tên..."
                        value={(table.getColumn('Thông tin nhân viên')?.getFilterValue() as string) ?? ''}
                        onChange={event => table.getColumn('Thông tin nhân viên')?.setFilterValue(event.target.value)}
                        className="text-foreground caret-foreground h-8 w-[150px] md:w-[200px] lg:w-[250px]"
                    />
                    {!isMobile && isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => table.resetColumnFilters()}
                            className="flex h-8 px-2 lg:px-3 xl:hidden"
                        >
                            Đặt lại
                            <X />
                        </Button>
                    )}
                </div>
                {table.getColumn('Trạng thái') && (
                    <TableDataFilter
                        table={table}
                        rootColumn="staffId"
                        filterColumn="Trạng thái"
                        title="Trạng thái"
                        options={staffTypes}
                        filterFn={(rawValue: boolean, option) => rawValue === option}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="hidden h-8 px-2 lg:px-3 xl:flex"
                    >
                        Đặt lại
                        <X />
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <DataTableViewOptions table={table} />

                {hasAddStaffPermission && <AddStaffDialog roles={roles} addNewStaffMutation={addNewStaffMutation} />}
            </div>
        </div>
    )
}
