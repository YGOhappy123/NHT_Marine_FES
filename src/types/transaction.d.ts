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

    interface IDeliveryService {
        serviceId: number
        name: string
        contactPhone: string
    }

    interface IOrderStatus {
        statusId: number
        name: string
        description: string
        isDefaultState: boolean
        isAccounted: boolean
        isUnfulfilled: boolean
    }
}

export {}
