import { ColumnDef } from '@tanstack/react-table'
import { CircleCheck, CircleX, MoreHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

export const distributedStatuses = [
    {
        value: false,
        label: 'Chưa phân vào kho',
        icon: CircleCheck
    },
    {
        value: true,
        label: 'Đã phân vào kho',
        icon: CircleX
    }
]

type Options = {
    hasDistributePermission: boolean
    onViewImport: (value: IProductImport) => void
    onDistributeImport: (value: IProductImport) => void
}

export const getTableColumns = ({ hasDistributePermission, onViewImport, onDistributeImport }: Options) => {
    const columns: ColumnDef<IProductImport>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={value => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'importId',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Mã đơn nhập hàng" enableHiding={false} />
            ),
            cell: ({ row }) => <div className="w-[80px]">{row.getValue('importId')}</div>,
            enableHiding: false,
            filterFn: (row, id, value: (number | string)[]) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            id: 'Thông tin đơn',
            accessorKey: 'invoiceNumber',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Thông tin đơn nhập hàng" enableHiding={false} />
            ),
            cell: ({ row }) => (
                <div className="flex max-w-[250px] flex-col gap-2 break-words whitespace-normal">
                    <p>
                        <span className="font-semibold">Mã hóa đơn: </span>
                        {row.original.invoiceNumber}
                    </p>
                    <p>
                        <span className="font-semibold">Ngày nhập hàng: </span>
                        {dayjs(row.original.importDate).format('DD/MM/YYYY')}
                    </p>
                    <p>
                        <span className="font-semibold">Tổng chi phí: </span>
                        {formatCurrency(row.original.totalCost)}
                    </p>
                </div>
            ),
            enableHiding: false
        },
        {
            id: 'Thông tin nhà cung cấp',
            accessorKey: 'trackedBy',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Thông tin nhà cung cấp" />,
            cell: ({ row }) => {
                return (
                    <div className="flex max-w-[250px] flex-col gap-2 break-words whitespace-normal">
                        <p>
                            <span className="font-semibold">Tên: </span>
                            {row.original.supplier?.name}
                        </p>
                        <p>
                            <span className="font-semibold">Email: </span>
                            {row.original.supplier?.contactEmail}
                        </p>
                        <p>
                            <span className="font-semibold">Số điện thoại: </span>
                            {row.original.supplier?.contactPhone}
                        </p>
                    </div>
                )
            },
            enableSorting: false
        },
        {
            id: 'Trạng thái phân bố',
            accessorKey: 'isDistributed',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái phân bố" />,
            cell: ({ row }) => {
                const status = distributedStatuses.find(s => s.value === row.getValue('Trạng thái phân bố'))
                if (!status) return null

                return (
                    <div className="flex w-[200px] items-center">
                        {status.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{status.label}</span>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            id: 'Thông tin người ghi nhận',
            accessorKey: 'trackedBy',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Thông tin người ghi nhận" />,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-2 break-words whitespace-normal">
                        <p>
                            <span className="font-semibold">Người ghi nhận: </span>
                            {(row.original.trackedByStaff as Partial<IStaff> | undefined)?.fullName}
                        </p>
                        <p>
                            <span className="font-semibold">Ngày ghi nhận: </span>
                            {dayjs(row.original.trackedAt).format('DD/MM/YYYY HH:mm:ss')}
                        </p>
                    </div>
                )
            },
            enableSorting: false
        },
        {
            id: 'actions',
            header: () => <div className="text-center">Hành động</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                                <MoreHorizontal />
                                <span className="sr-only">Mở menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-[160px]">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewImport(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={!hasDistributePermission || row.original.isDistributed}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (!hasDistributePermission || row.original.isDistributed) return

                                    onDistributeImport(row.original)
                                }}
                            >
                                Phân vào kho
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ]

    return columns
}
