import { Table } from '@tanstack/react-table'
import { Fish, FishOff, X } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import appPermissions from '@/configs/permissions'
import AddCategoryDialog from '@/pages/DashboardCategory/CategoryManagementPage/AddCategoryDialog'
import verifyPermission from '@/utils/verifyPermission'
import TableDataFilter from '@/components/common/TableDataFilter'
import { useIsMobile } from '@/hooks/useMobile'
import { twMerge } from 'tailwind-merge'

interface TableToolbarProps<TData> {
    table: Table<TData>
    parentCategories: ICategory[]
    addNewCategoryMutation: UseMutationResult<any, any, Partial<ICategory>, any>
}

const parentCategoriesOptions = [
    {
        value: 'null',
        label: 'Không có',
        icon: FishOff
    },
    {
        value: 'hasParent',
        label: 'Có danh mục cha',
        icon: Fish
    }
]

export function TableToolbar<TData>({ table, parentCategories, addNewCategoryMutation }: TableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const user = useSelector((state: RootState) => state.auth.user)
    const hasAddCategoryPermission = verifyPermission(user, appPermissions.addNewProductCategory)
    const isMobile = useIsMobile()

    return (
        <div className="flex items-center justify-between">
            <div className={twMerge('flex gap-2', isMobile ? '' : 'flex-col items-start xl:flex-row')}>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Tìm danh mục theo tên..."
                        value={(table.getColumn('Tên danh mục')?.getFilterValue() as string) ?? ''}
                        onChange={event => table.getColumn('Tên danh mục')?.setFilterValue(event.target.value)}
                        className="text-foreground caret-foreground h-8 w-[150px] md:w-[200px] lg:w-[250px]"
                    />
                    {!isMobile && isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => table.resetColumnFilters()}
                            className="flex h-8 px-2 lg:px-3 xl:hidden"
                        >
                            Đặt lại
                            <X />
                        </Button>
                    )}
                </div>
                {table.getColumn('Danh mục cha') && (
                    <TableDataFilter
                        table={table}
                        rootColumn="categoryId"
                        filterColumn="Danh mục cha"
                        title="Danh mục cha"
                        options={parentCategoriesOptions}
                        filterFn={(rawValue: string, options) => {
                            switch (options) {
                                case 'null':
                                    return rawValue == null
                                case 'hasParent':
                                    return rawValue != null
                                default:
                                    return false
                            }
                        }}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="hidden h-8 px-2 lg:px-3 xl:flex"
                    >
                        Đặt lại
                        <X />
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <DataTableViewOptions table={table} />

                {hasAddCategoryPermission && (
                    <AddCategoryDialog
                        parentCategories={parentCategories}
                        addNewCategoryMutation={addNewCategoryMutation}
                    />
                )}
            </div>
        </div>
    )
}
