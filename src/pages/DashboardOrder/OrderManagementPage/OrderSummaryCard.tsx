import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import dayjs from '@/libs/dayjs'

type OrderSummaryCardProps = {
    title: string
    data: number | string
}

const OrderSummaryCard = ({ title, data }: OrderSummaryCardProps) => {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{data}</CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">Ngày tổng hợp số liệu</div>
                <div className="text-muted-foreground">{dayjs().format('DD/MM/YYYY - HH:mm:ss')}</div>
            </CardFooter>
        </Card>
    )
}

export default OrderSummaryCard
