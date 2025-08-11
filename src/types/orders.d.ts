declare global {
    interface IOrder {
        orderId: number
        customerId: number
        orderStatusId: number
        couponId: number
        totalAmount: number
        recipientName?: string
        deliveryAddress?: string
        deliveryPhone?: string
        note?: string
        createdAt: string

        customer: Partial<ICustomer>
        orderStatus: IOrderStatus
        coupon?: ICoupon
        items: {
            orderId: number
            productItemId: number
            price: number
            quantity: number

            productItem: {
                productItemId: number
                imageUrl: string
                price: number
                attributes: {
                    variant: string
                    option: string
                }[]
                rootProduct: {
                    rootProductId: number
                    name: string
                    description: string
                    imageUrl: string
                }
            }
        }[]
        transitions: Partial<IOrderStatusTransition>[]
        updateLogs: Partial<IOrderStatusUpdateLog>[]
    }

    interface IOrderStatusTransition {
        transitionId: number
        transitionLabel: string
        fromStatusId: number
        toStatusId: number
        fromStatus?: Partial<IOrderStatus>
        toStatus?: Partial<IOrderStatus>
    }

    interface ITransitionGroup {
        fromStatusId: number
        fromStatus?: Partial<IOrderStatus>
        transitions: Partial<IOrderStatusTransition>[]
    }

    interface IOrderStatusUpdateLog {
        logId: number
        orderId: number
        statusId: number
        updatedAt: string
        updatedBy: number
        updatedByStaff?: Partial<IStaff>
        status?: Partial<IOrderStatus>
    }
}

export {}
