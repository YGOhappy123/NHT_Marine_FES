import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableToolbar } from '@/pages/DashboardCategory/CategoryManagementPage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardCategory/CategoryManagementPage/getTableColumns'
import { RootState } from '@/store'
import categoryService from '@/services/categoryService'
import useAxiosIns from '@/hooks/useAxiosIns'
import DataCategoryDialog from '@/pages/DashboardCategory/CategoryManagementPage/DataCategoryDialog'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'

const CategoryManagementPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'view' | 'update'>('view')
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)
    const { categories, addNewCategoryMutation, updateCategoryMutation, removeCategoryMutation } = categoryService({
        enableFetching: true
    })

    const fetchAllParentCategoriesQuery = useQuery({
        queryKey: ['categories-all'],
        queryFn: () => axios.get<IResponseData<ICategory[]>>('/products/categories'),
        enabled: true,
        select: res => res.data
    })
    const parentCategories = fetchAllParentCategoriesQuery.data?.data || []

    useEffect(() => {
        if (addNewCategoryMutation.isSuccess) {
            fetchAllParentCategoriesQuery.refetch()
        }
    }, [addNewCategoryMutation.isSuccess])

    useEffect(() => {
        if (updateCategoryMutation.isSuccess) {
            fetchAllParentCategoriesQuery.refetch()
        }
    }, [updateCategoryMutation.isSuccess])

    useEffect(() => {
        if (removeCategoryMutation.isSuccess) {
            fetchAllParentCategoriesQuery.refetch()
        }
    }, [removeCategoryMutation.isSuccess])

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user?.fullName}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách danh mục hàng hóa của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user?.avatar} alt={user?.fullName} />
                    </Avatar>
                </div>
            </div>

            <DataCategoryDialog
                category={selectedCategory}
                parentCategories={parentCategories}
                mode={dialogMode}
                setMode={setDialogMode}
                open={dialogOpen}
                setOpen={setDialogOpen}
                updateCategoryMutation={updateCategoryMutation}
                hasUpdatePermission={verifyPermission(user, appPermissions.updateProductCategory)}
            />

            <DataTable
                data={categories}
                columns={getTableColumns({
                    hasUpdatePermission: verifyPermission(user, appPermissions.updateProductCategory),
                    hasDeletePermission: verifyPermission(user, appPermissions.deleteProductCategory),
                    onViewCategory: (category: ICategory) => {
                        setSelectedCategory(category)
                        setDialogMode('view')
                        setDialogOpen(true)
                    },
                    onUpdateCategory: (category: ICategory) => {
                        setSelectedCategory(category)
                        setDialogMode('update')
                        setDialogOpen(true)
                    },
                    removeCategoryMutation: removeCategoryMutation
                })}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        parentCategories={parentCategories}
                        addNewCategoryMutation={addNewCategoryMutation}
                    />
                )}
            />
        </div>
    )
}

export default CategoryManagementPage
