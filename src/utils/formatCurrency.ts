const formatCurrency = (price?: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price ?? 0)
}

export default formatCurrency
