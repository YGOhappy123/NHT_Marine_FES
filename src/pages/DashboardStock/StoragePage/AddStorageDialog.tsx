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

const addStorageFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên kho không được để trống.' }),
    typeId: z.number('Vui lòng chọn loại kho.')
})

type AddStorageDialogProps = {
    storageTypes: IStorageType[]
    addNewStorageMutation: UseMutationResult<any, any, Partial<IStorage>, any>
}

const AddStorageDialog = ({ storageTypes, addNewStorageMutation }: AddStorageDialogProps) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof addStorageFormSchema>>({
        resolver: zodResolver(addStorageFormSchema),
        defaultValues: {
            name: '',
            typeId: undefined
        }
    })

    const onSubmit = async (values: z.infer<typeof addStorageFormSchema>) => {
        await addNewStorageMutation.mutateAsync({
            name: values.name,
            typeId: values.typeId ?? undefined
        })

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="flex h-8">
                    <PencilLine />
                    Thêm kho
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-2xl md:min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm kho</DialogTitle>
                    <DialogDescription>
                        Thêm các thông tin cần thiết cho kho. Ấn "Xác nhận" sau khi hoàn tất.
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
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="caret-card-foreground text-card-foreground h-12! w-full rounded border-2">
                                                        <SelectValue placeholder="Loại kho..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {storageTypes.map(type => (
                                                        <SelectItem
                                                            key={type.typeId}
                                                            value={type.typeId!.toString()}
                                                        >
                                                            {type.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
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

export default AddStorageDialog
