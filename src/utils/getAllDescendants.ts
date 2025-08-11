const getAllDescendants = (rootId: number, categoryGroup: Record<number, ICategory[]>) => {
    const children = categoryGroup[rootId] ?? []
    const descendants: ICategory[] = []

    for (const child of children) {
        descendants.push(child)
        descendants.push(...getAllDescendants(child.categoryId, categoryGroup))
    }

    return descendants
}

export default getAllDescendants
