import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store'
import useAxiosIns from '@/hooks/useAxiosIns'
import importService from '@/services/importService'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'
import permissions from '@/configs/permissions'
import { TableToolbar } from '@/pages/DashboardImport/ProductImportPage/TableToolbar'
import { getTableColumns } from '@/pages/DashboardImport/ProductImportPage/getTableColumns'
import ViewImportDialog from '@/pages/DashboardImport/ProductImportPage/ViewImportDialog'

const ProductImportPage = () => {
    const axios = useAxiosIns()
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedImport, setSelectedImport] = useState<IProductImport | null>(null)
    const { imports } = importService({ enableFetching: true })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.fullName}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách đơn nhập hàng của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.fullName} />
                    </Avatar>
                </div>
            </div>

            <ViewImportDialog productImport={selectedImport} open={dialogOpen} setOpen={setDialogOpen} />

            <DataTable
                data={imports}
                columns={getTableColumns({
                    hasDistributePermission: verifyPermission(user, permissions.updateInventory),
                    onViewImport: (productImport: IProductImport) => {
                        setSelectedImport(productImport)
                        setDialogOpen(true)
                    },
                    onDistributeImport: () => {
                        navigate('/inventories/distributions')
                    }
                })}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        hasAddImportPermission={verifyPermission(user, permissions.addNewImport)}
                    />
                )}
            />
        </div>
    )
}

export default ProductImportPage
