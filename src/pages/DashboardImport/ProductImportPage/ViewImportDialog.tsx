import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { formSteps } from '@/pages/DashboardImport/AddImportPage'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type ViewImportDialogProps = {
    productImport: IProductImport | null
    open: boolean
    setOpen: (value: boolean) => void
}

const ViewImportDialog = ({ productImport, open, setOpen }: ViewImportDialogProps) => {
    const columns: ColumnDef<IProductImport['items'][number]>[] = [
        {
            id: 'product',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Sản phẩm" enableHiding={false} />,
            cell: ({ row }) => {
                return (
                    <div>
                        <p className="text-base font-medium break-words whitespace-normal">
                            {row.original.productItem?.rootProduct.name}
                        </p>
                        <p className="text-muted-foreground break-words whitespace-normal">
                            <span className="font-medium">Phân loại: </span>
                            {row.original.productItem?.attributes
                                .map(attr => `${attr.variant}: ${attr.option}`)
                                .join(', ')}
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thông tin đơn nhập hàng</DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết về nhà cung cấp, ngày, số tiền và các sản phẩm của đơn nhập hàng.
                    </DialogDescription>
                </DialogHeader>
                <Separator />

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
                                    {productImport?.supplier?.name}
                                </div>
                                <div className="text-justify">
                                    <span className="text-card-foreground font-medium">1.2. Mã hóa đơn: </span>
                                    {productImport?.invoiceNumber}
                                </div>
                                <div>
                                    <span className="text-card-foreground font-medium">1.3. Ngày nhập hàng: </span>
                                    {dayjs(productImport?.importDate).format('DD/MM/YYYY')}
                                </div>
                                <div>
                                    <span className="text-card-foreground font-medium">1.4. Tổng số tiền: </span>
                                    {formatCurrency(productImport?.totalCost)}
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
                        <AccordionContent className="max-h-[200px] overflow-y-auto py-4">
                            <DataTable data={productImport?.items ?? []} columns={columns} disablePagination />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Separator />

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ViewImportDialog
