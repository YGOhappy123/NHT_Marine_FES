import { ColumnDef } from '@tanstack/react-table'
import { BadgeAlert, BadgeCheck, BadgeDollarSign } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import dayjs from '@/libs/dayjs'
import formatCurrency from '@/utils/formatCurrency'

type HighestOrderAmountTableProps = {
    customers: ICustomer & { orderAmount: number }[]
}

const HighestOrderAmountTable = ({ customers }: HighestOrderAmountTableProps) => {
    const columns: ColumnDef<ICustomer & { orderAmount: number }>[] = [
        {
            id: 'customerId',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Mã khách hàng" enableHiding={false} />
            ),
            cell: ({ row }) => row.original.customerId,
            enableHiding: false,
            enableSorting: false
        },
        {
            id: 'avatar',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Ảnh đại diện"
                    enableHiding={false}
                    className="text-center"
                />
            ),
            cell: ({ row }) => (
                <div className="flex w-full justify-center">
                    <div className="border-primary flex w-full max-w-[80px] items-center justify-center rounded-full border-3 p-1">
                        <img
                            src={row.original.avatar}
                            className="bg-primary-foreground aspect-square h-full w-full rounded-full object-cover"
                        />
                    </div>
                </div>
            ),
            enableHiding: false,
            enableSorting: false
        },
        {
            id: 'customerData',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Thông tin khách hàng" enableHiding={false} />
            ),
            cell: ({ row }) => (
                <div>
                    <p className="text-base font-medium break-words whitespace-normal">{row.original.fullName}</p>

                    <p className="text-muted-foreground break-words whitespace-normal">
                        <span className="font-medium">Email: </span>
                        {row.original.email ?? <i>Không có</i>}
                    </p>
                </div>
            ),
            enableHiding: false,
            enableSorting: false
        },
        {
            id: 'createdAt',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" enableHiding={false} />,
            cell: ({ row }) => (
                <p className="break-words whitespace-normal">
                    {dayjs(row.original.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                </p>
            ),
            enableHiding: false,
            enableSorting: false
        },
        {
            id: 'orderAmount',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Tổng số tiền"
                    className="flex justify-center"
                    enableHiding={false}
                />
            ),
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                        <BadgeDollarSign /> {formatCurrency(row.original.orderAmount)}
                    </Badge>
                </div>
            ),
            enableHiding: false,
            enableSorting: false
        },
        {
            id: 'isActive',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Trạng thái hoạt động"
                    className="flex justify-center"
                    enableHiding={false}
                />
            ),
            cell: ({ row }) => (
                <div className="flex justify-center">
                    {row.original.isActive ? (
                        <Badge variant="default">
                            <BadgeCheck /> Còn hoạt động
                        </Badge>
                    ) : (
                        <Badge variant="destructive">
                            <BadgeAlert /> Đã khóa tài khoản
                        </Badge>
                    )}
                </div>
            ),
            enableHiding: false,
            enableSorting: false
        }
    ]

    return (
        <div>
            <div className="mb-4 flex flex-col items-center gap-1.5">
                <h4 className="text-xl font-semibold">Top 5 khách hàng có tổng giá trị đơn hàng cao nhẩt</h4>
                <span className="text-muted-foreground text-sm">Chỉ tính trên các đơn hàng đã thu tiền.</span>
            </div>

            <DataTable data={customers} columns={columns as any} disablePagination />
        </div>
    )
}

export default HighestOrderAmountTable
