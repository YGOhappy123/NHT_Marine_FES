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
import formatCurrency from '@/utils/formatCurrency'

export const couponTypes = [
    {
        value: 'Fixed',
        label: 'Cố định',
        icon: CircleX
    },
    {
        value: 'Percentage',
        label: 'Theo phần trăm',
        icon: CircleCheck
    }
]
export const couponStatuses = [
    {
        value: false,
        label: 'Hết hiệu lực',
        icon: CircleX
    },
    {
        value: true,
        label: 'Còn hiệu lực',
        icon: CircleCheck
    }
]

type Options = {
    hasUpdatePermission: boolean
    hasDisablePermission: boolean
    onViewCoupon: (value: ICoupon) => void
    onUpdateCoupon: (value: ICoupon) => void
    disableCouponMutation: UseMutationResult<any, any, number, any>
}

export const getTableColumns = ({
    hasUpdatePermission,
    hasDisablePermission,
    onViewCoupon,
    onUpdateCoupon,
    disableCouponMutation
}: Options) => {
    const columns: ColumnDef<ICoupon>[] = [
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
            accessorKey: 'couponId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mã phiếu" enableHiding={false} />,
            cell: ({ row }) => <div className="w-[80px]">{row.getValue('couponId')}</div>,
            enableHiding: false,
            filterFn: (row, id, value: (number | string)[]) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            id: 'Code giảm giá',
            accessorKey: 'code',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Code giảm giá" />,
            cell: ({ row }) => (
                <div className="flex w-[150px] flex-col gap-2 break-words whitespace-normal">
                    {row.getValue('Code giảm giá')}
                </div>
            )
        },
        {
            id: 'Giá trị giảm',
            accessorKey: 'amount',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Giá trị giảm" />,
            cell: ({ row }) => {
                const type = row.original.type
                const amount = row.original.amount

                return (
                    <div className="flex w-[150px] flex-col gap-2 break-words whitespace-normal">
                        {type === 'Fixed' ? formatCurrency(amount) : `${amount} %`}
                    </div>
                )
            }
        },
        {
            id: 'SL tối đa',
            accessorKey: 'maxUsage',
            header: ({ column }) => <DataTableColumnHeader column={column} title="SL tối đa" />,
            cell: ({ row }) => (
                <div className="flex w-[100px] flex-col gap-2 break-words whitespace-normal">
                    {row.getValue('SL tối đa') || <i>Không giới hạn</i>}
                </div>
            )
        },
        {
            id: 'Hạn sử dụng',
            accessorKey: 'expiredAt',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Hạn sử dụng" />,
            cell: ({ row }) => (
                <div className="flex w-[150px] flex-col gap-2 break-words whitespace-normal">
                    {dayjs(row.getValue('Hạn sử dụng')).format('DD/MM/YYYY HH:mm:ss')}
                </div>
            )
        },
        {
            id: 'Trạng thái',
            accessorKey: 'isActive',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
            cell: ({ row }) => {
                const couponStatus = couponStatuses.find(type => type.value === row.getValue('Trạng thái'))
                if (!couponStatus) return null

                return (
                    <div className="flex w-[150px] items-center">
                        {couponStatus.icon && <couponStatus.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{couponStatus.label}</span>
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
                            {(row.original.createdByStaff as Partial<IStaff> | undefined)?.fullName}
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewCoupon(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={!hasUpdatePermission || !row.original.isActive}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (hasUpdatePermission && row.original.isActive) {
                                        onUpdateCoupon(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn khóa phiếu giảm giá này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ khóa phiếu giảm giá trong hệ thống NHT Marine."
                                onConfirm={async () => {
                                    if (hasDisablePermission && row.original.isActive) {
                                        disableCouponMutation.mutateAsync(row.original.couponId)
                                    }
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={!hasDisablePermission || !row.original.isActive}
                                        className="cursor-pointer"
                                    >
                                        Khóa phiếu
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
