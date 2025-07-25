import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { sections } from '@/pages/DashboardProduct/ProductDetailPage/TableOfContents'

type ProductPromotionsCardProps = {
    product: IRootProduct
}

const ProductPromotionsCard = ({ product }: ProductPromotionsCardProps) => {
    const section = sections.promotions

    return (
        <Card className="w-full max-w-4xl" id={section.id}>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription>
                    Thông tin về các chương trình khuyến mãi đang áp dụng cho sản phẩm này
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[500px]"></div>
            </CardContent>
        </Card>
    )
}

export default ProductPromotionsCard
