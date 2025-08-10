import { ColumnDef } from '@tanstack/react-table'
import { UseMutationResult } from '@tanstack/react-query'
import { MoreHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'

interface IDeliveryService {
    serviceId: number
    name: string
    contactPhone: string
}

type Options = {
    hasUpdatePermission: boolean
    hasDeletePermission: boolean
    onUpdateDeliveryService: (value: IDeliveryService) => void
    removeDeliveryServiceMutation: UseMutationResult<any, any, number, any>
}

export const getTableColumns = ({
    hasUpdatePermission,
    hasDeletePermission,
    onUpdateDeliveryService,
    removeDeliveryServiceMutation
}: Options) => {
    const columns: ColumnDef<IDeliveryService>[] = [
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
            accessorKey: 'serviceId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mã dịch vụ" enableHiding={false} />,
            cell: ({ row }) => <div className="w-[80px]">{row.getValue('serviceId')}</div>,
            enableHiding: false,
            filterFn: (row, id, value: (number | string)[]) => {
                return value.includes(row.getValue(id) as number)
            }
        },
        {
            id: 'Tên đơn vị vận chuyển',
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên đơn vị vận chuyển" />,
            cell: ({ row }) => <div className="w-[200px]">{row.getValue('Tên đơn vị vận chuyển')}</div>
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
                                        onUpdateDeliveryService(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <ConfirmationDialog
                                title="Bạn có chắc muốn xóa đơn vị vận chuyển này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn dịch vụ khỏi hệ thống."
                                onConfirm={async () => {
                                    if (hasDeletePermission) {
                                        removeDeliveryServiceMutation.mutateAsync(row.original.serviceId)
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
