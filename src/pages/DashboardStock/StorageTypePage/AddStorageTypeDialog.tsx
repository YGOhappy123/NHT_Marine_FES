
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { PencilLine } from 'lucide-react'


const addStorageTypeFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên loại kho không được để trống.' })
})

type AddStorageTypeDialogProps = {
    addNewStorageTypeMutation: UseMutationResult<any, any, Partial<IStorageType>, any>
}

const AddStorageTypeDialog = ({ addNewStorageTypeMutation }: AddStorageTypeDialogProps) => {
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof addStorageTypeFormSchema>>({
        resolver: zodResolver(addStorageTypeFormSchema),
        defaultValues: {
            name: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof addStorageTypeFormSchema>) => {
        await addNewStorageTypeMutation.mutateAsync({
            name: values.name
        })
        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="flex h-8">
                    <PencilLine />
                    Thêm loại kho
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thêm loại kho mới</DialogTitle>
                    <DialogDescription>
                        Nhập tên loại kho mới. Nhấn Lưu để tạo.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên loại kho</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên loại kho"
                                            className="h-10"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset()
                                    setOpen(false)
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={addNewStorageTypeMutation.isPending || !form.watch('name').trim()}
                            >
                                Lưu
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddStorageTypeDialog