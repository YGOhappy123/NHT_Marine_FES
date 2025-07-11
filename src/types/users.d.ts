declare global {
    interface ICustomer {
        customerId: number
        fullName: string
        createdAt: string
        email?: string
        avatar?: string
        isActive?: boolean
    }

    interface IStaff {
        staffId: number
        fullName: string
        createdAt: string
        email?: string
        avatar?: string
        isActive?: boolean

        roleId: number
        role?: string
        createdBy?: number
        createdByStaff?: Partial<IStaff> | string
    }
}

export {}
