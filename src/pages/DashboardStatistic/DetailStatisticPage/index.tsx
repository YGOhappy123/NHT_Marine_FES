import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import RevenueChart from '@/pages/DashboardStatistic/DetailStatisticPage/RevenueChart'
import SummaryCards from '@/pages/DashboardStatistic/DetailStatisticPage/SummaryCards'
import PopularCustomers from '@/pages/DashboardStatistic/DetailStatisticPage/PopularCustomers'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'

export type StatisticCriteria = 'daily' | 'weekly' | 'monthly' | 'yearly'

export const statisticTypes = [
    {
        label: 'Hôm nay',
        value: 'daily'
    },
    {
        label: 'Tuần này',
        value: 'weekly'
    },
    {
        label: 'Tháng này',
        value: 'monthly'
    },
    {
        label: 'Năm nay',
        value: 'yearly'
    }
]

const DetailStatisticPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const hasViewRevenueData = verifyPermission(user, permissions.viewRevenueAndStatisticData)

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.fullName}!</h2>
                    <p className="text-muted-foreground">
                        Đây là thống kê chi tiết về tình hình hoạt động của hệ thống NHT Marine.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.fullName} />
                    </Avatar>
                </div>
            </div>

            <div className="grid grid-cols-6 gap-6">
                {hasViewRevenueData && <SummaryCards />}
                {hasViewRevenueData && <RevenueChart />}
                {hasViewRevenueData && <PopularCustomers />}
            </div>
        </div>
    )
}

export default DetailStatisticPage
