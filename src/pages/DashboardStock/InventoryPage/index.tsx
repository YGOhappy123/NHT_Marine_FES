import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { RootState } from '@/store'
import storageService from '@/services/storageService'
import StorageCard from '@/pages/DashboardStock/InventoryPage/StorageCard'
import ChangeLocationDialog from '@/pages/DashboardStock/InventoryPage/ChangeLocationDialog'
import verifyPermission from '@/utils/verifyPermission'
import permissions from '@/configs/permissions'
import ChangeVariantDialog from '@/pages/DashboardStock/InventoryPage/ChangeVariantDialog'

const InventoryPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const hasUpdatePermission = verifyPermission(user, permissions.updateInventory)
    const [changeLocationDialogOpen, setChangeLocationDialogOpen] = useState(false)
    const [changeVariantDialogOpen, setChangeVariantDialogOpen] = useState(false)
    const [selectedStorage, setSelectedStorage] = useState<IStorage | null>(null)

    const { storages, changeInventoryLocationMutation, changeInventoryVariantMutation } = storageService({
        enableFetching: true
    })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user?.fullName ?? 'Người dùng'}!</h2>
                    <p className="text-muted-foreground">Đây là danh sách hàng tồn kho của hệ thống NHT Marine.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.fullName} />
                    </Avatar>
                </div>
            </div>

            <ChangeLocationDialog
                storage={selectedStorage}
                availableStorages={storages.filter(s => s.storageId !== selectedStorage?.storageId)}
                open={changeLocationDialogOpen}
                setOpen={setChangeLocationDialogOpen}
                changeInventoryLocationMutation={changeInventoryLocationMutation}
                hasUpdatePermission={hasUpdatePermission}
            />

            <ChangeVariantDialog
                storage={selectedStorage}
                open={changeVariantDialogOpen}
                setOpen={setChangeVariantDialogOpen}
                changeInventoryVariantMutation={changeInventoryVariantMutation}
                hasUpdatePermission={hasUpdatePermission}
            />

            <div className="grid grid-cols-6 gap-6">
                {storages.length === 0 && <Skeleton className="h-[200px] w-full" />}

                {storages.length > 0 &&
                    storages.map(storage => (
                        <StorageCard
                            key={storage.storageId}
                            storage={storage}
                            hasUpdatePermission={hasUpdatePermission}
                            onChangeLocation={(storage: IStorage) => {
                                setSelectedStorage(storage)
                                setChangeLocationDialogOpen(true)
                            }}
                            onChangeVariant={(storage: IStorage) => {
                                setSelectedStorage(storage)
                                setChangeVariantDialogOpen(true)
                            }}
                        />
                    ))}
            </div>
        </div>
    )
}

export default InventoryPage
