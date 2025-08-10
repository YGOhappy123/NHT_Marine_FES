import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMappedMessage } from '@/utils/resMessageMapping'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

const categoryService = ({ enableFetching = false }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [categories, setCategories] = useState<ICategory[]>([])
    const [categoryCount, setCategoryCount] = useState<number>(0)

    const getAllCategoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: () => axios.get<IResponseData<ICategory[]>>('/products/categories'),
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000
    })

    const addNewCategoryMutation = useMutation({
        mutationFn: (data: Partial<ICategory>) => axios.post<IResponseData<any>>('/products/categories', data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateCategoryMutation = useMutation({
        mutationFn: ({ categoryId, data }: { categoryId: number; data: Partial<ICategory> }) =>
            axios.patch<IResponseData<any>>(`/products/categories/${categoryId}`, data),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const removeCategoryMutation = useMutation({
        mutationFn: (categoryId: number) => axios.delete<IResponseData<any>>(`/products/categories/${categoryId}`),
        onError: onError,
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    useEffect(() => {
        if (getAllCategoriesQuery.isSuccess && getAllCategoriesQuery.data) {
            setCategories(getAllCategoriesQuery.data.data?.data)
            setCategoryCount(getAllCategoriesQuery.data.data?.total as number)
        }
    }, [getAllCategoriesQuery.isSuccess, getAllCategoriesQuery.data])

    const categoryGroup = useMemo(() => {
        const group: Record<number, ICategory[]> = {}
        if (categories.length === 0) return group

        const mappedCategories = categories.map(category => ({
            ...category,
            parentId: category.parentId || 0
        }))

        mappedCategories.forEach(category => {
            if (group[category.parentId] == null) {
                group[category.parentId] = []
            }
            group[category.parentId].push(category)
        })

        return group
    }, [categories])

    return {
        categories,
        categoryCount,
        categoryGroup,
        addNewCategoryMutation,
        updateCategoryMutation,
        removeCategoryMutation
    }
}
export default categoryService
