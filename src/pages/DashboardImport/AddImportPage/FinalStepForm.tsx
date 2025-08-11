import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { Button } from '@/components/ui/button'
import { AddImportData, formSteps } from '@/pages/DashboardImport/AddImportPage'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type FinalStepFormProps = {
    data: AddImportData
    rootProducts: IRootProduct[]
    suppliers: ISupplier[]
    onConfirm: (values: AddImportData) => Promise<void>
    onPrev: () => void
    isLoading: boolean
}

const FinalStepForm = ({ data, rootProducts, suppliers, onConfirm, onPrev, isLoading }: FinalStepFormProps) => {
    const getVariants = (productId: number) => {
        const product = rootProducts.find(rp => rp.rootProductId === productId)
        if (!product) return []

        const combinations = product.variants!.reduce(
            (acc, v) => {
                const res: any = []
                acc.forEach(prefix => {
                    v.options!.forEach(o => {
                        res.push([...prefix, { variant: v.name, ...o }])
                    })
                })
                return res
            },
            [[]]
        )

        return combinations.map((combo: any) => {
            const matchingItem = product.productItems!.find(item =>
                item.attributes?.every(attr => combo.some((c: any) => c.optionId === attr.optionId))
            )

            return {
                productItemId: matchingItem?.productItemId,
                label: combo.map((c: any) => `${c.variant}: ${c.value}`).join(', ')
            }
        })
    }

    const columns: ColumnDef<IProductImport['items'][number]>[] = [
        {
            id: 'product',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Sản phẩm" enableHiding={false} />,
            cell: ({ row }) => {
                const product = rootProducts.find(rp =>
                    rp.productItems?.some(pi => pi.productItemId === row.original.productItemId)
                )

                const variants = getVariants(product!.rootProductId)

                return (
                    <div>
                        <p className="text-base font-medium break-words whitespace-normal">{product?.name}</p>
                        <p className="text-muted-foreground break-words whitespace-normal">
                            <span className="font-medium">Phân loại: </span>
                            {variants.find(v => v.productItemId === row.original.productItemId)?.label}
                        </p>
                    </div>
                )
            },
            enableHiding: false,
            enableSorting: false
        },
        {
            id: 'quantity',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Số lượng" enableHiding={false} className="text-center" />
            ),
            cell: ({ row }) => <p className="text-center">{row.original.quantity.toString().padStart(2, '0')}</p>,
            enableHiding: false,
            enableSorting: false
        },
        {
            id: 'cost',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Đơn giá" enableHiding={false} className="text-center" />
            ),
            cell: ({ row }) => <p className="text-center">{formatCurrency(row.original.cost)}</p>,
            enableHiding: false,
            enableSorting: false
        }
    ]

    return (
        <div>
            <Accordion type="multiple" className="w-full" defaultValue={['item-1']}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                        <div className="flex flex-col">
                            <h4 className="text-lg font-semibold">1. {formSteps[0].title}</h4>
                            <span className="text-muted-foreground text-sm">{formSteps[0].description}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-1 flex-col gap-4 p-4">
                            <div className="text-justify">
                                <span className="text-card-foreground font-medium">1.1. Nhà cung cấp: </span>
                                {suppliers.find(supplier => supplier.supplierId === data.supplierId)?.name}
                            </div>
                            <div className="text-justify">
                                <span className="text-card-foreground font-medium">1.2. Mã hóa đơn: </span>
                                {data.invoiceNumber}
                            </div>
                            <div>
                                <span className="text-card-foreground font-medium">1.3. Ngày nhập hàng: </span>
                                {dayjs(data.importDate).format('DD/MM/YYYY')}
                            </div>
                            <div>
                                <span className="text-card-foreground font-medium">1.4. Tổng số tiền: </span>
                                {formatCurrency(data.items.reduce((acc, curr) => acc + curr.quantity * curr.cost, 0))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                        <div className="flex flex-col">
                            <h4 className="text-lg font-semibold">2. {formSteps[1].title}</h4>
                            <span className="text-muted-foreground text-sm">{formSteps[1].description}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="py-4">
                        <DataTable data={data.items ?? []} columns={columns} disablePagination />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={onPrev}
                    className="h-12 rounded text-base capitalize"
                >
                    Quay về bước trước
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        if (!isLoading) onConfirm(data)
                    }}
                    className="h-12 rounded text-base capitalize"
                >
                    {isLoading ? 'Đang tải...' : 'Tạo đơn nhập hàng'}
                </Button>
            </div>
        </div>
    )
}

export default FinalStepForm
