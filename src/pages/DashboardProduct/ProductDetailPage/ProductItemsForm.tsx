import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Resolver, useForm } from 'react-hook-form'
import { PencilLine } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { BADGE_COLORS } from '@/configs/constants'
import NoButtonImageUploader from '@/components/common/NoButtonImageUploader'
import fileService from '@/services/fileService'
import productService from '@/services/productService'

type ProductItemsFormProps = {
    product: IRootProduct
    options: IVariantOption[]
    hasModifyItemPermission: boolean
    onUpdateSuccess: () => Promise<any>
}

const productItemsFormSchema = z.object({
    productItems: z.array(
        z
            .object({
                productItemId: z.number(),
                imageUrl: z.string().min(1, { message: 'Vui lòng chọn ảnh minh họa.' }),
                price: z.coerce.number().min(1000, { message: 'Giá tiền phải lớn hơn 1000 đồng.' }),
                stock: z.coerce.number().min(0, { message: 'Số lượng tồn kho phải lớn hơn hoặc bằng 0.' }),
                packingGuide: z.string().min(1, { message: 'Quy cách đóng gói không được để trống.' })
            })
            .refine(data => data.price % 1000 === 0, {
                message: 'Giá tiền phải là bội số của 1000 đồng.',
                path: ['price']
            })
    )
})

const ProductItemsForm = ({ product, options, hasModifyItemPermission, onUpdateSuccess }: ProductItemsFormProps) => {
    const [mode, setMode] = useState<'view' | 'update'>('view')
    const { uploadBase64Mutation } = fileService()
    const { updateProductItemsMutation } = productService({ enableFetching: false })

    const form = useForm<z.infer<typeof productItemsFormSchema>>({
        resolver: zodResolver(productItemsFormSchema) as Resolver<z.infer<typeof productItemsFormSchema>>,
        defaultValues: {
            productItems:
                product.productItems?.map(item => ({
                    productItemId: item.productItemId,
                    imageUrl: item.imageUrl,
                    price: item.price,
                    packingGuide: item.packingGuide,
                    stock: item.stock
                })) || []
        }
    })

    const onSubmit = async (values: z.infer<typeof productItemsFormSchema>) => {
        if (!hasModifyItemPermission) return

        try {
            const valueToUpdate = await Promise.all(
                values.productItems.map(async (item, index) => {
                    let newImageUrl = ''

                    if (item.imageUrl !== product.productItems![index].imageUrl) {
                        const res = await uploadBase64Mutation.mutateAsync({
                            base64: item.imageUrl,
                            folder: 'products'
                        })
                        newImageUrl = res.data.data?.imageUrl
                    }

                    return {
                        productItemId: item.productItemId,
                        imageUrl: newImageUrl || item.imageUrl,
                        price: item.price,
                        packingGuide: item.packingGuide
                    }
                })
            )

            await updateProductItemsMutation.mutateAsync({
                productId: product.rootProductId,
                data: { productItems: valueToUpdate }
            })

            onUpdateSuccess()
            setMode('view')
        } catch {
            form.reset()
        }
    }

    useEffect(() => {
        form.reset({
            productItems:
                product.productItems?.map(item => ({
                    productItemId: item.productItemId,
                    imageUrl: item.imageUrl,
                    price: item.price,
                    packingGuide: item.packingGuide,
                    stock: item.stock
                })) || []
        })
    }, [product, form])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                {product.productItems?.map((item, index) => (
                    <div key={index} className="bg-muted/90 w-full rounded-lg border-2 p-3">
                        <div className="flex gap-2">
                            <h5 className="font-semibold">Danh sách thuộc tính:</h5>
                            {/* <ul className="flex items-center gap-2">
                                {item.attributes!.map((attribute, index) => {
                                    return (
                                        <li key={attribute.optionId}>
                                            <Badge
                                                style={{ backgroundColor: BADGE_COLORS[index % BADGE_COLORS.length] }}
                                            >
                                                {options.find(option => option.optionId === attribute.optionId)?.value}
                                            </Badge>
                                        </li>
                                    )
                                })}
                            </ul> */}
                        </div>

                        <Separator className="my-3 border" />

                        <div className="grid grid-cols-1 gap-12 xl:grid-cols-3">
                            <div className="col-span-1">
                                <FormField
                                    control={form.control}
                                    name={`productItems.${index}.imageUrl`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center">
                                            <FormControl>
                                                <NoButtonImageUploader
                                                    hasPermission={hasModifyItemPermission && mode === 'update'}
                                                    image={field.value}
                                                    setImage={field.onChange}
                                                    originalImage={item.imageUrl}
                                                    shape="square"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 flex flex-col gap-6 xl:col-span-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`productItems.${index}.price`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-card-foreground">Đơn giá</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        disabled={!hasModifyItemPermission || mode === 'view'}
                                                        placeholder="Đơn giá..."
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
                                        name={`productItems.${index}.stock`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-card-foreground">Số lượng tồn kho</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        disabled
                                                        placeholder="Số lượng tồn kho..."
                                                        className="caret-card-foreground text-card-foreground h-12 rounded border-2"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name={`productItems.${index}.packingGuide`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-card-foreground">
                                                Quy cách đóng gói sản phẩm
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={4}
                                                    disabled={!hasModifyItemPermission || mode === 'view'}
                                                    placeholder="Quy cách đóng gói sản phẩm..."
                                                    className="caret-card-foreground text-card-foreground rounded border-2"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {hasModifyItemPermission && (
                    <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                        {mode === 'view' && (
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
                                    disabled={!hasModifyItemPermission || form.formState.isSubmitting}
                                    className="h-12 rounded text-base capitalize"
                                >
                                    {form.formState.isSubmitting ? 'Đang tải...' : 'Cập nhật thông tin'}
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </form>
        </Form>
    )
}

export default ProductItemsForm
