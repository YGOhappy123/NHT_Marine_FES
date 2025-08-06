import { createBrowserRouter } from 'react-router-dom'
import MainRoutes from '@/routes/MainRoutes'
import PersonnelRoutes from '@/routes/PersonnelRoutes'
import OrderRoutes from '@/routes/OrderRoutes'
import ProductRoutes from '@/routes/ProductRoutes'
import AuthRoutes from '@/routes/AuthRoutes'
import CategoryRoutes from '@/routes/CategoryRoutes'
import CustomerRoutes from '@/routes/CustomerRoutes'
import PromotionRoutes from '@/routes/PromotionRoutes'
import StockRoutes from '@/routes/StockRoutes'

const developmentRoutes = createBrowserRouter([
    ...MainRoutes,
    ...PersonnelRoutes,
    ...OrderRoutes,
    ...CategoryRoutes,
    ...ProductRoutes,
    ...AuthRoutes,
    ...CustomerRoutes,
    ...PromotionRoutes,
    ...StockRoutes
])

const productionRoutes = createBrowserRouter([
    ...MainRoutes,
    ...PersonnelRoutes,
    ...OrderRoutes,
    ...CategoryRoutes,
    ...ProductRoutes,
    ...AuthRoutes,
    ...CustomerRoutes,
    ...PromotionRoutes,
    ...StockRoutes
])

const getRouter = (environment: 'development' | 'production') => {
    switch (environment) {
        case 'development':
            return developmentRoutes
        case 'production':
            return productionRoutes
        default:
            throw new Error('Invalid environment.')
    }
}

export default getRouter
