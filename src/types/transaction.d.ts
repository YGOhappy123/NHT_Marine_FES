
declare global {
    interface IDeliveryService {
        serviceId: number;
        name: string;
        contactPhone: string;
    }

    interface IOrderStatus {
        statusId: number;
        name: string;
        description: string;
        isDefaultState: boolean;
        isAccounted: boolean;
        isUnfulfilled: boolean;
    }
}

export {}