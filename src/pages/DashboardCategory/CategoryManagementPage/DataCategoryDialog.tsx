import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { PencilLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import getAllDescendants from '@/utils/getAllDescendants'
import categoryService from '@/services/categoryService'

const dataCategoryFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên danh mục không được để trống.' }),
    parentId: z.number().optional().nullable()
})

type DataCategoryDialogProps = {
    category: ICategory | null
    mode: 'view' | 'update'
    setMode: (value: 'view' | 'update') => void
    open: boolean
    setOpen: (value: boolean) => void
    updateCategoryMutation: UseMutationResult<any, any, { categoryId: number; data: Partial<ICategory> }, any>
    hasUpdatePermission: boolean
}

const DataCategoryDialog = ({
    category,
    updateCategoryMutation,
    hasUpdatePermission,
    mode,
    open,
    setMode,
    setOpen
}: DataCategoryDialogProps) => {
    const { categories, categoryGroup } = categoryService({ enableFetching: true })
    const descendants = category?.categoryId ? getAllDescendants(category.categoryId ?? 0, categoryGroup) : []

    const form = useForm<z.infer<typeof dataCategoryFormSchema>>({
        resolver: zodResolver(dataCategoryFormSchema),
        defaultValues: {
            name: '',
            parentId: undefined
        }
    })

    const onSubmit = async (values: z.infer<typeof dataCategoryFormSchema>) => {
        if (!category || !hasUpdatePermission) return

        await updateCategoryMutation.mutateAsync({
            categoryId: category.categoryId,
            data: { name: values.name, parentId: values.parentId ?? undefined }
        })

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && category) {
            form.reset({
                name: category.name,
                parentId: category.parentId ?? undefined
            })
        }
    }, [open, mode, category])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>{mode === 'view' ? 'Thông tin danh mục' : 'Cập nhật danh mục'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'view'
                            ? 'Thông tin chi tiết về tên danh mục.'
                            : 'Chỉnh sửa các thông tin của danh mục. Ấn "Xác nhận" sau khi hoàn tất.'}
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Tên danh mục</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={mode === 'view'}
                                                placeholder="Tên danh mục..."
                                                className="text-card-foreground caret-card-foreground h-12 rounded border-2 font-semibold"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="parentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Danh mục cha</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={value =>
                                                    field.onChange(value === 'none' ? null : Number(value))
                                                }
                                                value={
                                                    field.value !== null && field.value !== undefined
                                                        ? field.value.toString()
                                                        : 'none'
                                                }
                                                disabled={mode === 'view'}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
                                                        <SelectValue placeholder="Danh mục..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">
                                                        <i>Không có</i>
                                                    </SelectItem>
                                                    {categories
                                                        .filter(
                                                            parentCategory =>
                                                                !category ||
                                                                (parentCategory.categoryId !== category.categoryId &&
                                                                    descendants.every(
                                                                        cat =>
                                                                            cat.categoryId != parentCategory.categoryId
                                                                    ))
                                                        )
                                                        .map(category => (
                                                            <SelectItem
                                                                key={category.categoryId}
                                                                value={category.categoryId.toString()}
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator />
                        {mode === 'update' && (
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Hủy bỏ</Button>
                                </DialogClose>
                                <Button type="submit">Xác nhận</Button>
                            </DialogFooter>
                        )}
                    </form>
                </Form>

                {/* Move <DialogFooter /> outside <Form /> to prevent auto-submitting behavior */}
                {mode === 'view' && (
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Đóng</Button>
                        </DialogClose>
                        {hasUpdatePermission && (
                            <Button type="button" onClick={() => setMode('update')}>
                                <PencilLine />
                                Chỉnh sửa
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default DataCategoryDialog
