import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { FunnelPlus, Plus, Trash2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const secondStepFormSchema = z.object({
    variants: z
        .array(
            z.object({
                name: z.string().min(1, { message: 'Tên nhóm phân loại không được để trống.' }),
                isAdjustable: z.boolean(),
                options: z
                    .array(z.string().min(1, { message: 'Tên giá trị phân loại không được để trống.' }))
                    .min(1, { message: 'Phải định nghĩa ít nhất một giá trị cho nhóm phân loại.' })
                    .refine(opts => new Set(opts.map(opt => opt.trim().toLowerCase())).size === opts.length, {
                        message: 'Giá trị trong nhóm phân loại phải là duy nhất.'
                    })
            })
        )
        .min(1, { message: 'Phải định nghĩa ít nhất một nhóm phân loại.' })
        .refine(variants => new Set(variants.map(v => v.name.trim().toLowerCase())).size === variants.length, {
            message: 'Tên các nhóm phân loại phải là duy nhất.'
        })
})

export type SecondStepData = z.infer<typeof secondStepFormSchema>

type SecondStepFormProps = {
    defaultValues: SecondStepData | null
    onNext: (values: SecondStepData) => void
    onPrev: () => void
}

const SecondStepForm = ({ defaultValues, onNext, onPrev }: SecondStepFormProps) => {
    const form = useForm<SecondStepData>({
        resolver: zodResolver(secondStepFormSchema),
        defaultValues: defaultValues ?? {
            variants: [
                {
                    name: '',
                    isAdjustable: false,
                    options: ['']
                }
            ]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'variants'
    })

    const onSubmit = (values: SecondStepData) => {
        onNext(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <span className="font-medium">Tổng số nhóm phân loại: {form.getValues('variants').length}</span>
                    <Button type="button" onClick={() => append({ name: '', isAdjustable: false, options: [''] })}>
                        <FunnelPlus /> Thêm nhóm phân loại
                    </Button>
                </div>

                <div className="flex flex-col gap-6">
                    {fields.map((field, variantIndex) => (
                        <div key={field.id} className="space-y-3 rounded-md border-2 p-4">
                            <FormField
                                control={form.control}
                                name={`variants.${variantIndex}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">
                                            Tên nhóm phân loại số {variantIndex + 1}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="VD: Kích cỡ, Màu sắc"
                                                className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`variants.${variantIndex}.isAdjustable`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Loại nhóm phân loại</FormLabel>
                                        <Select
                                            onValueChange={value => field.onChange(Boolean(value))}
                                            value={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
                                                    <SelectValue placeholder="Danh mục..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {[
                                                    {
                                                        isAdjustable: true,
                                                        title: 'Có thể chuyển sang giá trị khác trong quá trình lưu kho'
                                                    },
                                                    {
                                                        isAdjustable: false,
                                                        title: 'Không thể chuyển sang giá trị khác trong quá trình lưu kho'
                                                    }
                                                ].map(item => (
                                                    <SelectItem
                                                        key={item.isAdjustable.toString()}
                                                        value={item.isAdjustable.toString()}
                                                    >
                                                        {item.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel className="text-card-foreground mb-2">Giá trị phân loại</FormLabel>

                                <div className="flex flex-col gap-4">
                                    {form.watch(`variants.${variantIndex}.options`)?.map((_, optionIndex) => (
                                        <FormField
                                            key={optionIndex}
                                            control={form.control}
                                            name={`variants.${variantIndex}.options.${optionIndex}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <Input
                                                                placeholder={`Giá trị số ${optionIndex + 1}`}
                                                                className="caret-card-foreground text-card-foreground h-12 rounded border-2 font-semibold"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                const current =
                                                                    form.getValues(
                                                                        `variants.${variantIndex}.options`
                                                                    ) || []

                                                                if (current.length <= 1) return

                                                                form.setValue(
                                                                    `variants.${variantIndex}.options`,
                                                                    current.filter((_, i) => i !== optionIndex)
                                                                )
                                                            }}
                                                        >
                                                            <Trash2 className="text-red-500" />
                                                        </Button>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>

                                {form.formState.errors.variants?.[variantIndex]?.options?.root && (
                                    <p className="text-destructive text-sm">
                                        {form.formState.errors.variants[variantIndex].options.root.message}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const current = form.getValues(`variants.${variantIndex}.options`) || []
                                        form.setValue(`variants.${variantIndex}.options`, [...current, ''])
                                    }}
                                >
                                    <Plus /> Thêm giá trị cho nhóm
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={fields.length <= 1}
                                    onClick={() => {
                                        if (fields.length > 1) remove(variantIndex)
                                    }}
                                >
                                    Xóa nhóm phân loại
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                {form.formState.errors.variants?.root && (
                    <p className="text-destructive mt-2 text-sm">{form.formState.errors.variants.root.message}</p>
                )}

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

export default SecondStepForm
