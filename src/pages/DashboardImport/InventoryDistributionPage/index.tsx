import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Avatar as RadixAvatar, AvatarImage as RadixAvatarImage } from '@radix-ui/react-avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { RootState } from '@/store'
import UndistributedImportCard from '@/pages/DashboardImport/InventoryDistributionPage/UndistributedImportCard'
import DistributeImportDialog from '@/pages/DashboardImport/InventoryDistributionPage/DistributeImportDialog'
import useAxiosIns from '@/hooks/useAxiosIns'
import importService from '@/services/importService'

const InventoryDistributionPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedImport, setSelectedImport] = useState<IProductImport | null>(null)

    const fetchImportsQuery = useQuery({
        queryKey: ['all-imports'],
        queryFn: () =>
            axios.get<IResponseData<IProductImport[]>>(
                `/product-imports?filter=${JSON.stringify({ isDistributed: false })}&sort=${JSON.stringify({ importDate: 'ASC' })}`
            ),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 20000,
        select: res => res.data
    })
    const fetchStoragesQuery = useQuery({
        queryKey: ['all-storages'],
        queryFn: () => axios.get<IResponseData<IStorage[]>>('/storages'),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 20000,
        select: res => res.data
    })

    const imports = fetchImportsQuery.data?.data ?? []
    const storages = fetchStoragesQuery.data?.data ?? []
    const { distributeImportMutation } = importService({ enableFetching: false })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.fullName}!</h2>
                    <p className="text-muted-foreground">
                        Đây là các đơn nhập hàng chưa được phân vào kho của hệ thống NHT Marine.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.fullName} />
                    </Avatar>
                </div>
            </div>

            <DistributeImportDialog
                productImport={selectedImport}
                storages={storages}
                open={dialogOpen}
                setOpen={setDialogOpen}
                distributeImportMutation={distributeImportMutation}
                onUpdateDone={() => fetchImportsQuery.refetch()}
            />

            {fetchImportsQuery.isLoading && <Skeleton className="h-[200px] w-full" />}

            {!fetchImportsQuery.isLoading && imports.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2">
                    <RadixAvatar className="w-[30%] xl:w-[20%]">
                        <RadixAvatarImage src="/images/happy-emoji.png" alt="empty cart"></RadixAvatarImage>
                    </RadixAvatar>
                    <p className="mt-2 font-semibold">Xin chúc mừng</p>
                    <p className="font-semibold">Toàn bộ đơn nhập hàng đã được phân vào kho!</p>
                </div>
            )}

            {imports.length > 0 && (
                <div className="grid grid-cols-6 gap-6">
                    {imports.map(pi => (
                        <UndistributedImportCard
                            key={pi.importId}
                            productImport={pi}
                            onDistributeImport={(productImport: IProductImport) => {
                                setSelectedImport(productImport)
                                setDialogOpen(true)
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default InventoryDistributionPage
