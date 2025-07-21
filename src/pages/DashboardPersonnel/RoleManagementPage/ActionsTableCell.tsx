import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type ActionsTableCellProps = {
    role: IStaffRole
}

const ActionsTableCell = ({ role }: ActionsTableCellProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                    <MoreHorizontal />
                    <span className="sr-only">Mở menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[160px]">
                <DropdownMenuItem className="cursor-pointer">Xem quyền</DropdownMenuItem>
                <DropdownMenuItem disabled={role.isImmutable} className="cursor-pointer">
                    Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" disabled={role.isImmutable} className="cursor-pointer">
                    Xóa
                    <DropdownMenuShortcut className="text-base">⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ActionsTableCell
