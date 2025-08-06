declare global {
    interface ICoupon {
        couponId: number
        code: string
        type: string
        amount: number
        maxUsage: number
        isActive: boolean
        expiredAt: string
        createdAt: string
        createdBy: number

        createdByStaff?: Partial<IStaff> | string
    }
}

export {}
