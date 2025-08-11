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

export const promotionTypes = [
    {
        value: false,
        label: 'Hết hiệu lực',
        icon: CircleX
    },
    {
        value: true,
        label: 'Đang hoạt động',
        icon: CircleCheck
    }
]

type Options = {
    hasUpdatePermission: boolean
    hasDisablePermission: boolean
    onViewPromotion: (value: IPromotion) => void
    onUpdatePromotion: (value: IPromotion) => void
    disablePromotionMutation: UseMutationResult<any, any, number, any>
}

export const getTableColumns = ({
    hasUpdatePermission,
    hasDisablePermission,
    onViewPromotion,
    onUpdatePromotion,
    disablePromotionMutation
}: Options) => {
    const columns: ColumnDef<IPromotion>[] = [
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
            accessorKey: 'promotionId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mã CT" enableHiding={false} />,
            cell: ({ row }) => <div className="w-[80px]">{row.getValue('promotionId')}</div>,
            enableHiding: false,
            filterFn: (row, id, value: (number | string)[]) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            id: 'Tên chương trình',
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên chương trình" />,
            cell: ({ row }) => (
                <div className="flex w-[200px] flex-col gap-2 break-words whitespace-normal">
                    {row.getValue('Tên chương trình')}
                </div>
            )
        },
        {
            id: 'Giảm giá',
            accessorKey: 'discountRate',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Giảm giá" />,
            cell: ({ row }) => (
                <div className="flex w-[100px] flex-col gap-2 break-words whitespace-normal">
                    {row.getValue('Giảm giá')}%
                </div>
            )
        },
        {
            id: 'Thời gian',
            accessorKey: 'date',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Thời gian" />,
            cell: ({ row }) => {
                return (
                    <div className="flex w-[200px] flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Bắt đầu:</span>
                            <span>{dayjs(row.original.startDate).format('DD/MM/YYYY HH:mm:ss')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-medium">Kết thúc:</span>
                            <span>{dayjs(row.original.endDate).format('DD/MM/YYYY HH:mm:ss')}</span>
                        </div>
                    </div>
                )
            },
            enableSorting: false
        },
        {
            id: 'Trạng thái',
            accessorKey: 'isActive',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
            cell: ({ row }) => {
                const promotionType = promotionTypes.find(type => type.value === row.getValue('Trạng thái'))
                if (!promotionType) return null

                return (
                    <div className="flex w-[150px] items-center">
                        {promotionType.icon && <promotionType.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                        <span>{promotionType.label}</span>
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewPromotion(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={!hasUpdatePermission || !row.original.isActive}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (hasUpdatePermission && row.original.isActive) {
                                        onUpdatePromotion(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn kết thúc chương trình này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ kết thúc chương trình trong hệ thống NHT Marine."
                                onConfirm={async () => {
                                    if (hasDisablePermission && row.original.isActive) {
                                        disablePromotionMutation.mutateAsync(row.original.promotionId)
                                    }
                                }}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        disabled={!hasDisablePermission || !row.original.isActive}
                                        className="cursor-pointer"
                                    >
                                        Kết thúc CT
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
