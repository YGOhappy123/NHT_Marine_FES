import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import dayjs from '@/libs/dayjs'
import formatCurrency from '@/utils/formatCurrency'

type UndistributedImportCardProps = {
    productImport: IProductImport
    onDistributeImport: (productImport: IProductImport) => void
}

const UndistributedImportCard = ({ productImport, onDistributeImport }: UndistributedImportCardProps) => {
    return (
        <Card className="col-span-6 lg:col-span-3 xl:col-span-2">
            <CardHeader className="flex items-center justify-between gap-12">
                <div className="flex flex-col justify-center gap-1">
                    <CardTitle className="text-xl">Chi tiết đơn nhập hàng</CardTitle>
                    <CardDescription>Mã đơn nhập hàng: {productImport.importId}</CardDescription>
                    <CardDescription>
                        Ngày tạo đơn: {dayjs(productImport.trackedAt).format('DD/MM/YYYY HH:mm:ss')}
                    </CardDescription>
                </div>
            </CardHeader>

            <Separator />
            <CardContent>
                <div className="flex flex-col gap-4 break-words whitespace-normal">
                    <p>
                        <span className="font-semibold">Nhà cung cấp: </span>
                        <span className="text-muted-foreground">{productImport.supplier?.name}</span>
                    </p>
                    <p>
                        <span className="font-semibold">Mã hóa đơn: </span>
                        <span className="text-muted-foreground">{productImport.invoiceNumber}</span>
                    </p>
                    <p>
                        <span className="font-semibold">Ngày nhập hàng: </span>
                        <span className="text-muted-foreground">
                            {dayjs(productImport.importDate).format('DD/MM/YYYY')}
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold">Tổng số tiền: </span>
                        <span className="text-muted-foreground">{formatCurrency(productImport.totalCost)}</span>
                    </p>
                    <Separator />

                    <p>
                        <span className="font-semibold">Nhân viên tạo đơn: </span>
                    </p>
                    <div className="flex items-start gap-4">
                        <div className="border-primary flex w-[60px] items-center justify-center overflow-hidden rounded-lg border-2 p-1">
                            <img
                                src={productImport.trackedByStaff?.avatar}
                                alt="product item image"
                                className="aspect-square h-full w-full rounded-sm object-cover"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-base font-semibold">
                                Mã số {productImport.trackedByStaff?.staffId} - {productImport.trackedByStaff?.fullName}
                            </p>
                            <p className="text-muted-foreground font-semibold">
                                Email: <span className="font-normal">{productImport.trackedByStaff?.email}</span>
                            </p>
                        </div>
                    </div>
                    <Separator />

                    <p>
                        <span className="font-semibold">Danh sách sản phẩm: </span>
                    </p>
                    <div className="max-h-[300px] overflow-y-auto">
                        {productImport.items.map((item, index) => (
                            <div key={item.productItemId}>
                                <ImportItem item={item} />
                                {index < (productImport.items ?? []).length - 1 && <Separator className="my-2" />}
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" size="lg" onClick={() => onDistributeImport(productImport)}>
                        Phân vào kho
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

type ImportItemProps = {
    item: IProductImport['items'][number]
}

const ImportItem = ({ item }: ImportItemProps) => {
    return (
        <div className="flex items-start gap-4">
            <div className="border-primary flex w-[60px] items-center justify-center overflow-hidden rounded-lg border-2 p-1">
                <img
                    src={item.productItem?.imageUrl}
                    alt="product item image"
                    className="aspect-square h-full w-full rounded-sm object-cover"
                />
            </div>

            <div className="flex flex-col gap-1">
                <p className="text-base font-semibold">
                    Mã số {item.productItem?.rootProduct?.rootProductId} - {item.productItem?.rootProduct?.name}
                </p>
                <p className="text-muted-foreground font-semibold">
                    Phân loại:{' '}
                    <span className="font-normal">
                        {item.productItem?.attributes.map(attr => `${attr.variant}: ${attr.option}`).join(', ')}
                    </span>
                </p>
                <p className="text-muted-foreground font-semibold">
                    Số lượng: <span className="font-normal">{item.quantity.toString().padStart(2, '0')}</span>
                </p>
            </div>
        </div>
    )
}

export default UndistributedImportCard
