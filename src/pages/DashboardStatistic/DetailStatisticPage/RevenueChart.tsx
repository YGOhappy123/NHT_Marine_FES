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

const chartConfig = {
    views: {
        label: 'Số tiền (vnđ)'
    }
} satisfies ChartConfig

const RevenueChart = () => {
    const axios = useAxiosIns()
    const [type, setType] = useState<StatisticCriteria>('daily')

    const getRevenueChartQuery = useQuery({
        queryKey: ['revenue-chart', type],
        queryFn: () => axios.get<IResponseData<any>>(`/statistics/revenues?type=${type}`),
        enabled: true,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 20000,
        select: res => res.data
    })

    const chartData = getRevenueChartQuery.data?.data ?? []

    return (
        <Card className="col-span-6">
            <CardHeader className="flex items-center justify-between gap-12">
                <div className="flex flex-col justify-center gap-1">
                    <CardTitle className="text-xl">Biểu đồ doanh thu</CardTitle>
                    <CardDescription>
                        Hiển thị doanh thu của cửa hàng trong{' '}
                        {statisticTypes.find(item => item.value === type)!.label.toLowerCase()}.
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
                {chartData.length === 0 && <Skeleton className="h-[200px] w-full" />}

                {chartData.length > 0 && (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
                        <ComposedChart
                            data={chartData.map((item: any) => ({
                                ...item,
                                revenue: item.totalDamages + item.totalImports + item.totalSales
                            }))}
                            stackOffset="sign"
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Legend />
                            <ChartTooltip content={<ChartTooltipContent className="w-[200px]" nameKey="views" />} />

                            <Bar
                                dataKey="totalSales"
                                stackId="a"
                                fill="var(--chart-2)"
                                name="Tiền từ đơn hàng"
                                maxBarSize={40}
                            />
                            <Bar
                                dataKey="totalImports"
                                stackId="a"
                                fill="var(--chart-1)"
                                name="Chi phí nhập hàng"
                                maxBarSize={40}
                            />
                            {/* <Bar
                                dataKey="totalDamages"
                                stackId="a"
                                fill="var(--chart-3)"
                                name="Thiệt hại sản phẩm"
                                maxBarSize={40}
                            /> */}

                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="var(--chart-4)"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                name="Doanh thu"
                            />
                        </ComposedChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}

export default RevenueChart
