import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { sections } from '@/pages/DashboardProduct/ProductDetailPage/TableOfContents'

type ProductVariantsCardProps = {
    product: IRootProduct
    hasModifyVariantsPermission: boolean
}

const ProductVariantsCard = ({ product, hasModifyVariantsPermission }: ProductVariantsCardProps) => {
    const section = sections.variants

    return (
        <Card className="w-full max-w-4xl" id={section.id}>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription>
                    {hasModifyVariantsPermission
                        ? 'Cập nhật phân loại và giá cả sản phẩm bẳng cách ấn vào nút "Chỉnh sửa" tại mục này'
                        : 'Tài khoản của bạn không được cấp quyền cập nhật phân loại và giá cả sản phẩm'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[500px]"></div>
            </CardContent>
        </Card>
    )
}

export default ProductVariantsCard
