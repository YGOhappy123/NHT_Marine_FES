import { useMemo } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Resolver, useFieldArray, useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BADGE_COLORS } from '@/configs/constants'
import { SecondStepData } from '@/pages/DashboardProduct/AddProductPage/SecondStepForm'
import NoButtonImageUploader from '@/components/common/NoButtonImageUploader'

const thirdStepFormSchema = z.object({
    productItems: z
        .array(
            z
                .object({
                    imageUrl: z.string().min(1, { message: 'Vui lòng chọn ảnh minh họa.' }),
                    price: z.coerce.number().min(1000, { message: 'Giá tiền phải lớn hơn 1000 đồng.' }),
                    packingGuide: z.string().min(1, { message: 'Quy cách đóng gói không được để trống.' }),
                    attributes: z
                        .array(z.number())
                        .min(1, { message: 'Danh sách thuộc tính phải có ít nhất một giá trị.' })
                })
                .refine(data => data.price % 1000 === 0, {
                    message: 'Giá tiền phải là bội số của 1000 đồng.',
                    path: ['price']
                })
        )
        .min(1)
})

export type ThirdStepData = z.infer<typeof thirdStepFormSchema>

type ThirdStepFormProps = {
    secondStepData: SecondStepData
    defaultValues: ThirdStepData | null
    onNext: (values: ThirdStepData) => void
    onPrev: () => void
}

const generateCombinations = <T,>(arrays: T[][]): { value: T; index: number }[][] => {
    return arrays.reduce<{ value: T; index: number }[][]>(
        (acc, curr) => acc.flatMap(a => curr.map((v, i) => [...a, { value: v, index: i }])),
        [[]]
    )
}

const ThirdStepForm = ({ secondStepData, defaultValues, onNext, onPrev }: ThirdStepFormProps) => {
    const combinations = useMemo(() => {
        return generateCombinations([...secondStepData.variants.map(v => v.options)])
    }, [secondStepData])

    const form = useForm<ThirdStepData>({
        resolver: zodResolver(thirdStepFormSchema) as Resolver<ThirdStepData>,
        defaultValues: defaultValues ?? {
            productItems: combinations.map(combo => ({
                imageUrl: '',
                price: 0,
                packingGuide: '',
                attributes: combo.map(item => item.index)
            }))
        }
    })

    const { fields } = useFieldArray({
        control: form.control,
        name: 'productItems'
    })

    const onSubmit = (values: ThirdStepData) => {
        onNext(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-6">
                <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-semibold">Danh sách các nhóm phân loại</h4>
                    {secondStepData.variants!.map((variant, index) => (
                        <div key={variant.name} className="flex gap-2">
                            <h5 className="font-semibold">
                                {index + 1}. Nhóm phân loại theo "{variant.name}":
                            </h5>
                            <ul className="flex items-center gap-2">
                                {variant.options!.map(option => {
                                    return (
                                        <li key={option}>
                                            <Badge
                                                style={{ backgroundColor: BADGE_COLORS[index % BADGE_COLORS.length] }}
                                            >
                                                {option}
                                            </Badge>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-col gap-6">
                    {fields.map((_, index) => (
                        <div key={index} className="bg-muted/90 w-full rounded-lg border-2 p-3">
                            <div className="flex gap-2">
                                <h5 className="font-semibold">Danh sách thuộc tính:</h5>
                                <ul className="flex items-center gap-2">
                                    {form.getValues(`productItems.${index}.attributes`).map((optionId, _index) => {
                                        return (
                                            <li key={_index}>
                                                <Badge
                                                    style={{
                                                        backgroundColor: BADGE_COLORS[_index % BADGE_COLORS.length]
                                                    }}
                                                >
                                                    {secondStepData.variants[_index].options[optionId]}
                                                </Badge>
                                            </li>
                                        )
                                    })}
                                </ul>
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
                                                        hasPermission
                                                        image={field.value}
                                                        setImage={field.onChange}
                                                        originalImage={''}
                                                        shape="square"
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
                                        name={`productItems.${index}.price`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-card-foreground">Đơn giá</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
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
                                        name={`productItems.${index}.packingGuide`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-card-foreground">
                                                    Quy cách đóng gói sản phẩm
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        rows={4}
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
                </div>

                <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPrev}
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

export default ThirdStepForm
