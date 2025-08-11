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
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'


type Options = {
    hasUpdatePermission: boolean
    hasDeletePermission: boolean
    onViewStorage: (value: IStorage) => void
    onUpdateStorage: (value: IStorage) => void
    removeStorageMutation: UseMutationResult<any, any, number, any>
}

export const getTableColumns = ({
    hasUpdatePermission,
    hasDeletePermission,
    onUpdateStorage,
    removeStorageMutation
}: Options) => {
    const columns: ColumnDef<IStorage>[] = [
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
            accessorKey: 'storageId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mã kho" enableHiding={false} />,
            cell: ({ row }) => <div className="w-[80px]">{row.getValue('storageId')}</div>,
            enableHiding: false,
            filterFn: (row, id, value: (number | string)[]) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            id: 'Tên kho',
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên kho" />,
            cell: ({ row }) => <div className="w-[200px]">{row.getValue('Tên kho')}</div>
        },
        {
            id: 'Loại kho',
            accessorKey: 'typeId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Loại kho" />,
            cell: ({ row }) => (
                <div className="w-[200px]">
                    {(row.original.type as Partial<IStorageType> | undefined)?.name || <i>Không có</i>}
                </div>
            )
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
                                    onUpdateStorage(row.original)
                                }
                            }}
                        >
                            Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ConfirmationDialog
                            title="Bạn có chắc muốn xóa kho này không?"
                            description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn kho khỏi hệ thống NHT Marine."
                            onConfirm={async () => {
                                if (hasDeletePermission) {
                                    removeStorageMutation.mutateAsync(row.original.storageId)
                                }
                            }}
                            trigger={
                                <DropdownMenuItem
                                    variant="destructive"
                                    disabled={!hasDeletePermission}
                                    className="cursor-pointer"
                                >
                                    Xóa
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
