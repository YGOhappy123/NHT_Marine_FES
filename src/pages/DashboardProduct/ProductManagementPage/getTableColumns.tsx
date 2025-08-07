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
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import striptags from 'striptags'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type Options = {
    hasUpdateInfoPermission: boolean
    hasUpdateItemsPermission: boolean
    hasDeletePermission: boolean
    onViewProduct: (value: IRootProduct) => void
    onUpdateProductInfo: (value: IRootProduct) => void
    onUpdateProductItems: (value: IRootProduct) => void
    removeProductMutation: UseMutationResult<any, any, number, any>
}

export const getTableColumns = ({
    hasUpdateInfoPermission,
    hasUpdateItemsPermission,
    hasDeletePermission,
    onViewProduct,
    onUpdateProductInfo,
    onUpdateProductItems,
    removeProductMutation
}: Options) => {
    const columns: ColumnDef<IRootProduct>[] = [
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
            accessorKey: 'rootProductId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mã sản phẩm" enableHiding={false} />,
            cell: ({ row }) => <div className="w-[80px]">{row.getValue('rootProductId')}</div>,
            enableHiding: false,
            filterFn: (row, id, value: (number | string)[]) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            id: 'Ảnh sản phẩm',
            accessorKey: 'imageUrl',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ảnh sản phẩm" />,
            cell: ({ row }) => (
                <div className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-full border-3 p-1">
                    <img
                        src={row.getValue('Ảnh sản phẩm')}
                        alt="product image"
                        className="aspect-square h-full w-full rounded-full object-cover"
                    />
                </div>
            ),
            enableSorting: false
        },
        {
            id: 'Thông tin sản phẩm',
            accessorKey: 'name',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Thông tin sản phẩm" enableHiding={false} />
            ),
            cell: ({ row }) => {
                const prices = (row.original.productItems ?? [{ price: 0 }]).map(item => item.price ?? 0)
                const minPrice = Math.min(...prices)
                const maxPrice = Math.max(...prices)

                return (
                    <div className="flex max-w-[300px] flex-col gap-2 break-words whitespace-normal">
                        <p>
                            <span className="font-semibold">Tên: </span>
                            {row.original.name}
                        </p>
                        <p>
                            <span className="font-semibold">Giá tiền: </span>
                            {minPrice !== maxPrice
                                ? `Từ ${formatCurrency(minPrice)} đến ${formatCurrency(maxPrice)}`
                                : formatCurrency(minPrice)}
                        </p>
                        <p className="line-clamp-3">
                            <span className="font-semibold">Mô tả: </span>
                            {striptags(row.original.description)}
                        </p>
                    </div>
                )
            },
            enableHiding: false
        },
        {
            id: 'Thông tin danh mục',
            accessorKey: 'categoryId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Thông tin danh mục" />,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-2 break-words whitespace-normal">
                        <p>
                            <span className="font-semibold">Mã danh mục: </span>
                            {row.original.categoryId}
                        </p>
                        <p>
                            <span className="font-semibold">Tên danh mục: </span>
                            {(row.original.category as Partial<ICategory> | undefined)?.name}
                        </p>
                    </div>
                )
            },
            enableSorting: false
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
            id: 'Tồn kho',
            accessorFn: row => {
                return (row.productItems ?? [{ stock: 0 }]).reduce((total, item) => total + (item.stock ?? 0), 0)
            },
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Tồn kho" className="justify-center" />
            ),
            cell: ({ getValue }) => {
                const totalStock = getValue<number>()
                return <div className="text-center">{totalStock}</div>
            },
            enableColumnFilter: true
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onViewProduct(row.original)}>
                                Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={!hasUpdateInfoPermission}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (hasUpdateInfoPermission) {
                                        onUpdateProductInfo(row.original)
                                    }
                                }}
                            >
                                Chỉnh sửa thông tin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={!hasUpdateItemsPermission}
                                className="cursor-pointer"
                                onClick={() => {
                                    if (hasUpdateItemsPermission) {
                                        onUpdateProductItems(row.original)
                                    }
                                }}
                            >
                                Thay đổi giá
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmationDialog
                                title="Bạn có chắc muốn xóa vai trò này?"
                                description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn vai trò khỏi hệ thống NHT Marine."
                                onConfirm={async () => {
                                    if (hasDeletePermission) {
                                        removeProductMutation.mutateAsync(row.original.rootProductId)
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
