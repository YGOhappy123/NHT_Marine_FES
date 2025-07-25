import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PencilLine } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { sections } from '@/pages/DashboardProduct/ProductDetailPage/TableOfContents'
import BannerUploader from '@/pages/DashboardProduct/ProductDetailPage/BannerUploader'
import RichTextEditor from '@/components/common/RichTextEditor'

type ProductInfoCardProps = {
    product: IRootProduct
    categories: ICategory[]
    hasModifyInfoPermission: boolean
}

const productInfoFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên sản phẩm không được để trống.' }),
    description: z.string().min(1, { message: 'Mô tả sản phẩm không được để trống.' }),
    categoryId: z.number().min(1, { message: 'Vui lòng chọn danh mục.' }),
    imageUrl: z.string().min(1, { message: 'Vui lòng chọn ảnh banner.' })
})

const ProductInfoCard = ({ product, categories, hasModifyInfoPermission }: ProductInfoCardProps) => {
    const section = sections.information
    const [mode, setMode] = useState<'view' | 'update'>('view')

    const form = useForm<z.infer<typeof productInfoFormSchema>>({
        resolver: zodResolver(productInfoFormSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            categoryId: product.categoryId,
            imageUrl: product.imageUrl
        }
    })

    const onSubmit = async (values: z.infer<typeof productInfoFormSchema>) => {
        if (!hasModifyInfoPermission) return

        console.log(values)
    }

    return (
        <Card className="w-full max-w-4xl" id={section.id}>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription>
                    {hasModifyInfoPermission
                        ? 'Cập nhật thông tin sản phẩm bẳng cách ấn vào nút "Chỉnh sửa" tại mục này'
                        : 'Tài khoản của bạn không được cấp quyền cập nhật thông tin sản phẩm'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-6">
                        <div className="grid grid-cols-1 gap-12 xl:grid-cols-3">
                            <div className="col-span-1">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center">
                                            <FormControl>
                                                <BannerUploader
                                                    hasPermission={hasModifyInfoPermission && mode === 'update'}
                                                    bannerImg={field.value}
                                                    setBannerImg={field.onChange}
                                                    currentBannerImg={product.imageUrl}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-1 flex flex-col gap-6 xl:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Tên sản phẩm</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={!hasModifyInfoPermission || mode === 'view'}
                                                    placeholder="Tên sản phẩm..."
                                                    className="caret-card-foreground text-card-foreground h-12 rounded border-2"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Danh mục</FormLabel>
                                            <Select
                                                onValueChange={value => field.onChange(Number(value))}
                                                value={field.value.toString()}
                                                disabled={!hasModifyInfoPermission || mode === 'view'}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
                                                        <SelectValue placeholder="Danh mục..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map(category => (
                                                        <SelectItem
                                                            key={category.categoryId}
                                                            value={category.categoryId.toString()}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">Mô tả sản phẩm</FormLabel>
                                            <FormControl>
                                                <RichTextEditor
                                                    disabled={!hasModifyInfoPermission || mode === 'view'}
                                                    content={field.value}
                                                    onChange={field.onChange}
                                                    containerClassName="rounded border-2"
                                                    editorClassName="caret-card-foreground text-card-foreground "
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                            {mode === 'view' && hasModifyInfoPermission && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setMode('update')
                                        form.reset()
                                    }}
                                    className="h-12 rounded text-base capitalize xl:col-span-2"
                                >
                                    <PencilLine />
                                    Chỉnh sửa
                                </Button>
                            )}

                            {mode === 'update' && (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setMode('view')
                                            form.reset()
                                        }}
                                        className="h-12 rounded text-base capitalize"
                                    >
                                        Hủy bỏ
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!hasModifyInfoPermission || form.formState.isSubmitting}
                                        className="h-12 rounded text-base capitalize"
                                    >
                                        {form.formState.isSubmitting ? 'Đang tải...' : 'Cập nhật thông tin'}
                                    </Button>
                                </>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ProductInfoCard
