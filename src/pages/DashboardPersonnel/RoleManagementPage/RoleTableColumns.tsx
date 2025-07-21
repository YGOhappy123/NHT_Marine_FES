import { ColumnDef } from '@tanstack/react-table'
import { CircleCheck, CircleX } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import ActionsTableCell from '@/pages/DashboardPersonnel/RoleManagementPage/ActionsTableCell'

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

export const columns: ColumnDef<IStaffRole>[] = [
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
        enableHiding: false
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
            const permissions = (row.original.permissions ?? []) as any

            return (
                <div className="flex flex-col items-start space-y-2">
                    {permissions
                        .filter((permission: any) => permission.code.startsWith('ACCESS'))
                        .map((permission: any, index: number) => (
                            <span key={index}>{permission.name}</span>
                        ))}
                </div>
            )
        },
        enableSorting: false
    },
    {
        id: 'actions',
        header: 'Hành động',
        cell: ({ row }) => <ActionsTableCell role={row.original} />
    }
]
