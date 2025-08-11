import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
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

const dataStorageFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên kho không được để trống.' }),
    typeId: z.number('Loại kho không được để trống.')
})

type DataStorageDialogProps = {
    storage: IStorage | null
    storageTypes: IStorageType[]
    mode: 'view' | 'update'
    open: boolean
    setOpen: (value: boolean) => void
    updateStorageMutation: UseMutationResult<any, any, { storageId: number; data: Partial<IStorage> }, any>
    hasUpdatePermission: boolean
}

const DataStorageDialog = ({
    storage,
    storageTypes,
    updateStorageMutation,
    hasUpdatePermission,
    mode,
    open,
    setOpen
}: DataStorageDialogProps) => {
    const form = useForm<z.infer<typeof dataStorageFormSchema>>({
        resolver: zodResolver(dataStorageFormSchema),
        defaultValues: {
            name: '',
            typeId: undefined
        }
    })

    const onSubmit = async (values: z.infer<typeof dataStorageFormSchema>) => {
        if (!storage || !hasUpdatePermission) return

        await updateStorageMutation.mutateAsync({
            storageId: storage.storageId,
            data: { name: values.name, typeId: values.typeId ?? undefined }
        })

        form.reset()
        setOpen(false)
    }

    useEffect(() => {
        if (open && storage) {
            form.reset({
                name: storage.name,
                typeId: storage.typeId ?? undefined
            })
        }
    }, [open, mode, storage])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>{mode === 'view' ? 'Thông tin kho' : 'Cập nhật kho'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'view'
                            ? 'Thông tin chi tiết về tên kho.'
                            : 'Chỉnh sửa các thông tin của kho. Ấn "Xác nhận" sau khi hoàn tất.'}
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
                                        <FormLabel className="text-card-foreground">Tên kho</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={mode === 'view'}
                                                placeholder="Tên kho..."
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
                                name="typeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-card-foreground">Loại kho</FormLabel>
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
                                                    {storageTypes
                                                        .map(storageType => (
                                                            <SelectItem
                                                                key={storageType.typeId}
                                                                value={storageType.typeId.toString()}
                                                            >
                                                                {storageType.name}
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

                
                
            </DialogContent>
        </Dialog>
    )
}

export default DataStorageDialog
