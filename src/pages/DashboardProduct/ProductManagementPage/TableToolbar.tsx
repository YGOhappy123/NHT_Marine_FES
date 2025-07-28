import { useNavigate } from 'react-router-dom'
import { Table } from '@tanstack/react-table'
import { BatteryFull, BatteryLow, PencilLine, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { useIsMobile } from '@/hooks/useMobile'
import { twMerge } from 'tailwind-merge'
import TableDataFilter from '@/components/common/TableDataFilter'

interface TableToolbarProps<TData> {
    table: Table<TData>
    hasAddProductPermission: boolean
}

const stockStatuses = [
    {
        value: true,
        label: 'Còn hàng',
        icon: BatteryFull
    },
    {
        value: false,
        label: 'Hết hàng',
        icon: BatteryLow
    }
]

export function TableToolbar<TData>({ table, hasAddProductPermission }: TableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const isMobile = useIsMobile()
    const navigate = useNavigate()

    return (
        <div className="flex items-center justify-between">
            <div className={twMerge('flex gap-2', isMobile ? '' : 'flex-col items-start xl:flex-row')}>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Tìm sản phẩm theo tên..."
                        value={(table.getColumn('Thông tin sản phẩm')?.getFilterValue() as string) ?? ''}
                        onChange={event => table.getColumn('Thông tin sản phẩm')?.setFilterValue(event.target.value)}
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
                {table.getColumn('Tồn kho') && (
                    <TableDataFilter
                        table={table}
                        rootColumn="rootProductId"
                        filterColumn="Tồn kho"
                        title="Trạng thái tồn kho"
                        options={stockStatuses}
                        filterFn={(rawValue: number, option) => {
                            console.log(rawValue > 0 === option)
                            return rawValue > 0 === option
                        }}
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

                {hasAddProductPermission && (
                    <Button size="sm" className="flex h-8" onClick={() => navigate('/products/add')}>
                        <PencilLine />
                        Thêm sản phẩm
                    </Button>
                )}
            </div>
        </div>
    )
}
