import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import orderService from '@/services/orderService'
import CustomPagination from '@/pages/DashboardOrder/OrderManagementPage/CustomPagination'
import OrderCard from '@/pages/DashboardOrder/OrderManagementPage/OrderCard'

const OrderManagementPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)

    const { orders, orderCount } = orderService({ enableFetching: true })
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

            <Card className="mb-6 w-full">
                <CardContent></CardContent>
            </Card>

            <div className="mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {paginatedOrders.map(order => (
                    <OrderCard key={order.orderId} order={order} />
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
