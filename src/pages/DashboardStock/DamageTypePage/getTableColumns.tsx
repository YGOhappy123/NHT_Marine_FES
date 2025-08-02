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

interface IDamageType {
    typeId: number
    name: string
}

type Options = {
    hasUpdatePermission: boolean
    hasDeletePermission: boolean
    onUpdateDamageType: (value: IDamageType) => void
    removeDamageTypeMutation: UseMutationResult<any, any, number, any>
}

export const getTableColumns = ({
    hasUpdatePermission,
    hasDeletePermission,
    onUpdateDamageType,
    removeDamageTypeMutation
}: Options) => {
    const columns: ColumnDef<IDamageType>[] = [
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
            accessorKey: 'typeId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mã loại thiệt hại" enableHiding={false} />,
            cell: ({ row }) => <div className="w-[80px]">{row.getValue('typeId')}</div>,
            enableHiding: false,
            filterFn: (row, id, value: (number | string)[]) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            id: 'Tên loại thiệt hại',
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên loại thiệt hại" />,
            cell: ({ row }) => <div className="w-[200px]">{row.getValue('Tên loại thiệt hại')}</div>
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
                                        onUpdateDamageType(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <ConfirmationDialog
                                title="Bạn có chắc muốn xóa loại thiệt hại này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn loại thiệt hại khỏi hệ thống."
                                onConfirm={async () => {
                                    if (hasDeletePermission) {
                                        removeDamageTypeMutation.mutateAsync(row.original.typeId)
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