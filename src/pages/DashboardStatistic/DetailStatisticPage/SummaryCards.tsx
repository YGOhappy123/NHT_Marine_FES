import { useState } from 'react'
import { Bar, CartesianGrid, ComposedChart, Legend, Line, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { StatisticCriteria, statisticTypes } from '@/pages/DashboardStatistic/DetailStatisticPage'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import useAxiosIns from '@/hooks/useAxiosIns'
import StatisticSummaryCard from '@/pages/DashboardStatistic/DetailStatisticPage/StatisticSummaryCard'

type StatisticSummary = {
    currentCount: number
    previousCount: number
}

type StatisticsResponse = {
    customers: StatisticSummary
    orders: StatisticSummary
    revenues: StatisticSummary
}

const SummaryCards = () => {
    const axios = useAxiosIns()
    const [type, setType] = useState<StatisticCriteria>('daily')

    const getSummaryStatisticQuery = useQuery({
        queryKey: ['summary', type],
        queryFn: () => axios.get<IResponseData<StatisticsResponse>>(`/statistics/summary?type=${type}`),
        enabled: true,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 20000,
        select: res => res.data
    })

    const summaryData = getSummaryStatisticQuery.data?.data

    return (
        <Card className="col-span-6">
            <CardHeader className="flex items-center justify-between gap-12">
                <div className="flex flex-col justify-center gap-1">
                    <CardTitle className="text-xl">Tóm tắt hoạt động</CardTitle>
                    <CardDescription>
                        Hiển thị số liệu {statisticTypes.find(item => item.value === type)!.label.toLowerCase()} so với
                        cùng kì trước.
                    </CardDescription>
                </div>
                <div className="grid shrink-0 grid-cols-2 gap-4 xl:grid-cols-4">
                    {statisticTypes.map(button => (
                        <Button
                            key={button.value}
                            variant={type === button.value ? 'default' : 'outline'}
                            size="lg"
                            onClick={() => setType(button.value as StatisticCriteria)}
                            className="w-[120px]"
                        >
                            {button.label}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <Separator />

            <CardContent>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <StatisticSummaryCard
                        loading={getSummaryStatisticQuery.isLoading}
                        value={summaryData?.customers.currentCount ?? 0}
                        prevValue={summaryData?.customers.previousCount ?? 0}
                        label="Khách hàng mới"
                        unit="tài khoản"
                        to="/customers"
                    />
                    <StatisticSummaryCard
                        loading={getSummaryStatisticQuery.isLoading}
                        value={summaryData?.revenues.currentCount ?? 0}
                        prevValue={summaryData?.revenues.previousCount ?? 0}
                        label="Doanh thu"
                        unit="vnđ"
                        to="/orders"
                    />
                    <StatisticSummaryCard
                        loading={getSummaryStatisticQuery.isLoading}
                        value={summaryData?.orders.currentCount ?? 0}
                        prevValue={summaryData?.orders.previousCount ?? 0}
                        label="Đơn hàng được đặt"
                        unit="đơn"
                        to="/orders"
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default SummaryCards
