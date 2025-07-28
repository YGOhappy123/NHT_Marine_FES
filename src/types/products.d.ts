declare global {
    interface IRootProduct {
        rootProductId: number
        categoryId: number
        name: string
        description: string
        imageUrl: string
        createdAt: string
        createdBy: number

        category?: Partial<ICategory> | string
        createdByStaff?: Partial<IStaff> | string
        variants?: Partial<IProductVariant>[]
        productItems?: Partial<IProductItem>[]
        promotions?: Partial<IPromotion>[]
    }

    interface ICategory {
        categoryId: number
        name: string
        createdAt: string
        createdBy: string
        parentId?: number

        createdByStaff?: Partial<IStaff> | string
    }

    interface IProductVariant {
        variantId: number
        name: string
        isAdjustable: boolean
        options: IVariantOption[]
    }

    interface IVariantOption {
        optionId: number
        value: string
    }

    interface IProductItem {
        productItemId: number
        imageUrl: string
        price: number
        packingGuide: string
        attributes: {
            optionId: number
        }[]
        stock: number
    }

    interface IPromotion {
        promotionId: number
        name: string
        description: string
        discountRate: number
        startDate: string
        endDate: string
        isActive: boolean
        createdAt: string
        createdBy: number

        createdByStaff?: Partial<IStaff> | string
        products?: Partial<IRootProduct>[]
    }
}

export {}
