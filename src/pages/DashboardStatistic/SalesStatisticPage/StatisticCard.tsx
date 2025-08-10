import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BADGE_COLORS } from '@/configs/constants'
import { StatisticCriteria, statisticTypes } from '@/pages/DashboardStatistic/DetailStatisticPage'
import formatCurrency from '@/utils/formatCurrency'
import striptags from 'striptags'

type StatisticCardProps = {
    axios: AxiosInstance
    product: IRootProduct
}

type SalesData = Record<StatisticCriteria, { productItemId: number; totalUnits: number; totalSales: number }[]>

const StatisticCard = ({ axios, product }: StatisticCardProps) => {
    const [type, setType] = useState<StatisticCriteria>('daily')

    const prices = (product.productItems ?? [{ price: 0 }]).map(item => item.price ?? 0)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    const fetchProductSalesQuery = useQuery({
        queryKey: ['product-sales', product.rootProductId],
        queryFn: () => axios.get<IResponseData<SalesData>>(`/statistics/products/${product.rootProductId}`),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 20000,
        select: res => res.data
    })

    const salesData = fetchProductSalesQuery.data?.data

    return (
        <Card className="col-span-6 lg:col-span-3 xl:col-span-2">
            <CardHeader className="flex items-center justify-between gap-12">
                <div className="flex flex-col justify-center gap-1">
                    <CardTitle className="text-xl">Chi tiết doanh số</CardTitle>
                    <CardDescription>Mã sản phẩm: {product.rootProductId}</CardDescription>
                </div>
                <div className="border-primary flex w-[70px] items-center justify-center overflow-hidden rounded-full border-3 p-1">
                    <img
                        src={product.imageUrl}
                        alt="product image"
                        className="aspect-square h-full w-full rounded-full object-cover"
                    />
                </div>
            </CardHeader>

            <Separator />
            <CardContent>
                <div className="flex flex-col gap-4 break-words whitespace-normal">
                    <p className="line-clamp-1 text-xl font-semibold">{product.name}</p>
                    <p>
                        <span className="font-semibold">Giá tiền: </span>
                        <span className="text-muted-foreground">
                            {minPrice !== maxPrice
                                ? `Từ ${formatCurrency(minPrice)} đến ${formatCurrency(maxPrice)}`
                                : formatCurrency(minPrice)}
                        </span>
                    </p>

                    <p className="line-clamp-3">
                        <span className="font-semibold">Mô tả: </span>
                        <span className="text-muted-foreground">{striptags(product.description)}</span>
                    </p>

                    <p>
                        <span className="font-semibold">Phân loại: </span>
                    </p>
                    {product.variants!.map((variant, index) => (
                        <div key={variant.variantId} className="flex items-center gap-2">
                            <Sparkles size={18} className="text-muted-foreground" />
                            <span className="text-muted-foreground font-semibold">{variant.name}:</span>
                            <ul className="flex flex-wrap items-center gap-2">
                                {variant.options!.map(option => {
                                    return (
                                        <li key={option.optionId}>
                                            <Badge
                                                style={{ backgroundColor: BADGE_COLORS[index % BADGE_COLORS.length] }}
                                            >
                                                {option.value}
                                            </Badge>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}

                    <div className="grid grid-cols-4 gap-4 lg:gap-3 xl:gap-2">
                        {statisticTypes.map(button => (
                            <Button
                                key={button.value}
                                variant={type === button.value ? 'default' : 'outline'}
                                size="lg"
                                onClick={() => setType(button.value as StatisticCriteria)}
                            >
                                {button.label}
                            </Button>
                        ))}
                    </div>

                    <p>
                        <span className="font-semibold">Doanh số: </span>
                    </p>
                    <div className="max-h-[300px] overflow-y-auto">
                        {(product.productItems ?? []).map((item, index) => (
                            <div key={item.productItemId}>
                                <StatisticProductItem
                                    productItem={item}
                                    type={type}
                                    salesData={salesData}
                                    options={product.variants!.reduce(
                                        (options, variant) => [...options, ...(variant.options as IVariantOption[])],
                                        [] as IVariantOption[]
                                    )}
                                />
                                {index < (product.productItems ?? []).length - 1 && <Separator className="my-2" />}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

type StatisticProductItemProps = {
    productItem: Partial<IProductItem>
    type: StatisticCriteria
    salesData: SalesData | undefined
    options: IVariantOption[]
}

const StatisticProductItem = ({ productItem, type, salesData, options }: StatisticProductItemProps) => {
    const matchingItem = salesData?.[type].find(item => item.productItemId === productItem.productItemId)

    return (
        <div className="flex items-start gap-4">
            <div className="border-primary flex w-[60px] items-center justify-center overflow-hidden rounded-lg border-2 p-1">
                <img
                    src={productItem.imageUrl}
                    alt="product item image"
                    className="aspect-square h-full w-full rounded-sm object-cover"
                />
            </div>

            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-semibold">Thuộc tính:</span>
                    <ul className="flex flex-wrap items-center gap-2">
                        {productItem.attributes!.map((attribute, index) => {
                            return (
                                <li key={attribute.optionId}>
                                    <Badge style={{ backgroundColor: BADGE_COLORS[index % BADGE_COLORS.length] }}>
                                        {options.find(option => option.optionId === attribute.optionId)?.value}
                                    </Badge>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <p className="text-muted-foreground font-semibold">
                    Số lượng bán ra:{' '}
                    <span className="font-normal">{(matchingItem?.totalUnits ?? 0).toString().padStart(2, '0')}</span>
                </p>
                <p className="text-muted-foreground font-semibold">
                    Số tiền thu về: <span className="font-normal">{formatCurrency(matchingItem?.totalSales ?? 0)}</span>
                </p>
            </div>
        </div>
    )
}

export default StatisticCard
