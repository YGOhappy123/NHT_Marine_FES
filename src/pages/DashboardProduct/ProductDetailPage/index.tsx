import { useParams } from 'react-router-dom'

const ProductDetailPage = () => {
    const { productId } = useParams()

    return <div>{productId}</div>
}

export default ProductDetailPage
