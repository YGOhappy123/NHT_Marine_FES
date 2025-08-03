import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PencilLine } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const addCategoryFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên danh mục không được để trống.' }),
    parentId: z.number().optional().nullable()
})

type AddCategoryDialogProps = {
    parentCategories: ICategory[]
    addNewCategoryMutation: UseMutationResult<any, any, Partial<ICategory>, any>
}

const AddCategoryDialog = ({ parentCategories, addNewCategoryMutation }: AddCategoryDialogProps) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof addCategoryFormSchema>>({
        resolver: zodResolver(addCategoryFormSchema),
        defaultValues: {
            name: '',
            parentId: undefined
        }
    })

    const onSubmit = async (values: z.infer<typeof addCategoryFormSchema>) => {
        await addNewCategoryMutation.mutateAsync({
            name: values.name,
            parentId: values.parentId ?? undefined
        })

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="flex h-8">
                    <PencilLine />
                    Thêm danh mục
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm danh mục hàng hóa</DialogTitle>
                    <DialogDescription>
                        Thêm các thông tin cần thiết cho danh mục hàng hóa. Ấn &apos;Xác nhận&apos; sau khi hoàn tất.
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
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
                                                        <SelectValue placeholder="Danh mục..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">Không có danh mục cha</SelectItem>
                                                    {parentCategories.map(category => (
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
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Đặt lại
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset()
                                    setOpen(false)
                                }}
                            >
                                Hủy bỏ
                            </Button>
                            <Button type="submit">Xác nhận</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddCategoryDialog
