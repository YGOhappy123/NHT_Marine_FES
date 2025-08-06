import { Table } from '@tanstack/react-table'
import { BadgePercent, CirclePercent, DiamondPercent, SquarePercent, X } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { promotionTypes } from '@/pages/DashboardPromotion/PromotionManagementPage/getTableColumns'
import { useIsMobile } from '@/hooks/useMobile'
import { twMerge } from 'tailwind-merge'
import AddPromotionDialog from '@/pages/DashboardPromotion/PromotionManagementPage/AddPromotionDialog'
import TableDataFilter from '@/components/common/TableDataFilter'

interface TableToolbarProps<TData> {
    table: Table<TData>
    rootProducts: IRootProduct[]
    addNewPromotionMutation: UseMutationResult<any, any, Partial<IPromotion>, any>
    hasAddPromotionPermission: boolean
}

const discountRateRange = [
    {
        value: '0-24',
        label: '0-24',
        icon: CirclePercent
    },
    {
        value: '25-49',
        label: '25-49',
        icon: DiamondPercent
    },
    {
        value: '50-74',
        label: '50-74',
        icon: SquarePercent
    },
    {
        value: '75-100',
        label: '75-100',
        icon: BadgePercent
    }
]

export function TableToolbar<TData>({
    table,
    rootProducts,
    addNewPromotionMutation,
    hasAddPromotionPermission
}: TableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const isMobile = useIsMobile()

    return (
        <div className="flex items-center justify-between">
            <div className={twMerge('flex gap-2', isMobile ? '' : 'flex-col items-start xl:flex-row')}>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Tìm CT khuyến mãi theo tên..."
                        value={(table.getColumn('Tên chương trình')?.getFilterValue() as string) ?? ''}
                        onChange={event => table.getColumn('Tên chương trình')?.setFilterValue(event.target.value)}
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
                        rootColumn="promotionId"
                        filterColumn="Trạng thái"
                        title="Trạng thái"
                        options={promotionTypes}
                        filterFn={(rawValue: boolean, option) => rawValue === option}
                    />
                )}
                {table.getColumn('Giảm giá') && (
                    <TableDataFilter
                        table={table}
                        rootColumn="promotionId"
                        filterColumn="Giảm giá"
                        title="Giảm giá"
                        options={discountRateRange}
                        filterFn={(rawValue: number, option) => {
                            switch (option) {
                                case '0-24':
                                    return rawValue >= 0 && rawValue < 25
                                case '25-49':
                                    return rawValue >= 25 && rawValue < 50
                                case '50-74':
                                    return rawValue >= 50 && rawValue < 75
                                case '75-100':
                                    return rawValue >= 75 && rawValue <= 100
                                default:
                                    return false
                            }
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

                {hasAddPromotionPermission && (
                    <AddPromotionDialog
                        rootProducts={rootProducts || []}
                        addNewPromotionMutation={addNewPromotionMutation}
                    />
                )}
            </div>
        </div>
    )
}
