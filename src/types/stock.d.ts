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

    interface IInventory {
        quantity: number
        productItemId: number
        productItem?: {
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
    }

    interface IProductImport {
        importId: number
        supplierId: number
        invoiceNumber: string
        totalCost: number
        importDate: string
        isDistributed: boolean
        trackedAt: string
        trackedBy: 3
        supplier?: Partial<ISupplier>
        trackedByStaff?: Partial<IStaff>
        items: {
            productItemId: number
            cost: number
            quantity: number

            productItem?: {
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
    }
}

export {}
