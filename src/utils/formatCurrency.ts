function formatCurrency(price?: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((price ?? 0) * 1000)
}

export default formatCurrency
