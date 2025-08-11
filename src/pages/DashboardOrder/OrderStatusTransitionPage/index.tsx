import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Eraser, FunnelPlus, PencilLine } from 'lucide-react'
import { Avatar as RadixAvatar, AvatarImage as RadixAvatarImage } from '@radix-ui/react-avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RootState } from '@/store'
import statusTransitionService from '@/services/statusTransitionService'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import useAxiosIns from '@/hooks/useAxiosIns'
import verifyPermission from '@/utils/verifyPermission'
import appPermissions from '@/configs/permissions'
import AddTransitionDialog from '@/pages/DashboardOrder/OrderStatusTransitionPage/AddTransitionDialog'
import UpdateTransitionDialog from '@/pages/DashboardOrder/OrderStatusTransitionPage/UpdateTransitionDialog'

const OrderStatusTransitionPage = () => {
    const axios = useAxiosIns()
    const user = useSelector((state: RootState) => state.auth.user)
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<IOrderStatus | null>(null)
    const [selectedTransition, setSelectedTransition] = useState<IOrderStatusTransition | null>(null)
    const { statusTransitions, addNewTransitionMutation, updateTransitionMutation, removeTransitionMutation } =
        statusTransitionService({ enableFetching: true })
    const hasUpdatePermission = verifyPermission(user, appPermissions.updateOrderStatus)

    const fetchAllOrderStatusesQuery = useQuery({
        queryKey: ['order-statuses-all'],
        queryFn: () => axios.get<IResponseData<IOrderStatus[]>>('/order-statuses'),
        enabled: true,
        select: res => res.data
    })
    const orderStatuses = fetchAllOrderStatusesQuery.data?.data || []

    const getSelectedStatusIds = (statusId: number | undefined, transitionGroups: ITransitionGroup[]) => {
        const matchingGroup = transitionGroups.find(group => group.fromStatusId === statusId)
        if (!matchingGroup) return []

        return matchingGroup.transitions.map(trans => trans.toStatusId!)
    }

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.fullName}!</h2>
                    <p className="text-muted-foreground">
                        Đây là danh sách trạng thái đơn hàng kèm hướng chuyển đổi của hệ thống NHT Marine.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.fullName} />
                    </Avatar>
                </div>
            </div>

            <AddTransitionDialog
                fromStatus={selectedStatus}
                availableStatuses={orderStatuses.filter(
                    item =>
                        item.statusId !== selectedStatus?.statusId &&
                        !getSelectedStatusIds(selectedStatus?.statusId, statusTransitions).includes(item.statusId)
                )}
                open={addDialogOpen}
                setOpen={setAddDialogOpen}
                addNewTransitionMutation={addNewTransitionMutation}
            />

            <UpdateTransitionDialog
                transition={selectedTransition}
                open={updateDialogOpen}
                setOpen={setUpdateDialogOpen}
                updateTransitionMutation={updateTransitionMutation}
            />

            {orderStatuses.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2">
                    <RadixAvatar className="w-[30%] xl:w-[20%]">
                        <RadixAvatarImage src="/images/happy-emoji.png" alt="empty cart"></RadixAvatarImage>
                    </RadixAvatar>
                    <p className="mt-2 font-semibold">Không có dữ liệu</p>
                    <p className="font-semibold">Không tìm thấy các trạng thái đơn hàng!</p>
                </div>
            )}

            {orderStatuses.length > 0 && (
                <div className="flex flex-col gap-12">
                    {orderStatuses.map(status => {
                        const matchingGroup = statusTransitions.find(trans => trans.fromStatusId === status.statusId)

                        return (
                            <div key={status.statusId} className="flex flex-col gap-6">
                                <Card>
                                    <CardHeader className="flex items-center justify-between gap-12">
                                        <div className="flex flex-col justify-center gap-1">
                                            <CardTitle className="text-xl">Chi tiết trạng thái đơn hàng</CardTitle>
                                            <CardDescription>Mã trạng thái đơn hàng: {status.statusId}</CardDescription>
                                        </div>
                                        {hasUpdatePermission && (
                                            <Button
                                                type="button"
                                                disabled={status.isUnfulfilled}
                                                onClick={() => {
                                                    setSelectedStatus(status)
                                                    setAddDialogOpen(true)
                                                }}
                                            >
                                                <FunnelPlus />
                                                Thêm hướng chuyển
                                            </Button>
                                        )}
                                    </CardHeader>
                                    <Separator />
                                    <CardContent>
                                        <div className="flex flex-col gap-4">
                                            <p className="line-clamp-1 text-xl font-semibold">Thông tin trạng thái</p>
                                            <p>
                                                <span className="font-semibold">Tên trạng thái: </span>
                                                <span className="text-muted-foreground">{status.name}</span>
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">Phân loại: </span>
                                                {status.isDefaultState && <Badge>Trạng thái mặc định</Badge>}
                                                {status.isAccounted && (
                                                    <Badge variant="success">Trạng thái đã thu tiền</Badge>
                                                )}
                                                {status.isUnfulfilled && (
                                                    <Badge variant="destructive">Trạng thái không hoàn thành</Badge>
                                                )}
                                                {!status.isDefaultState &&
                                                    !status.isAccounted &&
                                                    !status.isUnfulfilled && (
                                                        <Badge variant="outline">Trạng thái thường</Badge>
                                                    )}
                                            </div>
                                            <p>
                                                <span className="font-semibold">Mô tả trạng thái: </span>
                                                <span className="text-muted-foreground">{status.description}</span>
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {matchingGroup && matchingGroup.transitions.length > 0 && (
                                    <div className="flex">
                                        <div className="bg-primary w-1.5"></div>
                                        <div className="grid flex-1 grid-cols-1 gap-6 pl-6 lg:grid-cols-2">
                                            {matchingGroup.transitions.map((trans, index) => (
                                                <Card key={index}>
                                                    <CardHeader className="flex items-center justify-between gap-12">
                                                        <div className="flex flex-col justify-center gap-1">
                                                            <CardTitle className="text-xl">
                                                                Chi tiết hướng chuyển trạng thái
                                                            </CardTitle>
                                                            <CardDescription>
                                                                Mã chuyển trạng thái: {trans.transitionId}
                                                            </CardDescription>
                                                        </div>
                                                        {hasUpdatePermission && (
                                                            <div className="flex flex-col gap-4">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setSelectedTransition({
                                                                            ...trans,
                                                                            fromStatusId: status.statusId,
                                                                            fromStatus: status
                                                                        } as IOrderStatusTransition)
                                                                        setUpdateDialogOpen(true)
                                                                    }}
                                                                >
                                                                    <PencilLine />
                                                                    Chỉnh sửa
                                                                </Button>
                                                                <ConfirmationDialog
                                                                    title="Bạn có chắc muốn xóa hướng chuyển trạng thái này?"
                                                                    description="Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn hướng chuyển trạng thái khỏi hệ thống NHT Marine."
                                                                    onConfirm={async () => {
                                                                        await removeTransitionMutation.mutateAsync(
                                                                            trans.transitionId!
                                                                        )
                                                                    }}
                                                                    trigger={
                                                                        <Button variant="destructive">
                                                                            <Eraser />
                                                                            Xóa
                                                                        </Button>
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </CardHeader>
                                                    <Separator />
                                                    <CardContent>
                                                        <div className="col-span-2 flex flex-col gap-4">
                                                            <p className="line-clamp-1 text-xl font-semibold">
                                                                Thông tin trạng thái mới
                                                            </p>
                                                            <p>
                                                                <span className="font-semibold">Tên trạng thái: </span>
                                                                <span className="text-muted-foreground">
                                                                    {trans.toStatus?.name}
                                                                </span>
                                                            </p>

                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold">Phân loại: </span>
                                                                {trans.toStatus?.isDefaultState && (
                                                                    <Badge>Trạng thái mặc định</Badge>
                                                                )}
                                                                {trans.toStatus?.isAccounted && (
                                                                    <Badge variant="success">
                                                                        Trạng thái đã thu tiền
                                                                    </Badge>
                                                                )}
                                                                {trans.toStatus?.isUnfulfilled && (
                                                                    <Badge variant="destructive">
                                                                        Trạng thái không hoàn thành
                                                                    </Badge>
                                                                )}
                                                                {!trans.toStatus?.isDefaultState &&
                                                                    !trans.toStatus?.isAccounted &&
                                                                    !trans.toStatus?.isUnfulfilled && (
                                                                        <Badge variant="outline">
                                                                            Trạng thái thường
                                                                        </Badge>
                                                                    )}
                                                            </div>
                                                            <p>
                                                                <span className="font-semibold">
                                                                    Mô tả trạng thái:{' '}
                                                                </span>
                                                                <span className="text-muted-foreground">
                                                                    {trans.toStatus?.description}
                                                                </span>
                                                            </p>
                                                            <p>
                                                                <span className="font-semibold">
                                                                    Mô tả hướng chuyển đổi:{' '}
                                                                </span>
                                                                <span className="text-muted-foreground">
                                                                    {trans.transitionLabel}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default OrderStatusTransitionPage
