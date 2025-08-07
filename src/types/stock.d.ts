declare global {
    interface IDamageType {
        typeId: number
        name: string
    }

    interface IStorageType {
        typeId: number
        name: string
    }

    interface IStorage {
        storageId: number
        name: string
        typeId?: number
        type?: Partial<IStorageType>
        productItems?: Partial<IInventory>[]
    }

    interface ISupplier {
        supplierId: number
        name: string
        address: string
        contactEmail: string
        contactPhone: string
    }
}

export {}
