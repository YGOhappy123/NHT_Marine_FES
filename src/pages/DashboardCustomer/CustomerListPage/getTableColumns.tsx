import { ColumnDef } from '@tanstack/react-table'
import { UseMutationResult } from '@tanstack/react-query'
import { CircleCheck, CircleX, MoreHorizontal } from 'lucide-react'
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
import dayjs from 'dayjs'

export const customerTypes = [
    {
        value: false,
        label: 'Đã bị khóa',
        icon: CircleX
    },
    {
        value: true,
        label: 'Đang hoạt động',
        icon: CircleCheck
    }
]

type Options = {
    hasDeactivateCustomerAccountPermission: boolean
    deactivateCustomerAccountMutation: UseMutationResult<any, any, number, any>
}

export const getTableColumns = ({
    hasDeactivateCustomerAccountPermission,
    deactivateCustomerAccountMutation
}: Options) => {
    const columns: ColumnDef<ICustomer>[] = [
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
            accessorKey: 'customerId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mã KH" enableHiding={false} />,
            cell: ({ row }) => <div className="w-[50px]">{row.getValue('customerId')}</div>,
            enableHiding: false,
            filterFn: (row, id, value: (number | string)[]) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            id: 'Ảnh đại diện',
            accessorKey: 'avatar',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ảnh đại diện" />,
            cell: ({ row }) => (
                <div className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-full border-3 p-1">
                    <img
                        src={row.getValue('Ảnh đại diện')}
                        alt="product image"
                        className="aspect-square h-full w-full rounded-full object-cover"
                    />
                </div>
            ),
            enableSorting: false
        },
        {
            id: 'Họ tên',
            accessorKey: 'fullName',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Họ tên" />,
            cell: ({ row }) => <div className="w-[200px]">{row.getValue('Họ tên')}</div>
        },
        {
            id: 'Email',
            accessorKey: 'email',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
            cell: ({ row }) => <div className="w-[200px]">{row.getValue('Email')}</div>
        },
        {
            id: 'Thời gian tạo',
            accessorKey: 'createdAt',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Thời gian tạo" />,
            cell: ({ row }) => (
                <div className="w-[150px]">{dayjs(row.original.createdAt).format('DD/MM/YYYY HH:mm:ss')}</div>
            )
        },
        {
            id: 'Trạng thái',
            accessorKey: 'isActive',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
            cell: ({ row }) => {
                const customerType = customerTypes.find(type => type.value === row.getValue('Trạng thái'))
                if (!customerType) return null

                return (
                    <div className="flex w-[150px] items-center">
                        {customerType.icon && <customerType.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{customerType.label}</span>
                    </div>
                )
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
                            <ConfirmationDialog
                                title="Bạn có chắc muốn khóa tài khoản khách hàng này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ khóa tài khoản khách hàng vĩnh viễn trong hệ thống NHT Marine."
                                onConfirm={async () => {
                                    if (hasDeactivateCustomerAccountPermission && row.original.isActive) {
                                        deactivateCustomerAccountMutation.mutateAsync(row.original.customerId)
                                    }
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={!hasDeactivateCustomerAccountPermission || !row.original.isActive}
                                        className="cursor-pointer"
                                    >
                                        Khóa tài khoản
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
