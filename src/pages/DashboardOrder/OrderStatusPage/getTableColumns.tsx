import { ColumnDef } from '@tanstack/react-table'
import { UseMutationResult } from '@tanstack/react-query'
import { MoreHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'

interface IOrderStatus {
    statusId: number;
    name: string;
    description: string;
    isDefaultState: boolean;
    isAccounted: boolean;
    isUnfulfilled: boolean;
}

type Options = {
    hasUpdatePermission: boolean
    hasDeletePermission: boolean
    onUpdateOrderStatus: (value: IOrderStatus) => void
    removeOrderStatusMutation: UseMutationResult<any, any, number, any>
}

// (phần import và interface IOrderStatus giữ nguyên)
export const getTableColumns = ({
    hasUpdatePermission,
    hasDeletePermission,
    onUpdateOrderStatus,
    removeOrderStatusMutation
}: Options) => {
    const columns: ColumnDef<IOrderStatus>[] = [
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
            accessorKey: 'statusId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mã trạng thái" enableHiding={false} />,
            cell: ({ row }) => <div className="w-[80px]">{row.getValue('statusId')}</div>,
            enableHiding: false,
            filterFn: (row, id, value: (number | string)[]) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            id: 'Tên trạng thái đơn hàng',
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên trạng thái" />,
            cell: ({ row }) => <div className="w-[200px]">{row.getValue('Tên trạng thái đơn hàng')}</div>
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mô tả" />,
            cell: ({ row }) => (
                <div className="min-w-[200px] max-w-[300px] whitespace-normal break-words">
                    {row.getValue('description')}
                </div>
            )
        },
        // --- Trạng thái mặc định ---
        {
            id: 'isDefaultState',
            accessorKey: 'isDefaultState',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái mặc định" />,
            cell: ({ row }) => <div className="w-[120px]">{row.getValue('isDefaultState') ? 'Có' : 'Không'}</div>,
            // Khi filter, react-table sẽ truyền vào value là mảng các option đã chọn => ta kiểm tra includes
            filterFn: (row, id, value: (boolean | number | string)[]) => {
                return value.includes(row.getValue(id))
            }
        },
        // --- Đã thanh toán (isAccounted) ---
        {
            id: 'isAccounted',
            accessorKey: 'isAccounted',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Đã đối soát" />,
            cell: ({ row }) => <div className="w-[120px]">{row.getValue('isAccounted') ? 'Có' : 'Không'}</div>,
            filterFn: (row, id, value: (boolean | number | string)[]) => {
                return value.includes(row.getValue(id))
            }
        },
        // --- Chưa hoàn thành (isUnfulfilled) ---
        {
            id: 'isUnfulfilled',
            accessorKey: 'isUnfulfilled',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Chưa hoàn thành" />,
            cell: ({ row }) => <div className="w-[120px]">{row.getValue('isUnfulfilled') ? 'Có' : 'Không'}</div>,
            filterFn: (row, id, value: (boolean | number | string)[]) => {
                return value.includes(row.getValue(id))
            }
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
                            <DropdownMenuItem
                                disabled={!hasUpdatePermission}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (hasUpdatePermission) {
                                        onUpdateOrderStatus(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <ConfirmationDialog
                                title="Bạn có chắc muốn xóa trạng thái đơn hàng này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn trạng thái khỏi hệ thống."
                                onConfirm={async () => {
                                    if (hasDeletePermission) {
                                        removeOrderStatusMutation.mutateAsync(row.original.statusId)
                                    }
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={!hasDeletePermission}
                                        className="cursor-pointer"
                                    >
                                        Xóa
                                        <DropdownMenuShortcut className="text-base">⌘⌫</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ]

    return columns
}
