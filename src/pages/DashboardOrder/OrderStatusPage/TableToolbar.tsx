import { useState } from 'react'
import { Table } from '@tanstack/react-table'
import { X, Filter } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { useIsMobile } from '@/hooks/useMobile'
import { twMerge } from 'tailwind-merge'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
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

    const [defaultStateFilter, setDefaultStateFilter] = useState<null | boolean>(null)
    const [isAccountedFilter, setIsAccountedFilter] = useState<null | boolean>(null)
    const [isUnfulfilledFilter, setIsUnfulfilledFilter] = useState<null | boolean>(null)
    const [menuOpen, setMenuOpen] = useState(false)

    const applyFilters = () => {
        if (defaultStateFilter === null) {
            table.getColumn('isDefaultState')?.setFilterValue(undefined)
        } else {
            table.getColumn('isDefaultState')?.setFilterValue([defaultStateFilter])
        }

        if (isAccountedFilter === null) {
            table.getColumn('isAccounted')?.setFilterValue(undefined)
        } else {
            table.getColumn('isAccounted')?.setFilterValue([isAccountedFilter])
        }

        if (isUnfulfilledFilter === null) {
            table.getColumn('isUnfulfilled')?.setFilterValue(undefined)
        } else {
            table.getColumn('isUnfulfilled')?.setFilterValue([isUnfulfilledFilter])
        }

        setMenuOpen(false)
    }

    const resetFilters = () => {
        setDefaultStateFilter(null)
        setIsAccountedFilter(null)
        setIsUnfulfilledFilter(null)

        table.getColumn('isDefaultState')?.setFilterValue(undefined)
        table.getColumn('isAccounted')?.setFilterValue(undefined)
        table.getColumn('isUnfulfilled')?.setFilterValue(undefined)
        table.getColumn('Tên trạng thái đơn hàng')?.setFilterValue(undefined)
    }

    const summaryLabel = () => {
        const parts: string[] = []
        if (defaultStateFilter !== null) parts.push(`Mặc định: ${defaultStateFilter ? 'Có' : 'Không'}`)
        if (isAccountedFilter !== null) parts.push(`Đã đối soát: ${isAccountedFilter ? 'Có' : 'Không'}`)
        if (isUnfulfilledFilter !== null) parts.push(`Chưa hoàn thành: ${isUnfulfilledFilter ? 'Có' : 'Không'}`)
        return parts.length > 0 ? parts.join(' • ') : 'Bộ lọc trạng thái'
    }

    return (
        <div className="flex items-center justify-between">
            <div className={twMerge('flex gap-2', isMobile ? '' : 'flex-col items-start xl:flex-row')}>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Tìm trạng thái đơn hàng theo tên..."
                        value={(table.getColumn('Tên trạng thái đơn hàng')?.getFilterValue() as string) ?? ''}
                        onChange={event =>
                            table.getColumn('Tên trạng thái đơn hàng')?.setFilterValue(event.target.value)
                        }
                        className="text-foreground caret-foreground h-8 w-[150px] md:w-[200px] lg:w-[250px]"
                    />

                    <DropdownMenu open={menuOpen} onOpenChange={open => setMenuOpen(open)}>
                        <DropdownMenuTrigger asChild>
                            <Button variant={isFiltered ? 'secondary' : 'outline'} className="ml-2 h-8">
                                <Filter className="mr-2" />
                                {summaryLabel()}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" className="w-[320px] p-3">
                            <div onClick={e => e.stopPropagation()} className="flex flex-col gap-4">
                                <div>
                                    <div className="mb-2 text-sm font-medium">Trạng thái mặc định</div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={defaultStateFilter === null ? 'secondary' : 'ghost'}
                                            onClick={() => setDefaultStateFilter(null)}
                                        >
                                            Tất cả
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={defaultStateFilter === true ? 'secondary' : 'ghost'}
                                            onClick={() => setDefaultStateFilter(true)}
                                        >
                                            Có
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={defaultStateFilter === false ? 'secondary' : 'ghost'}
                                            onClick={() => setDefaultStateFilter(false)}
                                        >
                                            Không
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 text-sm font-medium">Đã thanh toán</div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={isAccountedFilter === null ? 'secondary' : 'ghost'}
                                            onClick={() => setIsAccountedFilter(null)}
                                        >
                                            Tất cả
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={isAccountedFilter === true ? 'secondary' : 'ghost'}
                                            onClick={() => setIsAccountedFilter(true)}
                                        >
                                            Có
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={isAccountedFilter === false ? 'secondary' : 'ghost'}
                                            onClick={() => setIsAccountedFilter(false)}
                                        >
                                            Không
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 text-sm font-medium">Chưa hoàn thành</div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={isUnfulfilledFilter === null ? 'secondary' : 'ghost'}
                                            onClick={() => setIsUnfulfilledFilter(null)}
                                        >
                                            Tất cả
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={isUnfulfilledFilter === true ? 'secondary' : 'ghost'}
                                            onClick={() => setIsUnfulfilledFilter(true)}
                                        >
                                            Có
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={isUnfulfilledFilter === false ? 'secondary' : 'ghost'}
                                            onClick={() => setIsUnfulfilledFilter(false)}
                                        >
                                            Không
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-2 flex justify-between">
                                    <Button
                                        variant="ghost"
                                        onClick={e => {
                                            e.stopPropagation()
                                            resetFilters()
                                        }}
                                    >
                                        Đặt lại
                                    </Button>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={e => {
                                                e.stopPropagation()
                                                applyFilters()
                                            }}
                                        >
                                            Áp dụng
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {!isMobile && isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                resetFilters()
                                setMenuOpen(false)
                            }}
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
                        onClick={() => {
                            resetFilters()
                            setMenuOpen(false)
                        }}
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
                    <AddOrderStatusDialog
                        addNewOrderStatusMutation={addNewOrderStatusMutation}
                        existingOrderStatuses={orderStatuses}
                    />
                )}
            </div>
        </div>
    )
}
