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
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'

export const roleTypes = [
    {
        value: false,
        label: 'Có thể chỉnh sửa',
        icon: CircleCheck
    },
    {
        value: true,
        label: 'Không thể chỉnh sửa',
        icon: CircleX
    }
]

type Options = {
    hasUpdatePermission: boolean
    hasDeletePermission: boolean
    onViewRole: (value: IStaffRole) => void
    onUpdateRole: (value: IStaffRole) => void
    removeRoleMutation: UseMutationResult<any, any, number, any>
}

export const getTableColumns = ({
    hasUpdatePermission,
    hasDeletePermission,
    onViewRole,
    onUpdateRole,
    removeRoleMutation
}: Options) => {
    const columns: ColumnDef<IStaffRole>[] = [
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
            accessorKey: 'roleId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mã vai trò" enableHiding={false} />,
            cell: ({ row }) => <div className="w-[80px]">{row.getValue('roleId')}</div>,
            enableHiding: false,
            filterFn: (row, id, value: (number | string)[]) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            id: 'Tên vai trò',
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên vai trò" />,
            cell: ({ row }) => <div className="w-[200px]">{row.getValue('Tên vai trò')}</div>
        },
        {
            id: 'Loại vai trò',
            accessorKey: 'isImmutable',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Loại vai trò" />,
            cell: ({ row }) => {
                const roleType = roleTypes.find(type => type.value === row.getValue('Loại vai trò'))
                if (!roleType) return null

                return (
                    <div className="flex w-[200px] items-center">
                        {roleType.icon && <roleType.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{roleType.label}</span>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            id: 'Quyền truy cập',
            accessorKey: 'permissions',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Danh sách quyền truy cập" />,
            cell: ({ row }) => {
                const permissions = (row.original.permissions ?? []) as IPermission[]

                return (
                    <div className="flex flex-col items-start space-y-2">
                        {permissions
                            .filter(permission => permission.code.startsWith('ACCESS'))
                            .map((permission, index) => (
                                <span key={index}>{permission.name}</span>
                            ))}
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewRole(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={row.original.isImmutable || !hasUpdatePermission}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (!row.original.isImmutable && hasUpdatePermission) {
                                        onUpdateRole(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn xóa vai trò này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn vai trò khỏi hệ thống NHT Marine."
                                onConfirm={async () => {
                                    if (!row.original.isImmutable && hasDeletePermission) {
                                        removeRoleMutation.mutateAsync(row.original.roleId)
                                    }
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={row.original.isImmutable || !hasDeletePermission}
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
