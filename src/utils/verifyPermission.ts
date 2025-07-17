import permissions from '@/configs/permissions'

const verifyPermission = (user: IStaff | null, permission?: (typeof permissions)[keyof typeof permissions]) => {
    if (!user) return false
    if (!permission) return true
    return user.permissions.includes(permission)
}

export default verifyPermission
