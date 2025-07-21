import { Table } from '@tanstack/react-table'
import { PencilLine, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter'
import { roleTypes } from '@/pages/DashboardPersonnel/RoleManagementPage/RoleTableColumns'

interface TableToolbarProps<TData> {
    table: Table<TData>
}

export function TableToolbar<TData>({ table }: TableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

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
            <Button size="sm" className="ml-2 hidden h-8 lg:flex">
                <PencilLine />
                Thêm vai trò
            </Button>
        </div>
    )
}
