
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


const addDamageTypeFormSchema = z.object({
    name: z.string().min(1, { message: 'Tên loại thiệt hại không được để trống.' })
})

type AddDamageTypeDialogProps = {
    addNewDamageTypeMutation: UseMutationResult<any, any, Partial<IDamageType>, any>
}

const AddDamageTypeDialog = ({ addNewDamageTypeMutation }: AddDamageTypeDialogProps) => {
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof addDamageTypeFormSchema>>({
        resolver: zodResolver(addDamageTypeFormSchema),
        defaultValues: {
            name: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof addDamageTypeFormSchema>) => {
        await addNewDamageTypeMutation.mutateAsync({
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
                    Thêm loại thiệt hại
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thêm loại thiệt hại mới</DialogTitle>
                    <DialogDescription>
                        Nhập tên loại thiệt hại mới. Nhấn Lưu để tạo.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên loại thiệt hại</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên loại thiệt hại"
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
                                disabled={addNewDamageTypeMutation.isPending || !form.watch('name').trim()}
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

export default AddDamageTypeDialog