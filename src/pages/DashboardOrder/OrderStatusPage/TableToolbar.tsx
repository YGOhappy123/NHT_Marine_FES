import { useState } from 'react'
import { Table } from '@tanstack/react-table'
import { X, Filter } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { useIsMobile } from '@/hooks/useMobile'
import { twMerge } from 'tailwind-merge'
import AddOrderStatusDialog from '@/pages/DashboardOrder/OrderStatusPage/AddOrderStatusDialog'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent
} from '@/components/ui/dropdown-menu'

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

    // local states cho 3 filter: null = Tất cả, true = Có, false = Không
    const [defaultStateFilter, setDefaultStateFilter] = useState<null | boolean>(null)
    const [isAccountedFilter, setIsAccountedFilter] = useState<null | boolean>(null)
    const [isUnfulfilledFilter, setIsUnfulfilledFilter] = useState<null | boolean>(null)

    // control open state của Dropdown để chỉ đóng khi bấm Áp dụng
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

        // đóng menu sau khi áp dụng
        setMenuOpen(false)
    }

    const resetFilters = () => {
        // reset local state
        setDefaultStateFilter(null)
        setIsAccountedFilter(null)
        setIsUnfulfilledFilter(null)

        // remove filters trên table
        table.getColumn('isDefaultState')?.setFilterValue(undefined)
        table.getColumn('isAccounted')?.setFilterValue(undefined)
        table.getColumn('isUnfulfilled')?.setFilterValue(undefined)

        // reset cả ô tìm kiếm theo tên
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
            {/* Giữ Input tìm kiếm như bạn yêu cầu */}
            <div className={twMerge('flex gap-2', isMobile ? '' : 'flex-col items-start xl:flex-row')}>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Tìm trạng thái đơn hàng theo tên..."
                        value={(table.getColumn('Tên trạng thái đơn hàng')?.getFilterValue() as string) ?? ''}
                        onChange={event => table.getColumn('Tên trạng thái đơn hàng')?.setFilterValue(event.target.value)}
                        className="text-foreground caret-foreground h-8 w-[150px] md:w-[200px] lg:w-[250px]"
                    />

                    {/* Nút filter gộp — menu chỉ đóng khi bấm Áp dụng */}
                    <DropdownMenu open={menuOpen} onOpenChange={open => setMenuOpen(open)}>
                        <DropdownMenuTrigger asChild>
                            <Button variant={isFiltered ? 'secondary' : 'outline'} className="h-8 ml-2">
                                <Filter className="mr-2" />
                                {summaryLabel()}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" className="w-[320px] p-3">
                            <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4">
                                {/* Trạng thái mặc định */}
                                <div>
                                    <div className="text-sm font-medium mb-2">Trạng thái mặc định</div>
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

                                {/* Đã đối soát */}
                                <div>
                                    <div className="text-sm font-medium mb-2">Đã đối soát</div>
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

                                {/* Chưa hoàn thành */}
                                <div>
                                    <div className="text-sm font-medium mb-2">Chưa hoàn thành</div>
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

                                {/* Hành động: Đặt lại (không đóng), Áp dụng (đóng + apply) */}
                                <div className="flex justify-between mt-2">
                                    <Button
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            // resetFilters giữ menu MỞ — theo yêu cầu trước
                                            resetFilters()
                                        }}
                                    >
                                        Đặt lại
                                    </Button>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={(e) => {
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

                    {/* nút reset nhanh (ngoài menu) — giờ gọi resetFilters() và đóng menu */}
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
                    <AddOrderStatusDialog addNewOrderStatusMutation={addNewOrderStatusMutation}
                    existingOrderStatuses={orderStatuses} />
                )}
            </div>
        </div>
    )
}
