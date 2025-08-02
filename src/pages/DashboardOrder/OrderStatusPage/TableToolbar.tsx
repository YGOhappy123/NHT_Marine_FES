import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { useIsMobile } from '@/hooks/useMobile'
import { twMerge } from 'tailwind-merge'
import AddOrderStatusDialog from '@/pages/DashboardOrder/OrderStatusPage/AddOrderStatusDialog'

interface TableToolbarProps<TData> {
    table: Table<TData>
    addNewOrderStatusMutation: UseMutationResult<any, any, Partial<IDeliveryService>, any>
    hasAddOrderStatusPermission: boolean
    orderStatuses: IOrderStatus[]
}

export function TableToolbar<TData>({
    table,
    addNewOrderStatusMutation,
    hasAddOrderStatusPermission,
    orderStatuses
}: TableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const isMobile = useIsMobile()

    return (
        <div className="flex items-center justify-between">
            <div className={twMerge('flex gap-2', isMobile ? '' : 'flex-col items-start xl:flex-row')}>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Tìm trạng thái đơn hàng theo tên..."
                        value={(table.getColumn('Tên trạng thái đơn hàng')?.getFilterValue() as string) ?? ''}
                        onChange={event => table.getColumn('Tên trạng thái đơn hàng')?.setFilterValue(event.target.value)}
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

                {hasAddOrderStatusPermission && (
                    <AddOrderStatusDialog addNewOrderStatusMutation={addNewOrderStatusMutation}
                    existingOrderStatuses={orderStatuses} />
                )}
            </div>
        </div>
    )
}
