import { ColumnDef } from '@tanstack/react-table'
import { BadgeAlert, BadgeCheck } from 'lucide-react'
import { sections } from '@/pages/DashboardProduct/ProductDetailPage/TableOfContents'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import dayjs from '@/libs/dayjs'

type ProductPromotionsCardProps = {
    product: IRootProduct
}

const ProductPromotionsCard = ({ product }: ProductPromotionsCardProps) => {
    const section = sections.promotions
    const columns: ColumnDef<Partial<IPromotion>>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Khuyến mãi" enableHiding={false} />,
            cell: ({ row }) => (
                <p className="break-words whitespace-normal">
                    {row.original.promotionId} - {row.original.name} - {row.original.discountRate}%
                </p>
            ),
            enableHiding: false
        },
        {
            accessorKey: 'applyTime',
            header: 'Thời gian áp dụng',
            cell: ({ row }) => (
                <div className="flex flex-col gap-2">
                    <p>
                        <span className="font-semibold">Bắt đầu: </span>
                        {dayjs(row.original.startDate).format('DD/MM/YYYY')}
                    </p>
                    <p>
                        <span className="font-semibold">Kết thúc: </span>
                        {dayjs(row.original.endDate).format('DD/MM/YYYY')}
                    </p>
                </div>
            )
        },
        {
            accessorKey: 'priority',
            header: () => <div className="text-center">Ưu tiên áp dụng</div>,
            cell: ({ row }) => {
                const isTopPriority = row.index === 0

                return (
                    <div className="flex justify-center">
                        {isTopPriority ? (
                            <Badge variant="default">
                                <BadgeCheck /> Ưu tiên
                            </Badge>
                        ) : (
                            <Badge variant="destructive">
                                <BadgeAlert /> Không
                            </Badge>
                        )}
                    </div>
                )
            }
        }
    ]

    return (
        <Card className="w-full max-w-4xl" id={section.id}>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription>
                    Thông tin về các chương trình khuyến mãi đang áp dụng cho sản phẩm này.
                    <br />
                    (Không bao gồm các khuyến mãi đã bị khóa).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    renderToolbar={table => (
                        <Input
                            placeholder="Tìm khuyến mãi theo tên..."
                            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                            onChange={event => table.getColumn('name')?.setFilterValue(event.target.value)}
                            className="text-foreground caret-foreground h-8 w-[150px] md:w-[200px] lg:w-[250px]"
                        />
                    )}
                    data={product.promotions ?? []}
                    columns={columns}
                />
            </CardContent>
        </Card>
    )
}

export default ProductPromotionsCard
