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

interface ISupplier {
    supplierId: number
    name: string
    address: string
    contactEmail: string
    contactPhone: string
}

type Options = {
    hasUpdatePermission: boolean
    hasDeletePermission: boolean
    onUpdateSupplier: (value: ISupplier) => void
    removeSupplierMutation: UseMutationResult<any, any, number, any>
}

export const getTableColumns = ({
    hasUpdatePermission,
    hasDeletePermission,
    onUpdateSupplier,
    removeSupplierMutation
}: Options) => {
    const columns: ColumnDef<ISupplier>[] = [
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
            accessorKey: 'supplierId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mã nhà cung cấp" enableHiding={false} />,
            cell: ({ row }) => <div className="w-[80px]">{row.getValue('supplierId')}</div>,
            enableHiding: false,
            filterFn: (row, id, value: (number | string)[]) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            id: 'Tên nhà cung cấp',
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên nhà cung cấp" />,
            cell: ({ row }) => <div className="w-[200px]">{row.getValue('Tên nhà cung cấp')}</div>
        },
        {
            id: 'address',
            accessorKey: 'address',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Địa chỉ" />,
            cell: ({ row }) => (
                <div className="min-w-[200px] max-w-[300px] whitespace-normal break-words">
                    {row.getValue('address')}
                </div>
            )
        },
        {
            id: 'contactEmail',
            accessorKey: 'contactEmail',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Email liên hệ" />,
            cell: ({ row }) => (
                <div className="min-w-[200px] max-w-[300px] whitespace-normal break-words">
                    {row.getValue('contactEmail')}
                </div>
            )
        },
        {
            id: 'contactPhone',
            accessorKey: 'contactPhone',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Số điện thoại" />,
            cell: ({ row }) => <div className="w-[150px]">{row.getValue('contactPhone')}</div>
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
                                        onUpdateSupplier(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <ConfirmationDialog
                                title="Bạn có chắc muốn xóa nhà cung cấp này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn nhà cung cấp khỏi hệ thống."
                                onConfirm={async () => {
                                    if (hasDeletePermission) {
                                        removeSupplierMutation.mutateAsync(row.original.supplierId)
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