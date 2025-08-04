import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftFromLine } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import TableOfContents from '@/pages/DashboardProduct/ProductDetailPage/TableOfContents'
import ProductInfoCard from '@/pages/DashboardProduct/ProductDetailPage/ProductInfoCard'
import ProductVariantsCard from '@/pages/DashboardProduct/ProductDetailPage/ProductVariantsCard'
import ProductPromotionsCard from '@/pages/DashboardProduct/ProductDetailPage/ProductPromotionsCard'
import useAxiosIns from '@/hooks/useAxiosIns'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'

const ProductDetailPage = () => {
    const { productId } = useParams()
    const axios = useAxiosIns()
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.auth.user)

    const getProductDetailQuery = useQuery({
        queryKey: ['product-detail', productId],
        queryFn: () => axios.get<IResponseData<IRootProduct>>(`/products/${productId}`),
        enabled: true,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data
    })

    const getCategoriesQuery = useQuery({
        queryKey: ['categories-all'],
        queryFn: () => axios.get<IResponseData<ICategory[]>>('/products/categories'),
        enabled: true,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data
    })

    const product = getProductDetailQuery.data?.data
    const categories = getCategoriesQuery.data?.data ?? []

    if (getProductDetailQuery.isPending) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-2">
                <div role="status">
                    <svg
                        aria-hidden="true"
                        className="fill-primary inline h-12 w-12 animate-spin text-gray-200 dark:text-gray-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                </div>
                <p className="mt-2 font-semibold">Đang tải dữ liệu sản phẩm</p>
                <p className="font-semibold">Xin vui lòng chờ đợi trong giây lát...</p>
            </div>
        )
    }

    if (!getProductDetailQuery.isPending && !product) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-2">
                <Button size="sm" className="flex items-center" onClick={() => navigate('/products')}>
                    <ArrowLeftFromLine />
                    Trở về trang danh sách sản phẩm
                </Button>
                <p className="mt-2 font-semibold">
                    Không tìm thấy sản phẩm với mã sản phẩm là: {productId?.toString()}
                </p>
                <p className="font-semibold">Sản phẩm không hợp lệ hoặc đã bị xóa</p>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.fullName}!</h2>
                    <p className="text-muted-foreground">
                        Đây là thông tin chi tiết về sản phẩm "{product!.name}" với mã sản phẩm {productId}.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.fullName} />
                    </Avatar>
                </div>
            </div>

            <div className="flex items-start gap-8">
                <div className="flex flex-1 flex-col items-center gap-4">
                    <ProductInfoCard
                        product={product!}
                        categories={categories}
                        hasModifyInfoPermission={verifyPermission(user, permissions.updateProductInformation)}
                        onUpdateSuccess={() => getProductDetailQuery.refetch()}
                    />
                    <ProductVariantsCard
                        product={product!}
                        hasModifyItemPermission={verifyPermission(user, permissions.updateProductPrice)}
                        onUpdateSuccess={() => getProductDetailQuery.refetch()}
                    />
                    <ProductPromotionsCard product={product!} />
                </div>
                <TableOfContents />
            </div>
        </div>
    )
}

export default ProductDetailPage
