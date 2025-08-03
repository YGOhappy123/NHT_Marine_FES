import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardProduct/ProductManagementPage/TableToolbar'
import { RootState } from '@/store'
import { getTableColumns } from '@/pages/DashboardProduct/ProductManagementPage/getTableColumns'
import productService from '@/services/productService'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'

const ProductManagementPage = () => {
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.auth.user)
    const { products, removeProductMutation } = productService({ enableFetching: true })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.fullName}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách sản phẩm của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.fullName} />
                    </Avatar>
                </div>
            </div>

            <DataTable
                data={products}
                columns={getTableColumns({
                    hasUpdateInfoPermission: verifyPermission(user, permissions.updateProductInformation),
                    hasUpdateItemsPermission: verifyPermission(user, permissions.updateProductPrice),
                    hasDeletePermission: verifyPermission(user, permissions.deleteProduct),
                    onViewProduct: product => navigate(`/products/${product.rootProductId}`),
                    onUpdateProductInfo: product => navigate(`/products/${product.rootProductId}`),
                    onUpdateProductItems: product => navigate(`/products/${product.rootProductId}`),
                    removeProductMutation: removeProductMutation
                })}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        hasAddProductPermission={verifyPermission(user, permissions.addNewProduct)}
                    />
                )}
            />
        </div>
    )
}

export default ProductManagementPage
