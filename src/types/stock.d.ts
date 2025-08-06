

declare global {
    interface IDamageType {
        typeId: number;
        name: string;
    }

    interface IStorageType {
        typeId: number;
        name: string;
    }

    interface ISupplier {
        supplierId: number;
        name: string;
        address: string;
        contactEmail: string;
        contactPhone: string;
    }
}

export {}