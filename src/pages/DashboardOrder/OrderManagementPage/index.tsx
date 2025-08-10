import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import orderService from '@/services/orderService'
import CustomPagination from '@/pages/DashboardOrder/OrderManagementPage/CustomPagination'
import OrderCard from '@/pages/DashboardOrder/OrderManagementPage/OrderCard'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'
import OrderSummaryCard from '@/pages/DashboardOrder/OrderManagementPage/OrderSummaryCard'
import formatCurrency from '@/utils/formatCurrency'

const OrderManagementPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const hasProcessOrderPermission = verifyPermission(user, permissions.processOrder)

    const { orders, orderCount, chooseInventoryMutation, updateStatusMutation } = orderService({ enableFetching: true })
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(1)
    }, [limit])

    const paginatedOrders = useMemo(() => {
        const start = (page - 1) * limit
        const end = start + limit

        return orders.slice(start, end)
    }, [orders, page, limit])

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.fullName}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách đơn hàng của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.fullName} />
                    </Avatar>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-6">
                <OrderSummaryCard title="Số lượng đơn hàng" data={orderCount.toString().padStart(2, '0')} />
                <OrderSummaryCard
                    title="Tổng doanh thu đơn hàng"
                    data={formatCurrency(
                        orders.filter(o => o.orderStatus.isAccounted).reduce((acc, cur) => acc + cur.totalAmount, 0)
                    )}
                />
                <OrderSummaryCard
                    title="Số đơn hàng đang chờ xử lý"
                    data={orders
                        .filter(o => o.orderStatus.isDefaultState)
                        .length.toString()
                        .padStart(2, '0')}
                />
            </div>

            <div className="mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {paginatedOrders.map(order => (
                    <OrderCard
                        key={order.orderId}
                        order={order}
                        hasPermission={hasProcessOrderPermission}
                        chooseInventoryMutation={chooseInventoryMutation}
                        updateStatusMutation={updateStatusMutation}
                    />
                ))}
            </div>

            <CustomPagination
                page={page}
                maxPage={Math.ceil(orderCount / limit)}
                limit={limit}
                setPage={setPage}
                setLimit={setLimit}
            />
        </div>
    )
}

export default OrderManagementPage
