import { useState } from 'react'
import { UseMutationResult } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { CircleDollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ChooseInventoryDialog from '@/pages/DashboardOrder/OrderManagementPage/ChooseInventoryDialog'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type OrderCardProps = {
    order: IOrder
    hasPermission: boolean
    chooseInventoryMutation: UseMutationResult<
        any,
        any,
        {
            orderId: number
            data: {
                statusId: number
                inventories: {
                    productItemId: number
                    storages: {
                        storageId: number
                        quantity: number
                    }[]
                }[]
            }
        },
        any
    >
    updateStatusMutation: UseMutationResult<
        any,
        any,
        {
            orderId: number
            data: { statusId: number }
        },
        any
    >
}

const OrderCard = ({ order, hasPermission, chooseInventoryMutation, updateStatusMutation }: OrderCardProps) => {
    const orderItemColumns: ColumnDef<IOrder['items'][number]>[] = [
        {
            id: 'product',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Sản phẩm" enableHiding={false} />,
            cell: ({ row }) => (
                <div>
                    <p className="text-base font-medium break-words whitespace-normal">
                        {row.original.productItem.rootProduct.name}
                    </p>
                    <p className="text-muted-foreground break-words whitespace-normal">
                        <span className="font-medium">Phân loại: </span>
                        {row.original.productItem.attributes.map(attr => `${attr.variant}: ${attr.option}`).join(', ')}
                    </p>
                </div>
            ),
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
            id: 'price',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Đơn giá" enableHiding={false} className="text-center" />
            ),
            cell: ({ row }) => <p className="text-center">{formatCurrency(row.original.price)}</p>,
            enableHiding: false,
            enableSorting: false
        }
    ]

    const updateLogColumns: ColumnDef<IOrder['updateLogs'][number]>[] = [
        {
            id: 'logId',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Mã log" enableHiding={false} />,
            cell: ({ row }) => <p>{row.original.logId}</p>,
            enableHiding: false,
            enableSorting: false
        },
        {
            id: 'updatedBy',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Nhân viên thực hiện" enableHiding={false} />
            ),
            cell: ({ row }) => (
                <div>
                    <p className="text-base font-medium break-words whitespace-normal">
                        {row.original.updatedByStaff?.fullName}
                    </p>
                    <p className="text-muted-foreground break-words whitespace-normal">
                        <span className="font-medium">Mã nhân viên: </span>
                        {row.original.updatedBy}
                    </p>
                    <p className="text-muted-foreground break-words whitespace-normal">
                        <span className="font-medium">Email: </span>
                        {row.original.updatedByStaff?.email}
                    </p>
                </div>
            ),
            enableHiding: false,
            enableSorting: false
        },
        {
            id: 'updatedAt',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Cập nhật lúc" enableHiding={false} />,
            cell: ({ row }) => <p>{dayjs(row.original.updatedAt).format('HH:mm:ss - DD/MM/YYYY')}</p>,
            enableHiding: false,
            enableSorting: false
        },
        {
            id: 'status',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Trạng thái mới"
                    enableHiding={false}
                    className="text-center"
                />
            ),
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge>{row.original.status?.name}</Badge>
                </div>
            ),
            enableHiding: false,
            enableSorting: false
        }
    ]

    const isDelivery = order.deliveryAddress != null
    const [inventoryDialogOpen, setInventoryDialogOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<IOrderStatus>(order.orderStatus)

    const handleProcessOrder = async (newStatus: IOrderStatus) => {
        if (order.orderStatus.isDefaultState && !newStatus.isUnfulfilled) {
            setSelectedStatus(newStatus)
            setInventoryDialogOpen(true)
        } else {
            if (order.orderStatus.isUnfulfilled) return
            await updateStatusMutation.mutateAsync({
                orderId: order.orderId,
                data: { statusId: newStatus.statusId }
            })
        }
    }

    return (
        <>
            <ChooseInventoryDialog
                selectedStatus={selectedStatus}
                open={inventoryDialogOpen}
                setOpen={setInventoryDialogOpen}
                desireProducts={order.items.map(item => ({
                    productItemId: item.productItemId,
                    quantity: item.quantity
                }))}
                orderItems={order.items}
                chooseInventoryMutation={chooseInventoryMutation}
                orderId={order.orderId}
            />

            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Thông tin đơn hàng mã: {order.orderId}</CardTitle>
                    <CardDescription>
                        Đặt lúc {dayjs(order.createdAt).format('HH:mm:ss ngày DD/MM/YYYY')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-primary-foreground border-primary mx-auto mb-2 flex w-fit items-center justify-center gap-6 rounded-full border-4 px-6">
                        <span className="text-primary py-2 text-xl font-semibold">{order.orderStatus.name}</span>
                        <div className="border-primary h-12 border-l-4"></div>
                        <span className="text-primary py-2 text-xl font-semibold">
                            {formatCurrency(order.totalAmount)}
                        </span>
                    </div>

                    <Accordion type="multiple" className="w-full" defaultValue={['item-1', 'item-2']}>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                                <div className="flex flex-col">
                                    <h4 className="text-lg font-semibold">1. Thông tin khách hàng</h4>
                                    <span className="text-muted-foreground text-sm">
                                        Thông tin về tài khoản khách hàng đã tạo đơn.
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex gap-12 p-4">
                                    <div className="border-primary flex w-full max-w-[100px] items-center justify-center rounded-full border-4 p-1">
                                        <img
                                            src={order.customer.avatar || '/images/upload-icon.jpg'}
                                            className="bg-primary-foreground aspect-square h-full w-full rounded-full object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col gap-4 text-base">
                                        <div className="text-card-foreground">
                                            <span className="font-medium">1.1. Họ và tên: </span>
                                            {order.customer.fullName}
                                        </div>
                                        <div className="text-card-foreground">
                                            <span className="font-medium">1.2. Email: </span>
                                            {order.customer.email ?? '(Chưa cập nhật)'}
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                                <div className="flex flex-col">
                                    <h4 className="text-lg font-semibold">2. Thông tin đơn hàng</h4>
                                    <span className="text-muted-foreground text-sm">
                                        Số lượng và chi tiết phân loại các sản phẩm trong đơn hàng.
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="py-4">
                                <DataTable data={order.items ?? []} columns={orderItemColumns} disablePagination />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                                <div className="flex flex-col">
                                    <h4 className="text-lg font-semibold">3. Thông tin nhận hàng</h4>
                                    <span className="text-muted-foreground text-sm">
                                        Phương thức nhận hàng và thông tin vận chuyển (nếu có).
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-1 flex-col gap-4 p-4 text-base">
                                <div className="text-card-foreground flex justify-between gap-6">
                                    <span className="font-medium">3.1. Phương thức nhận hàng: </span>
                                    <span>
                                        {isDelivery ? 'Vận chuyển qua đường bưu điện.' : 'Nhận trực tiếp tại cửa hàng.'}
                                    </span>
                                </div>

                                {isDelivery && (
                                    <>
                                        <div className="text-card-foreground flex justify-between gap-10">
                                            <span className="shrink-0 font-medium">3.2. Họ và tên người nhận: {}</span>
                                            <span className="text-end">{order.recipientName}</span>
                                        </div>
                                        <div className="text-card-foreground flex justify-between gap-10">
                                            <span className="font-medium">3.3. Số điện thoại người nhận: {}</span>
                                            <span className="text-end">{order.deliveryPhone}</span>
                                        </div>
                                        <div className="text-card-foreground flex justify-between gap-10">
                                            <span className="shrink-0 font-medium">3.4. Địa chỉ nhận hàng: {}</span>
                                            <span className="text-end">{order.deliveryAddress}</span>
                                        </div>
                                    </>
                                )}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4">
                            <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                                <div className="flex flex-col">
                                    <h4 className="text-lg font-semibold">4. Thông tin khác</h4>
                                    <span className="text-muted-foreground text-sm">
                                        Thông tin về ghi chú và mã giảm giá (nếu có).
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-1 flex-col gap-4 p-4 text-base">
                                <div className="text-card-foreground flex justify-between gap-10">
                                    <span className="shrink-0 font-medium">4.1. Ghi chú đơn hàng: {}</span>
                                    <span className="text-end">{order.note ?? <i>(Không có)</i>}</span>
                                </div>

                                {order.coupon != null ? (
                                    <>
                                        <div className="text-card-foreground flex justify-between gap-10">
                                            <span className="shrink-0 font-medium">4.2. Mã giảm giá: {}</span>
                                            <Badge variant="default">
                                                <CircleDollarSign /> {order.coupon.code.toUpperCase()} -{' '}
                                                {order.coupon.type === 'Fixed'
                                                    ? formatCurrency(order.coupon.amount)
                                                    : `${order.coupon.amount}%`}
                                            </Badge>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-card-foreground flex justify-between gap-10">
                                        <span className="shrink-0 font-medium">4.2. Mã giảm giá: {}</span>
                                        <span className="text-end">
                                            <i>(Không có)</i>
                                        </span>
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-5">
                            <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                                <div className="flex flex-col">
                                    <h4 className="text-lg font-semibold">5. Thông tin trạng thái</h4>
                                    <span className="text-muted-foreground text-sm">
                                        Thông tin về lịch sử cập nhật trạng thái của đơn hàng.
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="py-4">
                                <DataTable data={order.updateLogs ?? []} columns={updateLogColumns} disablePagination />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {hasPermission && order.transitions.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2">
                            {order.transitions.map(item => (
                                <Tooltip key={item.transitionId}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="lg"
                                            variant={
                                                item.toStatus?.isUnfulfilled
                                                    ? 'destructive'
                                                    : item.toStatus?.isAccounted
                                                      ? 'success'
                                                      : 'default'
                                            }
                                            onClick={() => handleProcessOrder(item.toStatus as IOrderStatus)}
                                        >
                                            {item.transitionLabel}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[200px]">
                                        <p className="text-center">{item.toStatus?.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

export default OrderCard
