import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import striptags from 'striptags'
import BannerUploader from '@/pages/DashboardProduct/ProductDetailPage/BannerUploader'
import RichTextEditor from '@/components/common/RichTextEditor'

const firstStepFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên sản phẩm không được để trống.' }),
    description: z
        .string()
        .min(1, { message: 'Mô tả sản phẩm không được để trống.' })
        .refine(val => striptags(val).length > 0, {
            message: 'Mô tả sản phẩm không được để trống.'
        }),
    categoryId: z.number().min(1, { message: 'Vui lòng chọn danh mục.' }),
    imageUrl: z.string().min(1, { message: 'Vui lòng chọn ảnh banner.' })
})

export type FirstStepData = z.infer<typeof firstStepFormSchema>

type FirstStepFormProps = {
    defaultValues: FirstStepData | null
    categories: ICategory[]
    onNext: (values: FirstStepData) => void
}

const FirstStepForm = ({ defaultValues, categories, onNext }: FirstStepFormProps) => {
    const form = useForm<FirstStepData>({
        resolver: zodResolver(firstStepFormSchema),
        defaultValues: defaultValues ?? {
            name: '',
            description: '',
            categoryId: 0,
            imageUrl: ''
        }
    })

    const onSubmit = (values: FirstStepData) => {
        onNext(values)
    }

    return (
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
                                            hasPermission
                                            bannerImg={field.value}
                                            setBannerImg={field.onChange}
                                            currentBannerImg={''}
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
                                            content={field.value}
                                            onChange={field.onChange}
                                            containerClassName="rounded border-2"
                                            editorClassName="caret-card-foreground text-card-foreground"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={true}
                        className="h-12 rounded text-base capitalize"
                    >
                        Quay về bước trước
                    </Button>
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="h-12 rounded text-base capitalize"
                    >
                        {form.formState.isSubmitting ? 'Đang tải...' : 'Đến bước kế tiếp'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default FirstStepForm
