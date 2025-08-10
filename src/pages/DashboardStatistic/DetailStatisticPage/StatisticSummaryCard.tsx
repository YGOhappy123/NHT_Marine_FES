import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingDown, TrendingUp } from 'lucide-react'

type StatisticCardProps = {
    value: number
    prevValue: number
    label?: string
    unit?: string
    loading?: boolean
    to: string
}

export default function StatisticCard({ value, prevValue, label, unit, loading, to }: StatisticCardProps) {
    const navigate = useNavigate()
    const [count, setCount] = useState(0)
    const percentGrowth = useMemo(() => (((value - prevValue) / prevValue) * 100).toFixed(2), [prevValue, value])
    const isIncreasing = useMemo(() => parseFloat(percentGrowth) > 0, [percentGrowth])

    useEffect(() => {
        const speed = 100
        let from = 0
        const step = value / speed
        const counter = setInterval(function () {
            from += step
            if (from > value) {
                clearInterval(counter)
                setCount(value)
            } else {
                setCount(Math.ceil(from))
            }
        }, 1)

        return () => clearInterval(counter)
    }, [value])

    return (
        <div
            className="border-primary bg-card flex min-h-[150px] cursor-pointer items-center gap-4 rounded-lg border-3 p-6 shadow-md"
            onClick={() => navigate(to)}
        >
            <div className="bg-primary flex aspect-square w-10 items-center justify-center rounded-lg">
                {isIncreasing ? <TrendingUp /> : <TrendingDown />}
            </div>
            {loading ? (
                <Skeleton className="h-full w-full rounded-xl" />
            ) : (
                <div className="text-card-foreground flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 text-3xl">
                        <strong>{count ? count.toLocaleString('en-US') : 0}</strong>
                        {unit && <strong>{unit}</strong>}
                        {value > 0 && prevValue > 0 && (
                            <span className={`text-xl font-bold ${isIncreasing ? 'text-success' : 'text-destructive'}`}>
                                ({isIncreasing ? '+' : ''}
                                {percentGrowth}%)
                            </span>
                        )}
                    </div>
                    <p className="text-muted-foreground text-lg font-medium">{label}</p>
                </div>
            )}
        </div>
    )
}
