import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronsUpDown, LogOutIcon, Moon, Sun, UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { RootState } from '@/store'
import { useTheme } from '@/hooks/useTheme'
import { signOut } from '@/slices/authSlice'

const SidebarUserButton = () => {
    const { isMobile, setOpenMobile } = useSidebar()
    const { theme, toggleTheme } = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.auth.user)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer select-none"
                >
                    <UserInfo user={user} />
                    <ChevronsUpDown className="ml-auto group-data-[state=collapsed]:hidden" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                sideOffset={4}
                align="end"
                side={isMobile ? 'bottom' : 'right'}
                className="max-w-80 min-w-64"
            >
                <DropdownMenuLabel className="p-1 font-normal">
                    <UserInfo user={user} />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        navigate('/profile')
                        setOpenMobile(false)
                    }}
                    className="cursor-pointer"
                >
                    <UserIcon className="mr-1" /> Thông tin cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={toggleTheme}>
                    {theme === 'dark' ? (
                        <>
                            <Sun className="mr-1" /> Chuyển sang light mode
                        </>
                    ) : (
                        <>
                            <Moon className="mr-1" /> Chuyển sang dark mode
                        </>
                    )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-500!" onClick={() => dispatch(signOut())}>
                    <LogOutIcon className="mr-1 text-red-700" /> Đăng xuất
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type UserInfoProps = {
    user: IStaff | null
}

const UserInfo = ({ user }: UserInfoProps) => {
    if (user == null) return null

    // Use the first letters of the last 2 words in name
    // Eg: "Nguyễn Văn A" => "VA"
    const nameInitials = user.fullName
        .split(' ')
        .slice(0, 2)
        .map((str) => str[0])
        .join('')

    return (
        <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.fullName} />
                <AvatarFallback className="bg-primary text-primary-foreground uppercase">{nameInitials}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col leading-tight group-data-[state=collapsed]:hidden">
                <span className="truncate text-sm font-semibold">{user.fullName}</span>
                <span className="truncate text-xs">{user.email}</span>
            </div>
        </div>
    )
}

export default SidebarUserButton
