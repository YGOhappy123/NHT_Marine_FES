import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type UserInfoProps = {
    user: IStaff
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

export default UserInfo
