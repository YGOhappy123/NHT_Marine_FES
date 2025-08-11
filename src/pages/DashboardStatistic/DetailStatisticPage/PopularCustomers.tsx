import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { StatisticCriteria, statisticTypes } from '@/pages/DashboardStatistic/DetailStatisticPage'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import HighestOrderCountTable from '@/pages/DashboardStatistic/DetailStatisticPage/HighestOrderCountTable'
import HighestOrderAmountTable from '@/pages/DashboardStatistic/DetailStatisticPage/HighestOrderAmountTable'
import useAxiosIns from '@/hooks/useAxiosIns'

type PopularCustomers = {
    highestOrderCountCustomers: ICustomer & { orderCount: number }[]
    highestOrderAmountCustomers: ICustomer & { orderAmount: number }[]
}

const PopularCustomers = () => {
    const axios = useAxiosIns()
    const [type, setType] = useState<StatisticCriteria>('daily')

    const getPopularCustomersQuery = useQuery({
        queryKey: ['popular-customers', type],
        queryFn: () => axios.get<IResponseData<PopularCustomers>>(`/statistics/popular-customers?type=${type}`),
        enabled: true,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 20000,
        select: res => res.data
    })

    const popularCustomers = getPopularCustomersQuery.data?.data

    return (
        <Card className="col-span-6">
            <CardHeader className="flex items-center justify-between gap-12">
                <div className="flex flex-col justify-center gap-1">
                    <CardTitle className="text-xl">Khách hàng nổi bật</CardTitle>
                    <CardDescription>
                        Hiển thị danh sách khách hàng nổi bật trong{' '}
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
                {popularCustomers == null && <Skeleton className="h-[200px] w-full" />}

                {popularCustomers != null && (
                    <div className="flex flex-col gap-6">
                        <HighestOrderCountTable customers={popularCustomers.highestOrderCountCustomers ?? []} />
                        <HighestOrderAmountTable customers={popularCustomers.highestOrderAmountCustomers ?? []} />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default PopularCustomers
