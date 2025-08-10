import { Avatar as RadixAvatar, AvatarImage as RadixAvatarImage } from '@radix-ui/react-avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

type StorageCardProps = {
    storage: IStorage
    hasUpdatePermission: boolean
    onChangeLocation: (storage: IStorage) => void
    onChangeVariant: (storage: IStorage) => void
}

const StorageCard = ({ storage, hasUpdatePermission, onChangeLocation, onChangeVariant }: StorageCardProps) => {
    return (
        <Card className="col-span-6 lg:col-span-3 xl:col-span-2">
            <CardHeader className="flex items-center justify-between gap-12">
                <div className="flex flex-col justify-center gap-1">
                    <CardTitle className="text-xl">Chi tiết kho/ bể</CardTitle>
                    <CardDescription>Mã kho/ bể: {storage.storageId}</CardDescription>
                </div>
            </CardHeader>

            <Separator />
            <CardContent>
                <div className="flex flex-col gap-4 break-words whitespace-normal">
                    <p className="line-clamp-1 text-xl font-semibold">{storage.name}</p>
                    <p>
                        <span className="font-semibold">Phân loại: </span>
                        <span className="text-muted-foreground">{storage.type?.name}</span>
                    </p>

                    {storage.productItems?.length && storage.productItems.length > 0 ? (
                        <>
                            <p>
                                <span className="font-semibold">Danh sách sản phẩm: </span>
                            </p>
                            <div className="max-h-[300px] overflow-y-auto">
                                {storage.productItems.map((item, index) => (
                                    <div key={item.productItemId}>
                                        <InventoryItem item={item as IInventory} />
                                        {index < (storage.productItems ?? []).length - 1 && (
                                            <Separator className="my-2" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            {hasUpdatePermission && (
                                <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                                    <Button variant="outline" size="lg" onClick={() => onChangeLocation(storage)}>
                                        Đổi kho lưu trữ sản phẩm
                                    </Button>
                                    <Button variant="outline" size="lg" onClick={() => onChangeVariant(storage)}>
                                        Đổi phân loại sản phẩm
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <RadixAvatar className="w-[50%] lg:w-[70%]">
                                <RadixAvatarImage
                                    src="/images/empty-fish-tank.png"
                                    alt="empty fish tank"
                                ></RadixAvatarImage>
                            </RadixAvatar>
                            <p className="text-muted-foreground font-semibold">Kho/ bể đang trống!</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

type InventoryItemProps = {
    item: IInventory
}

const InventoryItem = ({ item }: InventoryItemProps) => {
    return (
        <div className="flex items-start gap-4">
            <div className="border-primary flex w-[60px] items-center justify-center overflow-hidden rounded-lg border-2 p-1">
                <img
                    src={item.productItem?.imageUrl}
                    alt="product item image"
                    className="aspect-square h-full w-full rounded-sm object-cover"
                />
            </div>

            <div className="flex flex-col gap-1">
                <p className="text-base font-semibold">
                    Mã số {item.productItem?.rootProduct?.rootProductId} - {item.productItem?.rootProduct?.name}
                </p>
                <p className="text-muted-foreground font-semibold">
                    Phân loại:{' '}
                    <span className="font-normal">
                        {item.productItem?.attributes.map(attr => `${attr.variant}: ${attr.option}`).join(', ')}
                    </span>
                </p>
                <p className="text-muted-foreground font-semibold">
                    Số lượng: <span className="font-normal">{item.quantity.toString().padStart(2, '0')}</span>
                </p>
            </div>
        </div>
    )
}

export default StorageCard
