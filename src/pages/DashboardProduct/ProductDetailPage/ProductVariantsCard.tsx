import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BADGE_COLORS } from '@/configs/constants'
import { sections } from '@/pages/DashboardProduct/ProductDetailPage/TableOfContents'
import ProductItemsForm from '@/pages/DashboardProduct/ProductDetailPage/ProductItemsForm'

type ProductVariantsCardProps = {
    product: IRootProduct
    hasModifyItemPermission: boolean
    onUpdateSuccess: () => Promise<any>
}

const ProductVariantsCard = ({ product, hasModifyItemPermission, onUpdateSuccess }: ProductVariantsCardProps) => {
    const section = sections.variants

    return (
        <Card className="w-full max-w-4xl" id={section.id}>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription>
                    {hasModifyItemPermission
                        ? 'Cập nhật phân loại và giá cả sản phẩm bẳng cách ấn vào nút "Chỉnh sửa" tại mục này'
                        : 'Tài khoản của bạn không được cấp quyền cập nhật phân loại và giá cả sản phẩm'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-semibold">Danh sách các nhóm phân loại</h4>
                    {product.variants!.map((variant, index) => (
                        <div key={variant.variantId} className="flex gap-2">
                            <h5 className="font-semibold">
                                {index + 1}. Nhóm phân loại theo "{variant.name}":
                            </h5>
                            <ul className="flex items-center gap-2">
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
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <h4 className="text-lg font-semibold">Danh sách chi tiết sản phẩm</h4>
                    <ProductItemsForm
                        product={product!}
                        options={product.variants!.reduce(
                            (options, variant) => [...options, ...(variant.options as IVariantOption[])],
                            [] as IVariantOption[]
                        )}
                        hasModifyItemPermission={hasModifyItemPermission}
                        onUpdateSuccess={onUpdateSuccess}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductVariantsCard
