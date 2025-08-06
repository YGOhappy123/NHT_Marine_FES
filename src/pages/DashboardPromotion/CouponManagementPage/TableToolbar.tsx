import { Table } from '@tanstack/react-table'
import { Megaphone, MegaphoneOff, X } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { useIsMobile } from '@/hooks/useMobile'
import { twMerge } from 'tailwind-merge'
import AddCouponDialog from '@/pages/DashboardPromotion/CouponManagementPage/AddCouponDialog'
import TableDataFilter from '@/components/common/TableDataFilter'

interface TableToolbarProps<TData> {
    table: Table<TData>
    addNewCouponMutation: UseMutationResult<any, any, Partial<ICoupon>, any>
    hasAddCouponPermission: boolean
}

const promotionStatuses = [
    {
        value: false,
        label: 'Đã hết hạn',
        icon: MegaphoneOff
    },
    {
        value: true,
        label: 'Đang hoạt động',
        icon: Megaphone
    }
]

export function TableToolbar<TData>({ table, addNewCouponMutation, hasAddCouponPermission }: TableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const isMobile = useIsMobile()

    return (
        <div className="flex items-center justify-between">
            <div className={twMerge('flex gap-2', isMobile ? '' : 'flex-col items-start xl:flex-row')}>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Tìm phiếu giảm giá theo code..."
                        value={(table.getColumn('Code giảm giá')?.getFilterValue() as string) ?? ''}
                        onChange={event => table.getColumn('Code giảm giá')?.setFilterValue(event.target.value)}
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
                        rootColumn="couponId"
                        filterColumn="Trạng thái"
                        title="Trạng thái"
                        options={promotionStatuses}
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

                {hasAddCouponPermission && <AddCouponDialog addNewCouponMutation={addNewCouponMutation} />}
            </div>
        </div>
    )
}
