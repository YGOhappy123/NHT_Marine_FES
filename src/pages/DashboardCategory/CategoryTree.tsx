import { Avatar as RadixAvatar, AvatarImage as RadixAvatarImage } from '@radix-ui/react-avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { PencilLine } from 'lucide-react'
import dayjs from '@/libs/dayjs'

type CategoryTreeProps = {
    categoryGroup: Record<number, ICategory[]>
    hasUpdatePermission: boolean
    onUpdateCategory: (value: ICategory) => void
}

const CategoryTree = ({ categoryGroup, hasUpdatePermission, onUpdateCategory }: CategoryTreeProps) => {
    const rootCategories = categoryGroup[0]

    if (!rootCategories || rootCategories.length === 0)
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <RadixAvatar className="w-[30%] xl:w-[20%]">
                    <RadixAvatarImage src="/images/happy-emoji.png" alt="empty cart"></RadixAvatarImage>
                </RadixAvatar>
                <p className="mt-2 font-semibold">Không có dữ liệu</p>
                <p className="font-semibold">Không tìm thấy các danh mục gốc!</p>
            </div>
        )

    return (
        <div className="flex flex-col gap-12">
            <CategoryList
                categories={rootCategories}
                categoryGroup={categoryGroup}
                hasUpdatePermission={hasUpdatePermission}
                onUpdateCategory={onUpdateCategory}
            />
        </div>
    )
}

type CategoryListProps = {
    categories: ICategory[]
    categoryGroup: Record<number, ICategory[]>
    hasUpdatePermission: boolean
    onUpdateCategory: (value: ICategory) => void
}

const CategoryList = ({ categories, categoryGroup, hasUpdatePermission, onUpdateCategory }: CategoryListProps) => {
    return categories.map(category => (
        <div key={category.categoryId}>
            <CategoryItem
                category={category}
                categoryGroup={categoryGroup}
                hasUpdatePermission={hasUpdatePermission}
                onUpdateCategory={onUpdateCategory}
            />
        </div>
    ))
}

type CategoryItemProps = {
    category: ICategory
    categoryGroup: Record<number, ICategory[]>
    hasUpdatePermission: boolean
    onUpdateCategory: (value: ICategory) => void
}

const CategoryItem = ({ category, categoryGroup, hasUpdatePermission, onUpdateCategory }: CategoryItemProps) => {
    const childCategories = categoryGroup[category.categoryId]

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="flex items-center justify-between gap-12">
                    <div className="flex flex-col justify-center gap-1">
                        <CardTitle className="text-xl">Chi tiết danh mục</CardTitle>
                        <CardDescription>Mã danh mục: {category.categoryId}</CardDescription>
                    </div>
                    {hasUpdatePermission && (
                        <Button
                            type="button"
                            onClick={() => onUpdateCategory({ ...category, parentId: category.parentId || undefined })}
                        >
                            <PencilLine />
                            Chỉnh sửa
                        </Button>
                    )}
                </CardHeader>
                <Separator />
                <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="line-clamp-1 text-xl font-semibold">Thông tin người tạo</p>
                            <div className="mt-4 flex items-start gap-4">
                                <div className="border-primary flex w-[60px] items-center justify-center overflow-hidden rounded-lg border-2 p-1">
                                    <img
                                        src={(category.createdByStaff as Partial<IStaff>)?.avatar}
                                        alt="product item image"
                                        className="aspect-square h-full w-full rounded-sm object-cover"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <p className="text-base font-semibold">
                                        Mã số {(category.createdByStaff as Partial<IStaff>)?.staffId} -{' '}
                                        {(category.createdByStaff as Partial<IStaff>)?.fullName}
                                    </p>
                                    <p className="text-muted-foreground font-semibold">
                                        Email:{' '}
                                        <span className="font-normal">
                                            {(category.createdByStaff as Partial<IStaff>)?.email}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="line-clamp-1 text-xl font-semibold">Thông tin danh mục</p>
                            <p>
                                <span className="font-semibold">Tên danh mục: </span>
                                <span className="text-muted-foreground">{category.name}</span>
                            </p>
                            <p>
                                <span className="font-semibold">Ngày tạo: </span>
                                <span className="text-muted-foreground">
                                    {dayjs(category.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                </span>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {childCategories && childCategories.length > 0 && (
                <div className="flex">
                    <div className="bg-primary w-1.5"></div>
                    <div className="flex-1 pl-6">
                        <CategoryList
                            categories={childCategories}
                            categoryGroup={categoryGroup}
                            hasUpdatePermission={hasUpdatePermission}
                            onUpdateCategory={onUpdateCategory}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategoryTree
