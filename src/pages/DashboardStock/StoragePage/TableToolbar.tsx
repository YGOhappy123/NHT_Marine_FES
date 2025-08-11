import { Table } from '@tanstack/react-table'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import appPermissions from '@/configs/permissions'
import AddStorageDialog from '@/pages/DashboardStock/StoragePage/AddStorageDialog'
import verifyPermission from '@/utils/verifyPermission'
import { useIsMobile } from '@/hooks/useMobile'
import { twMerge } from 'tailwind-merge'
import { X } from 'lucide-react'

interface TableToolbarProps<TData> {
    table: Table<TData>
    storageTypes: IStorageType[]
    addNewStorageMutation: UseMutationResult<any, any, Partial<IStorage>, any>
}

export function TableToolbar<TData>({ table, storageTypes, addNewStorageMutation }: TableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const user = useSelector((state: RootState) => state.auth.user)
    const hasAddStoragePermission = verifyPermission(user, appPermissions.addNewStorage)
    const isMobile = useIsMobile()

    return (
        <div className="flex items-center justify-between">
            <div className={twMerge('flex gap-2', isMobile ? '' : 'flex-col items-start xl:flex-row')}>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Tìm kho theo tên..."
                        value={(table.getColumn('Tên kho')?.getFilterValue() as string) ?? ''}
                        onChange={event => table.getColumn('Tên kho')?.setFilterValue(event.target.value)}
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

                {hasAddStoragePermission && (
                    <AddStorageDialog
                        storageTypes={storageTypes}
                        addNewStorageMutation={addNewStorageMutation}
                    />
                )}
            </div>
        </div>
    )
}
