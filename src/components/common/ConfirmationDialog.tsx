import { useState, cloneElement, ReactElement } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'

type ConfirmationDialogProps = {
    title: string
    description: string
    onConfirm: () => Promise<void>
    trigger: ReactElement<any>
}

const ConfirmationDialog = ({ title, description, onConfirm, trigger }: ConfirmationDialogProps) => {
    const [open, setOpen] = useState(false)

    const handleConfirm = async () => {
        await onConfirm()
        setOpen(false)
    }

    return (
        <>
            {cloneElement(trigger, {
                onClick: (e: any) => {
                    e?.preventDefault?.()
                    setOpen(true)
                    trigger.props?.onClick?.(e)
                }
            })}

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>{description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>Xác nhận</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default ConfirmationDialog
