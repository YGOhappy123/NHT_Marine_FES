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
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import dayjs from 'dayjs'

export const staffTypes = [
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
    hasUpdateInfoPermission: boolean
    hasChangeRolePermission: boolean
    hasDeactivateAccountPermission: boolean
    onViewStaff: (value: IStaff) => void
    onUpdateStaffInfo: (value: IStaff) => void
    onChangeStaffRole: (value: IStaff) => void
    deactivateStaffAccountMutation: UseMutationResult<any, any, number, any>
    user: IStaff | null
}

export const getTableColumns = ({
    hasUpdateInfoPermission,
    hasChangeRolePermission,
    hasDeactivateAccountPermission,
    onViewStaff,
    onUpdateStaffInfo,
    onChangeStaffRole,
    deactivateStaffAccountMutation,
    user
}: Options) => {
    const columns: ColumnDef<IStaff>[] = [
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
            accessorKey: 'staffId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mã NV" enableHiding={false} />,
            cell: ({ row }) => <div className="w-[50px]">{row.getValue('staffId')}</div>,
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
            id: 'Thông tin nhân viên',
            accessorKey: 'fullName',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Thông tin nhân viên" />,
            cell: ({ row }) => (
                <div className="flex flex-col gap-2 break-words whitespace-normal">
                    <p>
                        <span className="font-semibold">Họ và tên: </span>
                        {row.original.fullName}
                    </p>
                    <p>
                        <span className="font-semibold">Email: </span>
                        {row.original.email}
                    </p>
                </div>
            )
        },
        {
            id: 'Vai trò',
            accessorKey: 'role',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Vai trò" />,
            cell: ({ row }) => <div className="w-[200px]">{(row.original.role as IStaffRole).name}</div>
        },
        {
            id: 'Trạng thái',
            accessorKey: 'isActive',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
            cell: ({ row }) => {
                const staffType = staffTypes.find(type => type.value === row.getValue('Trạng thái'))
                if (!staffType) return null

                return (
                    <div className="flex w-[150px] items-center">
                        {staffType.icon && <staffType.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{staffType.label}</span>
                    </div>
                )
            }
        },
        {
            id: 'Thông tin người tạo',
            accessorKey: 'createdBy',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Thông tin người tạo" />,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-2 break-words whitespace-normal">
                        <p>
                            <span className="font-semibold">Người tạo: </span>
                            {(row.original.createdByStaff as Partial<IStaff> | undefined)?.fullName || <i>Không có</i>}
                        </p>
                        <p>
                            <span className="font-semibold">Ngày tạo: </span>
                            {dayjs(row.original.createdAt).format('DD/MM/YYYY HH:mm:ss')}
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewStaff(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={
                                    (row.original.role as Partial<IStaffRole>).isImmutable ||
                                    !hasChangeRolePermission ||
                                    !row.original.isActive
                                }
                                className="cursor-pointer"
                                onClick={() => {
                                    if (
                                        (row.original.role as Partial<IStaffRole>).isImmutable ||
                                        !hasChangeRolePermission ||
                                        !row.original.isActive
                                    )
                                        return

                                    onChangeStaffRole(row.original)
                                }}
                            >
                                Thay đổi vai trò
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={
                                    (row.original.role as Partial<IStaffRole>).isImmutable ||
                                    !hasUpdateInfoPermission ||
                                    !row.original.isActive
                                }
                                className="cursor-pointer"
                                onClick={() => {
                                    if (
                                        (row.original.role as Partial<IStaffRole>).isImmutable ||
                                        !hasUpdateInfoPermission ||
                                        !row.original.isActive
                                    )
                                        return

                                    onUpdateStaffInfo(row.original)
                                }}
                            >
                                Chỉnh sửa thông tin
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn khóa tài khoản nhân viên này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ khóa tài khoản nhân viên vĩnh viễn trong hệ thống NHT Marine."
                                onConfirm={async () => {
                                    if (
                                        (row.original.role as Partial<IStaffRole>).isImmutable ||
                                        row.original.staffId === user?.staffId ||
                                        !row.original.isActive ||
                                        !hasDeactivateAccountPermission
                                    )
                                        return

                                    await deactivateStaffAccountMutation.mutateAsync(row.original.staffId)
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={
                                            (row.original.role as Partial<IStaffRole>).isImmutable ||
                                            row.original.staffId === user?.staffId ||
                                            !row.original.isActive ||
                                            !hasDeactivateAccountPermission
                                        }
                                        className="cursor-pointer"
                                    >
                                        Khóa tài khoản
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
